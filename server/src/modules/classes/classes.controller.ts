import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { PaginatedResponseDto } from '../../common/dto/paginated-response.dto';
import { ClassesService } from './classes.service';
import { ClassResponseDto } from './dto/class-response-dto';
import { CreateClassDto } from './dto/create-class.dto';
import { QueryClassDto } from './dto/query-class-dto';
import { UpdateClassDto } from './dto/update-class.dto';

@Controller('classes')
export class ClassesController {
  constructor(private readonly classesService: ClassesService) {}

  @Post()
  async create(
    @Body() createClassDto: CreateClassDto,
  ): Promise<ClassResponseDto> {
    return this.classesService.create(createClassDto);
  }

  @Get()
  async findAll(
    @Query() queryClassDto: QueryClassDto,
  ): Promise<PaginatedResponseDto<ClassResponseDto>> {
    return this.classesService.findAll(queryClassDto);
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<ClassResponseDto> {
    return this.classesService.findOne(id);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateClassDto: UpdateClassDto,
  ): Promise<ClassResponseDto> {
    return this.classesService.update(id, updateClassDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<{ message: string }> {
    return this.classesService.remove(id);
  }
}
