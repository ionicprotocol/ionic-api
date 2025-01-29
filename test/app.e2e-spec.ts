import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        transform: true,
        forbidNonWhitelisted: true,
      }),
    );
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('Morpho', () => {
    it('/beta/v0/morpho/position/:chain/:positionId/:account (GET)', () => {
      return request(app.getHttpServer())
        .get(
          '/beta/v0/morpho/position/optimism/0xb323495f7e4148be5643a4ea4a8221eef163e4bccfdedc2a6f4696baacbc86cc/0x7f65e7326F22963e2039734dDfF61958D5d284Ca',
        )
        .expect(200)
        .expect((res) => {
          expect(res.body.position).toBeDefined();
          expect(res.body.position.id).toBeDefined();
          expect(res.body.position.account).toBeDefined();
        });
    });
  });

  describe('Ionic', () => {
    it('/beta/v0/ionic/market-address/:chain/:asset (GET)', () => {
      return request(app.getHttpServer())
        .get('/beta/v0/ionic/market-address/optimism/WETH')
        .expect(200)
        .expect((res) => {
          expect(res.body.address).toBeDefined();
          expect(typeof res.body.address).toBe('string');
        });
    });

    const poolOperationTests = [
      { operation: 'supply', method: 'post' },
      { operation: 'withdraw', method: 'post' },
      { operation: 'borrow', method: 'post' },
      { operation: 'repay', method: 'post' },
    ];

    poolOperationTests.forEach(({ operation, method }) => {
      it(`/beta/v0/ionic/${operation}/:chain (${method.toUpperCase()})`, () => {
        const requestBody = {
          sender: '0x1234567890123456789012345678901234567890',
          call_data: {
            asset: 'WETH',
            amount: 1.5,
            on_behalf_of: '0x1234567890123456789012345678901234567890',
          },
        };

        return request(app.getHttpServer())
          [method](`/beta/v0/ionic/${operation}/optimism`)
          .send(requestBody)
          .expect(201)
          .expect((res) => {
            expect(res.body.txHash).toBeDefined();
            expect(res.body.status).toBe('success');
          });
      });
    });
  });
});
