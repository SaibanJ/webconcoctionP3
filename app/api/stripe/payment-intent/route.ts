
import { NextResponse } from "next/server";
import Stripe from "stripe";
import { getPricing } from "@/app/utils/namecheap";
import prisma from "@/lib/prisma";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-06-20",
});

export async function POST(request: Request) {
  try {
    const { domain, years, userId, hostingPlan, domainAction, calculatePrice, eppCode } = await request.json();

    if (!domain || !years) {
      return NextResponse.json({ error: "Domain and years are required" }, { status: 400 });
    }

    const tld = domain.split(".").pop();
    if (!tld) {
      return NextResponse.json({ error: "Invalid domain" }, { status: 400 });
    }

    // Determine action for pricing based on domainAction or default to REGISTER
    const pricingAction = domainAction || "REGISTER";

    const pricing = await getPricing("DOMAIN", pricingAction, tld);
    const price = parseFloat(pricing.Product[0].Price[0].$.Price) * years;
    const priceInCents = Math.round(price * 100);

    if (calculatePrice) {
      return NextResponse.json({ price: priceInCents });
    }

    // If not calculating price, then userId, hostingPlan, and domainAction are required
    if (!userId || !hostingPlan || !domainAction) {
      return NextResponse.json({ error: "Missing required fields for order creation" }, { status: 400 });
    }

    // Create an Order record in the database with PENDING status
    const order = await prisma.order.create({
      data: {
        userId,
        status: "PENDING",
        hostingPlan,
        domainAction,
        domainName: domain,
        years,
        totalPrice: price,
        eppCode: eppCode || null, // Include eppCode if provided
      },
    });

    const paymentIntent = await stripe.paymentIntents.create({
      amount: priceInCents,
      currency: "usd",
      metadata: {
        orderId: order.id,
        domain,
        years,
        hostingPlan,
        domainAction,
        userId,
      },
    });

    return NextResponse.json({ clientSecret: paymentIntent.client_secret, orderId: order.id });
  } catch (error) {
    console.error("Error creating payment intent:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
