import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';
import { Chain } from '../../common/types/chain.type';

export class MarketSearchQueryDto {
  @ApiProperty({
    description: 'Chain to query',
    example: 'base',
    required: true,
  })
  chain: Chain;

  @ApiProperty({
    description: 'Market ID to search for',
    example:
      '0x144bf18d6bf4c59602548a825034f73bf1d20177fc5f975fc69d5a5eba929b45',
    required: false,
  })
  @IsOptional()
  @IsString()
  marketId?: string;

  @ApiProperty({
    description: 'Collateral token address to search for',
    example: '0x7FcD174E80f264448ebeE8c88a7C4476AAF58Ea6',
    required: false,
  })
  @IsOptional()
  @IsString()
  collateralToken?: string;

  @ApiProperty({
    description: 'Collateral token symbol to search for',
    example: 'wsuperOETHb',
    required: false,
  })
  @IsOptional()
  @IsString()
  collateralTokenSymbol?: string;

  @ApiProperty({
    description: 'Borrow token address to search for',
    example: '0x4200000000000000000000000000000000000006',
    required: false,
  })
  @IsOptional()
  @IsString()
  borrowToken?: string;

  @ApiProperty({
    description: 'Borrow token symbol to search for',
    example: 'WETH',
    required: false,
  })
  @IsOptional()
  @IsString()
  borrowTokenSymbol?: string;
}
