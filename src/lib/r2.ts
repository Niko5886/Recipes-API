import fs from "fs";
import path from "path";
import { config as loadEnv } from "dotenv";
import { S3Client } from "@aws-sdk/client-s3";

let envLoaded = false;

export function ensureR2Env() {
  if (envLoaded) return;

  const hasR2Env = Boolean(
    process.env.R2_BUCKET_NAME &&
    (process.env.R2_ENDPOINT_URL || process.env.R2_ENDPOINT) &&
    process.env.R2_ACCESS_KEY_ID &&
    process.env.R2_SECRET_ACCESS_KEY &&
    process.env.R2_PUBLIC_URL
  );

  if (!hasR2Env) {
    const rootEnvPath = path.resolve(process.cwd(), "..", ".env");
    if (fs.existsSync(rootEnvPath)) {
      loadEnv({ path: rootEnvPath });
    }
  }

  envLoaded = true;
}

export function getR2Config() {
  ensureR2Env();

  const endpoint = process.env.R2_ENDPOINT_URL ?? process.env.R2_ENDPOINT;
  const bucket = process.env.R2_BUCKET_NAME;
  const accessKeyId = process.env.R2_ACCESS_KEY_ID;
  const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY;
  const publicUrl = process.env.R2_PUBLIC_URL;

  if (!endpoint || !bucket || !accessKeyId || !secretAccessKey || !publicUrl) {
    return null;
  }

  return { endpoint, bucket, accessKeyId, secretAccessKey, publicUrl };
}

export function createR2Client(config: {
  endpoint: string;
  accessKeyId: string;
  secretAccessKey: string;
}) {
  return new S3Client({
    region: "auto",
    endpoint: config.endpoint,
    credentials: {
      accessKeyId: config.accessKeyId,
      secretAccessKey: config.secretAccessKey,
    },
  });
}
