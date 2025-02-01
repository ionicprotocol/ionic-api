import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Chain } from '../types/chain.type';
import { getChainConfig } from '../utils/chain.utils';
import { PublicClient, createPublicClient, http } from 'viem';

@Injectable()
export class ChainService {
  private readonly clients: Map<Chain, PublicClient> = new Map();

  constructor(private readonly configService: ConfigService) {}

  getPublicClient(chain: Chain): PublicClient {
    let client = this.clients.get(chain);
    if (!client) {
      client = this.createPublicClient(chain);
      this.clients.set(chain, client);
    }
    return client;
  }

  getChainId(chain: Chain): number {
    const chainConfig = getChainConfig(chain);
    return chainConfig.id;
  }

  private createPublicClient(chain: Chain): PublicClient {
    const chainConfig = getChainConfig(chain);
    const rpcUrl = this.getRpcUrl(chain);

    return createPublicClient({
      chain: chainConfig,
      transport: http(rpcUrl),
    });
  }

  private getRpcUrl(chain: Chain): string | undefined {
    const envKey = `${chain.toUpperCase()}_RPC_URL`;
    const customRpcUrl = this.configService.get<string>(envKey);
    return customRpcUrl;
  }
}
