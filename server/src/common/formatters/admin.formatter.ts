import { AdminResponseDto } from '../../modules/admins/dto/admin-response.dto.js';
import { AdminWithRelations } from '../types/admin.type.js';

export function formatAdmin(admin: AdminWithRelations): AdminResponseDto {
  return {
    id: admin.id,
    userId: admin.userId,
    adminId: admin.adminId,
    name: admin.name,
    email: admin.user.email,
    createdAt: admin.user.createdAt,
    updatedAt: admin.user.updatedAt,
  };
}
