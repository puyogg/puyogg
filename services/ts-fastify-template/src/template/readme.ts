import * as fs from 'node:fs/promises';
import * as path from 'node:path';
import * as url from 'node:url';

const __dirname = path.dirname(url.fileURLToPath(import.meta.url));

export const readme = async (packageName: string): Promise<string> => {
  const baseReadme = await fs.readFile(path.resolve(__dirname, '../../README.md'), {
    encoding: 'utf-8',
  });

  const checklist = baseReadme.split('## New Lib Checklist\n\n')[1].split('\n##')[0];

  const newReadme = `# ${packageName}

TODO: package description

## New Library Checklist

${checklist}`;
  return newReadme;
};
