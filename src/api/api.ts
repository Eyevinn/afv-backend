import fastify from 'fastify';
import cors from '@fastify/cors';
import swagger from '@fastify/swagger';
import swaggerUI from '@fastify/swagger-ui';
import { TypeBoxTypeProvider } from '@fastify/type-provider-typebox';
import createAgent from './endpoints/create';
import deleteAgent from './endpoints/delete';
import getAgents from './endpoints/get';
import errorHandler from './utils/error-handler';
import setAgentFaders from './endpoints/faders';
import healthcheck from './endpoints/healthcheck';

export interface ApiOptions {
  title: string;
}

export default (opts: ApiOptions) => {
  const api = fastify({
    ignoreTrailingSlash: true
  }).withTypeProvider<TypeBoxTypeProvider>();

  // register the cors plugin, configure it for better security
  api.register(cors);

  // register the swagger plugins, it will automagically do magic
  api.register(swagger, {
    swagger: {
      info: {
        title: opts.title,
        description:
          'Create, list and delete AFV agents. Each agent establishes a WebSocket connection to a WebSocket server and translates incoming messages.',
        version: 'v1'
      }
    }
  });
  api.register(swaggerUI, {
    routePrefix: '/docs'
  });

  // register a global error handler
  api.setErrorHandler(errorHandler);
  api.register(healthcheck);
  api.register(getAgents);
  api.register(createAgent);
  api.register(deleteAgent);
  api.register(setAgentFaders);

  return api;
};
