import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { presignGetObject } from "@/lib/storage";
import { deliverablesForLicense, beatFileKey, kitFileKey, type LicenseType } from "@/lib/deliverables";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ orderId: string }> }
) {
  const { orderId } = await params;

  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: { items: true },
  });

  if (!order) return NextResponse.json({ error: "Not found" }, { status: 404 });

  let licensePdfUrl: string | null = null;
  if (order.status === "PAID" && order.licensePdfUrl?.startsWith("s3key:")) {
    const key = order.licensePdfUrl.replace("s3key:", "");
    licensePdfUrl = await presignGetObject(key, 600);
  }

  const downloads: Array<{ label: string; url: string }> = [];

  if (order.status === "PAID") {
    for (const item of order.items) {
      if (item.itemType === "TRACK") {
        const trackId = item.itemId;
        const licenseType = (item.licenseType || "BASIC") as LicenseType;
        const deliverables = deliverablesForLicense(licenseType);

        for (const d of deliverables) {
          const key = beatFileKey(trackId, d);
          const url = await presignGetObject(key, 600);
          downloads.push({ label: `${item.title} — ${d}`, url });
        }
      }

      if (item.itemType === "SOUND_KIT") {
        const key = kitFileKey(item.itemId);
        const url = await presignGetObject(key, 600);
        downloads.push({ label: `${item.title} — Download`, url });
      }
    }
  }

  return NextResponse.json({
    id: order.id,
    status: order.status,
    currency: order.currency,
    amount: order.amount,
    licensePdfUrl,
    downloads,
  });
}
