import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '../../../prisma/generated/prisma/client.js';
import { PaginatedResponseDto } from '../../common/dto/paginated-response.dto.js';
import { formatParent } from '../../common/formatters/parent.formatter.js';
import { checkDuplicate } from '../../common/utils/db.util.js';
import { PrismaService } from '../../database/prisma/prisma.service.js';
import { CreateParentDto } from './dto/create-parent.dto.js';
import { ParentResponseDto } from './dto/parent-response.dto.js';
import { QueryParentDto } from './dto/query-parent-dto.js';
import { UpdateParentDto } from './dto/update-parent.dto.js';

@Injectable()
export class ParentsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createParentDto: CreateParentDto): Promise<ParentResponseDto> {
    await checkDuplicate(
      this.prisma.parent,
      'name',
      createParentDto.name,
      null,
      'Parent with this name already exists',
    );

    if (createParentDto.phone) {
      await checkDuplicate(
        this.prisma.parent,
        'phone',
        createParentDto.phone,
        null,
        'Parent with this phone already exists',
      );
    }

    const parent = await this.prisma.parent.create({
      data: {
        name: createParentDto.name.trim(),
        phone: createParentDto.phone?.trim() || null,
        address: createParentDto.address?.trim() || null,
      },
      include: {
        students: {
          include: {
            student: {
              include: {
                user: true,
              },
            },
          },
        },
      },
    });

    return formatParent(parent);
  }

  async findAll(
    queryParentDto: QueryParentDto,
  ): Promise<PaginatedResponseDto<ParentResponseDto>> {
    const { search, page = 1, limit = 10 } = queryParentDto;

    const where: Prisma.ParentWhereInput = {};

    if (search) {
      where.OR = [{ name: { contains: search, mode: 'insensitive' } }];
    }

    const total = await this.prisma.parent.count({ where });

    const parents = await this.prisma.parent.findMany({
      where,
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { name: 'asc' },
      include: {
        students: {
          include: {
            student: {
              include: {
                user: true,
              },
            },
          },
        },
      },
    });

    return {
      data: parents.map((parent) => formatParent(parent)),
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: string): Promise<ParentResponseDto> {
    const parent = await this.prisma.parent.findUnique({
      where: { id },
      include: {
        students: {
          include: {
            student: {
              include: {
                user: true,
              },
            },
          },
        },
      },
    });

    if (!parent) throw new NotFoundException('Parent is not found');

    return formatParent(parent);
  }

  async update(
    id: string,
    updateParentDto: UpdateParentDto,
  ): Promise<ParentResponseDto> {
    const existingParent = await this.prisma.parent.findUnique({
      where: { id },
    });
    if (!existingParent) throw new NotFoundException('Parent is not found');

    // Validate name
    if (
      updateParentDto.name &&
      existingParent.name !== updateParentDto.name.trim()
    ) {
      await checkDuplicate(
        this.prisma.parent,
        'name',
        updateParentDto.name.trim(),
        id,
        'Parent with this name already exists',
      );
    }

    // Validate phone
    if (
      updateParentDto.phone &&
      existingParent.phone !== updateParentDto.phone.trim()
    ) {
      await checkDuplicate(
        this.prisma.parent,
        'phone',
        updateParentDto.phone.trim(),
        id,
        'Parent with this phone number already exists',
      );
    }

    const parent = await this.prisma.parent.update({
      where: { id },
      data: {
        name: updateParentDto.name?.trim(),
        phone: updateParentDto.phone?.trim(),
        address:
          updateParentDto.address === undefined
            ? undefined
            : updateParentDto.address?.trim() || null,
      },
      include: {
        students: {
          include: {
            student: {
              include: {
                user: true,
              },
            },
          },
        },
      },
    });

    return formatParent(parent);
  }

  async remove(id: string): Promise<{ message: string }> {
    const existingParent = await this.prisma.parent.findUnique({
      where: { id },
    });
    if (!existingParent) throw new NotFoundException('Parent is not found');

    await this.prisma.parent.delete({ where: { id } });

    return { message: 'Parent deleted successfully' };
  }
}
