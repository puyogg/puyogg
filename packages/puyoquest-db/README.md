# @puyogg/ts-postgres-template

## Migrations

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

Integration tests in this package should check the correctness of queries, migrations, and Postgres triggers.

### Locally

```sh
docker compose up -d puyoquest-db
cd packages/puyoquest-db
pnpm build:esm
POSTGRES_HOST=35433 POSTGRES_PORT=35434 pnpm migrate
POSTGRES_HOST=35433 POSTGRES_PORT=35434 pnpm test:int-watch
```
