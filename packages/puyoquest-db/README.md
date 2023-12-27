# @puyogg/ts-postgres-template

## Migrations

I had to write my own migration CLI for postgres.js. These migrations go forwards only (i.e. it will automatically roll back failed transactions, but there's no CLI or anything for manually rolling back specific migrations).

Create a new migration (don't add an extension to migration-name):

```sh
pnpm new-migration <migration-name>
```

Execute migrations (you might need to define `POSTGRES_PORT`):

```sh
pnpm build:esm
pnpm migrate
```

## Integration Testing

### Locally

```sh
docker compose up -d ts-db-template-test
cd packages/ts-postgres-template
pnpm build:esm
POSTGRES_PORT=35434 pnpm migrate
POSTGRES_PORT=35434 pnpm test:int-watch
```
