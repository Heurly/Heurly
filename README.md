# Heurly

## Installation

To install the project and contribute you have to do some steps :

-   git clone the repo
-   `npm i`
-   add .env and .env.development.local at project root (change the type of end of line sequence to "LF")
-   if you are on windows use wsl to do `./start-database.sh` (change the type of end of line sequence to "LF")
-   `npm run db:push`
-   `npm run db:seed`
-   `npm run dev`

## Deploy to prod

To deploy to production you need to update the schema of the prod DB.

-   copy the content of the .env.production.local prod to .env and run the command `npm run db:push` (⚠️ be carefull if prisma says "... delete data" make a copy of data to do data migration)
