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
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Roles } from '@thallesp/nestjs-better-auth';
import { TEACHING_ROLES } from '../../common/constants/role.constant.js';
import { PaginatedResponseDto } from '../../common/dto/paginated-response.dto';
import { ClassesService } from './classes.service';
import { ClassResponseDto } from './dto/class-response-dto';
import { CreateClassDto } from './dto/create-class.dto';
import { QueryClassDto } from './dto/query-class-dto';
import { UpdateClassDto } from './dto/update-class.dto';

@ApiTags('Classes')
@Roles(TEACHING_ROLES)
@Controller('classes')
export class ClassesController {
  constructor(private readonly classesService: ClassesService) {}

  @ApiOperation({ summary: 'Create a class for an academic year' })
  @ApiResponse({ status: 201, type: ClassResponseDto })
  @Post()
  async create(
    @Body() createClassDto: CreateClassDto,
  ): Promise<ClassResponseDto> {
    return this.classesService.create(createClassDto);
  }

  @ApiOperation({ summary: 'List classes' })
  @ApiResponse({ status: 200, type: PaginatedResponseDto<ClassResponseDto> })
  @Get()
  async findAll(
    @Query() queryClassDto: QueryClassDto,
  ): Promise<PaginatedResponseDto<ClassResponseDto>> {
    return this.classesService.findAll(queryClassDto);
  }

  @ApiOperation({ summary: 'Get a class by id' })
  @ApiResponse({ status: 200, type: ClassResponseDto })
  @Get(':id')
  async findOne(@Param('id') id: string): Promise<ClassResponseDto> {
    return this.classesService.findOne(id);
  }

  @ApiOperation({ summary: 'Update a class' })
  @ApiResponse({ status: 200, type: ClassResponseDto })
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateClassDto: UpdateClassDto,
  ): Promise<ClassResponseDto> {
    return this.classesService.update(id, updateClassDto);
  }

  @ApiOperation({ summary: 'Delete a class' })
  @ApiResponse({
    status: 200,
    schema: { example: { message: 'Class deleted successfully' } },
  })
  @Delete(':id')
  async remove(@Param('id') id: string): Promise<{ message: string }> {
    return this.classesService.remove(id);
  }
}
