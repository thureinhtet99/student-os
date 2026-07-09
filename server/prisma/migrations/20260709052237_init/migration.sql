/*
  Warnings:

  - You are about to drop the column `academicYearId` on the `attendances` table. All the data in the column will be lost.
  - You are about to drop the column `academicYearId` on the `classes` table. All the data in the column will be lost.
  - You are about to drop the column `academicYearId` on the `exams` table. All the data in the column will be lost.
  - You are about to drop the column `teachingAssignmentId` on the `exams` table. All the data in the column will be lost.
  - You are about to drop the column `enrollmentId` on the `results` table. All the data in the column will be lost.
  - You are about to drop the column `examId` on the `results` table. All the data in the column will be lost.
  - You are about to drop the column `teachingAssignmentId` on the `time_tables` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[name]` on the table `classes` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `teachingAllocationId` to the `exams` table without a default value. This is not possible if the table is not empty.
  - Added the required column `teachingAllocationId` to the `time_tables` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "attendances" DROP CONSTRAINT "attendances_academicYearId_fkey";

-- DropForeignKey
ALTER TABLE "classes" DROP CONSTRAINT "classes_academicYearId_fkey";

-- DropForeignKey
ALTER TABLE "exams" DROP CONSTRAINT "exams_academicYearId_fkey";

-- DropForeignKey
ALTER TABLE "exams" DROP CONSTRAINT "exams_teachingAssignmentId_fkey";

-- DropForeignKey
ALTER TABLE "results" DROP CONSTRAINT "results_enrollmentId_fkey";

-- DropForeignKey
ALTER TABLE "results" DROP CONSTRAINT "results_examId_fkey";

-- DropForeignKey
ALTER TABLE "time_tables" DROP CONSTRAINT "time_tables_teachingAssignmentId_fkey";

-- DropIndex
DROP INDEX "classes_name_academicYearId_key";

-- DropIndex
DROP INDEX "results_enrollmentId_examId_key";

-- AlterTable
ALTER TABLE "attendances" DROP COLUMN "academicYearId";

-- AlterTable
ALTER TABLE "classes" DROP COLUMN "academicYearId";

-- AlterTable
ALTER TABLE "exams" DROP COLUMN "academicYearId",
DROP COLUMN "teachingAssignmentId",
ADD COLUMN     "teachingAllocationId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "results" DROP COLUMN "enrollmentId",
DROP COLUMN "examId";

-- AlterTable
ALTER TABLE "time_tables" DROP COLUMN "teachingAssignmentId",
ADD COLUMN     "teachingAllocationId" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "classes_name_key" ON "classes"("name");

-- AddForeignKey
ALTER TABLE "time_tables" ADD CONSTRAINT "time_tables_teachingAllocationId_fkey" FOREIGN KEY ("teachingAllocationId") REFERENCES "teaching_assignments"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "exams" ADD CONSTRAINT "exams_teachingAllocationId_fkey" FOREIGN KEY ("teachingAllocationId") REFERENCES "teaching_assignments"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
