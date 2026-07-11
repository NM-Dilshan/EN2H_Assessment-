import { Injectable, Logger, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../../generated/prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
	private readonly logger = new Logger(PrismaService.name);
	private readonly hasDatabaseUrl: boolean;

	constructor() {
		const connectionString = process.env.DATABASE_URL ?? 'postgresql://localhost:5432/postgres?schema=public';

		super(
			(connectionString
				? {
					adapter: new PrismaPg({ connectionString }),
				}
				: {}) as any,
		);

		this.hasDatabaseUrl = Boolean(process.env.DATABASE_URL);
	}

	async onModuleInit() {
		if (process.env.NODE_ENV === 'test' || !this.hasDatabaseUrl) {
			if (!this.hasDatabaseUrl) {
				this.logger.warn('DATABASE_URL is not set. Prisma connection skipped for local startup.');
			}
			return;
		}

		await this.$connect();
		this.logger.log('Prisma connected');
	}

	async onModuleDestroy() {
		if (process.env.NODE_ENV === 'test') {
			return;
		}

		await this.$disconnect();
	}

}

