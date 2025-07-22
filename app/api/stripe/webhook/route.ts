
import { NextResponse } from "next/server";
import Stripe from "stripe";
import { registerDomain, transferDomain, ContactInfo } from "@/app/utils/namecheap";
import prisma from "@/lib/prisma"; // Import Prisma client

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-06-20",
});

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(request: Request) {
  const sig = request.headers.get("stripe-signature");
  const body = await request.text();

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, sig!, webhookSecret);
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: `Webhook Error: ${errorMessage}` }, { status: 400 });
  }

  // Handle the event
  switch (event.type) {
    case 'payment_intent.succeeded':
      const paymentIntent = event.data.object as Stripe.PaymentIntent;
      console.log("Received payment_intent.succeeded event. PaymentIntent metadata:", paymentIntent.metadata);
      const orderId = paymentIntent.metadata.orderId; // Assuming you pass orderId in metadata

      if (!orderId) {
        console.error("Order ID not found in payment intent metadata.");
        return NextResponse.json({ error: "Order ID missing" }, { status: 400 });
      }

      try {
        // Update the order status in your database
        const updatedOrder = await prisma.order.update({
          where: { id: orderId },
          data: {
            status: "COMPLETED",
            stripePaymentId: paymentIntent.id,
          },
        });

        // Use the updated order data for domain registration
        const { domainName, years, domainAction, eppCode } = updatedOrder;
        const registrantInfo: ContactInfo = JSON.parse(paymentIntent.metadata.registrantInfo);
        const initialPlan = JSON.parse(paymentIntent.metadata.initialPlan);

        // Create or update user in Supabase (via Prisma)
        const user = await prisma.user.upsert({
          where: { email: registrantInfo.emailAddress },
          update: {
            firstName: registrantInfo.firstName,
            lastName: registrantInfo.lastName,
            address1: registrantInfo.address1,
            address2: registrantInfo.address2 || null,
            city: registrantInfo.city,
            stateProvince: registrantInfo.stateProvince,
            postalCode: registrantInfo.postalCode,
            country: registrantInfo.country,
            phone: registrantInfo.phone,
            // Add other fields as necessary
          },
          create: {
            email: registrantInfo.emailAddress,
            firstName: registrantInfo.firstName,
            lastName: registrantInfo.lastName,
            address1: registrantInfo.address1,
            address2: registrantInfo.address2 || null,
            city: registrantInfo.city,
            stateProvince: registrantInfo.stateProvince,
            postalCode: registrantInfo.postalCode,
            country: registrantInfo.country,
            phone: registrantInfo.phone,
            name: `${registrantInfo.firstName} ${registrantInfo.lastName}`,
            // Add other fields as necessary
          },
        });

        // Update the order with the actual userId and initialPlan details
        await prisma.order.update({
          where: { id: orderId },
          data: {
            userId: user.id,
            hostingPlan: initialPlan.name, // Assuming initialPlan has a 'name' field
            totalPrice: paymentIntent.amount / 100, // Use the actual amount from payment intent
          },
        });

        if (domainAction === "REGISTER") {
          await registerDomain(domainName, years, registrantInfo);
          console.log(`Successfully registered domain: ${domainName}`);
        } else if (domainAction === "TRANSFER") {
          if (!eppCode) {
            console.error(`EPP Code missing for domain transfer: ${domainName}`);
            return NextResponse.json({ error: "EPP Code missing for transfer" }, { status: 400 });
          }
          await transferDomain(domainName, eppCode, years, registrantInfo);
          console.log(`Successfully transferred domain: ${domainName}`);
        } else {
          console.error(`Unknown domain action: ${domainAction} for order ${orderId}`);
          return NextResponse.json({ error: "Unknown domain action" }, { status: 400 });
        }

        // Create cPanel account
        const hostingUsername = paymentIntent.metadata.hostingUsername;
        const hostingPassword = paymentIntent.metadata.hostingPassword;
        const hostingPlanId = initialPlan.id; // Use the ID from the initialPlan object

        if (hostingUsername && hostingPassword && hostingPlanId) {
          try {
            const whmResponse = await fetch(`${request.nextUrl.origin}/api/whm/create`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                domain: domainName,
                username: hostingUsername,
                password: hostingPassword,
                plan: hostingPlanId,
                contactemail: registrantInfo.emailAddress, // Add contactemail
              }),
            });
            const whmData = await whmResponse.json();

            if (!whmResponse.ok || !whmData.success) {
              console.error(`Failed to create cPanel account for ${domainName}:`, whmData.error);
              // TODO: Handle this failure (e.g., notify admin, refund user)
            } else {
              console.log(`Successfully created cPanel account for ${domainName}`);
            }
          } catch (whmError) {
            console.error(`Error calling WHM API for ${domainName}:`, whmError);
            // TODO: Handle this error
          }
        } else {
          console.warn(`Skipping cPanel account creation for ${domainName}: Missing username, password, or plan.`);
        }

      } catch (error) {
        console.error(`Failed to process payment_intent.succeeded for order ${orderId}:`, error);
        // You should handle this failure by refunding the payment
        // and notifying the user.
        return NextResponse.json({ error: "Failed to process order" }, { status: 500 });
      }
      break;
    case 'payment_method.attached':
      const paymentMethod = event.data.object as Stripe.PaymentMethod;
      console.log(`PaymentMethod ${paymentMethod.id} was attached to a Customer.`);
      // You might want to update your database to reflect the attached payment method
      break;
    // ... handle other event types
    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  return NextResponse.json({ received: true });
}
