import { Parent } from '../../../prisma/generated/prisma/client.js';
import { ParentResponseDto } from '../../modules/parents/dto/parent-response.dto.js';
// import { ParentWithRelations } from '../types/parent.type.js';

export function formatParent(parent: Parent): ParentResponseDto {
  return {
    id: parent.id,
    name: parent.name,
    phone: parent.phone,
    address: parent.address,
    // students: parent.students
    //   ? parent.students.map((ps) => ({
    //       id: ps.student.id,
    //       name: ps.student.user.name,
    //     }))
    //   : null,
    createdAt: parent.createdAt,
    updatedAt: parent.updatedAt,
  };
}
