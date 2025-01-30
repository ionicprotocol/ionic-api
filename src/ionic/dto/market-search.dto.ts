import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class MarketSearchQueryDto {
  @ApiProperty({
    description: 'Asset symbol to search for',
    example: 'WETH',
    required: false,
  })
  @IsOptional()
  @IsString()
  asset?: string;

  @ApiProperty({
    description: 'Market (cToken) address to search for',
    example: '0x1234567890123456789012345678901234567890',
    required: false,
  })
  @IsOptional()
  @IsString()
  address?: string;

  @ApiProperty({
    description: 'Pool address to search for',
    example: '0x1234567890123456789012345678901234567890',
    required: false,
  })
  @IsOptional()
  @IsString()
  poolAddress?: string;

  @ApiProperty({
    description: 'Underlying token address to search for',
    example: '0x1234567890123456789012345678901234567890',
    required: false,
  })
  @IsOptional()
  @IsString()
  underlyingAddress?: string;

  @ApiProperty({
    description: 'Underlying token name to search for',
    example: 'Wrapped Ether',
    required: false,
  })
  @IsOptional()
  @IsString()
  underlyingName?: string;

  @ApiProperty({
    description: 'Underlying token symbol to search for',
    example: 'WETH',
    required: false,
  })
  @IsOptional()
  @IsString()
  underlyingSymbol?: string;
}
