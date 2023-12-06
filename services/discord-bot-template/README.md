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
