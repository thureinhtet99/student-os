import { EventResponseDto } from '../../modules/events/dto/event-response.dto.js';
import { EventWithRelations } from '../types/event.type.js';

export function formatEvent(event: EventWithRelations): EventResponseDto {
  return {
    id: event.id,
    name: event.name,
    description: event.description,
    startTime: event.startTime,
    endTime: event.endTime,
    class: event.class ? { id: event.class.id, name: event.class.name } : null,
    createdAt: event.createdAt,
    updatedAt: event.updatedAt,
  };
}
