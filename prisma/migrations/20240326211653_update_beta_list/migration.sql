/*
  Warnings:

  - You are about to drop the `BetaWhitelist` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "BetaWhitelist";

-- CreateTable
CREATE TABLE "BetaList" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "BetaList_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "BetaList_email_key" ON "BetaList"("email");
