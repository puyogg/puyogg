# ts-package-template

A base template for TypeScript libraries. Features:

- TypeScript, ESLint, Prettier
- Dual ESM + CommonJS output using Babel
- ESM-compatible tests using Vitest

## New Lib Checklist

- [ ] Update README.md
- [ ] Update TypeScript, ESLint, Prettier, and their configs (if necessary)
- [ ] Add project references to `tsconfig.json`
- Configure these package.json scripts that CI/CD looks for, if your package needs them:
  - [ ] `typecheck`
  - [ ] `build`
  - [ ] `test:unit`
  - [ ] `test:int` (Integration tests)
  - [ ] `build-image` (Docker image)

## Cloning the Template

**In the root of the monorepo**, run `pnpm new-lib <packageName>`

## Commands

Most build-related commands will have a `cjs` or `esm` variant. If you're only going to build for one module system, you can remove one of them.

- `clean`: Removes outputs (both cjs and esm) and deletes the `tsconfig.tsbuildinfo` file. Use this if TypeScript isn't rebuilding your `.d.ts` files.
- `tsc:<esm|cjs>`: Typecheck the `src` folder and output the **declaration files only** (`.d.ts` and `.d.ts.map`). Since we want ESM/CJS interop, Babel will handle transpiling the TypeScript files instead.
- `babel:<esm|cjs>`: Transpile the TypeScript files. If you target CJS, Babel will handle replacing ESM-specific features (e.g. `import.meta`). Note: **does not perform type checking**!
- `build:<esm|cjs>`: Typecheck then transpile
- `watch:<esm|cjs>`: Concurrently run TypeScript and Babel watch modes
- `build`: Build both ESM and CJS outputs.
- `test:unit`: Run unit tests with vitest. See [vitest.unit.config.mts](./vitest.unit.config.mts) for configuration details.
- `test:unit-watch`: Run unit tests with vitest watch mode.

### Debugging

Try out VS Code's JavaScript Debug Terminal for most things.

If that doesn't work, here's an example of exposing the debug ports for `vitest`:

```bash
node --inspect-brk=0.0.0.0:9229 ./node_modules/vitest/vitest.mjs --pool threads --poolOptions.threads.singleThread --config=vitest.unit.config.mts
```

`./node_modules/vitest/vitest.mjs` is the "bin" path specified in the library's `package.json`.

(Vitest doesn't expose host overrides in its own API, but environments like Docker will need you to use `0.0.0.0`).

## Configuration Details

When you clone this template, the new package will have this directory structure:

```
packages/
├── ts-lib-template
└── new-ts-lib/
    ├── node_modules
    ├── src/
    │   ├── index.ts
    │   ├── index.unit.spec.ts
    │   └── tsconfig.json
    ├── .eslintrc.cjs
    ├── .prettierrc.mjs
    ├── babel.config.mjs
    ├── package.json
    ├── tsconfig.dev.json
    ├── tsconfig.json
    └── vitest.unit.config.mts
```

package.json will be copied with a [subset of its dependencies](./src/new-ts-lib.ts#L54-L68) and with the new package name and package path.

tsconfig.json will be updated with any [project references](https://www.typescriptlang.org/docs/handbook/project-references.html) you define at creation time.

### TypeScript & Babel Configuration

I configured TypeScript in this package template to target ESM first:

- `{ "type": "module" }` set in [package.json](./package.json#L4) ([reference](https://nodejs.org/api/packages.html#type))
- `{ "module": "nodenext }` set in [tsconfig.json](./tsconfig.json#L4) ([reference](https://www.typescriptlang.org/tsconfig#module))

Targetting CommonJS as a secondary output is difficult to configure with TypeScript alone, so we handle that with Babel. I defined two custom `BABEL_ENV` configs for that in [babel.config.mjs](./babel.config.mjs): `esm` and `cjs`.

For executing the CommonJS outputs, `pnpm babel:cjs` does one extra thing to make sure Node understands it's a CJS script: `mkdir -p cjs && echo '{\"type\": \"commonjs\"}'`. Node uses the nearest `package.json` to the `.js` files to decide if `.js` files should be run as ESM or CJS.

TypeScript packages that will be consuming this one will be looking at the `main` and `exports` fields in [package.json](./package.json#L5-L9) to get types. **You should keep both** so this package stays compatible with both CJS and ESM.

> If `tsc`/Intellisense fail to find imported types, even though you're sure you `pnpm install`ed them, it's probably because they declare their `main` or `exports` fields differently. You can patch this with [pnpm patch](https://pnpm.io/cli/patch). Example with [@typescript-eslint](/patches/@typescript-eslint__utils@6.11.0.patch)

#### Three `tsconfig.json`s

It's tricky to get all of these goals to line up with each other:

- Intellisense set to ESM mode for `src` (e.g. tab completion for imports should add `.js` extension)
- Enable Intellisense for `.spec.ts` files in src, but don't transpile them or build declarations
- Enable Intellisense for configs (e.g. babel.config.mjs), while obeying rootDir rules
- Integrate with VS Code's ESLint plugin

ESLint expects any linted files to fall under tsconfig `include`; but files in `include` are expected to be part of compilation, which we don't want for tests.

Here's how I worked around all that:

- `./tsconfig.json`: Base configuration. Emits declarations only, includes source files, excludes tests
- `./src/tsconfig.json`: Overrides includes just for Intellisense (not outputs). `include` contains both source files and tests, so tests can import things and still have Intellisense.
- `./src/tsconfig.dev.json`: Just there so config files can have type checking

#### Babel Plugins/Presets

- [babel-plugin-source-map-support](https://www.npmjs.com/package/babel-plugin-source-map-support): enables stack traces to point back to the original TypeScript files.
  - Prepends `import 'source-map-support/register'` to the top of emitted JS. Since this has a runtime impact, `source-map-support` needs to be installed as a regular dependency.
  - ESM imports require file extensions, or an `exports` mapping. I [patched](/patches/source-map-support@0.5.21.patch) source-map-support to improve its ESM compatibility.

### Prettier and ESLint

If you're using VS Code, Prettier should be configured to format on save. Formatting is also done separately from ESLint now (Prettier's own [recommendation](https://prettier.io/docs/en/integrating-with-linters) for v3).

ESLint uses @typescript-eslint for [typed linting](https://typescript-eslint.io/linting/typed-linting). If this leads to performance issues or weird IDE messages, feel free to change [.eslintrc.cjs](./.eslintrc.cjs) to use a looser config. ([reference](https://typescript-eslint.io/linting/configs#projects-without-type-checking))

### Vitest

Vitest is used as the test runner because it has a similar API to Jest, but with better out-of-the-box support for ESM. (Although both have some slowdown with parallelization due to the instability of some Node APIs).

- [vitest.unit.config.mts](./vitest.unit.config.mts)
- [Example automock and test](./src/new-ts-lib.unit.spec.ts)
