import { AdminResponseDto } from '../../modules/admins/dto/admin-response.dto.js';
import { AdminWithUser } from '../types/admin.type.js';

export function formatAdmin(admin: AdminWithUser): AdminResponseDto {
  return {
    id: admin.id,
    employeeCode: admin.employeeCode,
    userId: admin.userId,
    name: admin.user.name,
    email: admin.user.email,
    role: admin.user.role,
    createdAt: admin.createdAt,
    updatedAt: admin.updatedAt,
  };
}
