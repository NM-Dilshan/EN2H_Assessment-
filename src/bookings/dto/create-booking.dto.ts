import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsEmail, IsEnum, IsInt, IsNotEmpty, IsOptional, IsString, Matches, Min } from 'class-validator';
import { BookingStatus } from '../../../generated/prisma/client';

export class CreateBookingDto {
  @ApiProperty({ example: 'Naveen Malith' })
  @IsString()
  @IsNotEmpty()
  customerName!: string;

  @ApiProperty({ example: 'naveenmalith1111@gmail.com' })
  @IsEmail()
  customerEmail!: string;

  @ApiProperty({ example: '+94712345678' })
  @IsString()
  @IsNotEmpty()
  customerPhone!: string;

  @ApiProperty({ example: 1 })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  serviceId!: number;

  @ApiProperty({ example: '2026-07-20', description: 'ISO date in YYYY-MM-DD format.' })
  @Matches(/^\d{4}-\d{2}-\d{2}$/)
  bookingDate!: string;

  @ApiProperty({ example: '14:30', description: '24-hour time in HH:mm format.' })
  @Matches(/^([01]\d|2[0-3]):[0-5]\d$/)
  bookingTime!: string;

  @ApiPropertyOptional({ enum: BookingStatus, example: BookingStatus.PENDING })
  @IsOptional()
  @IsEnum(BookingStatus)
  status?: BookingStatus;

  @ApiPropertyOptional({ example: 'Please call on arrival.' })
  @IsOptional()
  @IsString()
  notes?: string;
}