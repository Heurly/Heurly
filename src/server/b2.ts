"use server";

import B2 from "backblaze-b2";
import { env } from "@/env";

const b2 = new B2({
  applicationKeyId: env.BUCKET_KEY_ID,
  applicationKey: env.BUCKET_APP_KEY,
});

async function getBucketId() {
  // Authorize with Backblaze B2
  await b2.authorize();
  try {
    const {
      data: {
        buckets: [{ bucketId }],
      },
    } = await b2.getBucket({ bucketName: env.BUCKET_NAME });
    return bucketId;
  } catch (e) {
    throw "Error: Could not get bucket.";
  }
}

async function uploadFile(file: File) {
  const bucketId = await getBucketId();
  const {
    data: { uploadUrl, authorizationToken },
  } = await b2.getUploadUrl({ bucketId });

  const fileBuffer = Buffer.from(await file.arrayBuffer()); // Convert File to Buffer

  const response = await b2.uploadFile({
    uploadUrl,
    uploadAuthToken: authorizationToken,
    fileName: "heurly_"+ file.name,
    data: fileBuffer, // Use the converted Buffer
  });

  return response;
}

async function sendData(file: File) {
    console.log("key id", env.BUCKET_KEY_ID)
    console.log("app key", env.BUCKET_APP_KEY)
  try {
    // Get upload URL and authorization token
    const bucketId = await getBucketId();

    const {
      data: { uploadUrl, authorizationToken },
    } = await b2.getUploadUrl({ bucketId });

    const res = await uploadFile(file);

    console.log("File uploaded successfully:", res.data);

  } catch (error) {
    console.error("Error:", error);
  }
}

export { sendData };
