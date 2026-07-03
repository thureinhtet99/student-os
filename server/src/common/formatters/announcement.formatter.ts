import { AnnouncementResponseDto } from '../../modules/announcements/dto/announcement-response.dto.js';
import { AnnouncementWithRelations } from '../types/announcement.type.js';

export function formatAnnouncement(
  announcement: AnnouncementWithRelations,
): AnnouncementResponseDto {
  return {
    id: announcement.id,
    title: announcement.title,
    content: announcement.content,
    date: announcement.publishedAt,
    class: announcement.class
      ? { id: announcement.class.id, name: announcement.class.name }
      : null,
    createdAt: announcement.createdAt,
    updatedAt: announcement.updatedAt,
  };
}
