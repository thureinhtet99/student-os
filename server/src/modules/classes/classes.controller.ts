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
import {
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { Roles } from '@thallesp/nestjs-better-auth';
import { TEACHING_ROLES } from '../../common/constants/role.constant.js';
import {
  ApiPaginatedResponse,
  PaginatedResponseDto,
} from '../../common/dto/paginated-response.dto.js';
import { ClassesService } from './classes.service.js';
import { ClassResponseDto } from './dto/class-response-dto.js';
import { CreateClassResponse } from './dto/create-class-response.dto.js';
import { CreateClassDto } from './dto/create-class.dto.js';
import { QueryClassDto } from './dto/query-class-dto.js';
import { UpdateClassDto } from './dto/update-class.dto.js';

@ApiTags('Classes')
@Roles(TEACHING_ROLES)
@Controller('classes')
export class ClassesController {
  constructor(private readonly classesService: ClassesService) {}

  @ApiOperation({ summary: 'Create a class for an academic year' })
  @ApiCreatedResponse({ type: CreateClassResponse })
  @Post()
  async create(
    @Body() createClassDto: CreateClassDto,
  ): Promise<CreateClassResponse> {
    return this.classesService.create(createClassDto);
  }

  @ApiOperation({ summary: 'List classes' })
  @ApiPaginatedResponse(ClassResponseDto)
  @Get()
  async findAll(
    @Query() queryClassDto: QueryClassDto,
  ): Promise<PaginatedResponseDto<ClassResponseDto>> {
    return this.classesService.findAll(queryClassDto);
  }

  @ApiOperation({ summary: 'Get a class by id' })
  @ApiOkResponse({ type: ClassResponseDto })
  @Get(':id')
  async findOne(@Param('id') id: string): Promise<ClassResponseDto> {
    return this.classesService.findOne(id);
  }

  @ApiOperation({ summary: 'Update a class' })
  @ApiOkResponse({ type: ClassResponseDto })
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateClassDto: UpdateClassDto,
  ): Promise<ClassResponseDto> {
    return this.classesService.update(id, updateClassDto);
  }

  @ApiOperation({ summary: 'Delete a class' })
  @ApiOkResponse({
    schema: { example: { message: 'Class deleted successfully' } },
  })
  @Delete(':id')
  async remove(@Param('id') id: string): Promise<{ message: string }> {
    return this.classesService.remove(id);
  }
}
