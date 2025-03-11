import { Static } from '@sinclair/typebox';
import { FastifyPluginCallback } from 'fastify';
import AgentControler, { SerializedAgents } from '../classes/AgentControler';

const opts = {
  schema: {
    description: 'Lists all agents.',
    response: {
      200: {
        description: 'Successful response',
        type: 'array',
        items: {
          type: 'object',
          properties: {
            name: { type: 'string' },
            id: { type: 'string' },
            url: { type: 'string' },
            status: { type: 'string' },
            options: {
              type: 'object',
              properties: {
                fadeIn: { type: 'number' },
                fadeOut: { type: 'number' }
              }
            }
          }
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
