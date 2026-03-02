import crypto from "crypto";

type MomoConfig = {
  baseUrl: string; // e.g. https://sandbox.momodeveloper.mtn.com
  subscriptionKey: string; // Ocp-Apim-Subscription-Key
  targetEnvironment: string; // sandbox | production
  apiUser: string; // X-Reference-Id for token basic auth username
  apiKey: string; // password for token basic auth
  callbackUrl: string; // X-Callback-Url
};

export type MomoRequestToPayParams = {
  referenceId: string;        // UUID (X-Reference-Id header for requesttopay)
  amountRwf: number;          // integer RWF
  currency?: "RWF";
  phoneNumber: string;        // MSISDN with country code (e.g. 2507xxxxxxx)
  externalId: string;         // we set this to orderId
  payerMessage?: string;
  payeeNote?: string;
};

export type MomoStatus =
  | "PENDING"
  | "SUCCESSFUL"
  | "FAILED"
  | "TIMEOUT"
  | "UNKNOWN";

function cfgFromEnv(): MomoConfig {
  const baseUrl = process.env.MOMO_BASE_URL!;
  const subscriptionKey = process.env.MOMO_SUBSCRIPTION_KEY!;
  const targetEnvironment = process.env.MOMO_TARGET_ENVIRONMENT || "sandbox";
  const apiUser = process.env.MOMO_API_USER!;
  const apiKey = process.env.MOMO_API_KEY!;
  const callbackUrl = process.env.MOMO_CALLBACK_URL!;

  if (!baseUrl || !subscriptionKey || !targetEnvironment || !apiUser || !apiKey || !callbackUrl) {
    throw new Error("Missing MoMo env vars. Check MOMO_BASE_URL, MOMO_SUBSCRIPTION_KEY, MOMO_TARGET_ENVIRONMENT, MOMO_API_USER, MOMO_API_KEY, MOMO_CALLBACK_URL");
  }
  return { baseUrl, subscriptionKey, targetEnvironment, apiUser, apiKey, callbackUrl };
}

async function getToken(config: MomoConfig): Promise<string> {
  // Token endpoint: POST /collection/token/ (basic auth: apiUser:apiKey)
  const basic = Buffer.from(`${config.apiUser}:${config.apiKey}`).toString("base64");

  const res = await fetch(`${config.baseUrl}/collection/token/`, {
    method: "POST",
    headers: {
      Authorization: `Basic ${basic}`,
      "Ocp-Apim-Subscription-Key": config.subscriptionKey,
      "X-Target-Environment": config.targetEnvironment,
    },
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data?.message || data?.error || `Token error (${res.status})`);
  const token = data?.access_token;
  if (!token) throw new Error("MoMo token missing access_token");
  return token;
}

export function newReferenceId() {
  return crypto.randomUUID();
}

export async function requestToPay(params: MomoRequestToPayParams) {
  const config = cfgFromEnv();
  const token = await getToken(config);

  const body = {
    amount: String(params.amountRwf),
    currency: params.currency || "RWF",
    externalId: params.externalId,
    payer: {
      partyIdType: "MSISDN",
      partyId: params.phoneNumber,
    },
    payerMessage: params.payerMessage || `Order ${params.externalId}`,
    payeeNote: params.payeeNote || "YeweBeatz",
  };

  const res = await fetch(`${config.baseUrl}/collection/v1_0/requesttopay`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "X-Reference-Id": params.referenceId,
      "X-Target-Environment": config.targetEnvironment,
      "Ocp-Apim-Subscription-Key": config.subscriptionKey,
      "X-Callback-Url": config.callbackUrl,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  // Success is typically 202 Accepted with empty body
  const txt = await res.text();
  if (!res.ok) {
    let msg = txt;
    try {
      const j = JSON.parse(txt);
      msg = j?.message || j?.error || txt;
    } catch {}
    throw new Error(msg || `requestToPay error (${res.status})`);
  }
  return { ok: true };
}

export async function getRequestToPayStatus(referenceId: string): Promise<{ status: MomoStatus; raw: any }> {
  const config = cfgFromEnv();
  const token = await getToken(config);

  const res = await fetch(`${config.baseUrl}/collection/v1_0/requesttopay/${encodeURIComponent(referenceId)}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      "X-Target-Environment": config.targetEnvironment,
      "Ocp-Apim-Subscription-Key": config.subscriptionKey,
    },
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    return { status: "UNKNOWN", raw: data };
  }

  const s = String(data?.status || "").toUpperCase();
  if (s === "SUCCESSFUL") return { status: "SUCCESSFUL", raw: data };
  if (s === "FAILED") return { status: "FAILED", raw: data };
  if (s === "PENDING") return { status: "PENDING", raw: data };
  return { status: "UNKNOWN", raw: data };
}
