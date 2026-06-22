import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import bcrypt from 'bcrypt';
import { Prisma, UserRole } from '../../../prisma/generated/prisma/client.js';
import { PaginatedResponseDto } from '../../common/dto/paginated-response.dto.js';
import { formatStudent } from '../../common/formatters/student.formatter.js';
import { formatGender } from '../../common/formatters/user.formatter.js';
import { checkDuplicate } from '../../common/utils/db.util.js';
import { resolveImageUrl } from '../../common/utils/image.util.js';
import { PrismaService } from '../../database/prisma/prisma.service.js';
import { CloudinaryService } from '../../integrations/cloudinary/cloudinary.service.js';
import { CreateStudentDto } from './dto/create-student.dto.js';
import { QueryStudentDto } from './dto/query-student-dto.js';
import { StudentResponseDto } from './dto/student-response.dto.js';
import { UpdateStudentDto } from './dto/update-student.dto.js';

@Injectable()
export class StudentsService {
  private readonly logger = new Logger(StudentsService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly cloudinary: CloudinaryService,
  ) {}

  async create(
    createStudentDto: CreateStudentDto,
  ): Promise<StudentResponseDto> {
    await checkDuplicate(
      this.prisma.student,
      'name',
      createStudentDto.name,
      null,
      'Student with this name already exists',
    );

    await checkDuplicate(
      this.prisma.user,
      'email',
      createStudentDto.email,
      null,
      'Student with this email already exists',
    );

    if (createStudentDto.phone) {
      await checkDuplicate(
        this.prisma.student,
        'phone',
        createStudentDto.phone,
        null,
        'Student with this phone number already exists',
      );
    }

    const imageUrl = resolveImageUrl(createStudentDto.image, this.cloudinary);
    const hashedPwd = await bcrypt.hash(createStudentDto.password, 12);
    const studentId = `STU-${Math.floor(100000 + Math.random() * 900000)}`;

    const student = await this.prisma.student.create({
      data: {
        studentId,
        user: {
          create: {
            email: createStudentDto.email.trim(),
            password: hashedPwd,
            role: createStudentDto.role ?? UserRole.STUDENT,
            isVerified: true,
            isActive: true,
          },
        },
        name: createStudentDto.name.trim(),
        phone: createStudentDto.phone?.trim(),
        address: createStudentDto.address?.trim() || null,
        dateOfBirth: createStudentDto.dateOfBirth
          ? new Date(createStudentDto.dateOfBirth)
          : null,
        gender: formatGender(createStudentDto.gender),
        image: imageUrl,
        role: createStudentDto.role ?? UserRole.STUDENT,
        class: createStudentDto.class_id
          ? { connect: { id: createStudentDto.class_id } }
          : undefined,
        grade: createStudentDto.grade_id
          ? { connect: { id: createStudentDto.grade_id } }
          : undefined,
        parent: createStudentDto.parent_id
          ? { connect: { id: createStudentDto.parent_id } }
          : undefined,
      },
      include: {
        user: true,
        parent: true,
        class: true,
        grade: true,
      },
    });

    return formatStudent(student);
  }

