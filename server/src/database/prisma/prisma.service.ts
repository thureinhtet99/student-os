import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../../../prisma/generated/prisma/client.js';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  private readonly environmentMode = process.env.NODE_ENV ?? 'development';

  constructor() {
    const environmentMode = process.env.NODE_ENV ?? 'development';
    const adapter = new PrismaPg({
      connectionString: process.env.DATABASE_URL,
    });
    super({
      adapter,
      log:
        environmentMode === 'development'
          ? ['query', 'error', 'warn']
          : ['error'],
    });
  }

  async onModuleInit() {
    console.log(`Database initialized in ${this.environmentMode} mode`);
    await this.$connect();
    console.log('Database connected successfully!');
  }

  async onModuleDestroy() {
    await this.$disconnect();
    console.log('Database disconnected!');
  }

  async cleanDatabase() {
    if (this.environmentMode === 'production')
      throw new Error('Method not allowed');

    await this.$disconnect();
    console.log('Database cleaned up!');
  }
}
