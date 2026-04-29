import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { RidesModule } from './modules/rides/rides.module';
import { MatchmakingModule } from './modules/matchmaking/matchmaking.module';
import { PrismaModule } from './modules/prisma/prisma.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    RidesModule,
    MatchmakingModule,
  ],
})
export class AppModule {}