  async findAll(
    queryStudentDto: QueryStudentDto,
  ): Promise<PaginatedResponseDto<StudentResponseDto>> {
    const {
      class: classId,
      grade,
      filter,
      search,
      page = 1,
      limit = 10,
    } = queryStudentDto;

    const where: Prisma.StudentWhereInput = {};

    if (classId) where.classId = classId;

    if (grade) where.gradeId = grade;

    if (filter) where.gender = filter;

    if (search) {
      where.OR = [
        {
          name: { contains: search, mode: 'insensitive' },
        },
        {
          user: {
            email: { contains: search, mode: 'insensitive' },
          },
        },
        {
          address: { contains: search, mode: 'insensitive' },
        },
      ];
    }

    const total = await this.prisma.student.count({ where });

    const students = await this.prisma.student.findMany({
      where,
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { name: 'asc' },
      include: {
        user: true,
        parent: true,
        class: true,
        grade: true,
      },
    });

    return {
      data: students.map((student) => formatStudent(student)),
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: string) {
    const student = await this.prisma.student.findUnique({
      where: { id },
      include: {
        user: true,
        parent: true,
        class: true,
        grade: true,
      },
    });

    if (!student) throw new NotFoundException('Student is not found');

    return formatStudent(student);
  }

  // async findByClass(classId: number) {
  //   if (!classId) {
  //     throw new BadRequestException('Class id is required');
  //   }

  //   const students = await this.prisma.student.findMany({
  //     where: { classId },
  //     include: {
  //       class: true,
  //       attendances: true,
  //       results: true,
  //     },
  //     orderBy: { name: 'asc' },
  //   });

  //   return { students, success: true, error: false };
  // }

  async update(
    id: string,
    updateStudentDto: UpdateStudentDto,
  ): Promise<StudentResponseDto> {
    const existingStudent = await this.prisma.student.findUnique({
      where: { id },
      include: { user: true },
    });
    if (!existingStudent) throw new NotFoundException('Student is not found');

    if (
      updateStudentDto.name &&
      existingStudent.name.toLowerCase() !==
        updateStudentDto.name.trim().toLowerCase()
    ) {
      await checkDuplicate(
        this.prisma.student,
        'name',
        updateStudentDto.name,
        id,
        'Student with this name already exists',
      );
    }

    if (
      updateStudentDto.email &&
      existingStudent.user.email !== updateStudentDto.email.trim()
    ) {
      await checkDuplicate(
        this.prisma.user,
        'email',
        updateStudentDto.email,
        existingStudent.userId,
        'Student with this email already exists',
      );
    }

    if (
      updateStudentDto.phone &&
      existingStudent.phone !== updateStudentDto.phone.trim()
    ) {
      await checkDuplicate(
        this.prisma.student,
        'phone',
        updateStudentDto.phone,
        id,
        'Student with this phone number already exists',
      );
    }

    const student = await this.prisma.student.update({
      where: { id },
      data: {
        user:
          updateStudentDto.email || updateStudentDto.role
            ? {
                update: {
                  email: updateStudentDto.email?.trim(),
                  role: updateStudentDto.role,
                },
              }
            : undefined,
        name: updateStudentDto.name?.trim(),
        phone: updateStudentDto.phone?.trim(),
        address:
          updateStudentDto.address === undefined
            ? undefined
            : updateStudentDto.address?.trim() || null,
        dateOfBirth:
          updateStudentDto.dateOfBirth === undefined
            ? undefined
            : updateStudentDto.dateOfBirth
              ? new Date(updateStudentDto.dateOfBirth)
              : null,
        gender: updateStudentDto.gender
          ? formatGender(updateStudentDto.gender)
          : undefined,
        image:
          updateStudentDto.image === undefined
            ? undefined
            : resolveImageUrl(updateStudentDto.image, this.cloudinary),
        role: updateStudentDto.role,
        class:
          updateStudentDto.class_id === undefined
            ? undefined
            : updateStudentDto.class_id
              ? { connect: { id: updateStudentDto.class_id } }
              : { disconnect: true },
        grade:
          updateStudentDto.grade_id === undefined
            ? undefined
            : updateStudentDto.grade_id
              ? { connect: { id: updateStudentDto.grade_id } }
              : { disconnect: true },
        parent: updateStudentDto.parent_id
          ? { connect: { id: updateStudentDto.parent_id } }
          : undefined,
      },
      include: {
        user: true,
        parent: true,
        class: true,
        grade: true,
      },
    });

    return formatStudent(student);
  }

  async remove(id: string): Promise<{ message: string }> {
    const existingStudent = await this.prisma.student.findUnique({
      where: { id },
    });
    if (!existingStudent) throw new NotFoundException('Student is not found');

    if (existingStudent.image) {
      try {
        await this.cloudinary.deleteFromCloudinary(existingStudent.image);
      } catch (error) {
        this.logger.warn(
          `Failed to delete image from Cloudinary for student ${id}: ${(error as Error).message}`,
        );
      }
    }

    // Delete user which will cascade delete the student
    await this.prisma.user.delete({ where: { id: existingStudent.userId } });

    return { message: 'Student deleted successfully' };
  }
}
