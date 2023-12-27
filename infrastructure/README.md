# @puyogg/infrastructure

The primary Pulumi entrypoint. This monorepo uses a single "Pulumi project" with "stacks" for dev and prod.

Each package that depends on infra should export an "infra" folder that declares its resources, and then gets imported into `@puyogg/infrastructure`. **Note:** exports declared in those packages are NOT resurfaced as [Pulumi Stack Outputs](https://www.pulumi.com/learn/building-with-pulumi/stack-outputs/) in @puyogg/infrastructure unless you reexport them in this folder's [index.ts](./index.ts).
