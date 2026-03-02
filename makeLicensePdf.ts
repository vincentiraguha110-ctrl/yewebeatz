import { PDFDocument, StandardFonts } from "pdf-lib";

export async function makeLicensePdf(params: {
  orderId: string;
  buyerName?: string | null;
  buyerEmail?: string | null;
  sellerName: string;
  createdAtISO: string;
  items: Array<{
    title: string;
    licenseType?: string | null;
    deliverables?: string[] | null;
    usageLimits?: Record<string, string | number> | null;
  }>;
}) {
  const pdf = await PDFDocument.create();
  const page = pdf.addPage([595, 842]); // A4
  const font = await pdf.embedFont(StandardFonts.Helvetica);

  const draw = (text: string, x: number, y: number, size = 12) => {
    page.drawText(text, { x, y, size, font });
  };

  let y = 800;
  draw(`${params.sellerName} — Beat License Agreement`, 50, y, 18);
  y -= 28;

  draw(`Order ID: ${params.orderId}`, 50, y);
  y -= 16;
  draw(`Date: ${params.createdAtISO}`, 50, y);
  y -= 16;
  draw(`Buyer: ${params.buyerName || "N/A"} (${params.buyerEmail || "N/A"})`, 50, y);
  y -= 24;

  draw("Licensed Items:", 50, y, 14);
  y -= 18;

  for (const it of params.items) {
    draw(`• ${it.title}`, 60, y);
    y -= 16;
    if (it.licenseType) {
      draw(`License: ${it.licenseType}`, 80, y);
      y -= 16;
    }
    if (it.deliverables?.length) {
      draw(`Deliverables: ${it.deliverables.join(", ")}`, 80, y);
      y -= 16;
    }
    if (it.usageLimits && Object.keys(it.usageLimits).length) {
      const limits = Object.entries(it.usageLimits)
        .map(([k, v]) => `${k}: ${v}`)
        .join(" | ");
      draw(`Limits: ${limits}`.slice(0, 110), 80, y);
      y -= 16;
    }
    y -= 8;
    if (y < 110) break;
  }

  draw(
    "This license is granted only after confirmed payment. Keep this PDF for your records.",
    50,
    90
  );

  return pdf.save();
}
