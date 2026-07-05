import { AnnouncementResponseDto } from '../../modules/announcements/dto/announcement-response.dto.js';
import { AnnouncementWithClass } from '../types/announcement.type.js';

export function formatAnnouncement(
  announcement: AnnouncementWithClass,
): AnnouncementResponseDto {
  return {
    id: announcement.id,
    title: announcement.title,
    content: announcement.content,
    publishedAt: announcement.publishedAt,
    classId: announcement.classId,
    className: announcement.class?.name ?? null,
    createdAt: announcement.createdAt,
    updatedAt: announcement.updatedAt,
  };
}
