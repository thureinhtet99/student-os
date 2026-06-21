import { UserResponseDto } from '../../../common/dto/user-response.dto.js';

export class TeacherResponseDto extends UserResponseDto {
  teacherId!: string;
  classes!: { id: string; name: string }[];

  subjects!: { id: string; name: string }[];
}
