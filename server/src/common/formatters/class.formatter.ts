import { Class } from '../../../prisma/generated/prisma/client';
import { ClassResponseDto } from '../../modules/students/dto/student-response.dto';

export function formatClass(classEntity: Class): ClassResponseDto {
  return {
    id: classEntity.id,
    name: classEntity.name,
    //   teacher   classEntity.teacher ? formatTeacher(classEntity.teacher) : null,
    // students: classEntity.students.map((std) => ({
    //     id: item.id,
    //     product_name: item.product.name,
    //     quantity: Number(item.quantity),
    //     price: Number(item.price),
    //     product_id: item.product_id,
    //     order_id: item.order_id,
    //     subtotal: Number(item.price) * Number(item.quantity),
    //     created_at: item.created_at,
    //     updated_at: item.updated_at,
    //   })),
    //   subjects      Subject[]
    //   events        Event[]
    //   announcements Announcement[]

    created_at: classEntity.createdAt,
    updated_at: classEntity.updatedAt,
  };
}
