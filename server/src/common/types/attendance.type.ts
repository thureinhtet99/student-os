import {
  Attendance,
  Student,
} from '../../../prisma/generated/prisma/client.js';

export type AttendanceWithRelations = Attendance & {
  student?: Pick<Student, 'id' | 'name'> | null;
};
