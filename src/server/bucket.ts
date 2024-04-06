import "server-only";
import {
    S3Client,
    PutObjectCommand,
    DeleteObjectCommand,
    PutObjectCommandOutput,
    GetObjectCommand,
} from "@aws-sdk/client-s3";
import { env } from "@/env";
import { trustFile } from "@/types/schema/file-upload";
import { z } from "zod";
import { TLog, log } from "@/logger/logger";
import { Docs } from "@prisma/client";

type BucketUploadOutputData = PutObjectCommandOutput;

/**
 * This class is a singleton that will handle all the interactions with the cloud bucket
 * @class Bucket
 */
export class Bucket {
    private client = new S3Client({
        endpoint: env.BUCKET_ENDPOINT,
        region: env.BUCKET_REGION,
        credentials: {
            accessKeyId: env.BUCKET_KEY_ID,
            secretAccessKey: env.BUCKET_APP_KEY,
        },
    });

    // prefix for all file names
    private prefix = "heurly_";

    private static instance: Bucket;

    // zod schema for file type and size
    fileSchema = trustFile;

    private constructor() {
        // private constructor to ensure we only have one instance
    }

    /**
     * This function will check if the file type and size is safe
     * @param file {File} the file to check
     * @returns {boolean} true if the file is safe
     */
    private isFileTypeSafe(file: File): boolean {
        return this.fileSchema.safeParse(file).success;
    }

    /**
     * This function will upload a file to the cloud it will automatically check the file type and size
     * @param file {File} the file to upload
     * @returns {Promise<{success: boolean, data: BucketUploadOutputData}>
     */
    public async uploadFile(
        file: File,
    ): Promise<{ success: boolean; data: BucketUploadOutputData }> {
        log({ type: TLog.info, text: "Uploading file to the cloud" });

        // zod verification for file size and type
        if (!this.isFileTypeSafe(file)) {
            throw new Error("Invalid file type or size.");
        }

        const fileName = this.prefix + file.name;
        const fileBuffer = Buffer.from(await file.arrayBuffer());
        try {
            const response = await this.client.send(
                new PutObjectCommand({
                    Bucket: env.BUCKET_NAME,
                    Key: fileName,
                    Body: fileBuffer,
                    ContentType: file.type,
                }),
            );
            return {
                success: true,
                data: response,
            };
        } catch (error) {
            throw new Error("Error: Could not upload file.");
        }
    }

    /**
     *
     * @param fileName {string} the name of the file to delete
     * @returns  {Promise<{success: boolean, data: BucketUploadOutputData}>}
     */
    public async deleteFileByName(
        fileName: string,
    ): Promise<{ success: boolean; data: BucketUploadOutputData }> {
        log({
            type: TLog.info,
            text: `Deleting file ${fileName} from the cloud`,
        });

        // zod verification for file name
        const fileNameSchema = z.string().startsWith(this.prefix);

        // check if the file name is valid
        if (!fileNameSchema.safeParse(fileName).success) {
            throw new Error("Invalid file name.");
        }

        try {
            const response = await this.client.send(
                new DeleteObjectCommand({
                    Bucket: env.BUCKET_NAME,
                    Key: fileName,
                }),
            );
            return {
                success: true,
                data: response,
            };
        } catch (error) {
            throw new Error("Error: Could not delete file.");
        }
    }

    // /**
    //  *
    //  * This function will delete a file from the cloud
    //  * @param fileId {string} the id of the file to delete
    //  * @returns {Promise<{success: boolean, data: BucketUploadOutputData}>}
    //  */
    // public async deleteFileById(
    //     fileId: string,
    // ): Promise<{ success: boolean; data: BucketUploadOutputData }> {
    //     log({ type: TLog.info, text: `Deleting file ${fileId} from the cloud` });

    //     try {
    //         const response = await this.client.send(
    //             new DeleteObjectCommand({
    //                 Bucket: env.BUCKET_NAME,
    //                 Key: fileId,
    //             }),
    //         );
    //         return {
    //             success: true,
    //             data: response,
    //         };
    //     } catch (error) {
    //         log({ type: TLog.error, text: `${error}` })
    //         throw new Error("Error: Could not delete file.");
    //     }
    // }

    public async getFileUrlById(fileId: string): Promise<string> {
        return `https://${env.BUCKET_NAME}.${env.BUCKET_ENDPOINT}/${fileId}`;
    }

    public async getFile(doc: Docs): Promise<string> {
        const command = new GetObjectCommand({
            Bucket: env.BUCKET_NAME,
            Key: this.prefix + doc.title,
        });
        try {
            // const url = await getSignedUrl(this.client, command, { expiresIn: 3600 });
            // console.log(url);
            const response = await this.client.send(command);
            if (response.Body) {
                const buffer = Buffer.from(
                    new Uint8Array(await response.Body.transformToByteArray()),
                );
                const json = JSON.stringify({
                    blob: buffer.toString("base64"),
                });
                return json;
            } else {
                throw new Error("Response body is undefined.");
            }
        } catch (err) {
            throw new Error("File not found.");
        }
    }

    /**
     * This function is a singleton that will return the instance of the bucket
     * @returns {Bucket} the singleton instance of the bucket
     */
    public static getInstance(): Bucket {
        // ensure we only have one instance
        if (this.instance == null) {
            this.instance = new Bucket();
        }

        return this.instance;
    }
}

// singleton instance
export const bucket: Bucket = Bucket.getInstance();
