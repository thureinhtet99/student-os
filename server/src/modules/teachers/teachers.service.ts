import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import bcrypt from 'bcrypt';
import { Prisma, UserRole } from '../../../prisma/generated/prisma/client.js';
import { PaginatedResponseDto } from '../../common/dto/paginated-response.dto.js';
import { formatTeacher } from '../../common/formatters/teacher.formatter.js';
import { formatGender } from '../../common/formatters/user.formatter.js';
import { checkDuplicate } from '../../common/utils/db.util.js';
import { resolveImageUrl } from '../../common/utils/image.util.js';
import { PrismaService } from '../../database/prisma/prisma.service.js';
import { CloudinaryService } from '../../integrations/cloudinary/cloudinary.service.js';
import { CreateTeacherDto } from './dto/create-teacher.dto.js';
import { QueryTeacherDto } from './dto/query-teacher-dto.js';
import { TeacherResponseDto } from './dto/teacher-response.dto.js';
import { UpdateTeacherDto } from './dto/update-teacher.dto.js';

@Injectable()
export class TeachersService {
  private readonly logger = new Logger(TeachersService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly cloudinary: CloudinaryService,
  ) {}

  async create(
    createTeacherDto: CreateTeacherDto,
  ): Promise<TeacherResponseDto> {
    await checkDuplicate(
      this.prisma.teacher,
      'name',
      createTeacherDto.name,
      null,
      'Teacher with this name already exists',
    );

    await checkDuplicate(
      this.prisma.user,
      'email',
      createTeacherDto.email,
      null,
      'Teacher with this email already exists',
    );

    if (createTeacherDto.phone) {
      await checkDuplicate(
        this.prisma.teacher,
        'phone',
        createTeacherDto.phone,
        null,
        'Teacher with this phone number already exists',
      );
    }

    const imageUrl = resolveImageUrl(createTeacherDto.image, this.cloudinary);
    const hashedPwd = await bcrypt.hash(createTeacherDto.password, 12);
    const teacherId = `TCH-${Math.floor(100000 + Math.random() * 900000)}`;

    const teacher = await this.prisma.teacher.create({
      data: {
        teacherId,
        user: {
          create: {
            email: createTeacherDto.email.trim(),
            password: hashedPwd,
            role: createTeacherDto.role ?? UserRole.TEACHER,
            isVerified: true,
            isActive: true,
          },
        },
        name: createTeacherDto.name.trim(),
        phone: createTeacherDto.phone?.trim(),
        address: createTeacherDto.address?.trim() || null,
        dateOfBirth: createTeacherDto.birthday
          ? new Date(createTeacherDto.birthday)
          : null,
        gender: formatGender(createTeacherDto.gender),
        image: imageUrl,
        role: createTeacherDto.role ?? UserRole.TEACHER,
      },
      include: {
        user: true,
        classes: { select: { id: true, name: true } },
        subjects: { select: { id: true, name: true } },
      },
    });

    return formatTeacher(teacher);
  }

  async findAll(
    queryTeacherDto: QueryTeacherDto,
  ): Promise<PaginatedResponseDto<TeacherResponseDto>> {
    const { filter, search, page = 1, limit = 10 } = queryTeacherDto;

    const where: Prisma.TeacherWhereInput = {};

    if (filter) where.gender = filter;

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { user: { email: { contains: search, mode: 'insensitive' } } },
        { address: { contains: search, mode: 'insensitive' } },
      ];
    }

    const total = await this.prisma.teacher.count({ where });

    const teachers = await this.prisma.teacher.findMany({
      where,
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { name: 'asc' },
      include: {
        user: true,
        classes: { select: { id: true, name: true } },
        subjects: { select: { id: true, name: true } },
      },
    });

    return {
      data: teachers.map((teacher) => formatTeacher(teacher)),
      meta: {
        total,
        page,
        limit,
        total_pages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: string): Promise<TeacherResponseDto> {
    const teacher = await this.prisma.teacher.findUnique({
      where: { id },
      include: {
        user: true,
        classes: { select: { id: true, name: true } },
        subjects: { select: { id: true, name: true } },
      },
    });

    if (!teacher) throw new NotFoundException('Teacher is not found');

    return formatTeacher(teacher);
  }

  async update(
    id: string,
    updateTeacherDto: UpdateTeacherDto,
  ): Promise<TeacherResponseDto> {
    const existingTeacher = await this.prisma.teacher.findUnique({
      where: { id },
      include: { user: true },
    });
    if (!existingTeacher) throw new NotFoundException('Teacher is not found');

    if (
      updateTeacherDto.name &&
      existingTeacher.name.toLowerCase() !==
        updateTeacherDto.name.trim().toLowerCase()
    ) {
      await checkDuplicate(
        this.prisma.teacher,
        'name',
        updateTeacherDto.name,
        id,
        'Teacher with this name already exists',
      );
    }

    if (
      updateTeacherDto.email &&
      existingTeacher.user.email !== updateTeacherDto.email.trim()
    ) {
      await checkDuplicate(
        this.prisma.user,
        'email',
        updateTeacherDto.email,
        existingTeacher.userId,
        'Teacher with this email already exists',
      );
    }

    if (
      updateTeacherDto.phone &&
      existingTeacher.phone !== updateTeacherDto.phone?.trim()
    ) {
      await checkDuplicate(
        this.prisma.teacher,
        'phone',
        updateTeacherDto.phone,
        id,
        'Teacher with this phone number already exists',
      );
    }

    const teacher = await this.prisma.teacher.update({
      where: { id },
      data: {
        user:
          updateTeacherDto.email || updateTeacherDto.role
            ? {
                update: {
                  email: updateTeacherDto.email?.trim(),
                  role: updateTeacherDto.role,
                },
              }
            : undefined,
        name: updateTeacherDto.name?.trim(),
        phone: updateTeacherDto.phone?.trim(),
        address:
          updateTeacherDto.address === undefined
            ? undefined
            : updateTeacherDto.address?.trim() || null,
        dateOfBirth:
          updateTeacherDto.birthday === undefined
            ? undefined
            : updateTeacherDto.birthday
              ? new Date(updateTeacherDto.birthday)
              : null,
        gender: updateTeacherDto.gender
          ? formatGender(updateTeacherDto.gender)
          : undefined,
        image:
          updateTeacherDto.image === undefined
            ? undefined
            : resolveImageUrl(updateTeacherDto.image, this.cloudinary),
        role: updateTeacherDto.role,
      },
      include: {
        user: true,
        classes: { select: { id: true, name: true } },
        subjects: { select: { id: true, name: true } },
      },
    });

    return formatTeacher(teacher);
  }

  async remove(id: string): Promise<{ message: string }> {
    const existingTeacher = await this.prisma.teacher.findUnique({
      where: { id },
    });
    if (!existingTeacher) throw new NotFoundException('Teacher is not found');

    if (existingTeacher.image) {
      try {
        await this.cloudinary.deleteFromCloudinary(existingTeacher.image);
      } catch (error) {
        this.logger.warn(
          `Failed to delete image from Cloudinary for teacher ${id}: ${(error as Error).message}`,
        );
      }
    }

    // Delete user which will cascade delete the teacher
    await this.prisma.user.delete({ where: { id: existingTeacher.userId } });

    return { message: 'Teacher deleted successfully' };
  }
}
