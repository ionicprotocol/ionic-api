import { ApiProperty } from '@nestjs/swagger';
import { Address } from 'viem';

export class PositionDto {
  @ApiProperty({
    description: 'The market (cToken) address',
    example: '0x1234567890123456789012345678901234567890',
  })
  market_address: string;

  @ApiProperty({
    description: 'The underlying token symbol',
    example: 'WETH',
  })
  underlying_symbol: string;

  @ApiProperty({
    description: 'Supply balance in underlying token units',
    example: '1000000000000000000',
  })
  supply_balance: string;

  @ApiProperty({
    description: 'Borrow balance in underlying token units',
    example: '500000000000000000',
  })
  borrow_balance: string;

  @ApiProperty({
    description: 'Supply balance in USD',
    example: '1500.50',
  })
  supply_balance_usd: number;

  @ApiProperty({
    description: 'Borrow balance in USD',
    example: '750.25',
  })
  borrow_balance_usd: number;

  @ApiProperty({
    description: 'Collateral factor for the market',
    example: '0.75',
  })
  collateral_factor: number;

  @ApiProperty({
    description: 'Whether the position is being used as collateral',
    example: true,
  })
  is_collateral: boolean;
}

export class RewardInfoDto {
  @ApiProperty({ description: 'The reward token address' })
  rewardToken: Address;

  @ApiProperty({ description: 'The APY for the reward' })
  apy: string;
}

export class AssetPositionDto {
  @ApiProperty({ description: 'The underlying token decimals' })
  underlyingDecimals: string;

  @ApiProperty({ description: 'The underlying token balance' })
  underlyingBalance: string;

  @ApiProperty({ description: 'Supply APY' })
  supplyApy: string;

  @ApiProperty({ description: 'Borrow APY' })
  borrowApy: string;

  @ApiProperty({ description: 'Total supply' })
  totalSupply: string;

  @ApiProperty({ description: 'Total borrow' })
  totalBorrow: string;

  @ApiProperty({ description: 'Supply balance' })
  supplyBalance: string;

  @ApiProperty({ description: 'Borrow balance' })
  borrowBalance: string;

  @ApiProperty({ description: 'Liquidity' })
  liquidity: string;

  @ApiProperty({ description: 'Exchange rate' })
  exchangeRate: string;

  @ApiProperty({ description: 'Underlying price' })
  underlyingPrice: string;

  @ApiProperty({ description: 'Collateral factor' })
  collateralFactor: string;

  @ApiProperty({ description: 'Reserve factor' })
  reserveFactor: string;

  @ApiProperty({ description: 'Admin fee' })
  adminFee: string;

  @ApiProperty({ description: 'Ionic fee' })
  ionicFee: string;

  @ApiProperty({ description: 'The cToken address' })
  cToken: Address;

  @ApiProperty({
    description: 'Rewards information',
    type: [RewardInfoDto],
    required: false,
  })
  rewards?: RewardInfoDto[];
}

export class PoolPositionDto {
  @ApiProperty({ description: 'The pool name' })
  name: string;

  @ApiProperty({ description: 'The pool comptroller address' })
  comptroller: Address;

  @ApiProperty({ description: 'The pool assets', type: [AssetPositionDto] })
  assets: AssetPositionDto[];

  @ApiProperty({ description: 'The pool health factor' })
  healthFactor: string;
}

export class PositionsResponseDto {
  @ApiProperty({
    description: 'List of pool positions',
    type: [PoolPositionDto],
  })
  pools: PoolPositionDto[];
}
