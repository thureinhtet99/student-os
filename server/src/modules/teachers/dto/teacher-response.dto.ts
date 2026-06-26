import { OmitType } from '@nestjs/mapped-types';
import { UserResponseDto } from '../../../common/dto/user-response.dto.js';

export class TeacherResponseDto extends OmitType(UserResponseDto, ['role']) {
  teacherId!: string;
  classes!: { id: string; name: string }[];

  subjects!: { id: string; name: string }[];
}
