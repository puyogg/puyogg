import { z } from 'zod';
import { app } from '../../app.js';
import { models } from '../../app.js';
import { Character } from '@puyogg/puyoquest-db/models';

app.route({
  method: 'GET',
  url: '/v1/character/:charId',
  schema: {
    params: z.object({
      charId: z.string(),
    }),
    response: {
      200: Character,
    },
  },
  handler: async (request, reply) => {
    const { charId } = request.params;
    const character = await models.characterModel.findOne(charId);
    return reply.send(character);
  },
});
