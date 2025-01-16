// Let's create a simple HTTP endpoint `/webhooks/releases` that receives the GitHub release event 
// and logs the release information.
// We won't use any framework for this example, just the built-in Node.js HTTP server.

import Application, { ReleaseEvent } from './Application';
import Fastify from 'fastify';

const app = new Application();


const fastify = Fastify({ logger: true });

fastify.get('/', async (_request, reply) => {
  return reply.status(200).send({ hello: 'world' });
});

fastify.post('/webhooks/releases', async (request, reply) => {
    await app.handleReleaseEvent(request.body as ReleaseEvent);
    return reply.status(200).send({ ok: true });
});

(async () => {

    app.startBot();

    const port = parseInt(process.env.PORT || '3000');
    try {
        await fastify.listen({ port })
    } catch (err) {
        fastify.log.error(err)
        process.exit(1)
    }
})();




