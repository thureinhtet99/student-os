import { PickType } from '@nestjs/mapped-types';
import { CreateUserDto } from '../../../common/dto/create-user.dto';

export class CreateAdminDto extends PickType(CreateUserDto, [
  'name',
  'email',
  'password',
  'role',
] as const) {}
