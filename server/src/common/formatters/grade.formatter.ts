import { Grade } from '../../../prisma/generated/prisma/client';
import { GradeResponseDto } from '../../modules/students/dto/student-response.dto';

export function formatGrade(grade: Grade): GradeResponseDto {
  return {
    id: grade.id,
    level: grade.level,
    // students: grade.students.map((std) => ({
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
    created_at: grade.createdAt,
    updated_at: grade.updatedAt,
  };
}
