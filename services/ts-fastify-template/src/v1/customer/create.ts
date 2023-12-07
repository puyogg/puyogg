import { app } from '../../app.js';
import { models } from '../../app.js';
import { Customer, CustomerCreate } from '@puyogg/ts-postgres-template';

app.route({
  method: 'POST',
  url: '/v1/customer',
  schema: {
    body: CustomerCreate,
    response: {
      200: Customer,
    },
  },
  handler: async (request, reply) => {
    const customer = await models.customerModel.create(request.body);
    return reply.send(customer);
  },
});
