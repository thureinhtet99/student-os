import { AdminResponseDto } from '../../modules/admins/dto/admin-response.dto.js';
import { AdminWithRelations } from '../types/admin.type.js';

export function formatAdmin(admin: AdminWithRelations): AdminResponseDto {
  return {
    id: admin.id,
    name: admin.name,
    email: admin.email,
    role: admin.role,
    created_at: admin.createdAt ?? null,
    updated_at: admin.updatedAt ?? null,
  };
}
