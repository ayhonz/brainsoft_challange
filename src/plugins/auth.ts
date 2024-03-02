import { FastifyPluginAsync, FastifyRequest } from 'fastify';
import fp from 'fastify-plugin';
import fastifyAuth from '@fastify/auth';
import { UserEntity } from '../entities/user.entity';

const auth: FastifyPluginAsync = async function (fastify) {
  void fastify.register(fastifyAuth);

  fastify.decorate('authorization', async (req: FastifyRequest) => {
    if (!req.headers.authorization) {
      throw new Error('unauthorized');
    }
    const token = req.headers.authorization.split(' ')[1];
    const user = await req.mikroORM.orm.em.findOneOrFail(UserEntity, {
      authToken: token,
    });

    if (!user) {
      throw new Error('unauthorized');
    }

    req.user = user;
  });
  fastify.decorate('allowAnonymous', async (req: FastifyRequest) => {
    if (req.headers.authorization) {
      throw new Error('Not anonymous');
    }
  });
};

export default fp(auth, {
  name: 'auth',
  dependencies: ['micro-orm'],
});
