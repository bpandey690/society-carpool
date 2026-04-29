import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { RideStatus } from '@prisma/client';

export class SetRideStatusDto {
  @IsString()
  @IsNotEmpty()
  rideId!: string;

  @IsEnum(RideStatus)
  status!: RideStatus;
}

