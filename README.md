# Chatis

Chatis - веб-мессенджер для общения один на один в режиме реального времени.

Проект ведется как учебный продукт, максимально приближенный к коммерческой Scrum-разработке: требования фиксируются в backlog, работа идет через GitHub Issues, небольшие Pull Request и code review.

## Цель MVP

MVP должен покрыть базовый сценарий:

- вход по имени пользователя без регистрации, паролей и JWT;
- список пользователей онлайн;
- личные сообщения один на один;
- историю переписки через REST и TanStack Query;
- новые сообщения через WebSocket;
- сохранение истории в SQLite между перезапусками сервера;
- понятные состояния подключения и восстановления соединения.

## Стек

Frontend:

- React
- TypeScript
- Vite
- shadcn/ui
- Tailwind CSS
- Feature-Sliced Design

Backend:

- Node.js
- TypeScript
- ws
- SQLite
- better-sqlite3

## Локальный запуск

Установить зависимости:

```bash
npm install
cd server && npm install
cd ../client && npm install
```

Запустить бэкенд:

```bash
cd server
npm run dev
```

Запустить фронтенд:

```bash
cd client
npm run dev
```

По умолчанию:

- фронтенд Vite доступен на `http://localhost:5173`;
- WebSocket-сервер доступен на `ws://localhost:3001`;
- имя пользователя передается при подключении как `ws://localhost:3001?username=<username>`.

## Production-like запуск

Для demo deploy используется один Node.js-процесс: сервер отдаёт собранный frontend, healthcheck и WebSocket на одном публичном домене.

Собрать проект:

```bash
npm run render:build
```

Запустить production-сервер:

```bash
npm run render:start
```

Переменные окружения:

- `PORT` - порт HTTP/WebSocket-сервера;
- `DB_PATH` - путь к SQLite-файлу;
- `CLIENT_DIST_PATH` - путь к собранному frontend, если нужно переопределить значение по умолчанию;
- `VITE_WS_URL` - явный WebSocket URL для frontend build, если same-origin подключение не подходит.

Render Blueprint описан в `render.yaml`.

## API и контракты

Фронтенд не должен угадывать API из кода бэкенда. Источники правды:

- [REST OpenAPI contract](docs/api/openapi.yaml)
- [WebSocket AsyncAPI contract](docs/api/asyncapi.yaml)
- [Backend API contract для фронтенда](docs/contracts/backend-api-contract.md)
- [Страница документации](docs/index.html)

Команды для API-документации:

```bash
npm run api:lint
npm run api:docs
npm run api:types:rest
```

Важно: текущий сервер уже поддерживает WebSocket-подключение, online users, private messages и legacy WS-событие `get_history`. Целевая архитектура MVP: история сообщений через REST, новые сообщения через WebSocket.

## Процесс разработки

- [Product Backlog](docs/product-backlog.md)
- [Спринт 1 - Основа](docs/sprints/sprint-1-foundation.md)

Работа идет через GitHub Issues и Pull Request. Для коммитов используется Conventional Commits. Реализация новых функций начинается только после уточнения задачи, зависимостей, acceptance criteria и Definition of Done.
