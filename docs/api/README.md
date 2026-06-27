# API-контракты Chatis

API-контракт фиксируется не в markdown, а в машиночитаемых спецификациях:

- `openapi.yaml` - REST-контракт для эндпоинтов истории.
- `asyncapi.yaml` - WebSocket-контракт для realtime-событий.

Markdown-документы могут объяснять решения, но источник правды для API-поверхности - эти YAML-файлы.

## Решение по инструментам

- REST: OpenAPI.
- WebSocket/events: AsyncAPI.
- Генерация REST-типов TypeScript: `openapi-typescript`.
- Валидация AsyncAPI: `@asyncapi/parser` через локальный скрипт `scripts/validate-asyncapi.mjs`.

## Команды

Команды запускаются из корня проекта:

```bash
npm run api:lint
npm run api:types:rest
npm run api:docs
```

## Текущие сгенерированные артефакты

- `client/src/shared/api/generated/openapi-schema.ts` - сгенерированные REST-типы из `docs/api/openapi.yaml`.
- `docs/index.html` - локальная точка входа в документацию.
- `docs/viewer.html` - локальный просмотрщик markdown для продуктовых и процессных документов.
- `docs/api/index.html` - локальный индекс API-документации.
- `docs/api/openapi.html` - локальная OpenAPI-страница для REST-эндпоинтов.
- `docs/api/openapi-data.js` - сгенерированный файл данных для `openapi.html`.
- `docs/api/asyncapi.html` - локальная WebSocket API-страница для frontend-разработки.
- `docs/api/asyncapi-data.js` - сгенерированный файл данных для `asyncapi.html`.

## Локальные API-страницы

- `docs/index.html` - общая точка входа в документацию проекта.
- `docs/api/index.html` - точка входа в API-документацию.
- `docs/api/openapi.html` - REST/OpenAPI-документация.
- `docs/api/asyncapi.html` - WebSocket/AsyncAPI-документация.
- `docs/api/openapi.yaml` - исходник REST-контракта.
- `docs/api/asyncapi.yaml` - исходник WebSocket-контракта.

## Проверка live-контракта

Проверено локально против текущего бэкенда на `ws://localhost:3001`:

- WebSocket-подключение с `?username=<username>` работает.
- `users_online` приходит при подключении пользователей.
- `private_message` доставляется отправителю и получателю.
- Legacy `get_history` возвращает `chat_history`.
- REST `GET /api/messages/private` пока не реализован; текущий сервер только с WS отвечает `426 Upgrade Required`.

REST-эндпоинт истории должен быть реализован в `CH-013`.
