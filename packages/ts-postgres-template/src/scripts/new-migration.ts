import * as fs from 'node:fs';
import * as path from 'node:path';
import * as url from 'node:url';
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';

const __dirname = path.dirname(url.fileURLToPath(import.meta.url));

const argv = yargs(hideBin(process.argv)).command(
  '$0 <migration-name>',
  'create migration file with the provided name',
  (yargs) => {
    yargs.positional('migration-name', {
      describe: 'name of new migration file (kebab case, no extension)',
    });
  },
).argv;

const migrationName = Reflect.get(argv, 'migrationName') as string;

const migrationDir = path.resolve(__dirname, '../migrations');
if (!fs.existsSync(migrationDir)) {
  fs.mkdirSync(path.resolve(__dirname, '../migrations'), { recursive: true });
}

// https://stackoverflow.com/questions/19448436/how-to-create-date-in-yyyymmddhhmmss-format-using-javascript
const timestamp = new Date().toISOString().split('.')[0].replace(/[^\d]/gi, '');

fs.copyFileSync(
  path.resolve(__dirname, './migration-template.ts'),
  path.resolve(__dirname, `../migrations/${timestamp}_${migrationName.replace(/\s/g, '')}.ts`),
);
