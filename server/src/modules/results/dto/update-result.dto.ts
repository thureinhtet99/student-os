import { PartialType } from '@nestjs/mapped-types';
import { CreateResultDto } from './create-result.dto.js';

export class UpdateResultDto extends PartialType(CreateResultDto) {}
