import { app } from '../../app.js';
import { models } from '../../app.js';
import { Character, CharacterCreate } from '@puyogg/puyoquest-db/models';

app.route({
  method: 'POST',
  url: '/v1/character',
  schema: {
    body: CharacterCreate,
    response: {
      200: Character,
    },
  },
  handler: async (request, reply) => {
    const character = await models.characterModel.create(request.body);
    return reply.send(character);
  },
});
