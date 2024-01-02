ARG NODE_VERSION

# "puyogg-node" is an image made in CI
# It continues from /dev/Dockerfile.node, from the "ci" stage
FROM puyogg-node:latest as pruned
ARG WORKDIR
WORKDIR ${WORKDIR}

RUN pnpm --filter @puyogg/puyoquest-api --prod deploy pruned

FROM node:${NODE_VERSION} as production
ARG WORKDIR
WORKDIR ${WORKDIR}

ENV NODE_ENV=production

COPY --from=pruned ${WORKDIR}/pruned .

CMD ["node", "esm/index.js"]
