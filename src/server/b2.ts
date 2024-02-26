"use server";
import "server-only";
import B2 from "backblaze-b2";
import { env } from "@/env";
import { trustFile, trustFileList } from "@/types/schema/fileUpload";
import slugify from "slugify";

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

export async function uploadFile(file: File) {
    // zod verification for file size and type

    const res = trustFile.safeParse(file);
    if (!res.success) {
        return {
            error: res.error.errors[0]?.message,
        };
    }

    let uploadUrlFromB2, authorizationTokenFromB2;

    try {
        const bucketId = await getBucketId();

        const {
            data: { uploadUrl, authorizationToken },
        } = await b2.getUploadUrl({ bucketId });

        uploadUrlFromB2 = uploadUrl;
        authorizationTokenFromB2 = authorizationToken;
    } catch (e) {
        return {
            error: "Error when getting upload URL.",
        };
    }

    const fileBuffer = Buffer.from(await file.arrayBuffer());
    try {
        const response = await b2.uploadFile({
            uploadUrl: uploadUrlFromB2,
            uploadAuthToken: authorizationTokenFromB2,
            fileName: "heurly_" + slugify(file.name, "_"),
            data: fileBuffer,
        });
        if (response.status !== 200) {
            return {
                error: "Error when uploading file.",
            };
        }
        console.log(response);
    } catch (e) {
        return {
            error: "Error when uploading file.",
        };
    }
}

export async function getBucketFile(fileId: string) {
    await b2.authorize();

    b2.downloadFileById({
        fileId: "fileId",
        responseType: "arraybuffer",
    });
}
