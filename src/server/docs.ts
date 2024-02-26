"use server";
import { trustFile, trustFileList } from "@/types/schema/fileUpload";
import { uploadFile } from "./b2";
import { db } from "./db";
import type { User } from "next-auth";
import * as z from "zod";
import slugify from "slugify";
import { b2 } from "node_modules/@fullcalendar/core/internal-common";

import * as toxicity from "@tensorflow-models/toxicity";

// import pdfjsLib from 'pdfjs-dist';

function isDocsTypeSafe(file: File) {
    return trustFile.safeParse(file).success;
}

async function isDocsToxic(file: File) {
    // get the pdf content
    const fileContent = await file.text();
    console.log(fileContent);
    const threshold = 0.9;

    const topics =
        "identity_attack, insult, obscene, severe_toxicity, sexual_explicit, threat, toxicity, got identity attack, insult, obscene, severe toxicity, sexual explicit, threat, toxicity".split(
            ", ",
        );
    const model = await toxicity.load(threshold, topics);
    const predictions = await model.classify(fileContent);
    const resToxicity = predictions.every(
        (prediction) => prediction.results[0]?.match === false,
    );
    return resToxicity;
}

export async function handleFormUploadDocs(data: FormData) {
    const fileEntry = data.get("file") as unknown as FileList;
    const userId = data.get("userId") as User["id"];
    if (!fileEntry) {
        // Handle the case where no file was found in the FormData
        return {
            error: "No file found",
        };
    }
    // if there is only one file
    if (fileEntry instanceof File) {
        const file = fileEntry;

        // check if the file is valid
        if (!isDocsTypeSafe(file)) {
            return {
                error: "This file is not valid",
            };
        }

        // check if the file is toxic
        if (await isDocsToxic(file)) {
            return {
                error: "This file is toxic",
            };
        }

        // upload the file to the cloud
        const res = await uploadFile(file);
        if (res?.error) {
            return {
                error: res.error,
            };
        }

        // post the file to the database
        const resPostFile = await postFile(file, userId);
        if (resPostFile?.error) {
            return {
                error: resPostFile.error,
            };
        }

        return {
            success: true,
        };
    }

    if ((fileEntry as unknown) instanceof FileList) {
        const resCheckFileList = trustFileList.safeParse(fileEntry as FileList);

        if (!resCheckFileList.success) {
            return {
                error: resCheckFileList.error.errors[0]?.message,
            };
        }

        // Handle multiple file uploads
        for (const file of fileEntry) {
            // upload the file to the cloud
            try {
                const res = await uploadFile(file);
                if (res?.error) {
                    return {
                        error: res.error,
                    };
                }
            } catch (e) {
                return {
                    error: `Error uploading the file ${file.name}`,
                };
            }

            // post the file to the database
            try {
                const resPostFileMultiple = await postFile(file, userId);
                if (resPostFileMultiple?.error) {
                    return {
                        error: resPostFileMultiple.error,
                    };
                }
            } catch (e) {
                return {
                    error: `Error posting the file ${file.name}`,
                };
            }
        }
    }

    return {
        success: true,
    };
}

export async function postFile(file: File, userId: User["id"]) {
    // validate the file
    const res = trustFile.safeParse(file);
    if (!res.success) {
        return {
            error: res.error.errors[0]?.message,
        };
    }

    // validate the user ID
    const userIdSchema = z.string().cuid();

    const checkUserId = userIdSchema.safeParse(userId);
    if (!checkUserId.success) {
        return {
            error: "Invalid user ID",
        };
    }

    const user = await db.user.findUnique({
        where: {
            id: userId,
        },
    });

    if (!user) {
        return {
            error: "User not found",
        };
    }

    const resDb = await db.docs.create({
        data: {
            title: slugify(file.name, "_"),
            description: "A file",
            userId: userId,
        },
    });

    return {
        success: true,
    };
}

export async function getDocs() {}
