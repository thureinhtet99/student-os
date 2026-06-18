import {
  IsDateString,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';

export class CreateAnnouncementDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  name!: string;

  @IsString()
  @IsOptional()
  @MaxLength(1000)
  description?: string | null;

  @IsDateString()
  @IsNotEmpty()
  date!: string;

  @IsString()
  @IsOptional()
  class_id?: string | null;
}
