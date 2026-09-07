import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

// DigitalOcean Spaces is S3-compatible.
// DO_SPACE_ENDPOINT        e.g. https://blr1.digitaloceanspaces.com
// DO_SPACE_ORIGIN_ENDPOINT e.g. https://<bucket>.blr1.digitaloceanspaces.com (public origin/CDN base)
// DO_SPACE_BUCKET / DO_SPACE_ACCESS_KEY / DO_SPACE_SECRET_KEY

function required(name: string): string {
  const v = process.env[name];
  if (!v) throw new Error(`Missing env var ${name}`);
  return v;
}

export function isSpacesConfigured(): boolean {
  return Boolean(
    process.env.DO_SPACE_ENDPOINT &&
      process.env.DO_SPACE_BUCKET &&
      process.env.DO_SPACE_ACCESS_KEY &&
      process.env.DO_SPACE_SECRET_KEY,
  );
}

let client: S3Client | null = null;

function getClient(): S3Client {
  if (client) return client;
  const endpoint = required("DO_SPACE_ENDPOINT");
  // region from the endpoint host (blr1.digitaloceanspaces.com -> blr1)
  const region = new URL(endpoint).hostname.split(".")[0] || "us-east-1";
  client = new S3Client({
    endpoint,
    region,
    credentials: {
      accessKeyId: required("DO_SPACE_ACCESS_KEY"),
      secretAccessKey: required("DO_SPACE_SECRET_KEY"),
    },
    forcePathStyle: false,
  });
  return client;
}

function publicUrl(key: string): string {
  const origin = process.env.DO_SPACE_ORIGIN_ENDPOINT;
  if (origin) return `${origin.replace(/\/$/, "")}/${key}`;
  // fall back to <bucket>.<endpoint-host>/<key>
  const endpoint = required("DO_SPACE_ENDPOINT");
  const bucket = required("DO_SPACE_BUCKET");
  const host = new URL(endpoint).host;
  return `https://${bucket}.${host}/${key}`;
}

export async function uploadToSpaces(params: {
  key: string;
  body: Buffer | Uint8Array;
  contentType: string;
}): Promise<string> {
  await getClient().send(
    new PutObjectCommand({
      Bucket: required("DO_SPACE_BUCKET"),
      Key: params.key,
      Body: params.body,
      ContentType: params.contentType,
      ACL: "public-read",
      CacheControl: "public, max-age=31536000, immutable",
    }),
  );
  return publicUrl(params.key);
}
