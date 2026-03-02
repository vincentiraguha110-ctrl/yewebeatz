import Link from "next/link";

export default async function SuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ orderId?: string }>;
}) {
  const { orderId } = await searchParams;

  if (!orderId) {
    return (
      <div className="rounded-2xl border border-white/10 bg-white/5 p-6 text-white/70">
        Missing orderId.
      </div>
    );
  }

  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/orders/${orderId}`, {
    cache: "no-store",
  });

  const data = await res.json();
  if (!res.ok) {
    return (
      <div className="rounded-2xl border border-white/10 bg-white/5 p-6 text-white/70">
        Could not load order.
      </div>
    );
  }

  return (
    <div className="grid gap-6">
      <div>
        <h1 className="text-2xl font-semibold">Order</h1>
        <p className="mt-1 text-sm text-white/70">
          Order <span className="text-white">{orderId}</span>
        </p>
      </div>

      <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
        <div className="text-sm text-white/70">
          Status: <span className="text-white">{data.status}</span>
        </div>

        {data.status !== "PAID" && (
          <div className="mt-3 text-sm text-white/70">
            Payment not confirmed yet. If you paid with MoMo, go to{" "}
            <Link className="underline" href={`/momo/pending?orderId=${orderId}`}>
              pending
            </Link>
            .
          </div>
        )}

        {data.status === "PAID" && (
          <>
            <div className="mt-5">
              <div className="font-semibold">License PDF</div>
              {data.licensePdfUrl ? (
                <a className="mt-2 inline-block underline text-white/90" href={data.licensePdfUrl}>
                  Download License PDF
                </a>
              ) : (
                <div className="mt-2 text-sm text-white/70">
                  License PDF is being generated… refresh in a moment.
                </div>
              )}
            </div>

            <div className="mt-6">
              <div className="font-semibold">Downloads</div>
              <ul className="mt-2 space-y-2 text-sm text-white/80">
                {(data.downloads || []).map((d: any) => (
                  <li key={d.label}>
                    <a className="underline" href={d.url}>
                      {d.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
