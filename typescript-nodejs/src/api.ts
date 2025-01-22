import { Static, Type } from '@sinclair/typebox';
import { FastifyPluginCallback } from 'fastify';

const HelloWorld = Type.String({
  description: 'The magical words!'
});

const api: FastifyPluginCallback = (fastify, _, next) => {
  fastify.get<{ Reply: Static<typeof HelloWorld> }>(
    '/',
    {
      schema: {
        description: 'Say hello',
        response: {
          200: HelloWorld
        }
      }
    },
    async (_, reply) => {
      reply.send('Hello, world!');
    }
  );
  next();
};

export default api;
