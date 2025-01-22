import fastify from 'fastify';
import api from './api';

describe('api', () => {
  it('responds with hello, world!', async () => {
    const server = fastify();
    server.register(api);
    const response = await server.inject({
      method: 'GET',
      url: '/'
    });
    expect(response.statusCode).toBe(200);
    expect(response.body).toBe('Hello, world!');
  });
});
