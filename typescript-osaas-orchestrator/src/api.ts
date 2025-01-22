import fastify from 'fastify';
import cors from '@fastify/cors';
import swagger from '@fastify/swagger';
import swaggerUI from '@fastify/swagger-ui';
import { TypeBoxTypeProvider } from '@fastify/type-provider-typebox';
import { Static, Type } from '@sinclair/typebox';
import { FastifyPluginCallback } from 'fastify';


import apiToken from './api_token';
import { readJwtSecret } from './utils/config';
import { ContainerServiceInterface } from './container_service/interface';

const HelloWorld = Type.String({
  description: 'The magical words!'
});

const healthcheck: FastifyPluginCallback = (fastify, _, next) => {
  fastify.get<{ Reply: Static<typeof HelloWorld> }>(
    '/',
    {
      schema: {
        description: 'Say hello',
        response: {
          200: HelloWorld
        }
      }
    },
    async (_, reply) => {
      reply.send('Hello, world!');
    }
  );
  next();
};

export interface ApiOptions {
  service: ContainerServiceInterface;
  slackWebHookUrl?: URL;
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
        title: 'OSaaS Orchestrator',
        description:
          'Microservice to orchestrate OSaaS instances',
        version: 'v1'
      },
      securityDefinitions: {
        jwtToken: {
          type: 'apiKey',
          name: 'x-jwt',
          in: 'header',
          description: `JWT Token prefixed with 'Bearer'`
        }
      }
    }
  });
  api.register(swaggerUI, {
    routePrefix: '/docs'
  });

  api.register(healthcheck); // health check endpoint
  /*
   * the OSaaS component
  api.register(apiComponent, {
    service: opts.service,
    jwtSecret: readJwtSecret()
  }); 
   */
  api.register(apiToken, { slackWebHookUrl: opts.slackWebHookUrl });

  return api;
};