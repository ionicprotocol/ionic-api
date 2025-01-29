import { ApiProperty } from '@nestjs/swagger';
import { IsEthereumAddress } from 'class-validator';

export class BaseRequestDto {
  @ApiProperty({
    description: 'Ethereum address of the sender',
    example: '0x1234567890123456789012345678901234567890',
  })
  @IsEthereumAddress()
  sender: string;
}
