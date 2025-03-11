import { Static, Type } from '@sinclair/typebox';
import { FastifyPluginCallback } from 'fastify';
import AgentControler, { SerializedAgents } from '../classes/AgentControler';

const opts = {
  schema: {
    description: 'Deletes one or several agents.',
    body: {
      required: ['ids'],
      type: 'object',
      properties: {
        ids: {
          type: 'array',
          items: {
            type: 'string'
          }
        }
      }
    },
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

const DeleteBodyReq = Type.Object({
  ids: Type.Array(Type.String())
});

const deleteAgent: FastifyPluginCallback = (fastify, _, next) => {
  fastify.delete<{
    Body: Static<typeof DeleteBodyReq>;
    Reply: Static<typeof SerializedAgents>;
  }>('/agents', opts, async (request, reply) => {
    const { ids } = request.body;

    AgentControler.deleteAgents(ids);

    reply.code(200).send(AgentControler.serializedAgents);
  });
  next();
};

export default deleteAgent;
