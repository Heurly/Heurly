import * as z from "zod";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5mb
const ACCEPTED_DOCS_TYPES = ["application/pdf"];

export const trustFile = z
    .any()
    .refine((file) => file instanceof File, {
        message: "Expected a file",
    })
    .refine(
        (file) => file.size < MAX_FILE_SIZE,
        `File size should be less than 5mb.`,
    )
    .refine(
        (file) => ACCEPTED_DOCS_TYPES.includes(file.type),
        "Only these types are allowed .pdf",
    )
    .refine(
        (file) =>
            file.size < MAX_FILE_SIZE &&
            ACCEPTED_DOCS_TYPES.includes(file.type),
        "File size should be less than 5mb and only these types are allowed .pdf",
    );

export const trustFileList = z.any().refine(
    (filesInList) => {
        for (const file of filesInList) {
            const res = trustFile.safeParse(file);
            if (!res.success) {
                return false;
            }
        }
        return true;
    },
    {
        message: "Expected a file list",
    },
);

export const formUploadDocsSchema = z.object({
    file: trustFileList,
});
