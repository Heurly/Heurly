import courses from "./seedData/courses.json"
import units from "./seedData/units.json"
import { db } from "@/server/db"

async function main() {

    // delete all data
    await db.course.deleteMany({})

    for (const course of courses) {
        await db.course.create({
            data: {
                code_cours: course.CODE_COURS,
                nom_cours: course.NOM_COURS,
                professeur: course.PROFESSEUR,
                description: course.DESCRIPTION,
            }
        })
    }
    console.log("Courses seeded")

    // delete all data
    await db.unit.deleteMany({})

    for (const unit of units.ESIEE_PARIS) {
        await db.unit.create({
            data: {
                name: unit.label,
                full_name: unit.fullname,
                code: unit.code,
            }
        })
    }
    console.log("Units seeded")

}

main()