import { S3Client, PutObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const s3 = new S3Client({
  region: process.env.S3_REGION!,
  endpoint: process.env.S3_ENDPOINT || undefined,
  credentials: {
    accessKeyId: process.env.S3_ACCESS_KEY!,
    secretAccessKey: process.env.S3_SECRET_KEY!,
  },
});

export async function uploadBytes(params: {
  key: string;
  bytes: Uint8Array;
  contentType: string;
  cacheControl?: string;
}) {
  await s3.send(
    new PutObjectCommand({
      Bucket: process.env.S3_BUCKET!,
      Key: params.key,
      Body: Buffer.from(params.bytes),
      ContentType: params.contentType,
      CacheControl: params.cacheControl ?? "no-store",
    })
  );
}

export async function presignGetObject(key: string, expiresSeconds = 600) {
  const cmd = new GetObjectCommand({ Bucket: process.env.S3_BUCKET!, Key: key });
  return getSignedUrl(s3, cmd, { expiresIn: expiresSeconds });
}
