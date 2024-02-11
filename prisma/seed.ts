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
        const fullNameSplit = unit.fullname.split(";")
        const level = fullNameSplit.length
        resUnits.push({
            name: unit.label,
            code: unit.code,
            level: level
        })
        
    }

    await db.unit.createMany({
        data: resUnits
    })
    console.log("Units seeded")

}

class Node {
    name: string;
    code: number | null;
    parent: number | null;
    constructor(name: string, code: number | null = null, parent: number | null = null) {
        this.name = name;
        this.code = code;
        this.parent = parent;
    }
}






main()