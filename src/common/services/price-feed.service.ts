import { Injectable, Logger } from '@nestjs/common';
import { AxiosError } from 'axios';
import { HttpService } from '@nestjs/axios';

const COINGECKO_API_URL = 'https://api.coingecko.com/api/v3';

interface CoinGeckoResponse {
  ethereum: {
    usd: number;
  };
}

@Injectable()
export class PriceFeedService {
  private readonly logger = new Logger(PriceFeedService.name);
  private ethUsdPrice: number | null = null;
  private lastFetchTimestamp: number = 0;
  private readonly CACHE_DURATION = 5 * 60 * 1000; // 5 minutes in milliseconds

  constructor(private readonly httpService: HttpService) {}

  /**
   * Fetches the current ETH/USD price from CoinGecko
   * Uses caching to avoid hitting rate limits
   * @returns The current ETH/USD price
   * @throws Error if unable to fetch price and no cached price available
   */
  async getEthUsdPrice(): Promise<number> {
    const now = Date.now();

    // Return cached price if available and not expired
    if (
      this.ethUsdPrice &&
      now - this.lastFetchTimestamp < this.CACHE_DURATION
    ) {
      return this.ethUsdPrice;
    }

    try {
      const response = await this.httpService.axiosRef.get<CoinGeckoResponse>(
        `${COINGECKO_API_URL}/simple/price`,
        {
          params: {
            ids: 'ethereum',
            vs_currencies: 'usd',
          },
        },
      );

      const price = response.data?.ethereum?.usd;
      if (typeof price !== 'number') {
        throw new Error('Invalid response from CoinGecko API');
      }

      this.ethUsdPrice = price;
      this.lastFetchTimestamp = now;

      return this.ethUsdPrice;
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        this.logger.error(`Failed to fetch ETH/USD price: ${error.message}`);
      } else if (error instanceof Error) {
        this.logger.error(`Failed to fetch ETH/USD price: ${error.message}`);
      } else {
        this.logger.error('Failed to fetch ETH/USD price: Unknown error');
      }

      // Return cached price if available, even if expired
      if (this.ethUsdPrice !== null) {
        this.logger.warn('Using expired cached ETH/USD price');
        return this.ethUsdPrice;
      }

      throw new Error(
        'Failed to fetch ETH/USD price and no cached price available',
      );
    }
  }
}
