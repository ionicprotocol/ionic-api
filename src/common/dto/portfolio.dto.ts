// External dependencies
import { ApiProperty } from '@nestjs/swagger';

// Types
import { Chain } from '../types/chain.type';

export class PositionDto {
  @ApiProperty({
    description: 'Asset symbol',
    example: 'WETH',
  })
  asset: string;

  @ApiProperty({
    description: 'Supply balance in native units',
    example: '1.5',
  })
  supply_balance: string;

  @ApiProperty({
    description: 'Supply balance in USD',
    example: 1500.5,
  })
  supply_balance_usd: number;

  @ApiProperty({
    description: 'Borrow balance in native units',
    example: '0.5',
  })
  borrow_balance: string;

  @ApiProperty({
    description: 'Borrow balance in USD',
    example: 750.25,
  })
  borrow_balance_usd: number;

  @ApiProperty({
    description: 'Health factor',
    example: '1.5',
  })
  health_factor: string;
}

export class ProtocolPositionDto {
  @ApiProperty({
    description: 'Protocol name',
    example: 'Ionic',
    enum: ['Ionic', 'Morpho'],
  })
  protocol: string;

  @ApiProperty({
    description: 'Total supply value in USD',
    example: 1500.5,
  })
  total_supply_usd: number;

  @ApiProperty({
    description: 'Total borrow value in USD',
    example: 750.25,
  })
  total_borrow_usd: number;

  @ApiProperty({
    description: 'Net value in USD (supply - borrow)',
    example: 750.25,
  })
  net_value_usd: number;

  @ApiProperty({
    description: 'Detailed positions',
    type: [PositionDto],
  })
  positions: PositionDto[];
}

export class ChainPortfolioDto {
  @ApiProperty({
    description: 'Total value in USD for this chain',
    example: 2250.75,
  })
  total_value_usd: number;

  @ApiProperty({
    description: 'Total supply in USD for this chain',
    example: 3000.0,
  })
  total_supply_usd: number;

  @ApiProperty({
    description: 'Total borrow in USD for this chain',
    example: 750.25,
  })
  total_borrow_usd: number;

  @ApiProperty({
    description: 'Positions by protocol',
    type: [ProtocolPositionDto],
  })
  protocols: ProtocolPositionDto[];
}

export class PortfolioResponseDto {
  @ApiProperty({
    description: 'Total portfolio value in USD across all chains and protocols',
    example: 2250.75,
  })
  total_value_usd: number;

  @ApiProperty({
    description: 'Total supply value in USD across all chains and protocols',
    example: 3000.0,
  })
  total_supply_usd: number;

  @ApiProperty({
    description: 'Total borrow value in USD across all chains and protocols',
    example: 1500.5,
  })
  total_borrow_usd: number;

  @ApiProperty({
    description: 'Positions by chain',
    type: 'object',
    additionalProperties: {
      $ref: '#/components/schemas/ChainPortfolioDto',
    },
    example: {
      base: {
        total_value_usd: 1500.5,
        total_supply_usd: 2000.0,
        total_borrow_usd: 500.5,
        protocols: [
          {
            protocol: 'Ionic',
            total_supply_usd: 1500.5,
            total_borrow_usd: 500.5,
            net_value_usd: 1000.0,
            positions: [
              {
                asset: 'WETH',
                supply_balance: '1.5',
                supply_balance_usd: 1500.5,
                borrow_balance: '0.5',
                borrow_balance_usd: 500.5,
                health_factor: '1.5',
              },
            ],
          },
        ],
      },
    },
  })
  positions: Record<Chain, ChainPortfolioDto>;
}
