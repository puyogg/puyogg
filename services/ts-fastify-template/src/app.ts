import Fastify from 'fastify';
import fastifySwagger from '@fastify/swagger';
import fastifySwaggerUI from '@fastify/swagger-ui';
import {
  jsonSchemaTransform,
  serializerCompiler,
  validatorCompiler,
  ZodTypeProvider,
} from 'fastify-type-provider-zod';
import { connect, Models, Sql, Config } from '@puyogg/ts-postgres-template';

export const app = Fastify({
  logger: { level: process.env.LOG_LEVEL ?? 'info' },
}).withTypeProvider<ZodTypeProvider>();
export type App = typeof app;

app.setValidatorCompiler(validatorCompiler);
app.setSerializerCompiler(serializerCompiler);

// TODO: pass connection options to connect
export let sql: Sql;
export let models: Models;

export const initApp = async (dbConfig?: Partial<Config>) => {
  await app.register(fastifySwagger, {
    openapi: {
      info: {
        title: 'TemplateAPI',
        description: 'Sample backend service using fastify and zod',
        version: '0.1.0',
      },
      servers: [],
    },
    transform: jsonSchemaTransform,
  });

  await app.register(fastifySwaggerUI, {
    routePrefix: '/docs',
  });

  ({ sql, models } = connect({ host: dbConfig?.host, database: dbConfig?.database }));

  // These have to be dynamically imported AFTER app, sql, and models are initialized globally.
  await import('./healthcheck.js');
  await import('./v1/index.js');

  // Filler request to initialize pool. sql is lazy loaded
  await sql`SELECT 1`;

  return { sql, models, app };
};

export const startApp = async () => {
  await initApp();
  await app.ready();

  console.log('Listening on port 3000!');
  await app.listen({
    host: process.env.FASTIFY_HOST ?? 'localhost',
    port: 3000,
  });
};
