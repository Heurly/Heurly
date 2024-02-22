"use server";

import B2 from "backblaze-b2";
import { env } from "@/env";
import * as z from "zod";

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
    // zod verification for file size and type

    const fileSchema = z.object({
        size: z.number().max(5000000),
        type: z.string().regex(/application\/pdf/),
    });

    try {
        fileSchema.parse({
            size: file.size,
            type: file.type,
        });
    } catch (e) {
        return {
            error: "File is too big.",
        };
    }

    let uploadUrl, authorizationToken;

    try {
        const bucketId = await getBucketId();

        const {
            data: { uploadUrlFromB2, authorizationTokenFromb2 },
        } = await b2.getUploadUrl({ bucketId });

        uploadUrl = uploadUrlFromB2;
        authorizationToken = authorizationTokenFromb2;
    } catch (e) {
        return {
            error: "Error when getting upload URL.",
        };
    }

    const fileBuffer = Buffer.from(await file.arrayBuffer()); // Convert File to Buffer

    try {
        const response = await b2.uploadFile({
            uploadUrl,
            uploadAuthToken: authorizationToken,
            fileName: "heurly_" + file.name,
            data: fileBuffer, // Use the converted Buffer
        });
    } catch (e) {
        return {
            error: "Error when uploading file.",
        };
    }
}

export { uploadFile };
