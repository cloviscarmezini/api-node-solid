import fastify from 'fastify';
import { appRoutes } from '@src/http/routes';

export const app = fastify();

app.register(appRoutes);