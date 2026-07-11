import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsEmail, IsEnum, IsInt, IsOptional, IsString, Matches, Min } from 'class-validator';
import { BookingStatus } from '../../../generated/prisma/client';

export class UpdateBookingDto {
	@ApiPropertyOptional({ example: 'Naveen Malith' })
	@IsOptional()
	@IsString()
	customerName?: string;

	@ApiPropertyOptional({ example: 'naveenmalith1111@gmail.com' })
	@IsOptional()
	@IsEmail()
	customerEmail?: string;

	@ApiPropertyOptional({ example: '+94712345678' })
	@IsOptional()
	@IsString()
	customerPhone?: string;

	@ApiPropertyOptional({ example: 1 })
	@IsOptional()
	@Type(() => Number)
	@IsInt()
	@Min(1)
	serviceId?: number;

	@ApiPropertyOptional({ example: '2026-07-20' })
	@IsOptional()
	@Matches(/^\d{4}-\d{2}-\d{2}$/)
	bookingDate?: string;

	@ApiPropertyOptional({ example: '14:30' })
	@IsOptional()
	@Matches(/^([01]\d|2[0-3]):[0-5]\d$/)
	bookingTime?: string;

	@ApiPropertyOptional({ enum: BookingStatus, example: BookingStatus.CONFIRMED })
	@IsOptional()
	@IsEnum(BookingStatus)
	status?: BookingStatus;

	@ApiPropertyOptional({ example: 'Please call on arrival.' })
	@IsOptional()
	@IsString()
	notes?: string;
}