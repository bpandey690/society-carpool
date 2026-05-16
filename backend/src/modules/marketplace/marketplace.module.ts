import { Module } from '@nestjs/common';
import { MarketplaceService } from './marketplace.service';
import { MarketplaceController } from './marketplace.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { MarketplaceGateway } from './marketplace.gateway';

@Module({
  imports: [PrismaModule],
  providers: [MarketplaceService, MarketplaceGateway],
  controllers: [MarketplaceController],
})
export class MarketplaceModule {}
