import { OmitType } from '@nestjs/mapped-types';
import { CreateUserDto } from '../../../common/dto/create-user.dto.js';

export class CreateTeacherDto extends OmitType(CreateUserDto, [
  'role',
] as const) {}
