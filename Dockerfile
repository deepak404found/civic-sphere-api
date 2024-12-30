FROM node:latest as nodemodules

RUN mkdir -p /usr/src
WORKDIR /usr/src

COPY package.json /usr/src/package.json
COPY pnpm-lock.yaml /usr/src/pnpm-lock.yaml

RUN npm install -g pnpm

RUN pnpm install

# Path: Dockerfile
FROM nodemodules as build

COPY . /usr/src

ENV NODE_ENV=production
ENV PORT=3001
ENV PG_HOST=172.27.153.152

# RUN pnpm migrate:generate

RUN pnpm run build

EXPOSE 3001

ENTRYPOINT [ "pnpm", "run", "start" ]
