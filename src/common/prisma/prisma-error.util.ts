import { ConflictException, NotFoundException } from '@nestjs/common';
import { Prisma } from '../../../generated/prisma/client';

type PrismaErrorOptions = {
  duplicateMessage?: string;
  notFoundMessage?: string;
};

export function rethrowPrismaError(error: unknown, options: PrismaErrorOptions = {}): never {
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    if (error.code === 'P2002') {
      throw new ConflictException(options.duplicateMessage ?? 'Resource already exists.');
    }

    if (error.code === 'P2025') {
      throw new NotFoundException(options.notFoundMessage ?? 'Resource not found.');
    }
  }

  throw error;
}