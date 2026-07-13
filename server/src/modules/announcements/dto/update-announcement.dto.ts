import { PartialType } from '@nestjs/mapped-types';
import { CreateAnnouncementDto } from './create-announcement.dto.js';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsDateString,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';
export class UpdateAnnouncementDto extends PartialType(CreateAnnouncementDto) {
  @ApiProperty({ type: String, example: 'Announcement title' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(800)
  title!: string;

  @ApiPropertyOptional({ type: String, example: 'Announcement description' })
  @IsString()
  @IsOptional()
  @MaxLength(2000)
  content!: string;

  @ApiProperty({ type: String, example: '2026-07-10T09:00:00.000Z' })
  @IsDateString()
  @IsNotEmpty()
  publishedAt!: string;

  @ApiPropertyOptional({ example: 'classid123', nullable: true })
  @IsString()
  @IsOptional()
  classId?: string | null;
}
