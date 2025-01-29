import { ApiProperty } from '@nestjs/swagger';

export class MarketInfoResponseDto {
  @ApiProperty({
    description: 'Market ID',
    example:
      '0x144bf18d6bf4c59602548a825034f73bf1d20177fc5f975fc69d5a5eba929b45',
  })
  marketId: string;

  @ApiProperty({
    description: 'Collateral token address',
    example: '0x7FcD174E80f264448ebeE8c88a7C4476AAF58Ea6',
  })
  collateralToken: string;

  @ApiProperty({
    description: 'Collateral token symbol',
    example: 'wsuperOETHb',
  })
  collateralTokenSymbol: string;

  @ApiProperty({
    description: 'Borrow token address',
    example: '0x4200000000000000000000000000000000000006',
  })
  borrowToken: string;

  @ApiProperty({
    description: 'Borrow token symbol',
    example: 'WETH',
  })
  borrowTokenSymbol: string;

  @ApiProperty({
    description: 'Market utilization (scaled by WAD)',
    example: '920000000000000000',
  })
  utilization: string;

  @ApiProperty({
    description: 'Market liquidity in loan assets',
    example: '23000000',
  })
  liquidity: string;

  @ApiProperty({
    description: 'Supply APY at target (scaled by WAD)',
    example: '30000000000000000',
  })
  apyAtTarget: string;

  @ApiProperty({
    description: 'Borrow APY (scaled by WAD)',
    example: '80000000000000000',
  })
  borrowApy: string;

  @ApiProperty({
    description: 'Total supply in assets',
    example: '1000000000000000000',
  })
  totalSupplyAssets: string;

  @ApiProperty({
    description: 'Total borrow in assets',
    example: '500000000000000000',
  })
  totalBorrowAssets: string;
}

export class MarketsResponseDto {
  @ApiProperty({
    description: 'List of markets matching the query parameters',
    type: [MarketInfoResponseDto],
  })
  markets: MarketInfoResponseDto[];
}
