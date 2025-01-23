import { Static, Type } from '@sinclair/typebox';
import { FastifyPluginCallback } from 'fastify';
import AgentControler, { SerializedAgents } from '../classes/AgentControler';

const opts = {
  schema: {
    body: {
      required: ['ids'],
      type: 'object',
      properties: {
        ids: { type: 'array' }
      }
    },
    response: {
      500: {
        properties: {
          error: { type: 'string' }
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
