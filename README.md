# @puyogg/puyogg

🔴🟢🔵🟡🟣🏳️‍🌈

## Local Development Setup

### Tooling

You will need these tools installed:

- Node v20
- pnpm v8 (try `npm install -g pnpm@8`)
- Docker Desktop v4.24+
- (Optional) Pulumi CLI

If you're new to web development and need more installation help, see: TODO

### Running a service

Install dependencies and compile TypeScript

```sh
pnpm install
pnpm -r build
```

(Re)build and start a service

```sh
docker compose up --build -d yotarou
```

## Contributing

### Unit and Integration Tests

Unit tests can be run directly in individual packages.

```sh
# From the root directory, you can use pnpm's --filter option.
pnpm --filter @puyogg/yotarou unit-test [optional/path/to/specific/spec/file]

# Or navigate to the directory first
cd services/yotarou
pnpm unit-test [optional/path/to/specific/spec/file]
```
