import fastify from 'fastify';
import cors from '@fastify/cors';
import swagger from '@fastify/swagger';
import swaggerUI from '@fastify/swagger-ui';
import { TypeBoxTypeProvider } from '@fastify/type-provider-typebox';
import createAgent from './endpoints/create';
import deleteAgent from './endpoints/delete';
import getAgents from './endpoints/get';
import Logger from './classes/Logger';

export interface ApiOptions {
  title: string;
}

export default (opts: ApiOptions) => {
  const api = fastify({
    ignoreTrailingSlash: true
  }).withTypeProvider<TypeBoxTypeProvider>();

  api.setErrorHandler(function (error, _, reply) {
    // Log error
    Logger.red(
      `[${error.code ?? 'No Code'}]: ${error.message ?? 'No Message'}`
    );
    // Send error response
    reply
      .status(500)
      .send({ statusCode: 500, error: error.message ?? 'No Message' });
  });

  // register the cors plugin, configure it for better security
  api.register(cors);

  // register the swagger plugins, it will automagically do magic
  api.register(swagger, {
    swagger: {
      info: {
        title: opts.title,
        description: 'hello',
        version: 'v1'
      }
    }
  });
  api.register(swaggerUI, {
    routePrefix: '/docs'
  });

  api.register(getAgents);
  api.register(createAgent);
  api.register(deleteAgent);

  return api;
};
