import { FastifyPluginCallback } from 'fastify';
import bearerAuthPlugin from '@fastify/bearer-auth';
import { ApiKey } from '@osaas/token';
import { ErrorResponse } from './api/errors';

export interface ApiMicroserviceOpts {
  dummy: string;
}

const apiMicroservice: FastifyPluginCallback<ApiMicroserviceOpts> = (fastify, opts, next) => {
  fastify.register(bearerAuthPlugin, {
    keys: ApiKey.getApiKey()
  });

  // Insert routes here...
  // fastify.post<{}>();

  next();
};

export apiMicroservice;

