import { ApiProperty } from '@nestjs/swagger';
import { Chain } from '../types/chain.type';

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
    description: 'Detailed positions by chain',
    type: 'object',
    additionalProperties: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          asset: { type: 'string', example: 'WETH' },
          supply_balance: { type: 'string', example: '1.5' },
          supply_balance_usd: { type: 'number', example: 1500.5 },
          borrow_balance: { type: 'string', example: '0.5' },
          borrow_balance_usd: { type: 'number', example: 750.25 },
          health_factor: { type: 'string', example: '1.5' },
        },
      },
    },
    example: {
      optimism: [
        {
          asset: 'WETH',
          supply_balance: '1.5',
          supply_balance_usd: 1500.5,
          borrow_balance: '0.5',
          borrow_balance_usd: 750.25,
          health_factor: '1.5',
        },
      ],
    },
  })
  positions: Record<
    Chain,
    Array<{
      asset: string;
      supply_balance: string;
      supply_balance_usd: number;
      borrow_balance: string;
      borrow_balance_usd: number;
      health_factor: string;
    }>
  >;
}

export class PortfolioResponseDto {
  @ApiProperty({
    description: 'Total portfolio value in USD across all protocols',
    example: 2250.75,
  })
  total_value_usd: number;

  @ApiProperty({
    description: 'Total supply value in USD across all protocols',
    example: 3000.0,
  })
  total_supply_usd: number;

  @ApiProperty({
    description: 'Total borrow value in USD across all protocols',
    example: 1500.5,
  })
  total_borrow_usd: number;

  @ApiProperty({
    description: 'Positions by protocol',
    type: [ProtocolPositionDto],
  })
  protocols: ProtocolPositionDto[];
}
