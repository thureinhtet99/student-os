/*
  Warnings:

  - You are about to drop the column `gradeId` on the `students` table. All the data in the column will be lost.
  - You are about to drop the `grades` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "students" DROP CONSTRAINT "students_gradeId_fkey";

-- DropIndex
DROP INDEX "students_gradeId_idx";

-- AlterTable
ALTER TABLE "students" DROP COLUMN "gradeId";

-- DropTable
DROP TABLE "grades";
