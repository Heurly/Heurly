import { trustFile, trustFileList } from "@/types/schema/fileUpload";
import { uploadFile } from "@/server/b2";
import { db } from "@/server/db";
import type { User } from "next-auth";
import * as z from "zod";
import slugify from "slugify";
// import tf from "@tensorflow/tfjs-node";
import * as toxicity from "@tensorflow-models/toxicity";
import { getDocument } from "pdfjs-dist";
// Dynamically set the worker source
const pdfjs = await import("pdfjs-dist");
pdfjs.GlobalWorkerOptions.workerSrc = "pdfjs-dist/build/pdf.worker.mjs";

export async function POST(request: Request): Promise<Response> {
    // handle the form data
    const res = await handleFormUploadDocs(await request.formData());
    return Response.json(res);
}

function isDocsTypeSafe(file: File) {
    return trustFile.safeParse(file).success;
}

async function extractTextFromPDF(pdfData: Uint8Array): Promise<string> {
    const loadingTask = getDocument({ data: pdfData });
    const pdf = await loadingTask.promise;

    let textContent = "";

    // Iterate through each page
    for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
        const page = await pdf.getPage(pageNum);

        const pageTextContent = await page.getTextContent();

        pageTextContent.items.forEach((item) => {
            if ("str" in item) {
                textContent += item.str + " ";
            }
        });
    }
    return textContent;
}

async function isDocsToxic(file: File) {
    const fileContentArrayBuffer = await file.arrayBuffer();
    // Convert ArrayBuffer to Uint8Array
    const fileContent = new Uint8Array(fileContentArrayBuffer);

    let textContent = "";

    // Extract the PDF content
    try {
        textContent = await extractTextFromPDF(fileContent);
    } catch (e) {
        throw new Error("Error extracting text from PDF", e as Error);
    }

    const threshold = 0.9;

    const toxicityLabels = [
        "identity_attack",
        "insult",
        "obscene",
        "severe_toxicity",
        "sexual_explicit",
        "threat",
        "toxicity",
    ];
    const model = await toxicity.load(threshold, toxicityLabels);
    const predictions = await model.classify(textContent);
    const isTextNotToxic = predictions.every(
        (prediction) => prediction.results[0]?.match === false,
    );
    return !isTextNotToxic;
}

async function handleFormUploadDocs(data: FormData) {
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
        const isToxic = await isDocsToxic(file);

        if (isToxic) {
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
        const resCheckFileList = trustFileList.safeParse(fileEntry);

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

async function postFile(file: File, userId: User["id"]) {
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
    console.log(resDb);
    return {
        success: true,
    };
}
