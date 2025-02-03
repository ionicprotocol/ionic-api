import { ApiProperty } from '@nestjs/swagger';

export class RewardDto {
  @ApiProperty({ description: 'Address of the reward token' })
  rewardToken: string;

  @ApiProperty({ description: 'Symbol of the reward token' })
  rewardSymbol: string;

  @ApiProperty({ description: 'APY for the reward', example: '5.2' })
  apy: string;
}

export class AssetPositionDto {
  @ApiProperty({
    description: 'Symbol of the underlying token',
    example: 'USDC',
  })
  underlyingSymbol: string;

  @ApiProperty({
    description: 'Decimals of the underlying token',
    example: '6',
  })
  underlyingDecimals: string;

  @ApiProperty({
    description: 'Supply balance in base units',
    example: '1000000',
  })
  supplyBalance: string;

  @ApiProperty({ description: 'Supply balance in USD', example: '1000.00' })
  supplyBalanceUsd: string;

  @ApiProperty({
    description: 'Borrow balance in base units',
    example: '500000',
  })
  borrowBalance: string;

  @ApiProperty({ description: 'Borrow balance in USD', example: '500.00' })
  borrowBalanceUsd: string;

  @ApiProperty({ description: 'Collateral factor', example: '0.8' })
  collateralFactor: string;

  @ApiProperty({ description: 'Supply APY', example: '3.5' })
  supplyApy: string;

  @ApiProperty({ description: 'Borrow APY', example: '4.2' })
  borrowApy: string;

  @ApiProperty({
    description: 'Price of underlying token in USD',
    example: '1.00',
  })
  underlyingPriceUsd: string;

  @ApiProperty({
    description: 'Total supply in base units',
    example: '10000000',
  })
  totalSupply: string;

  @ApiProperty({ description: 'Total supply in USD', example: '10000.00' })
  totalSupplyUsd: string;

  @ApiProperty({
    description: 'Total borrow in base units',
    example: '5000000',
  })
  totalBorrow: string;

  @ApiProperty({ description: 'Total borrow in USD', example: '5000.00' })
  totalBorrowUsd: string;

  @ApiProperty({
    description: 'Available liquidity in base units',
    example: '5000000',
  })
  liquidity: string;

  @ApiProperty({
    description: 'Available liquidity in USD',
    example: '5000.00',
  })
  liquidityUsd: string;

  @ApiProperty({
    description: 'Reward tokens and their APYs',
    type: [RewardDto],
  })
  rewards: RewardDto[];
}

export class PoolPositionDto {
  @ApiProperty({ description: 'Name of the pool', example: 'Morpho USDC' })
  name: string;

  @ApiProperty({ description: 'Unique identifier of the pool' })
  poolId: string;

  @ApiProperty({ description: 'Health factor of the position', example: '1.5' })
  healthFactor: string;

  @ApiProperty({
    description: 'Asset positions in this pool',
    type: [AssetPositionDto],
  })
  assets: AssetPositionDto[];
}

export class PositionsResponseDto {
  @ApiProperty({
    description: 'List of pool positions',
    type: 'object',
    properties: {
      pools: {
        type: 'array',
        items: { $ref: '#/components/schemas/PoolPositionDto' },
      },
    },
  })
  positions: {
    pools: PoolPositionDto[];
  };
}
