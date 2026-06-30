FROM node:24-bookworm-slim AS client-build

WORKDIR /app/client

COPY client/package*.json ./
RUN npm install

COPY client ./
RUN npm run build

FROM node:24-bookworm-slim AS server-build

WORKDIR /app/server

COPY server/package*.json ./
RUN npm install

COPY server ./
RUN npm run build
RUN npm prune --omit=dev

FROM node:24-bookworm-slim AS runtime

ENV NODE_ENV=production
ENV PORT=3001
ENV DB_PATH=/data/chatis.db
ENV CLIENT_DIST_PATH=/app/client/dist

WORKDIR /app

RUN mkdir -p /data && chown node:node /data

COPY --from=client-build --chown=node:node /app/client/dist /app/client/dist
COPY --from=server-build --chown=node:node /app/server/dist /app/server/dist
COPY --from=server-build --chown=node:node /app/server/node_modules /app/server/node_modules
COPY --from=server-build --chown=node:node /app/server/package*.json /app/server/

USER node

EXPOSE 3001

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=5 \
	CMD node -e "fetch('http://127.0.0.1:3001/api/health').then(response => process.exit(response.ok ? 0 : 1)).catch(() => process.exit(1))"

CMD ["node", "/app/server/dist/index.js"]
