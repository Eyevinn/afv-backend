import { Static, Type } from '@sinclair/typebox';
import { FastifyPluginCallback } from 'fastify';
import AgentControler from '../classes/AgentControler';

const opts = {
  schema: {
    description: 'Set transition fading duration for an agent.',
    body: {
      required: ['fadeIn', 'fadeOut'],
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
          fadeIn: { type: 'number' },
          fadeOut: { type: 'number' }
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

const setFadersBodyReq = Type.Object({
  fadeIn: Type.Number(),
  fadeOut: Type.Number()
});

const setFadersResponseBody = Type.Object({
  name: Type.String(),
  id: Type.String(),
  fadeIn: Type.Number(),
  fadeOut: Type.Number()
});

const setFadersErrorBody = Type.Object({
  code: Type.Number(),
  message: Type.String(),
  id: Type.String()
});

const setFadersParams = Type.Object({
  id: Type.String()
});

const setAgentFaders: FastifyPluginCallback = (fastify, _, next) => {
  fastify.post<{
    Body: Static<typeof setFadersBodyReq>;
    Reply: Static<typeof setFadersResponseBody | typeof setFadersErrorBody>;
    Params: Static<typeof setFadersParams>;
  }>('/agents/:id', opts, async (request, reply) => {
    const { fadeIn, fadeOut } = request.body;
    const { id } = request.params;

    const foundAgent = AgentControler.findAgent(id);
    if (foundAgent) {
      foundAgent?._messageTranslator.setFaders(fadeIn, fadeOut);
      reply.code(200).send({ id, name: foundAgent?._name, fadeIn, fadeOut });
    } else {
      reply.code(400).send({ code: 400, message: 'Could not find agent', id });
    }
  });
  next();
};

export default setAgentFaders;
