import { z } from 'zod';
import { app } from '../app.js';

app.route({
  method: 'POST',
  url: '/v1/add',
  schema: {
    body: z.object({
      a: z.number(),
      b: z.number(),
    }),
    response: {
      200: z.number(),
    },
  },
  handler: async (request, reply) => {
    const { a, b } = request.body;
    return reply.send(a + b);
  },
});
