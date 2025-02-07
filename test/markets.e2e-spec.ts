import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app.module';

describe('Markets (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterEach(async () => {
    await app.close();
  });

  describe('GET /beta/v0/markets', () => {
    it('should return aggregated markets data', async () => {
      const response = await request(app.getHttpServer())
        .get('/beta/v0/markets')
        .expect(200);

      expect(response.body).toHaveProperty('totalValueUsd');
      expect(response.body).toHaveProperty('protocols');
      expect(Array.isArray(response.body.protocols)).toBe(true);

      response.body.protocols.forEach((protocol) => {
        expect(protocol).toHaveProperty('protocol');
        expect(protocol).toHaveProperty('totalValueUsd');
        expect(protocol).toHaveProperty('markets');
        expect(Array.isArray(protocol.markets)).toBe(true);

        protocol.markets.forEach((market) => {
          expect(market).toHaveProperty('id');
          expect(market).toHaveProperty('totalValueUsd');
          expect(market).toHaveProperty('supplyApy');
          expect(market).toHaveProperty('borrowApy');
        });
      });
    });

    it('should filter markets by protocol', async () => {
      const response = await request(app.getHttpServer())
        .get('/beta/v0/markets?protocol=ionic')
        .expect(200);

      expect(response.body).toHaveProperty('protocol', 'ionic');
      expect(response.body).toHaveProperty('totalValueUsd');
      expect(response.body).toHaveProperty('markets');
      expect(Array.isArray(response.body.markets)).toBe(true);
    });

    it('should filter markets by chain', async () => {
      const response = await request(app.getHttpServer())
        .get('/beta/v0/markets?chain=base')
        .expect(200);

      expect(response.body).toHaveProperty('totalValueUsd');
      expect(response.body).toHaveProperty('protocols');
      expect(Array.isArray(response.body.protocols)).toBe(true);

      response.body.protocols.forEach((protocol) => {
        protocol.markets.forEach((market) => {
          // Add chain-specific assertions here if markets include chain information
          expect(market).toBeDefined();
        });
      });
    });

    it('should filter markets by asset', async () => {
      const response = await request(app.getHttpServer())
        .get('/beta/v0/markets?asset=ETH')
        .expect(200);

      expect(response.body).toHaveProperty('totalValueUsd');
      expect(response.body).toHaveProperty('protocols');
      expect(Array.isArray(response.body.protocols)).toBe(true);

      response.body.protocols.forEach((protocol) => {
        protocol.markets.forEach((market) => {
          // ETH markets should include ETH in their ID
          expect(market.id.toUpperCase()).toContain('ETH');
        });
      });
    });

    it('should handle combined filters', async () => {
      const response = await request(app.getHttpServer())
        .get('/beta/v0/markets?protocol=ionic&chain=base&asset=ETH')
        .expect(200);

      expect(response.body).toHaveProperty('protocol', 'ionic');
      expect(response.body).toHaveProperty('totalValueUsd');
      expect(response.body).toHaveProperty('markets');
      expect(Array.isArray(response.body.markets)).toBe(true);

      response.body.markets.forEach((market) => {
        expect(market.id.toUpperCase()).toContain('ETH');
      });
    });
  });
});
