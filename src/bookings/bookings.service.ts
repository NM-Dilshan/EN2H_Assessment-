import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { BookingStatus } from '../../generated/prisma/client';
import { rethrowPrismaError } from '../common/prisma/prisma-error.util';
import { PrismaService } from '../prisma/prisma.service';
import { publicUserSelect } from '../users/users.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingStatusDto } from './dto/update-status.dto';

const bookingInclude = {
  service: {
    include: {
      creator: {
        select: publicUserSelect,
      },
    },
  },
} as const;

@Injectable()
export class BookingsService {
  constructor(private readonly prisma: PrismaService) {}

  findAll() {
    return this.prisma.booking.findMany({
      orderBy: { createdAt: 'desc' },
      include: bookingInclude,
    });
  }

  async findOne(id: number) {
    const booking = await this.prisma.booking.findUnique({
      where: { id },
      include: bookingInclude,
    });

    if (!booking) {
      throw new NotFoundException('Booking not found.');
    }

    return booking;
  }

  async create(createBookingDto: CreateBookingDto) {
    const bookingDate = this.toBookingDate(createBookingDto.bookingDate);
    const scheduledDateTime = this.toScheduledDateTime(createBookingDto.bookingDate, createBookingDto.bookingTime);

    await this.ensureServiceExists(createBookingDto.serviceId);
    this.ensureFutureDate(scheduledDateTime);
    await this.ensureNoDuplicateBooking(createBookingDto.serviceId, bookingDate, createBookingDto.bookingTime);

    try {
      return await this.prisma.booking.create({
        data: {
          customerName: createBookingDto.customerName.trim(),
          customerEmail: createBookingDto.customerEmail.trim().toLowerCase(),
          customerPhone: createBookingDto.customerPhone.trim(),
          serviceId: createBookingDto.serviceId,
          bookingDate,
          bookingTime: createBookingDto.bookingTime,
          status: createBookingDto.status ?? BookingStatus.PENDING,
          notes: createBookingDto.notes?.trim() || null,
        },
        include: bookingInclude,
      });
    } catch (error) {
      rethrowPrismaError(error, {
        duplicateMessage: 'This service is already booked for the selected date and time.',
      });
    }
  }

  async updateStatus(id: number, updateBookingStatusDto: UpdateBookingStatusDto) {
    const currentBooking = await this.findOne(id);

    if (currentBooking.status === BookingStatus.CANCELLED && updateBookingStatusDto.status === BookingStatus.COMPLETED) {
      throw new BadRequestException('A cancelled booking cannot be marked as completed.');
    }

    try {
      return await this.prisma.booking.update({
        where: { id },
        data: {
          status: updateBookingStatusDto.status,
        },
        include: bookingInclude,
      });
    } catch (error) {
      rethrowPrismaError(error, {
        notFoundMessage: 'Booking not found.',
        duplicateMessage: 'This service is already booked for the selected date and time.',
      });
    }
  }

  async cancel(id: number) {
    return this.updateStatus(id, { status: BookingStatus.CANCELLED });
  }

  async remove(id: number) {
    await this.findOne(id);

    try {
      await this.prisma.booking.delete({
        where: { id },
      });

      return { message: 'Booking deleted successfully.' };
    } catch (error) {
      rethrowPrismaError(error, {
        notFoundMessage: 'Booking not found.',
      });
    }
  }

  private async ensureServiceExists(serviceId: number) {
    const service = await this.prisma.service.findUnique({
      where: { id: serviceId },
      select: { id: true },
    });

    if (!service) {
      throw new NotFoundException('Service not found.');
    }
  }

  private async ensureNoDuplicateBooking(serviceId: number, bookingDate: Date, bookingTime: string, bookingId?: number) {
    const duplicate = await this.prisma.booking.findFirst({
      where: {
        serviceId,
        bookingDate,
        bookingTime,
        ...(bookingId ? { NOT: { id: bookingId } } : {}),
      },
      select: { id: true },
    });

    if (duplicate) {
      throw new ConflictException('This service is already booked for the selected date and time.');
    }
  }

  private ensureFutureDate(scheduledDateTime: Date) {
    if (scheduledDateTime.getTime() < new Date().getTime()) {
      throw new BadRequestException('Booking date and time cannot be in the past.');
    }
  }

  private toBookingDate(bookingDate: string) {
    return new Date(`${bookingDate}T00:00:00`);
  }

  private toScheduledDateTime(bookingDate: string, bookingTime: string) {
    return new Date(`${bookingDate}T${bookingTime}:00`);
  }

  private formatBookingDate(bookingDate: Date) {
    const year = bookingDate.getFullYear();
    const month = String(bookingDate.getMonth() + 1).padStart(2, '0');
    const day = String(bookingDate.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
  }
}