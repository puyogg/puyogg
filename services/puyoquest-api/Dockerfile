ARG NODE_VERSION

FROM node:${NODE_VERSION} as dev
ARG WORKDIR=/app
WORKDIR ${WORKDIR}

RUN npm install -g pnpm@8

COPY .npmrc pnpm-lock.yaml .pnpmfile.cjs ./

COPY patches patches

RUN pnpm fetch

COPY . .
RUN pnpm install -r --offline

FROM dev as ci
RUN pnpm -r build

FROM ci as pruned
ARG WORKDIR
WORKDIR ${WORKDIR}

RUN pnpm --filter @puyogg/puyoquest-api --prod deploy pruned

ARG NODE_VERSION
FROM node:${NODE_VERSION} as production
ARG WORKDIR
WORKDIR ${WORKDIR}

ENV NODE_ENV=production

COPY --from=pruned ${WORKDIR}/pruned .

CMD ["node", "esm/index.js"]
