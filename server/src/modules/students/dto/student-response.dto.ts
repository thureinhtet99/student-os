import { OmitType } from '@nestjs/mapped-types';
import { Class, Parent } from '../../../../prisma/generated/prisma/client.js';
import { UserResponseDto } from '../../../common/dto/user-response.dto.js';

export class StudentResponseDto extends OmitType(UserResponseDto, ['role']) {
  studentId!: string;

  parent!: Parent | null;

  class!: Class | null;
}
