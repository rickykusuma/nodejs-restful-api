import {PrismaClient} from '@prisma/client';
import {logger} from './logging.js';

export const prismaClient = new PrismaClient({
  log: [
    {
      emit: 'event',
      level: 'query',
    },
    {
      emit: 'event',
      level: 'error',
    },
    {
      emit: 'event',
      level: 'info',
    },
    {
      emit: 'event',
      level: 'warn',
    },
  ],
})

prismaClient.$on('error', (err) => {
  logger.error(err)
})
prismaClient.$on('warn', (err) => {
  logger.warn(err)
})
prismaClient.$on('info', (err) => {
  logger.info(err)
})
prismaClient.$on('query', (err) => {
  logger.info(err)
})