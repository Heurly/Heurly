"use server";
import "server-only";
import B2 from "backblaze-b2";
import { env } from "@/env";
import * as z from "zod";
import { fileFormDocsSchema, trustFile } from "@/types/fileUpload";

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

    const res = trustFile.safeParse(file);
    if (!res.success) {
        return {
            error: res.error.errors[0]?.message,
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

    const fileBuffer = Buffer.from(await file.arrayBuffer());
    try {
        const response = await b2.uploadFile({
            uploadUrl,
            uploadAuthToken: authorizationToken,
            fileName: "heurly_" + file.name,
            data: fileBuffer, // Use the converted binary string
        });
    } catch (e) {
        return {
            error: "Error when uploading file.",
        };
    }
}

export { uploadFile };
