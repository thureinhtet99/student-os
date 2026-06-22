import {
  Attendance,
  Student,
} from '../../../prisma/generated/prisma/client.js';

export type AttendanceWithRelations = Attendance & {
  student: Student | null;
};
