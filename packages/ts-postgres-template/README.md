# @puyogg/ts-postgres-template

## Integration Testing

### Locally

```sh
docker compose up -d ts-db-template-test
cd packages/ts-postgres-template
POSTGRES_PORT=35434 pnpm migrate
pnpm test:int-watch
```
