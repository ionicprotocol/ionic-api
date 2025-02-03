import { Injectable } from '@nestjs/common';
import { GraphQLClient, gql } from 'graphql-request';
import { Address } from 'viem';
import { MorphoGraphQLResponse } from '../types/graphql.types';

@Injectable()
export class MorphoGraphQLService {
  private client: GraphQLClient;

  constructor() {
    this.client = new GraphQLClient('https://blue-api.morpho.org/graphql');
  }

  private readonly GET_USER_POSITIONS = gql`
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

  async getUserPositions(
    address: Address,
    chainId: number,
  ): Promise<MorphoGraphQLResponse> {
    return this.client.request(this.GET_USER_POSITIONS, {
      address,
      chainId,
    });
  }
}
