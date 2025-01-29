import { Test, TestingModule } from '@nestjs/testing';
import { IonicService } from './ionic.service';
import { PoolOperationRequestDto } from './dto/pool-operations.dto';

describe('IonicService', () => {
  let service: IonicService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [IonicService],
    }).compile();

    service = module.get<IonicService>(IonicService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getMarketAddress', () => {
    it('should return market address', async () => {
      const chain = 'optimism';
      const asset = 'WETH';

      const result = await service.getMarketAddress(chain, asset);

      expect(result).toBeDefined();
      expect(result.address).toBeDefined();
      expect(typeof result.address).toBe('string');
    });
  });

  describe('pool operations', () => {
    const chain = 'optimism';
    const request: PoolOperationRequestDto = {
      sender: '0x1234567890123456789012345678901234567890',
      call_data: {
        asset: 'WETH',
        amount: 1.5,
        on_behalf_of: '0x1234567890123456789012345678901234567890',
      },
    };

    it('should handle supply operation', async () => {
      const result = await service.supply(chain, request);

      expect(result).toBeDefined();
      expect(result.txHash).toBeDefined();
      expect(result.status).toBe('success');
    });

    it('should handle withdraw operation', async () => {
      const result = await service.withdraw(chain, request);

      expect(result).toBeDefined();
      expect(result.txHash).toBeDefined();
      expect(result.status).toBe('success');
    });

    it('should handle borrow operation', async () => {
      const result = await service.borrow(chain, request);

      expect(result).toBeDefined();
      expect(result.txHash).toBeDefined();
      expect(result.status).toBe('success');
    });

    it('should handle repay operation', async () => {
      const result = await service.repay(chain, request);

      expect(result).toBeDefined();
      expect(result.txHash).toBeDefined();
      expect(result.status).toBe('success');
    });
  });
});
