import { app } from '../../app.js';
import { models } from '../../app.js';
import { Order, OrderCreate } from '@puyogg/ts-postgres-template';

app.route({
  method: 'POST',
  url: '/v1/order',
  schema: {
    body: OrderCreate,
    response: {
      200: Order,
    },
  },
  handler: async (request, reply) => {
    const order = await models.orderModel.create(request.body);
    return reply.send(order);
  },
});
