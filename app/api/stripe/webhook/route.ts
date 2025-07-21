
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
        const { domainName, years, domainAction, eppCode, userId } = updatedOrder;

        // Retrieve the user's contact information from the database
        const user = await prisma.user.findUnique({
          where: { id: userId },
        });

        if (!user || !user.firstName || !user.lastName || !user.address1 || !user.city || !user.stateProvince || !user.postalCode || !user.country || !user.phone || !user.email) {
          console.error(`Missing user contact information for userId: ${userId}`);
          return NextResponse.json({ error: "Missing user contact information" }, { status: 500 });
        }

        const registrantInfo: ContactInfo = {
          firstName: user.firstName,
          lastName: user.lastName,
          address1: user.address1,
          address2: user.address2 || undefined,
          city: user.city,
          stateProvince: user.stateProvince,
          postalCode: user.postalCode,
          country: user.country,
          phone: user.phone,
          emailAddress: user.email,
          organizationName: undefined, // Assuming no organization for now
          jobTitle: undefined, // Assuming no job title for now
        };

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
