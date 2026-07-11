import { Injectable, NotFoundException } from '@nestjs/common';
import { rethrowPrismaError } from '../common/prisma/prisma-error.util';
import { PrismaService } from '../prisma/prisma.service';
import { publicUserSelect } from '../users/users.service';
import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';

const serviceInclude = {
  creator: {
    select: publicUserSelect,
  },
} as const;

@Injectable()
export class ServicesService {
  constructor(private readonly prisma: PrismaService) {}

  create(userId: number, createServiceDto: CreateServiceDto) {
    return this.prisma.service.create({
      data: {
        title: createServiceDto.title.trim(),
        description: createServiceDto.description.trim(),
        duration: createServiceDto.duration,
        price: createServiceDto.price,
        isActive: createServiceDto.isActive ?? true,
        createdBy: userId,
      },
      include: serviceInclude,
    });
  }

  findAll() {
    return this.prisma.service.findMany({
      orderBy: { createdAt: 'desc' },
      include: serviceInclude,
    });
  }

  async findOne(id: number) {
    const service = await this.prisma.service.findUnique({
      where: { id },
      include: serviceInclude,
    });

    if (!service) {
      throw new NotFoundException('Service not found.');
    }

    return service;
  }

  async update(id: number, updateServiceDto: UpdateServiceDto) {
    await this.findOne(id);

    try {
      return await this.prisma.service.update({
        where: { id },
        data: {
          ...(updateServiceDto.title !== undefined ? { title: updateServiceDto.title.trim() } : {}),
          ...(updateServiceDto.description !== undefined
            ? { description: updateServiceDto.description.trim() }
            : {}),
          ...(updateServiceDto.duration !== undefined ? { duration: updateServiceDto.duration } : {}),
          ...(updateServiceDto.price !== undefined ? { price: updateServiceDto.price } : {}),
          ...(updateServiceDto.isActive !== undefined ? { isActive: updateServiceDto.isActive } : {}),
        },
        include: serviceInclude,
      });
    } catch (error) {
      rethrowPrismaError(error, {
        notFoundMessage: 'Service not found.',
      });
    }
  }

  async remove(id: number) {
    await this.findOne(id);

    try {
      await this.prisma.service.delete({
        where: { id },
      });

      return { message: 'Service deleted successfully.' };
    } catch (error) {
      rethrowPrismaError(error, {
        notFoundMessage: 'Service not found.',
      });
    }
  }
}