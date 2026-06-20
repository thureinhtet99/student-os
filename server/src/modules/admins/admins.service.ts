import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import bcrypt from 'bcrypt';
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
  private readonly SALT_ROUNDS = 12;
  constructor(private readonly prisma: PrismaService) {}

  async create(createAdminDto: CreateAdminDto): Promise<AdminResponseDto> {
    try {
      const { email, password, name, role } = createAdminDto;

      await checkDuplicate(
        this.prisma.admin,
        'name',
        name,
        null,
        'Admin with this name already exists',
      );

      await checkDuplicate(
        this.prisma.user,
        'email',
        email,
        null,
        'Admin with this email already exists',
      );

      const hashedPwd = await bcrypt.hash(password, this.SALT_ROUNDS);
      const adminId = `ADM-${Math.floor(100000 + Math.random() * 900000)}`;

      const admin = await this.prisma.admin.create({
        data: {
          adminId,
          user: {
            create: {
              email: email.trim(),
              password: hashedPwd,
              role: role ?? UserRole.ADMIN,
              isVerified: true,
              isActive: true,
            },
          },
          name: name.trim(),
          role: role ?? UserRole.ADMIN,
        },
        include: { user: true },
      });

      return formatAdmin(admin);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';

      console.error('Error during account register:', message);
      throw new InternalServerErrorException(
        'An error occurred during creating admin',
      );
    }
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
          user: {
            email: { contains: search, mode: 'insensitive' },
          },
        },
      ];
    }

    const total = await this.prisma.admin.count({ where });

    const admins = await this.prisma.admin.findMany({
      where,
      skip: (page - 1) * (limit || 10),
      take: limit || 10,
      orderBy: { name: 'asc' },
      include: { user: true },
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
      include: { user: true },
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
      include: { user: true },
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
      existingAdmin.user.email !== updateAdminDto.email.trim()
    ) {
      await checkDuplicate(
        this.prisma.user,
        'email',
        updateAdminDto.email,
        existingAdmin.userId,
        'Admin with this email already exists',
      );
    }

    const admin = await this.prisma.admin.update({
      where: { id },
      data: {
        user: (updateAdminDto.email || updateAdminDto.role)
          ? {
              update: {
                email: updateAdminDto.email?.trim(),
                role: updateAdminDto.role,
              },
            }
          : undefined,
        name: updateAdminDto.name?.trim(),
        role: updateAdminDto.role,
      },
      include: { user: true },
    });

    return formatAdmin(admin);
  }

  async remove(id: string): Promise<{ message: string }> {
    const existingAdmin = await this.prisma.admin.findUnique({
      where: { id },
    });
    if (!existingAdmin) throw new NotFoundException('Admin is not found');

    // Delete user which will cascade delete the admin
    await this.prisma.user.delete({ where: { id: existingAdmin.userId } });

    return { message: 'Admin deleted successfully' };
  }
}
