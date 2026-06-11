import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma, UserRole } from '../../../prisma/generated/prisma/client.js';
import { PaginatedResponseDto } from '../../common/dto/paginated-response.dto.js';
import { formatStudent } from '../../common/formatters/student.formatter.js';
import { formatGender } from '../../common/formatters/user.formatter.js';
import { resolveImageUrl } from '../../common/utils/image.util.js';
import { PrismaService } from '../../database/prisma/prisma.service.js';
import { CloudinaryService } from '../../integrations/cloudinary/cloudinary.service.js';
import { CreateStudentDto } from './dto/create-student.dto.js';
import { QueryStudentDto } from './dto/query-student-dto.js';
import { StudentResponseDto } from './dto/student-response.dto.js';
import { UpdateStudentDto } from './dto/update-student.dto.js';

@Injectable()
export class StudentsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly cloudinary: CloudinaryService,
  ) {}

  async create(
    createStudentDto: CreateStudentDto,
  ): Promise<StudentResponseDto> {
    const existingStudent = await this.prisma.student.findFirst({
      where: {
        OR: [
          {
            name: {
              equals: createStudentDto.name.trim(),
              mode: 'insensitive',
            },
          },
          { email: createStudentDto.email.trim() },
          { phone: createStudentDto.phone?.trim() },
        ],
      },
    });

    if (existingStudent)
      throw new BadRequestException(
        'Student with this name, email or phone number already exists',
      );

    const imageUrl = resolveImageUrl(createStudentDto.image, this.cloudinary);

    const student = await this.prisma.student.create({
      data: {
        email: createStudentDto.email.trim(),
        password: createStudentDto.password,
        name: createStudentDto.name.trim(),
        phone: createStudentDto.phone?.trim(),
        address: createStudentDto.address?.trim() || null,
        birthday: createStudentDto.birthday
          ? new Date(createStudentDto.birthday)
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
        parent: { omit: { password: true } },
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
          email: { contains: search, mode: 'insensitive' },
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
        parent: {
          omit: { password: true },
        },
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
        total_pages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: string) {
    const student = await this.prisma.student.findUnique({
      where: { id },
      include: {
        parent: {
          omit: { password: true },
        },
        class: true,
        grade: true,
      },
    });

    if (!student) {
      throw new NotFoundException('Student is not found');
    }

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
    });
    if (!existingStudent) throw new NotFoundException('Student is not found');

    if (
      updateStudentDto.name &&
      existingStudent.name.toLowerCase() !==
        updateStudentDto.name.trim().toLowerCase()
    ) {
      const duplicateStudent = await this.prisma.student.findFirst({
        where: {
          name: {
            equals: updateStudentDto.name.trim(),
            mode: 'insensitive',
          },
          NOT: { id },
        },
      });

      if (duplicateStudent)
        throw new BadRequestException('Student with this name already exists');
    }

    if (
      updateStudentDto.email &&
      existingStudent.email !== updateStudentDto.email.trim()
    ) {
      const duplicateEmailStudent = await this.prisma.student.findFirst({
        where: {
          email: updateStudentDto.email.trim(),
          NOT: { id },
        },
      });

      if (duplicateEmailStudent)
        throw new BadRequestException('Student with this email already exists');
    }

    if (
      updateStudentDto.phone &&
      existingStudent.phone !== updateStudentDto.phone.trim()
    ) {
      const duplicatePhoneStudent = await this.prisma.student.findFirst({
        where: {
          phone: updateStudentDto.phone.trim(),
          NOT: { id },
        },
      });

      if (duplicatePhoneStudent)
        throw new BadRequestException(
          'Student with this phone number already exists',
        );
    }

    const student = await this.prisma.student.update({
      where: { id },
      data: {
        email: updateStudentDto.email?.trim(),
        name: updateStudentDto.name?.trim(),
        phone: updateStudentDto.phone?.trim(),
        address:
          updateStudentDto.address === undefined
            ? undefined
            : updateStudentDto.address?.trim() || null,
        birthday:
          updateStudentDto.birthday === undefined
            ? undefined
            : updateStudentDto.birthday
              ? new Date(updateStudentDto.birthday)
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
        parent: {
          omit: { password: true },
        },
        class: true,
        grade: true,
      },
    });

    return formatStudent(student);
  }

  async remove(id: string): Promise<{ message?: string }> {
    const existingStudent = await this.prisma.student.findUnique({
      where: { id },
    });
    if (!existingStudent) throw new NotFoundException('Student is not found');

    if (existingStudent.image)
      await this.cloudinary.deleteFromCloudinary(existingStudent.image);

    await this.prisma.student.delete({ where: { id } });

    return { message: 'Student deleted successfully' };
  }
}
