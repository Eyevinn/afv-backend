import { FastifyError, FastifyReply, FastifyRequest } from 'fastify';
import Logger from './Logger';

export default (
  error: FastifyError,
  _: FastifyRequest,
  reply: FastifyReply
) => {
  // Log error
  Logger.red(`[${error.code ?? 'No Code'}]: ${error.message ?? 'No Message'}`);
  // Send error response
  reply
    .status(500)
    .send({ statusCode: 500, error: error.message ?? 'No Message' });
};
