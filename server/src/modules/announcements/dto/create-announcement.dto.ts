import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsDateString,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';

export class CreateAnnouncementDto {
  @ApiProperty({ example: 'School closed Friday' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  title!: string;

  @ApiPropertyOptional({ example: 'Reminder that school is closed...' })
  @IsString()
  @IsOptional()
  @MaxLength(1000)
  content?: string;

  @ApiProperty({ example: '2026-07-10T09:00:00.000Z' })
  @IsDateString()
  @IsNotEmpty()
  date!: string;

  @ApiPropertyOptional({ example: 'ckx123classid', nullable: true })
  @IsString()
  @IsOptional()
  classId?: string | null;
}
