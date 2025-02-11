import { Injectable, Logger } from '@nestjs/common';
import { Address } from 'viem';
import { GraphQLClient } from 'graphql-request';

import {
  MorphoGraphQLResponse,
  MarketQueryResponse,
} from '../types/graphql.types';

@Injectable()
export class MorphoGraphQLService {
  private readonly logger = new Logger(MorphoGraphQLService.name);
  private readonly clients: Record<number, GraphQLClient> = {};

  private getClient(chainId: number): GraphQLClient {
    if (!this.clients[chainId]) {
      this.clients[chainId] = new GraphQLClient(
        `https://blue-api.morpho.org/graphql`,
      );
    }
    return this.clients[chainId];
  }

  async getUserPositions(
    address: Address,
    chainId: number,
  ): Promise<MorphoGraphQLResponse> {
    const query = `
      query User($address: String!, $chainId: Int) {
        userByAddress(address: $address, chainId: $chainId) {
          address
          marketPositions {
            borrowAssets
            borrowAssetsUsd
            collateral
            collateralUsd
            healthFactor
            supplyAssetsUsd
            supplyAssets
            market {
              collateralAsset {
                address
                name
                symbol
                decimals
                priceUsd
              }
              loanAsset {
                address
                name
                symbol
                decimals
                priceUsd
              }
              uniqueKey
              lltv
              state {
                liquidityAssets
                liquidityAssetsUsd
                borrowApy
                borrowAssets
                borrowAssetsUsd
                collateralAssetsUsd
                collateralAssets
                utilization
                rewards {
                  asset {
                    address
                    decimals
                    priceUsd
                    symbol
                  }
                  borrowApr
                  supplyApr
                }
              }
            }
          }
        }
      }
    `;

    const variables = {
      address,
      chainId,
    };

    try {
      const client = this.getClient(chainId);
      return await client.request(query, variables);
    } catch (error) {
      this.logger.error('Failed to fetch user positions:', error);
      throw new Error('Failed to fetch user positions from GraphQL API');
    }
  }

  async getMarkets(chainId: number): Promise<MarketQueryResponse> {
    const query = `
      query Markets($orderBy: MarketOrderBy, $orderDirection: OrderDirection, $where: MarketFilters) {
        markets(orderBy: $orderBy, orderDirection: $orderDirection, where: $where) {
          items {
            collateralAsset {
              address
              symbol
              priceUsd
            }
            loanAsset {
              address
              symbol
              priceUsd
            }
            lltv
            state {
              borrowApy
              borrowAssets
              borrowAssetsUsd
              collateralAssets
              collateralAssetsUsd
              supplyApy
              supplyAssets
              supplyAssetsUsd
              utilization
              rewards {
                asset {
                  address
                  symbol
                  priceUsd
                }
                supplyApr
                borrowApr
              }
            }
          }
        }
      }
    `;

    const variables = {
      orderBy: 'SupplyAssetsUsd',
      orderDirection: 'Desc',
      where: {
        chainId_in: [chainId],
        borrowAssetsUsd_gte: 100,
        supplyAssetsUsd_gte: 100,
      },
    };

    try {
      const client = this.getClient(chainId);
      return await client.request(query, variables);
    } catch (error) {
      this.logger.error('Failed to fetch markets:', error);
      throw new Error('Failed to fetch markets from GraphQL API');
    }
  }
}
