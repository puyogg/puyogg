/**
 * Dump the legacy db from https://github.com/puyogg/puyoquest
 * to csv files
 */

import postgres from 'postgres';
import { stringify as CsvStringify } from 'csv/sync';
import * as fs from 'node:fs';
import * as path from 'node:path';
import * as url from 'node:url';

const __dirname = path.dirname(url.fileURLToPath(import.meta.url));

const sql = postgres({
  // transform: postgres.camel,
  onnotice: () => undefined,
  host: 'localhost',
  port: 25432,
  user: 'postgres',
  database: 'discordbot-db',
  password: 'dev_postgres_password',
});

const getSkips = (max: number, interval: number): number[] => {
  const skips: number[] = [];

  let i = 0;
  while (i < max) {
    skips.push(i);
    i += interval;
  }

  return skips;
};

const getTable = async (tableName: string): Promise<Record<string, unknown>[]> => {
  const interval = 100;

  const max = await (async () => {
    const countStr = await sql<{ count: string }[]>`SELECT COUNT(*) FROM ${sql(tableName)}`;
    const count = countStr[0].count;
    return Number(count);
  })();

  const skips = getSkips(max, interval);

  const allRows = [];
  for (const skip of skips) {
    const rows = await sql`SELECT * FROM ${sql(tableName)} LIMIT ${interval} OFFSET ${skip}`;
    allRows.push(...rows);
  }

  return allRows;
};

try {
  const timestamp = '2024mar31';
  const tableNames = ['characters', 'cards', 'aliases', 'cron_last_updated', 'image_cache'];

  for (const tableName of tableNames) {
    const table = await getTable(tableName);

    const csv = CsvStringify(table, {
      header: true,
    });
    fs.writeFileSync(
      path.resolve(__dirname, `../../data/legacy-tables/${tableName}-${timestamp}.csv`),
      csv,
      {
        encoding: 'utf-8',
      },
    );
  }
} catch (e) {
  console.error(e);
} finally {
  await sql.end();
}
