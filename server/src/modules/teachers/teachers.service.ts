import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { hashPassword } from 'better-auth/crypto';
import { randomUUID } from 'node:crypto';
import { Prisma, UserRole } from '../../../prisma/generated/prisma/client.js';
import { APP_CONSTANT } from '../../common/constants/app.constant.js';
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
    const { email, password, name, image, gender } = createTeacherDto;

    await checkDuplicate(
      this.prisma.user,
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

    const hashedPwd = await hashPassword(password);
    const userId = randomUUID();
    const imageUrl = resolveImageUrl(image, this.cloudinary);

    const teacher = await this.prisma.$transaction(async (tx) => {
      const createdUser = await tx.user.create({
        data: {
          id: userId,
          email: email.trim(),
          name: name.trim(),
          role: UserRole.TEACHER,
          image: imageUrl,
          accounts: {
            create: {
              id: randomUUID(),
              accountId: `${APP_CONSTANT.APP_NAME}-${userId.slice(-12)}`,
              providerId: 'credential',
              password: hashedPwd,
            },
          },
        },
      });

      const teacherId = `TCH-${createdUser.id.slice(-12)}`;

      return tx.teacher.create({
        data: {
          employeeCode: teacherId,
          userId: createdUser.id,
          gender,
        },
        include: {
          user: true,
          teachingAssignments: {
            include: {
              class: true,
              subject: true,
            },
          },
        },
      });
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
        { user: { name: { contains: search, mode: 'insensitive' } } },
        { user: { email: { contains: search, mode: 'insensitive' } } },
        { address: { contains: search, mode: 'insensitive' } },
      ];
    }

    const total = await this.prisma.teacher.count({ where });

    const teachers = await this.prisma.teacher.findMany({
      where,
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { user: { name: 'asc' } },
      include: {
        user: true,
        teachingAssignments: {
          include: {
            class: true,
            subject: true,
          },
        },
      },
    });

    return {
      data: teachers.map((teacher) => formatTeacher(teacher)),
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: string): Promise<TeacherResponseDto> {
    const teacher = await this.prisma.teacher.findUnique({
      where: { id },
      include: {
        user: true,
        teachingAssignments: {
          include: {
            class: true,
            subject: true,
          },
        },
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
      existingTeacher.user.name.toLowerCase() !==
        updateTeacherDto.name.trim().toLowerCase()
    ) {
      await checkDuplicate(
        this.prisma.user,
        'name',
        updateTeacherDto.name,
        existingTeacher.userId,
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
        user: {
          update: {
            email: updateTeacherDto.email?.trim(),
            name: updateTeacherDto.name?.trim(),
            image:
              updateTeacherDto.image === undefined
                ? undefined
                : resolveImageUrl(updateTeacherDto.image, this.cloudinary),
          },
        },
        phone: updateTeacherDto.phone?.trim(),
        address:
          updateTeacherDto.address === undefined
            ? undefined
            : updateTeacherDto.address?.trim() || null,
        dateOfBirth:
          updateTeacherDto.dateOfBirth === undefined
            ? undefined
            : updateTeacherDto.dateOfBirth
              ? new Date(updateTeacherDto.dateOfBirth)
              : null,
        gender: updateTeacherDto.gender
          ? formatGender(updateTeacherDto.gender)
          : undefined,
      },
      include: {
        user: true,
        teachingAssignments: {
          include: {
            class: true,
            subject: true,
          },
        },
      },
    });

    return formatTeacher(teacher);
  }

  async remove(id: string): Promise<{ message: string }> {
    const existingTeacher = await this.prisma.teacher.findUnique({
      where: { id },
      include: { user: true },
    });
    if (!existingTeacher) throw new NotFoundException('Teacher is not found');

    if (existingTeacher.user.image) {
      try {
        await this.cloudinary.deleteFromCloudinary(existingTeacher.user.image);
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
