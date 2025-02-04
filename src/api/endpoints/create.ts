import { Static, Type } from '@sinclair/typebox';
import { FastifyPluginCallback } from 'fastify';
import AgentControler from '../classes/AgentControler';
import { SerializedAgent } from '../classes/Agent';

const opts = {
  schema: {
    description:
      'Creates an agent that establishes a websocket connection with the websocket server provided in the url field.',
    body: {
      required: ['url', 'name'],
      type: 'object',
      properties: {
        name: { type: 'string' },
        url: { type: 'string' }
      }
    },
    response: {
      200: {
        description: 'Successful response',
        type: 'object',
        properties: {
          name: { type: 'string' },
          id: { type: 'string' },
          url: { type: 'string' },
          status: { type: 'string' }
        }
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
