import postgres from 'postgres';
import { initModels } from './models/init.js';

export type { Models } from './models/init.js';
export type { Sql } from 'postgres';

export type Config = postgres.Options<Record<string, postgres.PostgresType>>;

export const Db = (config: Config) => {
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

export const connect = (config?: Partial<Config>) => {
  return Db({
    transform: postgres.camel,
    onnotice: () => undefined,
    host: config?.host ?? process.env.POSTGRES_HOST ?? 'puyoquest-db',
    port: config?.port ?? parseInt(process.env.POSTGRES_PORT ?? '5432', 10),
    user: config?.user ?? process.env.POSTGRES_USER ?? 'postgres',
    database: config?.database ?? process.env.POSTGRES_DBNAME ?? 'db',
    password: config?.password ?? process.env.POSTGRES_PASSWORD ?? 'password',
  });
};
