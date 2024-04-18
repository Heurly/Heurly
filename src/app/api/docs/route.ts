import { trustFile, trustFileList } from "@/types/schema/file-upload";
import { db } from "@/server/db";
import type { User } from "next-auth";
import { getDocument } from "pdfjs-dist";
import { log, TLog } from "@/logger/logger";
import * as pdfjs from "pdfjs-dist";
import { bucket } from "@/server/bucket";
import { UserModel } from "prisma/zod";
import { Docs } from "@prisma/client";

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

export async function POST(request: Request): Promise<Response> {
    log({ type: TLog.info, text: "Handling POST request" });
    // let apiURL = request.headers.get("origin") ?? "";

    // handle the form data
    const res = await handleFormUploadDocs(await request.formData());
    return Response.json(res);
}

function isDocsTypeSafe(file: File) {
    log({ type: TLog.info, text: "Checking if the file is valid" });
    return trustFile.safeParse(file).success;
}

// type ToxicityResponse = {
//     isToxic: boolean;
// };

async function extractTextFromPDF(pdfFile: File): Promise<string> {
    log({ type: TLog.info, text: "Extracting text from PDF" });
    const fileContentArrayBuffer = await pdfFile.arrayBuffer();
    // Convert ArrayBuffer to Uint8Array
    const fileContent = new Uint8Array(fileContentArrayBuffer);

    const loadingTask = getDocument({ data: fileContent });
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

async function handleFormUploadDocs(data: FormData) {
    log({ type: TLog.info, text: "Handling form upload" });
    console.log(data);
    const fileEntry = data.get("file") as unknown as FileList;

    const userId = data.get("userId") as User["id"];
    const title = data.get("title") as Docs["title"];
    const description = data.get("description") as Docs["description"];

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
        // const pdfText = await extractTextFromPDF(file);

        // let isToxic: boolean;
        // try {
        //     const resIsToxic = await fetch(`${apiURL}/api/toxicity`, {
        //         method: "POST",
        //         body: JSON.stringify({ text: pdfText }),
        //         headers: {
        //             "Content-Type": "application/json",
        //         },
        //     })
        //         .then((res) => res.json())
        //         .then((res) => res as ToxicityResponse);

        //     isToxic = resIsToxic.isToxic ?? true;
        // } catch (e) {
        //     throw new Error(`Error while checking toxicity`);
        // }

        // if (isToxic) {
        //     return {
        //         error: "This file is toxic",
        //     };
        // }
        const filename = crypto.randomUUID() + `.pdf`;
        // upload the file to the cloud
        try {
            const resUploadOneFile = await bucket.uploadFile(file, filename);
            if (!resUploadOneFile.success) {
                return {
                    error: "Error uploading the file",
                };
            }
        } catch (e) {
            log({
                type: TLog.error,
                text: `Error uploading the file ${file.name}`,
            });
        }

        // post the file to the database
        const resPostFile = await postFile(
            file,
            userId,
            filename,
            title,
            description,
        );
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
            const filename = crypto.randomUUID() + `.pdf`;
            // upload the file to the cloud
            try {
                const res = await bucket.uploadFile(file, filename);
                if (!res.success) {
                    return {
                        error: "Error uploading the file",
                    };
                }

                log({
                    type: TLog.info,
                    text: `File uploaded with filename ${filename}`,
                });
            } catch (e) {
                return {
                    error: `Error uploading the file ${file.name}`,
                };
            }

            // post the file to the database
            try {
                const resPostFileMultiple = await postFile(
                    file,
                    userId,
                    filename,
                    title,
                    description,
                );
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

async function postFile(
    file: File,
    userId: User["id"],
    filename: string,
    title: string,
    description: string,
) {
    log({ type: TLog.info, text: "Posting file to the database" });
    // validate the file
    const res = trustFile.safeParse(file);
    if (!res.success) {
        return {
            error: res.error.errors[0]?.message,
        };
    }

    // validate the user ID
    const userIdCheck = UserModel.shape.id.safeParse(userId);

    if (!userIdCheck.success) {
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
    // filename : is a cuid + ".pdf"
    const resDb = await db.docs.create({
        data: {
            title: title,
            filename: filename,
            description: description,
            userId: userId,
        },
    });
    console.log(resDb);
    return {
        success: true,
    };
}
