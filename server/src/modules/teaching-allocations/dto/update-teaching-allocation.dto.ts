import { PartialType } from '@nestjs/mapped-types';
import { CreateTeachingAllocationDto } from './create-teaching-allocation.dto.js';

export class UpdateTeachingAllocationDto extends PartialType(
  CreateTeachingAllocationDto,
) {}
