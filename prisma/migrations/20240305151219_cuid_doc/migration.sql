/*
  Warnings:

  - The primary key for the `Docs` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- AlterTable
ALTER TABLE "Docs" DROP CONSTRAINT "Docs_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "Docs_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Docs_id_seq";
