import { Static } from '@sinclair/typebox';
import { FastifyPluginCallback } from 'fastify';
import AgentControler, { SerializedAgents } from '../classes/AgentControler';

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

const getAgents: FastifyPluginCallback = (fastify, _, next) => {
  fastify.get<{
    Reply: Static<typeof SerializedAgents>;
  }>('/agents', opts, async (_, reply) => {
    reply.code(200).send(AgentControler.serializedAgents);
  });
  next();
};

export default getAgents;
