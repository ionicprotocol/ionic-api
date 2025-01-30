import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';
import { Chain } from '../../common/types/chain.type';

export class GetMarketAddressParamsDto {
  @ApiProperty({
    description: 'The blockchain network',
    enum: [
      'optimism',
      'base',
      'mode',
      'bob',
      'fraxtal',
      'lisk',
      'ink',
      'superseed',
      'worldchain',
      'swell',
      'soneium',
    ],
    example: 'optimism',
  })
  chain: Chain;

  @ApiProperty({
    description: 'The asset symbol',
    example: 'WETH',
  })
  @IsString()
  asset: string;
}

export class MarketInfoDto {
  @ApiProperty({
    description: 'The market (cToken) address',
    example: '0x1234567890123456789012345678901234567890',
  })
  address: string;

  @ApiProperty({
    description: 'The pool address',
    example: '0x1234567890123456789012345678901234567890',
  })
  pool_address: string;

  @ApiProperty({
    description: 'The underlying token address',
    example: '0x1234567890123456789012345678901234567890',
  })
  underlying_address: string;

  @ApiProperty({
    description: 'The underlying token name',
    example: 'Wrapped Ether',
  })
  underlying_name: string;

  @ApiProperty({
    description: 'The underlying token symbol',
    example: 'WETH',
  })
  underlying_symbol: string;

  @ApiProperty({
    description: 'The token decimals',
    example: 18,
  })
  decimals: number;

  @ApiProperty({
    description: 'The supply APY in percentage',
    example: 2.5,
  })
  supply_apy: number | null;

  @ApiProperty({
    description: 'The borrow APY in percentage',
    example: 3.5,
  })
  borrow_apy: number | null;

  @ApiProperty({
    description: 'The total supply in underlying token units',
    example: '1000000000000000000',
  })
  total_supply: string | null;

  @ApiProperty({
    description: 'The total borrow in underlying token units',
    example: '500000000000000000',
  })
  total_borrow: string | null;

  @ApiProperty({
    description: 'The utilization rate in percentage',
    example: 50,
  })
  utilization_rate: number | null;

  @ApiProperty({
    description: 'Whether the market is listed',
    example: true,
  })
  is_listed: boolean | null;

  @ApiProperty({
    description: 'Whether borrowing is paused',
    example: false,
  })
  is_borrow_paused: boolean | null;

  @ApiProperty({
    description: 'Whether minting (supply) is paused',
    example: false,
  })
  is_mint_paused: boolean | null;
}

export class MarketsResponseDto {
  @ApiProperty({
    description: 'List of markets matching the query parameters',
    type: [MarketInfoDto],
  })
  markets: MarketInfoDto[];
}
