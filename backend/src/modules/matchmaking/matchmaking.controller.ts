import { Body, Controller, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { MatchmakingService } from './matchmaking.service';
import { SearchMatchesDto } from './dto/search-matches.dto';
import { RequestRideDto } from './dto/request-ride.dto';
import { RideStatus } from '@prisma/client';

@Controller('matchmaking')
export class MatchmakingController {
  constructor(private readonly mm: MatchmakingService) {}

  @Post('search')
  async search(@Body() dto: SearchMatchesDto) {
    return this.mm.search(dto);
  }

  @Post('request')
  async requestRide(@Body() dto: RequestRideDto) {
    return this.mm.requestRide(dto);
  }

  @Get('requests')
  async listRequests(@Query('rideId') rideId?: string) {
    return this.mm.listRequests(rideId);
  }

  @Patch('requests/:id')
  async updateRequest(@Param('id') id: string, @Body() body: { status: RideStatus }) {
    return this.mm.updateRequestStatus(id, body.status);
  }
}

