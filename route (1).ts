import { NextResponse } from "next/server";
import Stripe from "stripe";
import { prisma } from "@/lib/db";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: "2025-01-27.acacia" });

export async function POST(req: Request) {
  const body = await req.json();
  const { buyerEmail, buyerName, items } = body;

  if (!items?.length) return NextResponse.json({ error: "No items" }, { status: 400 });

  const amountRwf = items.reduce((s: number, i: any) => s + i.priceRwf, 0);

  const order = await prisma.order.create({
    data: {
      status: "PENDING",
      provider: "STRIPE",
      amount: amountRwf,
      currency: "RWF",
      buyerEmail,
      buyerName,
      items: {
        create: items.map((i: any) => ({
          itemType: i.type,
          itemId: i.id,
          title: i.title,
          price: i.priceRwf,
          licenseType: i.licenseType ?? null,
          deliverables: Array.isArray(i.deliverables) ? i.deliverables.join(",") : null,
          usageLimits: i.usageLimits ? JSON.stringify(i.usageLimits) : null,
        })),
      },
    },
  });

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    customer_email: buyerEmail,
    line_items: items.map((i: any) => ({
      quantity: 1,
      price_data: {
        currency: "rwf",
        unit_amount: i.priceRwf, // RWF is zero-decimal in Stripe
        product_data: { name: i.title },
      },
    })),
    metadata: { orderId: order.id },
    success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/success?orderId=${order.id}`,
    cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/cart`,
  });

  await prisma.order.update({
    where: { id: order.id },
    data: { providerRef: session.id },
  });

  return NextResponse.json({ url: session.url });
}
