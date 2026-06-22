import { PickType } from '@nestjs/mapped-types';
import { UserResponseDto } from '../../../common/dto/user-response.dto';

export class AdminResponseDto extends PickType(UserResponseDto, [
  'id',
  'userId',
  'name',
  'email',
  'createdAt',
  'updatedAt',
]) {
  adminId!: string;
}
