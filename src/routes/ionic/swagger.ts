import { Router } from 'express';
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Ionic API',
      version: '0.1.0',
      description: 'API for interacting with Ionic Protocol pools',
    },
    components: {
      schemas: {
        TransactionRequest: {
          type: 'object',
          properties: {
            success: { type: 'boolean' },
            transactionRequest: {
              type: 'object',
              properties: {
                to: { type: 'string' },
                data: { type: 'string' },
                from: { type: 'string' },
                value: { type: 'string', nullable: true },
              },
            },
          },
        },
        Error: {
          type: 'object',
          properties: {
            success: { type: 'boolean' },
            error: { type: 'string' },
          },
        },
      },
    },
    paths: {
      '/beta/v0/ionic/supply/{chain}': {
        post: {
          tags: ['Ionic Operations'],
          summary: 'Supply assets to an Ionic pool',
          parameters: [
            {
              name: 'chain',
              in: 'path',
              required: true,
              schema: {
                type: 'string',
                enum: ['optimism', 'base', 'mode', 'bob', 'fraxtal', 'lisk', 'ink', 'superseed', 'worldchain', 'swell', 'soneium', 'ozeantest', 'camptest'],
              },
            },
          ],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['account', 'amount', 'asset'],
                  properties: {
                    account: { type: 'string' },
                    amount: { type: 'string' },
                    asset: { type: 'string' },
                  },
                },
              },
            },
          },
          responses: {
            200: {
              description: 'Successful operation',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/TransactionRequest' },
                },
              },
            },
            400: {
              description: 'Invalid input',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/Error' },
                },
              },
            },
          },
        },
      },
      '/beta/v0/ionic/withdraw/{chain}': {
        post: {
          tags: ['Ionic Operations'],
          summary: 'Withdraw assets from an Ionic pool',
          parameters: [
            {
              name: 'chain',
              in: 'path',
              required: true,
              schema: {
                type: 'string',
                enum: ['optimism', 'base', 'mode', 'bob', 'fraxtal', 'lisk', 'ink', 'superseed', 'worldchain', 'swell', 'soneium', 'ozeantest', 'camptest'],
              },
            },
          ],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['account', 'amount', 'asset'],
                  properties: {
                    account: { type: 'string' },
                    amount: { type: 'string' },
                    asset: { type: 'string' },
                  },
                },
              },
            },
          },
          responses: {
            200: {
              description: 'Successful operation',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/TransactionRequest' },
                },
              },
            },
            400: {
              description: 'Invalid input',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/Error' },
                },
              },
            },
          },
        },
      },
      '/beta/v0/ionic/borrow/{chain}': {
        post: {
          tags: ['Ionic Operations'],
          summary: 'Borrow assets from an Ionic pool',
          parameters: [
            {
              name: 'chain',
              in: 'path',
              required: true,
              schema: {
                type: 'string',
                enum: ['optimism', 'base', 'mode', 'bob', 'fraxtal', 'lisk', 'ink', 'superseed', 'worldchain', 'swell', 'soneium', 'ozeantest', 'camptest'],
              },
            },
          ],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['account', 'amount', 'asset'],
                  properties: {
                    account: { type: 'string' },
                    amount: { type: 'string' },
                    asset: { type: 'string' },
                  },
                },
              },
            },
          },
          responses: {
            200: {
              description: 'Successful operation',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/TransactionRequest' },
                },
              },
            },
            400: {
              description: 'Invalid input',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/Error' },
                },
              },
            },
          },
        },
      },
      '/beta/v0/ionic/repay/{chain}': {
        post: {
          tags: ['Ionic Operations'],
          summary: 'Repay borrowed assets to an Ionic pool',
          parameters: [
            {
              name: 'chain',
              in: 'path',
              required: true,
              schema: {
                type: 'string',
                enum: ['optimism', 'base', 'mode', 'bob', 'fraxtal', 'lisk', 'ink', 'superseed', 'worldchain', 'swell', 'soneium', 'ozeantest', 'camptest'],
              },
            },
          ],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['account', 'amount', 'asset'],
                  properties: {
                    account: { type: 'string' },
                    amount: { type: 'string' },
                    asset: { type: 'string' },
                  },
                },
              },
            },
          },
          responses: {
            200: {
              description: 'Successful operation',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/TransactionRequest' },
                },
              },
            },
            400: {
              description: 'Invalid input',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/Error' },
                },
              },
            },
          },
        },
      },
      '/beta/v0/ionic/market-address/{chain}/{asset}': {
        get: {
          tags: ['Pool Information'],
          summary: 'Get pool address for a specific asset',
          parameters: [
            {
              name: 'chain',
              in: 'path',
              required: true,
              schema: {
                type: 'string',
                enum: ['optimism', 'base', 'mode', 'bob', 'fraxtal', 'lisk', 'ink', 'superseed', 'worldchain', 'swell', 'soneium', 'ozeantest', 'camptest'],
              },
            },
            {
              name: 'asset',
              in: 'path',
              required: true,
              schema: { type: 'string' },
            },
          ],
          responses: {
            200: {
              description: 'Successful operation',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      success: { type: 'boolean' },
                      poolAddress: { type: 'string' },
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
  },
  apis: ['./src/routes/ionic/index.ts'], // Path to the API routes
};

const specs = swaggerJsdoc(options);

const router = Router();
router.use('/api-docs', swaggerUi.serve);
router.get('/api-docs', swaggerUi.setup(specs));

export default router; 