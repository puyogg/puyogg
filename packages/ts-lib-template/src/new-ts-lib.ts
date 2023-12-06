import * as fs from 'node:fs/promises';
import * as path from 'node:path';
import * as url from 'node:url';
import { execAsync } from './exec-async.js';
import pick from 'lodash/pick.js';
import { readme } from './readme.js';

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

export const newLib = async (packageName: string): Promise<void> => {
  const newLibPath = path.join('packages', packageName);
  await fs.mkdir(path.join(newLibPath, 'src'), { recursive: true });

  const basePackageJson = JSON.parse(
    await fs.readFile(path.resolve(__dirname, '../package.json'), {
      encoding: 'utf-8',
    }),
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

  packageJson.dependencies = pick(packageJson.dependencies ?? {}, ['source-map-support']);
  packageJson.devDependencies = pick(packageJson.devDependencies ?? {}, [
    '@babel/cli',
    '@babel/core',
    '@babel/preset-env',
    '@babel/preset-typescript',
    '@types/babel__core',
    '@typescript-eslint/eslint-plugin',
    '@typescript-eslint/parser',
    '@typescript-eslint/utils',
    'babel-plugin-source-map-support',
    'babel-plugin-transform-import-meta',
    'concurrently',
    'eslint',
    'eslint-config-prettier',
    'prettier',
    'ts-node',
    'typescript',
    'vitest',
  ]);

  const newReadme = await readme(packageName);

  await fs.writeFile(
    path.join(newLibPath, 'package.json'),
    JSON.stringify(packageJson, undefined, 2),
    { encoding: 'utf-8' },
  );

  await fs.writeFile(path.join(newLibPath, 'README.md'), JSON.stringify(newReadme, undefined, 2), {
    encoding: 'utf-8',
  });

  const toCopy = [
    '.eslintrc.cjs',
    '.prettierrc.mjs',
    'babel.config.mjs',
    'tsconfig.json',
    'tsconfig.dev.json',
    'vitest.unit.config.mts',
    'src/index.unit.spec.ts',
    'src/tsconfig.json',
  ];
  await Promise.all(
    toCopy.map(async (fileName) => {
      await fs.copyFile(path.resolve(__dirname, `../${fileName}`), path.join(newLibPath, fileName));
    }),
  );

  // const tsconfigJson = JSON.parse(
  //   await fs.readFile(path.resolve(__dirname, '../tsconfig.json'), {
  //     encoding: 'utf-8',
  //   }),
  // ) as Record<string, unknown>;

  // TODO: Allow adding project references

  // await fs.writeFile(
  //   path.join(newLibPath, 'tsconfig.json'),
  //   JSON.stringify(tsconfigJson, undefined, 2) + '\n',
  //   { encoding: 'utf-8' },
  // );

  await fs.writeFile(path.join(newLibPath, 'src', 'index.ts'), '', { encoding: 'utf-8' });

  await execAsync('pnpm', ['install'], { cwd: newLibPath });
};
