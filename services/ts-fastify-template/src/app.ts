import Fastify from 'fastify';
import { serializerCompiler, validatorCompiler, ZodTypeProvider } from 'fastify-type-provider-zod';

export const app = Fastify({ logger: true }).withTypeProvider<ZodTypeProvider>();
app.setValidatorCompiler(validatorCompiler);
app.setSerializerCompiler(serializerCompiler);

export const initApp = async () => {
  await import('./healthcheck.js');
  await import('./v1/index.js');
  return app;
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
