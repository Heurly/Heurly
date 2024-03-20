/*
  Warnings:

  - You are about to drop the column `code_cours` on the `Course` table. All the data in the column will be lost.
  - You are about to drop the column `nom_cours` on the `Course` table. All the data in the column will be lost.
  - You are about to drop the column `professeur` on the `Course` table. All the data in the column will be lost.
  - Added the required column `code` to the `Course` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Course" DROP COLUMN "code_cours",
DROP COLUMN "nom_cours",
DROP COLUMN "professeur",
ADD COLUMN     "code" TEXT NOT NULL,
ADD COLUMN     "name" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "professor" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "small_code" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "unit" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "year" TEXT NOT NULL DEFAULT '';

-- CreateTable
CREATE TABLE "BetaWhitelist" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "BetaWhitelist_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "BetaWhitelist_email_key" ON "BetaWhitelist"("email");
