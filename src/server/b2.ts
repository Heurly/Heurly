"use server";
import "server-only";
import { S3Client, PutObjectCommand  } from '@aws-sdk/client-s3';

import { env } from "@/env";
import { trustFile } from "@/types/schema/file-upload";
import slugify from "slugify";
import { TLog, log } from "@/logger/logger";

const client = new S3Client({
    endpoint: env.BUCKET_ENDPOINT,
    region: env.BUCKET_REGION,
    credentials: {
        accessKeyId: env.BUCKET_KEY_ID,
        secretAccessKey: env.BUCKET_APP_KEY,
    },
  });

// async function getBucketId() {
//     log({ type: TLog.info, text: "Getting bucket ID" });
//     // Authorize with Backblaze B2
//     const cmd = new ListBucketsCommand({});

//     try {
//         const { Buckets } = await client.send(cmd);
//         console.log("Buckets: ", Buckets);
//     } catch (e) {
//         throw "Error: Could not get bucket.";
//     }
// }

function isFileTypeSafe(file: File) {
    log({ type: TLog.info, text: "Checking file type and size" });
    return trustFile.safeParse(file).success;
}

export async function uploadFile(file: File) {
    log({ type: TLog.info, text: "Uploading file to the cloud" });
    
    // zod verification for file size and type
    if (!isFileTypeSafe(file)) {
        return {
            error: "Invalid file type or size.",
        };
    }
  
    const fileName = "heurly_" + slugify(file.name, "_");
    const fileBuffer = Buffer.from(await file.arrayBuffer());
    try {

        const response = await client.send(new PutObjectCommand({
            Bucket: env.BUCKET_NAME,
            Key: fileName,
            Body: fileBuffer
          }));
        console.log(JSON.stringify(response))
        return
        return {
            success: true,
            data: response,
        };
    } catch (e) {
        console.log(e)
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
