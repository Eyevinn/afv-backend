import { Static, Type } from '@sinclair/typebox';
import { FastifyPluginCallback } from 'fastify';

const opts = {
  schema: {
    description: 'Healthcheck endpoint'
  }
};

const HealthcheckResponse = Type.String();

const healthcheck: FastifyPluginCallback = (fastify, _, next) => {
  fastify.get<{ Reply: Static<typeof HealthcheckResponse> }>(
    '/',
    opts,
    async (_, reply) => {
      reply.send('Alive and well!');
    }
  );
  next();
};
export default healthcheck;
