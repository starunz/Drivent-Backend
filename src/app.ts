import 'reflect-metadata';
import 'express-async-errors';
import express, { Express } from 'express';
import { createClient } from 'redis';
import cors from 'cors';

import { loadEnv, connectDb, disconnectDB } from '@/config';

loadEnv();

import { handleApplicationErrors } from '@/middlewares';
import {
  usersRouter,
  authenticationRouter,
  eventsRouter,
  enrollmentsRouter,
  ticketRouter,
  paymentRouter,
  hotelRouter,
  reservationRouter,
} from '@/routers';

export const redis = createClient({
  url: process.env.REDIS_URL,
});

const app = express();
app
  .use(cors())
  .use(express.json())
  .get('/health', (_req, res) => res.send('OK!'))
  .use('/users', usersRouter)
  .use('/auth', authenticationRouter)
  .use('/event', eventsRouter)
  .use('/enrollments', enrollmentsRouter)
  .use('/ticket', ticketRouter)
  .use('/payment', paymentRouter)
  .use('/hotels', hotelRouter)
  .use('/reservation', reservationRouter)
  .use(handleApplicationErrors);

export async function init(): Promise<Express> {
  await redis.connect();
  connectDb();
  return Promise.resolve(app);
}

export async function close(): Promise<void> {
  await disconnectDB();
}

export default app;
