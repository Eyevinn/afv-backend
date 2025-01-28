import { Static } from '@sinclair/typebox';
import { FastifyPluginCallback } from 'fastify';
import AgentControler, { SerializedAgents } from '../classes/AgentControler';

const getAgents: FastifyPluginCallback = (fastify, _, next) => {
  fastify.get<{
    Reply: Static<typeof SerializedAgents>;
  }>('/agents', _, async (_, reply) => {
    reply.code(200).send(AgentControler.serializedAgents);
  });
  next();
};

export default getAgents;
