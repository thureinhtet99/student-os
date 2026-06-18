import { AnnouncementResponseDto } from '../../modules/announcements/dto/announcement-response.dto.js';
import { AnnouncementWithRelations } from '../types/announcement.type.js';

export function formatAnnouncement(
  announcement: AnnouncementWithRelations,
): AnnouncementResponseDto {
  return {
    id: announcement.id,
    name: announcement.name,
    description: announcement.description,
    date: announcement.date,
    class: announcement.class
      ? { id: announcement.class.id, name: announcement.class.name }
      : null,
    created_at: announcement.createdAt,
    updated_at: announcement.updatedAt,
  };
}
