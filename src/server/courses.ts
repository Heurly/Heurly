"use server";
import { db } from "./db";

export async function getCourse(id: number) {
    return db.course.findUnique({
        where: {
            id: id,
        },
    });
}

export async function getCoursesForSelect(query: string) {
    return db.course.findMany({
        where: {
            OR: [
                {
                    name: {
                        contains: query,
                    },
                },
                {
                    small_code: {
                        contains: query,
                    },
                },
                {
                    code: {
                        contains: query,
                    },
                },
            ],
        },
        distinct: ["name"],
        orderBy: [
            {
                year: "desc",
            },
            {
                name: "asc",
            },
            {
                code: "asc",
            },
            {
                small_code: "asc",
            },
        ],
        take: 10,
    });
}
