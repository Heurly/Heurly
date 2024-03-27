import type { Feature } from "@prisma/client";
import { TLog, log } from "@/logger/logger";
import { db } from "@/server/db";
import { createInterface } from "readline";
import { stdin as input, stdout as output } from "process";
import courses from "./seed-data/courses.json";
import units from "./seed-data/units.json";
import features from "./seed-data/features.json";
import LogCatch from "@/components/utils/log-catch";

type RawData = {
    fullname: string;
    code: number;
    label: string;
};

const rl = createInterface({ input, output });

async function getEmail() {
    const mail: string = await new Promise<string>((resolve) => {
        rl.question("👀 Enter the email you will use: ", resolve);
    });

    if (!mail || mail.trim().length === 0) {
        throw new Error("⚠️ No email entered");
    }

    const isGood: string = await new Promise<string>((resolve) => {
        rl.question(`👀 you will use ${mail} for email ? [y/n] `, resolve);
    });

    if (isGood.toLowerCase().trim() != "y") {
        await getEmail();
    }

    rl.close();
    return mail;
}

async function main() {
    let errorCode = 0;
    try {
        // delete all data
        await db.course.deleteMany({});
        log({ type: TLog.info, text: "🪣  courses deleted" });
    } catch (e: any) {
        errorCode = 1;
        LogCatch(e);
    }

    const resCourses = courses.map((course) => {
        return {
            code: course.code,
            name: course.name,
            professor: course.professor,
            description: course.description,
            year: course.year,
            unit: course.unit,
            small_code: course.small_code,
        };
    });

    try {
        await db.course.createMany({
            data: resCourses,
        });

        log({ type: TLog.info, text: "🎒 Courses seeded" });
    } catch (e: any) {
        errorCode = 2;
        LogCatch(e);
    }

    try {
        // delete all data
        await db.unit.deleteMany({});
        log({ type: TLog.info, text: "🪣  Units deleted" });
    } catch (e: any) {
        errorCode = 3;
        LogCatch(e);
    }

    const rawUnits = units.ESIEE_PARIS as RawData[];

    const resUnits = [];

    for (const unit of rawUnits) {
        resUnits.push({
            name: unit.label,
            code: unit.code,
            fullName: unit.fullname,
        });
    }

    try {
        await db.unit.createMany({
            data: resUnits,
        });
        log({ type: TLog.info, text: "📚 Units seeded" });
    } catch (e: any) {
        errorCode = 4;
        LogCatch(e);
    }

    let insertSchool = null;
    try {
        // detect if the ESIEE Paris school is already in the database
        insertSchool = await db.school.findFirst({
            where: {
                name: "ESIEE Paris",
            },
        });

        // if the school is already in the database, we don't add it
        if (insertSchool) {
            log({ type: TLog.info, text: "👏🏽 School already in the database" });
        } else {
            insertSchool = await db.school.create({
                data: {
                    name: "ESIEE Paris",
                },
            });
            log({ type: TLog.info, text: "🏫 School seeded" });
        }
    } catch (e: any) {
        errorCode = 5;
        LogCatch(e);
    }

    try {
        if (!insertSchool) throw new Error("⚠️ School not created");
        await db.schoolHostname.create({
            data: {
                hostname: "planif.esiee.fr",
                schoolId: insertSchool.id, // the id of ESIEE Paris
            },
        });
        log({ type: TLog.info, text: "🏫 Hostname seeded" });
    } catch (e: any) {
        errorCode = 6;
        LogCatch(e);
    }

    try {
        const mail = await getEmail();

        await db.betaList.create({
            data: {
                email: mail,
            },
        });

        log({ type: TLog.info, text: "😉 User seeded" });
    } catch (e: any) {
        errorCode = 7;
        LogCatch(e);
    }

    try {
        const roles = [
            {
                name: "admin",
                description: "Admin role",
            },
            {
                name: "tester",
                description: "Tester role",
            },
            {
                name: "user",
                description: "User role",
            },
        ];

        // insert role
        await db.role.createMany({
            data: roles,
        });
    } catch (e: any) {
        errorCode = 8;
        LogCatch(e);
    }

    try {
        const resCreateFeatures = await db.feature.createMany({
            data: features,
        });

        if (resCreateFeatures) {
            log({
                type: TLog.info,
                text: "🎉 Features seeded",
            });
        }
    } catch (e: any) {
        errorCode = 9;
        LogCatch(e);
    }

    const userRights: string[] = [];
    const testerRights: string[] = [
        "show_timetable",
        "edit_timetable",
        "show_profile",
    ];

    // tester have all the rights of user + tester rights
    for (const userRight of userRights) {
        if (testerRights.includes(userRight)) continue;
        testerRights.push(userRight);
    }

    const rights = [
        {
            role: "admin",
            roleFeatures: "*",
        },
        {
            role: "user",
            roleFeatures: userRights,
        },
        {
            role: "tester",
            roleFeatures: testerRights,
        },
    ];
    let tabFeatures = null;
    try {
        // get all the features
        tabFeatures = await db.feature.findMany();
    } catch (e: any) {
        errorCode = 10;
        LogCatch(e);
    }

    if (!tabFeatures) throw new Error("No features found");

    for (const { role, roleFeatures } of rights) {
        // assign all rights
        if (roleFeatures === "*") {
            let roleAllRights;
            try {
                roleAllRights = await db.role.findFirst({
                    where: {
                        name: role,
                    },
                });
            } catch (e: any) {
                errorCode = 11;
                LogCatch(e);
            }

            if (!roleAllRights)
                throw new Error("No role found to assign all rights");

            const tabAdminRights = tabFeatures.map((feature: Feature) => ({
                featureId: feature.id,
                roleId: roleAllRights.id,
            }));
            let resAsignAllRightsToAdmin = null;
            try {
                resAsignAllRightsToAdmin = await db.right.createMany({
                    data: tabAdminRights,
                });
            } catch (e: any) {
                errorCode = 12;
                LogCatch(e);
            }

            if (!resAsignAllRightsToAdmin)
                throw new Error("No rights assigned to admin");
        } else {
            let roleSpecificRights = null;
            try {
                roleSpecificRights = await db.role.findFirst({
                    where: {
                        name: role,
                    },
                });
            } catch (e: any) {
                errorCode = 13;
                LogCatch(e);
            }

            if (!roleSpecificRights)
                throw new Error("No role found to assign specific rights");

            const tabRoleRights = tabFeatures.filter((feature) =>
                roleFeatures.includes(feature.name),
            );

            let resAsignSpecificRights = null;
            try {
                resAsignSpecificRights = await db.right.createMany({
                    data: tabRoleRights.map((feature) => ({
                        featureId: feature.id,
                        roleId: roleSpecificRights.id,
                    })),
                });
            } catch (e: any) {
                errorCode = 14;
                LogCatch(e);
            }

            if (!resAsignSpecificRights)
                throw new Error("No rights assigned to user");
        }
    }

    log({
        type: TLog.info,
        text: "📖 all rights have been granted",
    });

    if (errorCode !== 0) {
        log({
            type: TLog.error,
            text: `❌ Seed failed with error code ${errorCode}`,
        });
    } else {
        log({ type: TLog.info, text: "✨ Seed done" });
    }
}

main();
