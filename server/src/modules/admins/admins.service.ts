import {
  HttpException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { hashPassword } from 'better-auth/crypto';
import { randomUUID } from 'node:crypto';
import { Prisma, UserRole } from '../../../prisma/generated/prisma/client.js';
import { APP_CONSTANT } from '../../common/constants/app.constant.js';
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
    try {
      const { email, password, name, role } = createAdminDto;

      await checkDuplicate(
        this.prisma.user,
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

      const hashedPwd = await hashPassword(password);
      const userId = randomUUID();

      const admin = await this.prisma.$transaction(async (tx) => {
        const createdUser = await tx.user.create({
          data: {
            id: userId,
            email: email.trim(),
            name: name.trim(),
            role: role ?? UserRole.ADMIN,
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

        const adminId =
          role === UserRole.SUPER_ADMIN
            ? `SUPER-ADM-${createdUser.id.slice(-12)}`
            : `ADM-${createdUser.id.slice(-12)}`;

        return tx.admin.create({
          data: {
            employeeCode: adminId,
            userId: createdUser.id,
          },
          include: { user: true },
        });
      });

      return formatAdmin(admin);
    } catch (error) {
      if (error instanceof HttpException) throw error;
      const message = error instanceof Error ? error.message : 'Unknown error';
      console.error('Error during admin create:', message);
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
      where.user = {
        OR: [
          { name: { contains: search, mode: 'insensitive' } },
          { email: { contains: search, mode: 'insensitive' } },
        ],
      };
    }

    const total = await this.prisma.admin.count({ where });

    const admins = await this.prisma.admin.findMany({
      where,
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { user: { name: 'asc' } },
      include: { user: true },
    });

    return {
      data: admins.map(formatAdmin),
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
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
      existingAdmin.user.name.toLowerCase() !==
        updateAdminDto.name.trim().toLowerCase()
    ) {
      await checkDuplicate(
        this.prisma.user,
        'name',
        updateAdminDto.name,
        existingAdmin.userId,
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
        user: {
          update: {
            email: updateAdminDto.email
              ? updateAdminDto.email.trim()
              : undefined,
            name: updateAdminDto.name ? updateAdminDto.name.trim() : undefined,
          },
        },
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

    await this.prisma.user.delete({ where: { id: existingAdmin.userId } });

    return { message: 'Admin deleted successfully' };
  }
}
