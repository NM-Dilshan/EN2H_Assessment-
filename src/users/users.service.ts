import { Injectable } from '@nestjs/common';
import { Prisma } from '../../generated/prisma/client';
import { rethrowPrismaError } from '../common/prisma/prisma-error.util';
import { PrismaService } from '../prisma/prisma.service';

export const publicUserSelect = {
  id: true,
  name: true,
  email: true,
  createdAt: true,
  updatedAt: true,
} as const satisfies Prisma.UserSelect;

export const authUserSelect = {
  ...publicUserSelect,
  password: true,
} as const satisfies Prisma.UserSelect;

export type PublicUser = Prisma.UserGetPayload<{ select: typeof publicUserSelect }>;
export type AuthUser = Prisma.UserGetPayload<{ select: typeof authUserSelect }>;

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  findByEmail(email: string) {
    return this.prisma.user.findUnique({
      where: { email },
      select: publicUserSelect,
    });
  }

  findByEmailForAuth(email: string) {
    return this.prisma.user.findUnique({
      where: { email },
      select: authUserSelect,
    });
  }

  findById(id: number) {
    return this.prisma.user.findUnique({
      where: { id },
      select: publicUserSelect,
    });
  }

  findByIdForAuth(id: number) {
    return this.prisma.user.findUnique({
      where: { id },
      select: authUserSelect,
    });
  }

  async create(data: Prisma.UserCreateInput) {
    try {
      return await this.prisma.user.create({
        data,
        select: publicUserSelect,
      });
    } catch (error) {
      rethrowPrismaError(error, {
        duplicateMessage: 'A user with this email already exists.',
      });
    }
  }

  toPublicUser(user: AuthUser): PublicUser {
    const { password: _password, ...publicUser } = user;
    return publicUser;
  }
}