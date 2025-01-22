import fastify from 'fastify';
import cors from '@fastify/cors';
import swagger from '@fastify/swagger';
import swaggerUI from '@fastify/swagger-ui';
import { TypeBoxTypeProvider } from '@fastify/type-provider-typebox';
import api from './api';

const server = fastify({
  ignoreTrailingSlash: true
}).withTypeProvider<TypeBoxTypeProvider>();

// register the cors plugin, configure it for better security
server.register(cors);

// register the swagger plugins, it will automagically do magic
server.register(swagger, {
  swagger: {
    info: {
      title: '@eyevinn/typescript-nodejs',
      description: 'hello',
      version: 'v1'
    }
  }
});
server.register(swaggerUI, {
  routePrefix: '/docs'
});

server.register(api);

const PORT = process.env.PORT ? Number(process.env.PORT) : 8000;

server.listen({ port: PORT, host: '0.0.0.0' }, (err, address) => {
  if (err) {
    throw err;
  }
  console.log(`Server listening on ${address}`);
});

export default server;
