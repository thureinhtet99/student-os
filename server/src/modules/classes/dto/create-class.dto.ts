import { IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateClassDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  name!: string;

  @IsString()
  @IsOptional()
  teacher_id!: string | null;

  //   @IsArray()
  //   @IsString({ each: true })
  //   @IsOptional()
  //   subjects!: string[] | null;

  //   @IsArray()
  //   @IsString({ each: true })
  //   @IsOptional()
  //   students!: string[] | null;

  //   @IsArray()
  //   @IsString({ each: true })
  //   @IsOptional()
  //   events!: string[] | null;

  //   @IsArray()
  //   @IsString({ each: true })
  //   @IsOptional()
  //   announcements!: string[] | null;
}
