# syntax = docker/dockerfile:1

# Adjust BUN_VERSION as desired
ARG BUN_VERSION=1.1.34
FROM oven/bun:${BUN_VERSION}-slim as base

# set for base and all layer that inherit from it
ENV NODE_ENV production

LABEL fly_launch_runtime="Remix"

# Set production environment
ENV NODE_ENV="production"

# Install all node_modules, including dev dependencies
FROM base as deps

WORKDIR /app
RUN mkdir -p /temp/dev

ADD package.json bun.lockb .npmrc /temp/dev/
RUN cd /temp/dev && bun install

# Setup production node_modules
FROM base as production-deps

WORKDIR /app
RUN mkdir -p /temp/prod

ADD package.json bun.lockb .npmrc /temp/prod/
RUN cd /temp/prod && bun install --production --ignore-scripts

# Throw-away build stage to reduce size of final image
FROM base as build

WORKDIR /app

# Install packages needed to build node modules
RUN apt-get update -qq && \
    apt-get install --no-install-recommends -y build-essential pkg-config python-is-python3

COPY --from=deps /temp/dev/node_modules /app/node_modules
COPY --from=deps /temp/dev/package.json /app/package.json

ADD . .
RUN bun run build

# Final stage for app image
FROM base

ENV FLY="true"
ENV INTERNAL_PORT="8080"
ENV PORT="8081"
ENV NODE_ENV="production"

WORKDIR /app

COPY --from=production-deps /temp/prod/node_modules /app/node_modules

COPY --from=build /app/server-build /app/server-build
COPY --from=build /app/build /app/build
COPY --from=build /app/package.json /app/package.json

ADD . .

CMD [ "bun", "run", "start" ]
