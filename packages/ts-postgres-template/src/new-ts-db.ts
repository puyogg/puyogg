import * as fs from 'node:fs/promises';
import * as path from 'node:path';
import * as url from 'node:url';
import pick from 'lodash/pick.js';
import { generateDockerComposeYaml } from './template/docker-compose.js';
import { execAsync } from './template/exec-async.js';

const __dirname = path.dirname(url.fileURLToPath(import.meta.url));

interface PackageJson {
  name: string;
  version: string;
  type: string;
  main: string;
  bin: string;
  exports: Record<string, unknown>;
  scripts: Record<string, string>;
  repository: {
    type: string;
    url: string;
    directory: string;
  };
  dependencies?: Record<string, string>;
  devDependencies?: Record<string, string>;
  peerDependencies?: Record<string, string>;
}

export const newTsDb = async (packageName: string) => {
  const newDockerCompose = generateDockerComposeYaml({
    packageName,
    originalYaml: await fs.readFile(path.join(__dirname, '../../../docker-compose.yml'), {
      encoding: 'utf-8',
    }),
  });
  await fs.writeFile(path.resolve(__dirname, '../../../docker-compose.yml'), newDockerCompose, {
    encoding: 'utf-8',
  });

  const newLibPath = path.join('packages', packageName);
  await fs.mkdir(path.join(newLibPath, 'src'), { recursive: true });

  const basePackageJson = JSON.parse(
    await fs.readFile(path.resolve(__dirname, '../package.json'), { encoding: 'utf-8' }),
  ) as PackageJson;

  const packageJson = pick(basePackageJson, [
    'name',
    'version',
    'type',
    'main',
    'exports',
    'scripts',
    'repository',
    'dependencies',
    'devDependencies',
  ]);

  const npmScope = packageJson.name.split('/')[0];
  packageJson.name = `${npmScope}/${packageName}`;
  packageJson.version = '0.1.0';
  packageJson.repository.directory = `packages/${packageName}`;

  packageJson.dependencies = pick(packageJson.dependencies ?? {}, [
    'postgres',
    'source-map-support',
    'yargs',
    'zod',
  ]);

  packageJson.devDependencies = pick(packageJson.devDependencies ?? {}, [
    '@babel/cli',
    '@babel/core',
    '@babel/preset-env',
    '@babel/preset-typescript',
    '@types/babel__core',
    '@types/node',
    '@types/yargs',
    '@typescript-eslint/eslint-plugin',
    '@typescript-eslint/parser',
    '@typescript-eslint/utils',
    'babel-plugin-source-map-support',
    'babel-plugin-transform-import-meta',
    'concurrently',
    'eslint',
    'eslint-config-prettier',
    'prettier',
    'tsx',
    'typescript',
    'vitest',
  ]);

  await fs.writeFile(
    path.join(newLibPath, 'package.json'),
    JSON.stringify(packageJson, undefined, 2),
    { encoding: 'utf-8' },
  );

  const filesToCopy = [
    '.eslintrc.cjs',
    '.prettierrc.mjs',
    'babel.config.mjs',
    'tsconfig.json',
    'tsconfig.dev.json',
    'vitest.unit.config.mts',
    'vitest.int.config.mts',
    'src/db.ts',
    'src/tsconfig.json',
  ];
  await Promise.all(
    filesToCopy.map(async (fileName) => {
      await fs.copyFile(path.resolve(__dirname, `../${fileName}`), path.join(newLibPath, fileName));
    }),
  );

  const dirsToCopy = ['src/migrations', 'src/models', 'src/scripts', 'src/test-utils', 'src/types'];
  await Promise.all(
    dirsToCopy.map(async (dirPath) => {
      await fs.cp(path.resolve(__dirname, `../${dirPath}`), path.join(newLibPath, dirPath), {
        recursive: true,
      });
    }),
  );

  await fs.writeFile(path.join(newLibPath, 'src', 'index.ts'), '', { encoding: 'utf-8' });
  await execAsync('pnpm', ['install'], { cwd: newLibPath });
};
