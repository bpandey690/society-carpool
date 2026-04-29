import { Type } from 'class-transformer';
import { IsDateString, IsNotEmpty, IsNumber, IsString, IsUUID, ValidateNested } from 'class-validator';

class LngLatDto {
  @IsNumber()
  @Type(() => Number)
  lng!: number;

  @IsNumber()
  @Type(() => Number)
  lat!: number;
}

export class RequestRideDto {
  @IsUUID()
  rideId!: string;

  @IsString()
  @IsNotEmpty()
  riderName!: string;

  @IsString()
  @IsNotEmpty()
  riderStartName!: string;

  @IsString()
  @IsNotEmpty()
  riderEndName!: string;

  @IsDateString()
  riderStartTime!: string;

  @ValidateNested()
  @Type(() => LngLatDto)
  riderStart!: LngLatDto;

  @ValidateNested()
  @Type(() => LngLatDto)
  riderEnd!: LngLatDto;
}

