import { Static, Type } from '@sinclair/typebox';
import { FastifyPluginCallback } from 'fastify';

const opts = {
  schema: {
    description: 'Healthcheck endpoint'
  }
};

export const healthcheckResponse = 'Alive and well!';

const HealthcheckResponse = Type.String();

const healthcheck: FastifyPluginCallback = (fastify, _, next) => {
  fastify.get<{ Reply: Static<typeof HealthcheckResponse> }>(
    '/',
    opts,
    async (_, reply) => {
      reply.send(healthcheckResponse);
    }
  );
  next();
};
export default healthcheck;
