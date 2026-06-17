import { IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateParentDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  name!: string;

  @IsString()
  @IsOptional()
  @MaxLength(15)
  phone!: string | null;

  @IsString()
  @IsOptional()
  @MaxLength(500)
  address!: string | null;
}
