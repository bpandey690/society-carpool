import { Body, Controller, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { PublishRideDto } from './dto/publish-ride.dto';
import { RidesService } from './rides.service';
import { RideStatus } from '@prisma/client';

@Controller('rides')
export class RidesController {
  constructor(private readonly rides: RidesService) {}

  @Post()
  async publish(@Body() dto: PublishRideDto) {
    return this.rides.publishRide(dto);
  }

  @Get()
  async list(@Query('status') status?: RideStatus) {
    return this.rides.listRides(status);
  }

  @Get(':id')
  async get(@Param('id') id: string) {
    return this.rides.getRide(id);
  }

  @Patch(':id/status')
  async setStatus(@Param('id') id: string, @Body() body: { status: RideStatus }) {
    return this.rides.setRideStatus(id, body.status);
  }
}

