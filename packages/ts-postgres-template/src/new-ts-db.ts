import * as fs from 'node:fs/promises';
import * as path from 'node:path';
import * as url from 'node:url';
import { generateDockerComposeYaml } from './docker-compose.js';

const __dirname = path.dirname(url.fileURLToPath(import.meta.url));

export const newTsDb = async (packageName: string) => {
  const newDockerCompose = generateDockerComposeYaml({
    packageName,
    originalYaml: await fs.readFile(path.join(__dirname, '../../../docker-compose.yml'), {
      encoding: 'utf-8',
    }),
  });

  console.log(newDockerCompose);
};
