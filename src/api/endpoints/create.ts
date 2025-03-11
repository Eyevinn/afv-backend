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
        url: { type: 'string' },
        options: {
          type: 'object',
          properties: {
            fadeIn: { type: 'number' },
            fadeOut: { type: 'number' }
          }
        }
      }
    },
    response: {
      200: {
        description: 'Successful response',
        type: 'object',
        required: ['url', 'name', 'id', 'status'],
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
};

const CreateBodyReq = Type.Object({
  url: Type.String(),
  name: Type.String(),
  options: Type.Optional(
    Type.Object({
      fadeIn: Type.Optional(Type.Number()),
      fadeOut: Type.Optional(Type.Number())
    })
  )
});

const createAgent: FastifyPluginCallback = (fastify, _, next) => {
  fastify.post<{
    Body: Static<typeof CreateBodyReq>;
    Reply: Static<typeof SerializedAgent>;
  }>('/agents', opts, async (request, reply) => {
    const { url, name, options } = request.body;

    const newAgent = await AgentControler.createAgent(url, name, options);

    reply.code(200).send(newAgent.serialize());
  });
  next();
};

export default createAgent;
