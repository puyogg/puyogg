import Fastify from 'fastify';
import { serializerCompiler, validatorCompiler, ZodTypeProvider } from 'fastify-type-provider-zod';
import { connect, Models, Sql } from '@puyogg/ts-postgres-template';

export const app = Fastify({
  logger: { level: process.env.LOG_LEVEL ?? 'info' },
}).withTypeProvider<ZodTypeProvider>();
app.setValidatorCompiler(validatorCompiler);
app.setSerializerCompiler(serializerCompiler);
export type App = typeof app;

// TODO: pass connection options to connect
export let sql: Sql;
export let models: Models;

export const initApp = async (dbName?: string) => {
  ({ sql, models } = connect({ database: dbName }));

  await import('./healthcheck.js');
  await import('./v1/index.js');

  // Filler request to initialize pool. sql is lazy
  await sql`SELECT 1`;

  return { sql, models, app };
};

export const startApp = async () => {
  await initApp();
  await app.ready();

  console.log('Listening on port 3000!');
  await app.listen({
    host: '0.0.0.0',
    port: 3000,
  });
};
