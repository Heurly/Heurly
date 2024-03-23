import { TLog, log } from "@/logger/logger";
import courses from "./seedData/courses.json";
import units from "./seedData/units.json";
import { db } from "@/server/db";
import { createInterface } from "readline";
import { stdin as input, stdout as output } from "process";

type RawData = {
    fullname: string;
    code: number;
    label: string;
};

const rl = createInterface({ input, output });

function handleCatch(e: unknown | Error | string) {
    if (e instanceof Error) {
        log({ type: TLog.error, text: e.message });
    }
    if (typeof e === "string") {
        log({ type: TLog.error, text: e });
    }
}

const getEmail = async () => {
    const mail: string = await new Promise<string>((resolve) => {
        rl.question("👀 Enter the email you will use: ", resolve);
    });

    if (!mail || mail.trim().length === 0) {
        throw new Error("⚠️ No email entered");
    }

    rl.close();
    return mail;
};

async function main() {
    try {
        // delete all data
        await db.course.deleteMany({});
        log({ type: TLog.info, text: "🪣  courses deleted" });
    } catch (e) {
        handleCatch(e);
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
    } catch (e) {
        handleCatch(e);
    }

    try {
        // delete all data
        await db.unit.deleteMany({});
        log({ type: TLog.info, text: "🪣  Units deleted" });
    } catch (e) {
        handleCatch(e);
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
    } catch (e) {
        handleCatch(e);
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
            return;
        } else {
            insertSchool = await db.school.create({
                data: {
                    name: "ESIEE Paris",
                },
            });
            log({ type: TLog.info, text: "🏫 School seeded" });
        }
    } catch (e) {
        handleCatch(e);
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
    } catch (e) {
        handleCatch(e);
    }

    try {
        const mail = await getEmail();

        await db.betaWhitelist.create({
            data: {
                email: mail,
            },
        });

        log({ type: TLog.info, text: "😉 User seeded" });
    } catch (e) {
        handleCatch(e);
    }

    log({ type: TLog.info, text: "✨ Seed done" });
}

main();
