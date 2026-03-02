import { prisma } from "@/lib/db";
import { makeLicensePdf } from "@/lib/makeLicensePdf";
import { uploadBytes } from "@/lib/storage";

function safeJson(raw: string) {
  try {
    return JSON.parse(raw);
  } catch {
    return { raw };
  }
}

export async function finalizeOrder(orderId: string) {
  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: { items: true },
  });
  if (!order) throw new Error("Order not found");
  if (order.status !== "PAID") return;
  if (order.licensePdfUrl) return;

  const pdfItems = order.items.map((it) => ({
    title: it.title,
    licenseType: it.licenseType,
    deliverables: it.deliverables ? it.deliverables.split(",").map((s) => s.trim()) : null,
    usageLimits: it.usageLimits ? safeJson(it.usageLimits) : null,
  }));

  const pdfBytes = await makeLicensePdf({
    orderId: order.id,
    buyerName: order.buyerName,
    buyerEmail: order.buyerEmail,
    sellerName: "YeweBeatz",
    createdAtISO: order.createdAt.toISOString(),
    items: pdfItems,
  });

  const pdfKey = `licenses/${order.id}/license.pdf`;

  await uploadBytes({
    key: pdfKey,
    bytes: pdfBytes,
    contentType: "application/pdf",
    cacheControl: "no-store",
  });

  await prisma.order.update({
    where: { id: order.id },
    data: { licensePdfUrl: `s3key:${pdfKey}` },
  });
}
