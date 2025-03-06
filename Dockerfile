ARG NODE_IMAGE=node:22-alpine
FROM ${NODE_IMAGE} AS base
WORKDIR /app
COPY package.json package-lock.json ./
RUN \
    if [ -f yarn.lock ]; then yarn --frozen-lockfile; \
    elif [ -f package-lock.json ]; then npm ci; \
    elif [ -f pnpm-lock.yaml ]; then yarn global add pnpm && pnpm i --frozen-lockfile; \
    else echo "Lockfile not found." && exit 1; \
    fi

FROM base AS builder
WORKDIR /source
COPY --from=base /app/node_modules ./node_modules
COPY . .

FROM base AS runner
WORKDIR /app
ENV NODE_ENV=production

COPY --from=builder --chown=node:node ["/source/package.json", "/source/package-lock.json*", "/source/tsconfig*.json", "./"]
COPY --from=builder --chown=node:node ["/source/src", "./src"]
USER node

EXPOSE 8000
ENV PORT=8000

CMD [ "npm", "start" ]
