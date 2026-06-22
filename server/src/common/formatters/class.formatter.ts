import { ClassResponseDto } from '../../modules/classes/dto/class-response-dto.js';
import { ClassWithRelations } from '../types/class.type';

export function formatClass(classEntity: ClassWithRelations): ClassResponseDto {
  return {
    id: classEntity.id,
    name: classEntity.name,
    teacher: classEntity.teacher
      ? { id: classEntity.teacher.id, name: classEntity.teacher.name }
      : null,
    // students: classEntity.students
    //   ? classEntity.students.map((std) => std)
    //   : null,
    // subjects: classEntity.subjects
    //   ? classEntity.subjects.map((sub) => sub)
    //   : null,
    // events: classEntity.events ? classEntity.events.map((eve) => eve) : null,
    // announcements: classEntity.announcements
    //   ? classEntity.announcements.map((ann) => ann)
    //   : null,
    createdAt: classEntity.createdAt,
    updatedAt: classEntity.updatedAt,
  };
}
