import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getRequestToPayStatus } from "@/lib/momo";
import { finalizeOrder } from "@/lib/finalizeOrder";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const orderId = searchParams.get("orderId");
  if (!orderId) return NextResponse.json({ error: "Missing orderId" }, { status: 400 });

  const order = await prisma.order.findUnique({ where: { id: orderId } });
  if (!order) return NextResponse.json({ error: "Order not found" }, { status: 404 });

  if (order.status === "PAID") {
    return NextResponse.json({ orderStatus: "PAID", message: "Payment confirmed." });
  }

  if (order.provider !== "MOMO" || !order.providerRef) {
    return NextResponse.json({ orderStatus: order.status, message: "Not a MoMo order." });
  }

  const { status } = await getRequestToPayStatus(order.providerRef);

  if (status === "SUCCESSFUL") {
    await prisma.order.update({ where: { id: order.id }, data: { status: "PAID" } });
    await finalizeOrder(order.id);
    return NextResponse.json({ orderStatus: "PAID", message: "Payment confirmed." });
  }

  if (status === "FAILED") {
    await prisma.order.update({ where: { id: order.id }, data: { status: "FAILED" } });
    return NextResponse.json({ orderStatus: "FAILED", message: "Payment failed." });
  }

  return NextResponse.json({ orderStatus: "PENDING", message: "Waiting for MoMo confirmation..." });
}
