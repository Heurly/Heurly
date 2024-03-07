"use server";
import "server-only";
import B2 from "backblaze-b2";
import { env } from "@/env";
import { trustFile } from "@/types/schema/file-upload";
import slugify from "slugify";
import { TLog, log } from "@/logger/logger";

const b2 = new B2({
    applicationKeyId: env.BUCKET_KEY_ID,
    applicationKey: env.BUCKET_APP_KEY,
});

interface BucketResponse {
    status: number;
    statusText: string;
    headers: string[];
    config: string;
    request: string;
    data: {
        buckets: [
            {
                bucketId: string;
                uploadUrl: string;
            },
        ];
    };
}

async function getBucketId() {
    log({ type: TLog.info, text: "Getting bucket ID" });
    // Authorize with Backblaze B2
    await b2.authorize();
    try {
        const res = (await b2.getBucket({
            bucketName: env.BUCKET_NAME,
        })) as BucketResponse;

        if (!res.data || !("buckets" in res.data))
            throw new Error("Error: Could not get bucket.");

        const bucketId = res?.data?.buckets[0]?.bucketId;

        return bucketId;
    } catch (e) {
        throw "Error: Could not get bucket.";
    }
}

export async function uploadFile(file: File) {
    log({ type: TLog.info, text: "Uploading file to the cloud" });
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

        type resUploadUrl = {
            data: {
                uploadUrl: string;
                authorizationToken: string;
            };
        };
        const res = (await b2.getUploadUrl({ bucketId })) as resUploadUrl;

        uploadUrlFromB2 = res.data?.uploadUrl;
        authorizationTokenFromB2 = res.data?.authorizationToken;
    } catch (e) {
        return {
            error: "Error when getting upload URL.",
        };
    }
    if (!uploadUrlFromB2 || !authorizationTokenFromB2)
        throw new Error("Error when getting upload URL.");

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
    } catch (e) {
        return {
            error: "Error when uploading file.",
        };
    }
}

// export async function getBucketFile(fileId: string) {
//     await b2.authorize();

//     await b2.downloadFileById({
//         fileId: "fileId",
//         responseType: "arraybuffer",
//     });
// }
