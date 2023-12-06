import * as fs from 'node:fs';
import * as path from 'node:path';
import * as url from 'node:url';
import { connect } from '../db.js';
import { Sql } from 'postgres';

const __dirname = path.dirname(url.fileURLToPath(import.meta.url));

interface Migration {
  description?: string;
  up: (sql: Sql) => Promise<void>;
  down?: (sql: Sql) => Promise<void>;
}

const { sql } = connect();

const upsertMigrationHistoryTable = async () => {
  await sql`CREATE SCHEMA IF NOT EXISTS migrations`;
  await sql`CREATE TABLE IF NOT EXISTS migrations.history (
    name TEXT NOT NULL,
    description TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW() 
  )`;
};

const insertMigrationHistory = async (name: string, description: string | null) => {
  await sql`INSERT INTO migrations.history ${sql({ name, description })}`;
};

const executeMigration = async (name: string, migration: Migration) => {
  try {
    process.stdout.write('Migrating... ');
    await migration.up(sql);
    await insertMigrationHistory(name, migration.description ?? null);
    process.stdout.write('Done.\n');
  } catch (e) {
    console.log('ERROR!');
    if (migration.down) {
      await migration.down(sql);
    }

    throw e;
  }
};

const fetchPastMigrationNames = async () => {
  const result: { name: string }[] = await sql`SELECT name FROM migrations.history`;
  return new Set(result.map((r) => r.name));
};

const main = async () => {
  try {
    await upsertMigrationHistoryTable();

    const files = fs
      .readdirSync(path.resolve(__dirname, '../migrations'))
      .filter((file) => file.endsWith('.ts'))
      .sort((a, b) => a.localeCompare(b));

    const pastMigrations = await fetchPastMigrationNames();

    for (const file of files) {
      const filePath = path.resolve(__dirname, '../migrations', file);
      const migrationName = path.parse(file).name;
      process.stdout.write(`${migrationName}:\t`);

      if (pastMigrations.has(migrationName)) {
        process.stdout.write('SKIPPED\n');
        continue;
      }

      const migration = (await import(filePath)) as Migration;
      await executeMigration(path.parse(file).name, migration);
    }
  } finally {
    await sql.end();
  }
};

void main();
