import courses from "./seedData/courses.json"
import units from "./seedData/units.json"
import { db } from "@/server/db"
import fs from "fs"

type RawData = {
    fullname: string;
    code: number;
    label: string;
}
async function main() {

    // delete all data
    await db.course.deleteMany({})

    const resCourses = courses.map((course) => {
        return {
            code_cours: course.CODE_COURS,
            nom_cours: course.NOM_COURS,
            professeur: course.PROFESSEUR,
            description: course.DESCRIPTION,
        }
    })

    await db.course.createMany({
        data: resCourses
    })

    console.log("Courses seeded")

    // delete all data
    await db.unit.deleteMany({})

    const rawUnits = units.ESIEE_PARIS as RawData[]

    const resUnits = []

    for (const unit of rawUnits) {
        resUnits.push({
            name: unit.label,
            code: unit.code,
            fullName: unit.fullname,
        })
    }

    await db.unit.createMany({
        data: resUnits
    })

    console.log("Units seeded")

}

main()