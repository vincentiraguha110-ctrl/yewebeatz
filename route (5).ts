import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { finalizeOrder } from "@/lib/finalizeOrder";
import { getRequestToPayStatus } from "@/lib/momo";

/**
 * NOTE: MoMo callback payloads vary by deployment. This handler supports:
 * - referenceId / X-Reference-Id (we store as providerRef)
 * - externalId (we set to order.id in requestToPay body)
 */
export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));

  const referenceId =
    body?.referenceId ||
    body?.reference_id ||
    body?.financialTransactionId ||
    body?.transactionId;

  const externalId = body?.externalId || body?.external_id;

  let order = null as any;

  if (referenceId) {
    order = await prisma.order.findFirst({
      where: { provider: "MOMO", providerRef: String(referenceId) },
    });
  }
  if (!order && externalId) {
    order = await prisma.order.findUnique({ where: { id: String(externalId) } });
  }

  if (!order) return NextResponse.json({ ok: true });

  // If callback includes status
  const callbackStatus = String(body?.status || "").toUpperCase();
  if (callbackStatus === "SUCCESSFUL") {
    await prisma.order.update({ where: { id: order.id }, data: { status: "PAID" } });
    await finalizeOrder(order.id);
    return NextResponse.json({ ok: true });
  }
  if (callbackStatus === "FAILED") {
    await prisma.order.update({ where: { id: order.id }, data: { status: "FAILED" } });
    return NextResponse.json({ ok: true });
  }

  // Otherwise, fall back to status query if we have providerRef
  if (order.providerRef) {
    const { status } = await getRequestToPayStatus(order.providerRef);
    if (status === "SUCCESSFUL") {
      await prisma.order.update({ where: { id: order.id }, data: { status: "PAID" } });
      await finalizeOrder(order.id);
    } else if (status === "FAILED") {
      await prisma.order.update({ where: { id: order.id }, data: { status: "FAILED" } });
    }
  }

  return NextResponse.json({ ok: true });
}
