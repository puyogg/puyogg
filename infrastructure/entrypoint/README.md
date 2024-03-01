# @puyogg/infra-entrypoint

The primary Pulumi entrypoint.

Each package that depends on infra should export an "infra" folder that declares its resources, and then gets imported into `@puyogg/infrastructure`. **Note:** exports declared in those packages are NOT resurfaced as [Pulumi Stack Outputs](https://www.pulumi.com/learn/building-with-pulumi/stack-outputs/) in @puyogg/infrastructure unless you reexport them in this folder's [index.ts](./index.ts).

## Setup

- [awsume](https://awsu.me/): Pulumi depends on having AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY and other env vars exported in the shell. `awsume` is pretty convenient for doing this for assumed roles.
- [Pulumi](https://www.pulumi.com/docs/install/)

## TypeScript ESM

Pulumi seems to support TypeScript CJS, and JavaScript ESM, but not TypeScript written as ESM.

Before running Pulumi you should build this package and its dependencies first.

```bash
pnpm -r build:esm
awsume puyogg-dev
pulumi preview
```

We want ESM because that's what our other workspace dependencies are written in, and also because Pulumi's methods work better with top-level await.

## Watch Mode

From the root of the monorepo, build once so TypeScript doesn't complain about the initial graph.

Then use pnpm's filtering to run watch mode for this package and its workspace dependencies:

```bash
pnpm --filter @puyogg/infra-entrypoint... --no-sort --workspace-concurrency Infinity watch:esm
```

- `...` suffix: Matches the current package and its workspace dependencies https://pnpm.io/filtering#--filter-package_name-1
- `--no-sort`: By default, pnpm waits for successful exit codes in parent packages before executing the command in dependents. This lets them all run at once. This is also why you need an initial build.

## Future work

Maybe split into multiple pulumi projects? But I haven't figured out yet the logistics of running multiple `pulumi up` and `pulumi preview` in GitHub Actions.
