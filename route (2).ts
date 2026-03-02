import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { newReferenceId, requestToPay } from "@/lib/momo";

export async function POST(req: Request) {
  const body = await req.json();
  const { buyerEmail, buyerName, phoneNumber, items } = body;

  if (!items?.length) return NextResponse.json({ error: "No items" }, { status: 400 });

  const amountRwf = items.reduce((s: number, i: any) => s + i.priceRwf, 0);

  const order = await prisma.order.create({
    data: {
      status: "PENDING",
      provider: "MOMO",
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

  const referenceId = newReferenceId();
  await prisma.order.update({ where: { id: order.id }, data: { providerRef: referenceId } });

  try {
    await requestToPay({
      referenceId,
      amountRwf,
      currency: "RWF",
      phoneNumber,
      externalId: order.id, // we use orderId as externalId
      payerMessage: `YeweBeatz order ${order.id}`,
      payeeNote: "YeweBeatz",
    });
  } catch (e: any) {
    await prisma.order.update({ where: { id: order.id }, data: { status: "FAILED" } });
    return NextResponse.json({ error: e?.message || "MoMo requestToPay failed" }, { status: 500 });
  }

  return NextResponse.json({ orderId: order.id, referenceId, status: "PENDING" });
}
