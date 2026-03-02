# YeweBeatz (Full Project Template)

A beatstore template (RWF-only) with:
- Next.js App Router + Tailwind
- Prisma + PostgreSQL
- Stripe Checkout (RWF zero-decimal)
- MTN MoMo Collections (skeleton routes)
- License tiers (Basic/Premium/Unlimited)
- License PDF generation
- Secure downloads via S3/R2 presigned URLs

## 1) Install
```bash
npm install
```

## 2) Configure env
Copy `.env.example` -> `.env.local` (or edit `.env.local`) and set:
- DATABASE_URL
- STRIPE keys
- S3/R2 keys

## 3) Database
```bash
npx prisma migrate dev --name init
```

## 4) Run
```bash
npm run dev
```

## 5) Upload your files to S3/R2
Beats:
- beats/<TRACK_ID>/mp3.mp3
- beats/<TRACK_ID>/wav.wav
- beats/<TRACK_ID>/stems.zip

Sound kits:
- kits/<KIT_ID>/download.zip

Example:
- beats/T10036/mp3.mp3

## 6) Stripe webhook
Create a Stripe webhook endpoint pointing to:
- /api/webhooks/stripe

Use the webhook secret in STRIPE_WEBHOOK_SECRET.

## 7) MTN MoMo
Routes exist but you must implement real requestToPay + getStatus calls in:
- src/app/api/pay/momo/route.ts
- src/app/api/pay/momo/status/route.ts


## MoMo Collections (implemented)
This template implements:
- Token: POST /collection/token/ (Basic Auth apiUser:apiKey)
- RequestToPay: POST /collection/v1_0/requesttopay (Bearer token)
- Status: GET /collection/v1_0/requesttopay/{referenceId}

Set env vars in .env.local:
MOMO_BASE_URL, MOMO_SUBSCRIPTION_KEY, MOMO_TARGET_ENVIRONMENT, MOMO_API_USER, MOMO_API_KEY, MOMO_CALLBACK_URL
