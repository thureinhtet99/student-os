import { AdminResponseDto } from '../../modules/admins/dto/admin-response.dto.js';
import { AdminWithRelations } from '../types/admin.type.js';

export function formatAdmin(admin: AdminWithRelations): AdminResponseDto {
  return {
    id: admin.id,
    // userId: admin.userId,
    adminId: admin.employeeCode,
    email: admin.user.email,
    name: admin.user.name,
    role: admin.user.role,
    // createdAt: admin.user.createdAt,
    // updatedAt: admin.user.updatedAt,
  };
}
