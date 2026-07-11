import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsBoolean, IsInt, IsOptional, IsNumber, IsString, Min } from 'class-validator';

export class UpdateServiceDto {
	@ApiPropertyOptional({ example: 'Haircut' })
	@IsOptional()
	@IsString()
	title?: string;

	@ApiPropertyOptional({ example: 'Full haircut with wash and styling' })
	@IsOptional()
	@IsString()
	description?: string;

	@ApiPropertyOptional({ example: 45 })
	@IsOptional()
	@Type(() => Number)
	@IsInt()
	@Min(1)
	duration?: number;

	@ApiPropertyOptional({ example: 25.5 })
	@IsOptional()
	@Type(() => Number)
	@IsNumber({ maxDecimalPlaces: 2 })
	@Min(0)
	price?: number;

	@ApiPropertyOptional({ example: true })
	@IsOptional()
	@IsBoolean()
	isActive?: boolean;
}