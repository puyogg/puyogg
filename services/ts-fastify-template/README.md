# ts-package-template

A base template for TypeScript APIs. Features:

- TypeScript, ESLint, Prettier
- Fastify with Zod for strongly typed schemas and validation
- Swagger and Swagger UI
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

**In the root of the monorepo**, run `pnpm new-api <packageName>`

## Integration Tests

### Running the tests

```sh
...
```

### Test configuration

[vitest.int.config.mts](./vitest.int.config.mts) contains a [globalSetup](https://vitest.dev/config/#globalsetup) file ([global-setup.ts](./src/test-utils/global-setup.ts)) and a per-test [setupFile](https://vitest.dev/config/#setupfiles) ([test-setup.ts](./src/test-utils/test-setup.ts)).

`global-setup.ts` is run once before all tests. It creates an "admin" db that each test uses to clone the primary db. We need multiple clones of the primary db so the tests can run in parallel.

`test-setup.ts` initializes the Fastify app and db connection, provides them to each test using Vitest's [TestContext](https://vitest.dev/guide/test-context.html#beforeeach-and-aftereach), and then cleans up after the test file finishes.

You can use app, db, or models by destructuring them in Vitest's fixtures (only `test`, `beforeEach`, and `afterEach`):

```ts
test('does stuff', async ({ app, models, sql }) => {
  const res = await app.inject({
    /* .. */
  });

  const order = await models.orderModel.create({
    /* ... */
  });

  const rows = await sql<Customer[]>`SELECT * FROM customer`;
});
```
