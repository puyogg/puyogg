import * as fs from 'node:fs/promises';
import * as path from 'node:path';
import * as url from 'node:url';
import { spawn } from 'node:child_process';
import pick from 'lodash/pick.js';
import { readme } from './readme.js';

const execAsync = async (
  cmd: string,
  args: string[],
  { cwd }: { cwd?: string },
): Promise<number> => {
  const exec = spawn(cmd, args, { stdio: 'inherit', cwd });

  return new Promise<number>((res, rej) => {
    exec.on('error', (err) => rej(err));
    exec.on('exit', (code, signal) => {
      if (typeof code === 'number' && code > 0) {
        return rej(new Error(`Process exited with code: ${code}`));
      }

      if (signal) {
        return rej(new Error(`Process terminated due to signal: ${signal}`));
      }

      if (code === null) {
        return rej(new Error(`Null exit code`));
      }

      res(code);
    });
  });
};

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

export const newApi = async (packageName: string): Promise<void> => {
  const newServicePath = path.join('services', packageName);
  console.log('writing service to', newServicePath);
  await fs.mkdir(path.join(newServicePath, 'src', 'v1'), { recursive: true });

  const basePackageJson = JSON.parse(
    await fs.readFile(path.resolve(__dirname, '../../package.json'), {
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
  packageJson.repository.directory = `services/${packageName}`;

  packageJson.dependencies = pick(packageJson.dependencies ?? {}, [
    '@fastify/swagger',
    '@fastify/swagger-ui',
    'fastify',
    'fastify-type-provider-zod',
    'source-map-support',
    'zod',
  ]);

  packageJson.devDependencies = pick(packageJson.devDependencies ?? {}, [
    '@babel/cli',
    '@babel/core',
    '@babel/preset-env',
    '@babel/preset-typescript',
    '@types/babel__core',
    '@types/node',
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
    path.join(newServicePath, 'package.json'),
    JSON.stringify(packageJson, undefined, 2),
    { encoding: 'utf-8' },
  );

  const newReadme = await readme(packageName);
  await fs.writeFile(
    path.join(newServicePath, 'README.md'),
    JSON.stringify(newReadme, undefined, 2),
    {
      encoding: 'utf-8',
    },
  );

  const toCopy = [
    '.eslintrc.cjs',
    '.prettierrc.mjs',
    'babel.config.mjs',
    'tsconfig.json',
    'tsconfig.dev.json',
    'vitest.unit.config.mts',
    'src/index.ts',
    'src/healthcheck.ts',
    'src/app.ts',
    'src/tsconfig.json',
    'src/v1/add.ts',
    'src/v1/add.int.spec.ts',
    'src/v1/hello.ts',
    'src/v1/hello.int.spec.ts',
    'src/v1/index.ts',
  ];
  await Promise.all(
    toCopy.map(async (fileName) => {
      await fs.copyFile(
        path.resolve(__dirname, `../../${fileName}`),
        path.join(newServicePath, fileName),
      );
    }),
  );

  await execAsync('pnpm', ['install'], { cwd: newServicePath });
};
