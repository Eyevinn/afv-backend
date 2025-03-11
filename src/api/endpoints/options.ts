import { Static, Type } from '@sinclair/typebox';
import { FastifyPluginCallback } from 'fastify';
import AgentControler from '../classes/AgentControler';
import { SerializedAgent } from '../classes/Agent';

const opts = {
  schema: {
    description: 'Update options for an agent.',
    body: {
      type: 'object',
      properties: {
        fadeIn: { type: 'number' },
        fadeOut: { type: 'number' }
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
          status: { type: 'string' },
          options: {
            type: 'object',
            properties: {
              fadeIn: { type: 'number' },
              fadeOut: { type: 'number' }
            }
          }
        }
      },
      400: {
        description: 'Could not find agent',
        type: 'object',
        properties: {
          code: { type: 'number' },
          message: { type: 'string' },
          id: { type: 'string' }
        }
      }
    }
  }
};

const putOptionsBodyReq = Type.Object({
  fadeIn: Type.Optional(Type.Number()),
  fadeOut: Type.Optional(Type.Number())
});

const putOptionsErrorBody = Type.Object({
  code: Type.Number(),
  message: Type.String(),
  id: Type.String()
});

const putOptionsParams = Type.Object({
  id: Type.String()
});

const putAgentOptions: FastifyPluginCallback = (fastify, _, next) => {
  fastify.put<{
    Body: Static<typeof putOptionsBodyReq>;
    Reply: Static<typeof SerializedAgent | typeof putOptionsErrorBody>;
    Params: Static<typeof putOptionsParams>;
  }>('/agents/:id', opts, async (request, reply) => {
    const { id } = request.params;

    const foundAgent = AgentControler.findAgent(id);
    if (foundAgent) {
      foundAgent?._messageTranslator.updateOptions(request.body);
      reply.code(200).send(foundAgent.serialize());
    } else {
      reply.code(400).send({ code: 400, message: 'Could not find agent', id });
    }
  });
  next();
};

export default putAgentOptions;
