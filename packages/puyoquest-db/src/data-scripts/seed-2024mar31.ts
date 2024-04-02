import postgres from 'postgres';
import * as fs from 'node:fs';
import * as path from 'node:path';
import * as url from 'node:url';
import { parse as CsvParse } from 'csv/sync';
import pMap from 'p-map';

const __dirname = path.dirname(url.fileURLToPath(import.meta.url));

const sql = postgres({
  // transform: postgres.camel,
  onnotice: () => undefined,
  host: 'localhost',
  port: 35433,
  user: 'postgres',
  database: 'ppqdb',
  password: 'password',
});

const insertValue = async (tableName: string, value: Record<string, unknown>): Promise<void> => {
  await sql`
    INSERT INTO ${sql(tableName)}
    ${sql(value)}
    ON CONFLICT DO NOTHING
  `;
};

const CoerceEmptyStrAsNull = (str: string, opts?: { normalize: boolean }): string | null => {
  if (str === '') return null;
  if (opts?.normalize) return str.normalize('NFKD');
  return str;
};

try {
  // console.log('Inserting characters');
  const characterFileStr = fs.readFileSync(
    path.resolve(__dirname, '../../data/legacy-tables/characters-2024mar31.csv'),
    { encoding: 'utf-8' },
  );
  const characters = (
    CsvParse(characterFileStr, { columns: true }) as Record<string, string>[]
  ).map((character) => {
    return {
      ...character,
      updated_at: new Date(Number(character.updated_at)),
    } as Record<string, string | number | Date>;
  });
  await pMap(
    characters,
    async (character) => {
      // console.log(`Inserting ${String(character.char_id)} ${String(character.name)}`);
      await insertValue('character', character);
    },
    { concurrency: 5 },
  );

  // console.log('Inserting cards');
  const cardFileStr = fs.readFileSync(
    path.resolve(__dirname, '../../data/legacy-tables/cards-2024mar31.csv'),
    { encoding: 'utf-8' },
  );
  const cards = (CsvParse(cardFileStr, { columns: true }) as Record<string, string>[]).map(
    (card) => ({
      ...card,
      rarity_modifier: CoerceEmptyStrAsNull(card.rarity_modifier),
      name_normalized: CoerceEmptyStrAsNull(card.name_normalized, { normalize: true }),
      jp_name: CoerceEmptyStrAsNull(card.jp_name),
      jp_name_normalized: CoerceEmptyStrAsNull(card.jp_name_normalized, { normalize: true }),
      link_name_normalized: CoerceEmptyStrAsNull(card.link_name_normalized, { normalize: true }),
      side_color: CoerceEmptyStrAsNull(card.side_color),
      updated_at: new Date(Number(card.updated_at)),
    }),
  );
  await pMap(
    cards,
    async (card) => {
      await insertValue('card', card);
    },
    { concurrency: 5 },
  );

  // console.log('Inserting aliases');
  const aliases = (
    CsvParse(
      fs.readFileSync(path.resolve(__dirname, '../../data/legacy-tables/aliases-2024mar31.csv'), {
        encoding: 'utf-8',
      }),
      { columns: true },
    ) as Record<string, string>[]
  ).map((alias) => ({
    ...alias,
    alias: alias.alias.normalize('NFKD'),
    updated_at: new Date(Number(alias.updated_at)),
  }));
  await pMap(
    aliases,
    async (alias) => {
      await insertValue('alias', alias);
    },
    { concurrency: 5 },
  );

  // console.log('Inserting cron data');
  const crons = (
    CsvParse(
      fs.readFileSync(
        path.resolve(__dirname, '../../data/legacy-tables/cron_last_updated-2024mar31.csv'),
        {
          encoding: 'utf-8',
        },
      ),
      { columns: true },
    ) as Record<string, string>[]
  ).map((cron) => ({
    ...cron,
    updated_at: new Date(Number(cron.updated_at)),
  }));
  await pMap(
    crons,
    async (cron) => {
      await insertValue('cron_last_updated', cron);
    },
    { concurrency: 5 },
  );
} catch (e) {
  console.error(e);
} finally {
  await sql.end();
}
