import { Test, TestingModule } from '@nestjs/testing';
import { MorphoService } from './morpho.service';

describe('MorphoService', () => {
  let service: MorphoService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MorphoService],
    }).compile();

    service = module.get<MorphoService>(MorphoService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getPosition', () => {
    it('should return position details', async () => {
      const chain = 'optimism';
      const positionId =
        '0xb323495f7e4148be5643a4ea4a8221eef163e4bccfdedc2a6f4696baacbc86cc';
      const account = '0x7f65e7326F22963e2039734dDfF61958D5d284Ca';

      const result = await service.getPosition(chain, positionId, account);

      expect(result).toBeDefined();
      expect(result.position).toBeDefined();
      expect(result.position.id).toBe(positionId);
      expect(result.position.account).toBe(account);
    });
  });
});
