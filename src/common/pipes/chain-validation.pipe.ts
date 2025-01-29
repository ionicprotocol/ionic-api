import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';
import { Chain } from '../types/chain.type';

@Injectable()
export class ChainValidationPipe implements PipeTransform<string, Chain> {
  private readonly validChains: Chain[] = [
    'optimism',
    'base',
    'mode',
    'bob',
    'fraxtal',
    'lisk',
    'ink',
    'superseed',
    'worldchain',
    'swell',
    'soneium',
  ];

  transform(value: string): Chain {
    const chain = value.toLowerCase() as Chain;
    if (!this.validChains.includes(chain)) {
      throw new BadRequestException(`Invalid chain: ${value}`);
    }
    return chain;
  }
}
