import { Injectable, Logger } from '@nestjs/common';
import axios from 'axios';
import { Chain } from '../types/chain.type';

interface DexScreenerTokenResponse {
  pairs: Array<{
    chainId: string;
    dexId: string;
    priceUsd: string;
    priceNative: string;
    baseToken: {
      address: string;
      symbol: string;
    };
    quoteToken: {
      address: string;
      symbol: string;
    };
    liquidity: {
      usd: number;
    };
  }>;
}

@Injectable()
export class PriceService {
  private readonly logger = new Logger(PriceService.name);

  async getDexScreenerPrice(chain: Chain, symbol: string, tokenAddress: string): Promise<bigint> {
    try {
      if (!tokenAddress) {
        throw new Error(`No token address for ${symbol}`);
      }

      const response = await axios.get<DexScreenerTokenResponse>(
        `https://api.dexscreener.com/latest/dex/tokens/${tokenAddress}`
      );
      
      const pairs = response.data.pairs;
      if (!pairs?.length) {
        throw new Error('No pairs found');
      }

      if (pairs[0]?.priceUsd) {
        const price = pairs[0].priceUsd;
        this.logger.debug(`Got ${symbol} price: ${price} USD from DEXScreener`);
        return BigInt(Math.round(Number(price) * 1e8));
      }

      throw new Error('No price data returned');
    } catch (error) {
      this.logger.error(`Error fetching ${symbol} price: ${error.message}`);
      return 0n;
    }
  }
} 