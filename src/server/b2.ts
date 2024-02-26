"use server";
import "server-only";
import B2 from "backblaze-b2";
import { env } from "@/env";
import * as z from "zod";
import {
    formUploadDocsSchema,
    trustFile,
    trustFileList,
} from "@/types/fileUpload";
import { P } from "node_modules/@fullcalendar/core/internal-common";

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

async function handleFormUploadDocs(data: FormData) {
    const fileEntry = data.get("file") as unknown as FileList;
    if (!fileEntry) {
        // Handle the case where no file was found in the FormData
        return {
            error: "No file found",
        };
    }

    if (fileEntry instanceof File) {
        const file = fileEntry;

        const resCheckTrustFile = trustFile.safeParse(file);

        if (!resCheckTrustFile.success) {
            return {
                error: resCheckTrustFile.error.errors[0]?.message,
            };
        }

        const res = await uploadFile(file);
        if (res?.error) {
            return {
                error: res.error,
            };
        }
        return {
            success: true,
        };
    }

    const resCheckFileList = trustFileList.safeParse(fileEntry as FileList);

    if (!resCheckFileList.success) {
        return {
            error: resCheckFileList.error.errors[0]?.message,
        };
    }

    // Handle multiple file uploads
    for (const file of fileEntry) {
        const res = await uploadFile(file);
        if (res?.error) {
            return {
                error: res.error,
            };
        }
    }

    // Assuming uploadFile is a function that uploads a file and returns a response object
    // If all uploads are successful, return a success response
    return {
        success: true,
    };
}

async function uploadFile(file: File) {
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
            fileName: "heurly_" + file.name,
            data: fileBuffer, // Use the converted binary string
        });
    } catch (e) {
        console.log(e);
        return {
            error: "Error when uploading file.",
        };
    }
}

export { uploadFile, handleFormUploadDocs };
