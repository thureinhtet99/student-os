import { Parent } from '../../../prisma/generated/prisma/client';
import { ParentResponseDto } from '../../modules/students/dto/student-response.dto';

export function formatParent(
  parent: Omit<Parent, 'password'>,
): ParentResponseDto {
  return {
    id: parent.id,
    name: parent.name,
    email: parent.email,
    phone: parent.phone,
    address: parent.address,
    role: parent.role,
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
    created_at: parent.createdAt,
    updated_at: parent.updatedAt,
  };
}
