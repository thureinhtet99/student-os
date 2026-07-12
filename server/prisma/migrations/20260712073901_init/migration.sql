-- DropForeignKey
ALTER TABLE "attendances" DROP CONSTRAINT "attendances_enrollmentId_fkey";

-- DropForeignKey
ALTER TABLE "exams" DROP CONSTRAINT "exams_teachingAllocationId_fkey";

-- DropForeignKey
ALTER TABLE "time_tables" DROP CONSTRAINT "time_tables_teachingAllocationId_fkey";

-- AddForeignKey
ALTER TABLE "time_tables" ADD CONSTRAINT "time_tables_teachingAllocationId_fkey" FOREIGN KEY ("teachingAllocationId") REFERENCES "teaching_assignments"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "attendances" ADD CONSTRAINT "attendances_enrollmentId_fkey" FOREIGN KEY ("enrollmentId") REFERENCES "enrollments"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "exams" ADD CONSTRAINT "exams_teachingAllocationId_fkey" FOREIGN KEY ("teachingAllocationId") REFERENCES "teaching_assignments"("id") ON DELETE CASCADE ON UPDATE CASCADE;
