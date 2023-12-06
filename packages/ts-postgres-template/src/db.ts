import postgres from 'postgres';
import { initModels } from './models/init.js';

export { Models } from './models/init.js';

export const Db = (config: postgres.Options<Record<string, postgres.PostgresType>>) => {
  const sql = postgres({
    transform: postgres.camel,
    ...config,
  });

  const models = initModels(sql);

  return {
    sql,
    models,
  };
};

export const connect = () => {
  return Db({
    transform: postgres.camel,
    onnotice: () => undefined,
    host: process.env.POSTGRES_HOST ?? '0.0.0.0',
    port: parseInt(process.env.POSTGRES_PORT ?? '5432', 10),
    user: process.env.POSTGRES_USER ?? 'postgres',
    database: process.env.POSTGRES_DBNAME ?? 'db',
    password: process.env.POSTGRES_PASSWORD ?? 'password',
  });
};

export const connectTestDb = (dbName: string) => {
  return Db({
    transform: postgres.camel,
    onnotice: () => undefined,
    host: process.env.POSTGRES_HOST ?? '0.0.0.0',
    port: parseInt(process.env.POSTGRES_PORT ?? '5432', 10),
    user: process.env.POSTGRES_USER ?? 'postgres',
    database: dbName,
    password: process.env.POSTGRES_PASSWORD ?? 'password',
  });
};
