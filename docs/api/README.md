# Chatis API contracts

API contract фиксируется не в markdown, а в machine-readable спецификациях:

- `openapi.yaml` - REST contract для history endpoints.
- `asyncapi.yaml` - WebSocket contract для realtime events.

Markdown-документы могут объяснять решения, но source of truth для API surface - эти YAML-файлы.

## Tooling decision

- REST: OpenAPI.
- WebSocket/events: AsyncAPI.
- REST TypeScript generation: `openapi-typescript`.
- AsyncAPI validation: `@asyncapi/parser` через локальный script `scripts/validate-asyncapi.mjs`.

## Commands

Команды запускаются из корня проекта:

```bash
npm run api:lint
npm run api:types:rest
npm run api:docs
```

## Current generated artifacts

- `client/src/shared/api/generated/openapi-schema.ts` - generated REST types from `docs/api/openapi.yaml`.
- `docs/index.html` - local documentation entrypoint.
- `docs/viewer.html` - local markdown viewer for product/process documents.
- `docs/api/index.html` - local API documentation index.
- `docs/api/openapi.html` - local OpenAPI documentation page for REST endpoints.
- `docs/api/openapi-data.js` - generated data file for `openapi.html`.
- `docs/api/asyncapi.html` - local WebSocket API page for frontend development.
- `docs/api/asyncapi-data.js` - generated data file for `asyncapi.html`.

## Local API pages

- `docs/index.html` - full project documentation entrypoint.
- `docs/api/index.html` - API documentation entrypoint.
- `docs/api/openapi.html` - REST/OpenAPI documentation.
- `docs/api/asyncapi.html` - WebSocket/AsyncAPI documentation.
- `docs/api/openapi.yaml` - REST contract source.
- `docs/api/asyncapi.yaml` - WebSocket contract source.

## Live contract check

Проверено локально против текущего backend на `ws://localhost:3001`:

- WebSocket connection с `?username=<username>` работает.
- `users_online` приходит при подключении пользователей.
- `private_message` доставляется отправителю и получателю.
- Legacy `get_history` возвращает `chat_history`.
- REST `GET /api/messages/private` пока не реализован; текущий WS-only server отвечает `426 Upgrade Required`.

REST history endpoint должен быть реализован в `CH-013`.
