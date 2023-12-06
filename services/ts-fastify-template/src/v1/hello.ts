import { z } from 'zod';
import { app } from '../app.js';

app.route({
  method: 'GET',
  url: '/v1/hello',
  schema: {
    response: {
      200: z.string(),
    },
  },
  handler: async (request, reply) => {
    return reply.send('Hello, world!');
  },
});
