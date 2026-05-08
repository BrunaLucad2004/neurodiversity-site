import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';

export const REDIS_NAMESPACE = 'REDIS';

@Module({
  providers: [
    {
      provide: REDIS_NAMESPACE,
      inject: [ConfigService],
      useFactory: (configService: ConfigService) =>
        new Redis(configService.get<string>('REDIS_URL')),
    },
  ],
  exports: [REDIS_NAMESPACE],
})
export class RedisModule {}
