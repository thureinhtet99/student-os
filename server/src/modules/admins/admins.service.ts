import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma, UserRole } from '../../../prisma/generated/prisma/client.js';
import { PaginatedResponseDto } from '../../common/dto/paginated-response.dto.js';
import { formatAdmin } from '../../common/formatters/admin.formatter.js';
import { checkDuplicate } from '../../common/utils/db.util.js';
import { PrismaService } from '../../database/prisma/prisma.service.js';
import { AdminResponseDto } from './dto/admin-response.dto.js';
import { CreateAdminDto } from './dto/create-admin.dto.js';
import { QueryAdminDto } from './dto/query-admin-dto.js';
import { UpdateAdminDto } from './dto/update-admin.dto.js';

@Injectable()
export class AdminsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createAdminDto: CreateAdminDto): Promise<AdminResponseDto> {
    await checkDuplicate(
      this.prisma.admin,
      'name',
      createAdminDto.name,
      null,
      'Admin with this name already exists',
    );

    await checkDuplicate(
      this.prisma.admin,
      'email',
      createAdminDto.email,
      null,
      'Admin with this email already exists',
    );

    const admin = await this.prisma.admin.create({
      data: {
        email: createAdminDto.email.trim(),
        password: createAdminDto.password,
        name: createAdminDto.name.trim(),
        role: createAdminDto.role ?? UserRole.ADMIN,
      },
    });

    return formatAdmin(admin);
  }

  async findAll(
    queryAdminDto: QueryAdminDto,
  ): Promise<PaginatedResponseDto<AdminResponseDto>> {
    const { search, page = 1, limit = 10 } = queryAdminDto;

    const where: Prisma.AdminWhereInput = {};

    if (search) {
      where.OR = [
        {
          name: { contains: search, mode: 'insensitive' },
        },
        {
          email: { contains: search, mode: 'insensitive' },
        },
      ];
    }

    const total = await this.prisma.admin.count({ where });

    const admins = await this.prisma.admin.findMany({
      where,
      skip: (page - 1) * (limit || 10),
      take: limit || 10,
      orderBy: { name: 'asc' },
    });

    return {
      data: admins.map((admin) => formatAdmin(admin)),
      meta: {
        total,
        page,
        limit,
        total_pages: Math.ceil(total / (limit || 10)),
      },
    };
  }

  async findOne(id: string): Promise<AdminResponseDto> {
    const admin = await this.prisma.admin.findUnique({
      where: { id },
    });

    if (!admin) throw new NotFoundException('Admin is not found');

    return formatAdmin(admin);
  }

  async update(
    id: string,
    updateAdminDto: UpdateAdminDto,
  ): Promise<AdminResponseDto> {
    const existingAdmin = await this.prisma.admin.findUnique({
      where: { id },
    });
    if (!existingAdmin) throw new NotFoundException('Admin is not found');

    if (
      updateAdminDto.name &&
      existingAdmin.name.toLowerCase() !==
        updateAdminDto.name.trim().toLowerCase()
    ) {
      await checkDuplicate(
        this.prisma.admin,
        'name',
        updateAdminDto.name,
        id,
        'Admin with this name already exists',
      );
    }

    if (
      updateAdminDto.email &&
      existingAdmin.email !== updateAdminDto.email.trim()
    ) {
      await checkDuplicate(
        this.prisma.admin,
        'email',
        updateAdminDto.email,
        id,
        'Admin with this email already exists',
      );
    }

    const admin = await this.prisma.admin.update({
      where: { id },
      data: {
        email: updateAdminDto.email?.trim(),
        name: updateAdminDto.name?.trim(),
        role: updateAdminDto.role,
      },
    });

    return formatAdmin(admin);
  }

  async remove(id: string): Promise<{ message: string }> {
    const existingAdmin = await this.prisma.admin.findUnique({
      where: { id },
    });
    if (!existingAdmin) throw new NotFoundException('Admin is not found');

    await this.prisma.admin.delete({ where: { id } });

    return { message: 'Admin deleted successfully' };
  }
}
