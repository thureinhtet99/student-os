import { IsOptional, IsString } from 'class-validator';
import { CreateUserDto } from '../../../common/dto/create-user.dto.js';

export class CreateStudentDto extends CreateUserDto {
  @IsString()
  @IsOptional()
  parentId!: string | null;

  @IsString()
  @IsOptional()
  classId!: string | null;

  @IsString()
  @IsOptional()
  newParentName!: string | null;

  @IsString()
  @IsOptional()
  newParentPhone!: string | null;

  @IsString()
  @IsOptional()
  newParentAddress!: string | null;
}
