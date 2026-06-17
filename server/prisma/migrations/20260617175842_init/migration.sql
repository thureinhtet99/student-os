/*
  Warnings:

  - You are about to drop the column `email` on the `parents` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "parents_email_idx";

-- DropIndex
DROP INDEX "parents_email_key";

-- AlterTable
ALTER TABLE "parents" DROP COLUMN "email";
