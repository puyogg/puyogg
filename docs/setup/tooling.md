# Tooling

Here's what you need to develop for this repo. I'll try to provide instructions for both Mac and [WSL](https://learn.microsoft.com/en-us/windows/wsl/install).

## Basic dev stuff

- [Git](https://git-scm.com/)
- An IDE or code editor. Suggestion: [VS Code](https://code.visualstudio.com/)

## JavaScript/TypeScript development

### Node v20

Node will exist in two "places" when you're developing locally: on your host computer, and inside the Docker containers. Your host Node.js version should match the image the containers use, which right now is Node.js v20.

I recommend installing Node.js through [nvm](https://github.com/nvm-sh/nvm)

### pnpm v8

[pnpm](https://pnpm.io/) is a JavaScript package manager. After Node.js is installed, you can install pnpm globally:

```sh
npm install -g pnpm@8
```

### Docker Desktop v4.24+

[Docker](https://docs.docker.com/get-started/overview/) is a tool for developing containerized apps. Developing code this way helps guarantee that the code you write is deployable and works on more than just your machine. It also helps with simulating infrastructure (e.g. databases) or networking details that would normally be tedious to set up yourself.

You can download Docker Desktop here: https://www.docker.com/products/docker-desktop/

For other Unix users, I recommend getting a Docker CLI + Docker Compose plugin version that at least supports [Docker Compose Watch](https://docs.docker.com/compose/file-watch/)

## Infrastructure Development

Note: Only a few people will be allowed to manage infrastructure

This repo uses [Pulumi](https://www.pulumi.com/) for declaring and deploying infrastructure to AWS. For the most part, you don't need this installed yourself. When you make a pull request, the [test.yml](/.github/workflows/test.yml) workflow will run [`pulumi preview`](https://www.pulumi.com/docs/cli/commands/pulumi_preview/).

If you do need Pulumi CLI installed though, see https://www.pulumi.com/docs/install/. (Use the Linux instructions for WSL).
