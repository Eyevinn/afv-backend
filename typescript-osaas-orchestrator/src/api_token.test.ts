import { TypeBoxTypeProvider } from '@fastify/type-provider-typebox';
import fastify, { FastifyInstance } from 'fastify';
import { createSigner } from 'fast-jwt';

import apiToken from './api_token';

describe('Token API', () => {
  let api: FastifyInstance;

  beforeAll(() => {
    // We need to use fake timers so we can verify a signed JWT token
    jest.useFakeTimers({
      now: 1686127497000
    });
    api = fastify({
      ignoreTrailingSlash: true
    }).withTypeProvider<TypeBoxTypeProvider>();
    api.register(apiToken);
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  test('can generate a token', async () => {
    const signSync = createSigner({ key: 'jwtsecretindev' });
    const expectedToken = signSync({
      iat: Math.round(Date.now() / 1000),
      customer: 'eyevinn',
      email: 'test@eyevinn.se',
      limit: 3
    });

    const response = await api.inject({
      method: 'POST',
      url: '/token',
      payload: {
        company: 'eyevinn',
        email: 'test@eyevinn.se'
      }
    });
    expect(response.statusCode).toEqual(200);
    expect(response.body).toEqual(expectedToken);
  });

  test('can handle company name with spaces', async () => {
    const signSync = createSigner({ key: 'jwtsecretindev' });
    const expectedToken = signSync({
      iat: Math.round(Date.now() / 1000),
      customer: 'eyevinn_is_da_best',
      email: 'test@eyevinn.se',
      limit: 3
    });

    const response = await api.inject({
      method: 'POST',
      url: '/token',
      payload: {
        company: 'eyevinn is da    best',
        email: 'test@eyevinn.se'
      }
    });
    expect(response.statusCode).toEqual(200);
    expect(response.body).toEqual(expectedToken);
  });
});
