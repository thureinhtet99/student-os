import { IsOptional, IsString } from 'class-validator';
import { CreateUserDto } from '../../../common/dto/create-user.dto.js';

export class CreateStudentDto extends CreateUserDto {
  @IsString()
  @IsOptional()
  parent_id!: string | null;

  @IsString()
  @IsOptional()
  class_id!: string | null;
}
