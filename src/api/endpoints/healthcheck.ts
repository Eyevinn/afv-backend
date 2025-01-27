import { Static } from '@sinclair/typebox';
import { FastifyPluginCallback } from 'fastify';
import AgentControler, { AgentsHealthCheck } from '../classes/AgentControler';

const opts = {
  schema: {
    response: {
      500: {
        properties: {
          error: { type: 'string' }
        }
      }
    }
  }
};

const healthcheck: FastifyPluginCallback = (fastify, _, next) => {
  fastify.get<{ Reply: Static<typeof AgentsHealthCheck> }>(
    '/healthcheck',
    opts,
    async (_, reply) => {
      reply.code(200).send(AgentControler.healthcheck);
    }
  );
  next();
};

export default healthcheck;
