import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';
import { Chain } from '../types/chain.type';

export class MarketSearchQueryDto {
  @ApiProperty({
    description: 'Chain to query',
    example: 'base',
    required: false,
  })
  @IsOptional()
  chain?: Chain;

  @ApiProperty({
    description: 'Asset symbol',
    example: 'WETH',
    required: false,
  })
  @IsOptional()
  @IsString()
  asset?: string;

  @ApiProperty({
    description: 'Market address',
    example: '0x1234567890123456789012345678901234567890',
    required: false,
  })
  @IsOptional()
  @IsString()
  address?: string;

  @ApiProperty({
    description: 'Pool address',
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
