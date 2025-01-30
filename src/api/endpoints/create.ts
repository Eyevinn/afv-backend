import { Static, Type } from '@sinclair/typebox';
import { FastifyPluginCallback } from 'fastify';
import AgentControler from '../classes/AgentControler';
import { SerializedAgent } from '../classes/Agent';

const opts = {
  schema: {
    body: {
      required: ['url', 'name'],
      type: 'object',
      properties: {
        url: { type: 'string' },
        name: { type: 'string' }
      }
    }
  }
};

const CreateBodyReq = Type.Object({
  url: Type.String(),
  name: Type.String()
});

const createAgent: FastifyPluginCallback = (fastify, _, next) => {
  fastify.post<{
    Body: Static<typeof CreateBodyReq>;
    Reply: Static<typeof SerializedAgent>;
  }>('/agents', opts, async (request, reply) => {
    const { url, name } = request.body;

    const newAgent = await AgentControler.createAgent(url, name);

    reply.code(200).send(newAgent.serialize());
  });
  next();
};

export default createAgent;
