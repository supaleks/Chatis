# API-контракт бэкенда для фронтенда

Этот документ фиксирует контракт между бэкенд-разработчиком и фронтенд-разработчиком. Фронтенд не должен угадывать WebSocket-события или REST-эндпоинты из кода бэкенда.

## Где фиксируем контракт

Контракт фиксируется в трех местах, у каждого места своя роль:

1. `docs/api/openapi.yaml` - машиночитаемый источник правды для REST.
2. `docs/api/asyncapi.yaml` - машиночитаемый источник правды для WebSocket/events.
3. `docs/contracts/backend-api-contract.md` - человекочитаемое пояснение решений и ownership.
4. GitHub Issue `CH-021` - задача на согласование и ревью контракта в Спринте 1.
5. TypeScript-типы на уровне кода - будут выделены отдельной задачей `CH-011`, когда появится реальная необходимость шарить типы между фронтендом и бэкендом.

До закрытия `CH-011` фронтенд реализует интеграцию по `docs/api/openapi.yaml` и `docs/api/asyncapi.yaml`, а реализация бэкенда обязана им соответствовать. Если поведение бэкенда отличается от спецификаций, это считается багом или расхождением контракта.

## Ownership и процесс изменений

На текущем этапе Codex эмулирует роль бэкенд-разработчика и отвечает за контракт бэкенда.

Правила изменения контракта:

- любое изменение WebSocket-события или REST-эндпоинта идет через GitHub Issue;
- breaking change нельзя вносить тихо внутри feature PR;
- Pull Request с изменением backend API должен обновлять этот документ;
- frontend-задачи не должны стартовать, если нужный endpoint/event не описан здесь;
- review проверяет не только код, но и соответствие контракту.

Роли:

- Backend owner: Codex в роли бэкенд-разработчика.
- Frontend consumer: пользователь в роли фронтенд-разработчика.
- Process owner / reviewer: Codex в роли Engineering Manager и Tech Lead.

## Текущее состояние бэкенда

Бэкенд сейчас поднимает WebSocket-сервер на порту `3001`.

```txt
ws://localhost:3001
```

REST-эндпоинт истории сообщений для MVP пока не реализован. До его появления в бэкенде есть legacy WebSocket-событие `get_history`, но целевая архитектура MVP такая: история через REST + TanStack Query, новые события через WebSocket.

### Статус проверки контракта

Контракт проверен по текущим backend source files:

- `server/src/index.ts` - runtime-поведение WebSocket-сервера;
- `server/src/types/chat.ts` - TypeScript-типы событий и payload;
- `server/src/repositories/message.repository.ts` - порядок и формат истории сообщений.

Проверенное поведение:

- WebSocket-сервер слушает `ws://localhost:3001`;
- `username` читается из query string при подключении;
- отсутствие `username` возвращает `error` и закрывает socket;
- `users_online` отправляется всем клиентам после подключения и отключения пользователя;
- `private_message` сохраняется в SQLite и отправляется отправителю и получателю;
- legacy `get_history` возвращает `chat_history`;
- REST endpoint `GET /api/messages/private` пока является целевым контрактом, а не текущей реализацией.

Если backend implementation расходится с этим документом, `docs/api/openapi.yaml` или `docs/api/asyncapi.yaml`, это считается contract drift и должно идти отдельной задачей или bug ticket.

## Авторизация / подключение пользователя

В MVP нет регистрации, паролей, JWT и server-side accounts.

Пользователь идентифицируется через `username` в query string при открытии WebSocket-подключения:

```ts
const socket = new WebSocket(
  `ws://localhost:3001?username=${encodeURIComponent(username)}`
)
```

Если `username` отсутствует, бэкенд отправляет событие ошибки и закрывает соединение:

```json
{
  "type": "error",
  "payload": {
    "message": "Username is required"
  }
}
```

## Quick reference для frontend-разработчика

Минимальный сценарий интеграции для MVP:

1. Получить `username` из frontend session state.
2. Открыть WebSocket:

```ts
const socket = new WebSocket(
  `ws://localhost:3001?username=${encodeURIComponent(username)}`
)
```

3. Слушать server events:

- `users_online` - обновить список online users;
- `private_message` - добавить новое realtime-сообщение в активный диалог или cache;
- `error` - показать пользователю понятное состояние ошибки;
- `chat_history` - legacy only, не использовать как целевой источник истории в MVP.

4. Отправлять новое личное сообщение через WebSocket event `private_message`.
5. Загружать историю диалога через целевой REST endpoint `GET /api/messages/private` после реализации `CH-013`.

Фронтенд не должен читать backend source code для интеграции. Если нужный event или endpoint не описан в этом документе, `docs/api/openapi.yaml` или `docs/api/asyncapi.yaml`, задачу нужно вернуть на refinement.

## Server events

### `users_online`

Бэкенд отправляет событие всем подключенным клиентам после подключения или отключения пользователя.

```json
{
  "type": "users_online",
  "payload": [
    {
      "username": "alex"
    },
    {
      "username": "maria"
    }
  ]
}
```

Фронтенд использует это событие для списка пользователей онлайн.

### `private_message`

Бэкенд отправляет событие отправителю и получателю после сохранения сообщения.

```json
{
  "type": "private_message",
  "payload": {
    "id": "uuid",
    "from": "alex",
    "to": "maria",
    "text": "Привет",
    "createdAt": "2026-06-27T10:00:00.000Z"
  }
}
```

Фронтенд использует это событие только для новых realtime-сообщений.

### `chat_history`

Legacy-событие. Сейчас бэкенд может вернуть историю через WebSocket в ответ на `get_history`.

```json
{
  "type": "chat_history",
  "payload": [
    {
      "id": "uuid",
      "from": "alex",
      "to": "maria",
      "text": "Привет",
      "createdAt": "2026-06-27T10:00:00.000Z"
    }
  ]
}
```

Для MVP фронтенд не должен строить целевую загрузку истории на этом событии. История должна быть перенесена на REST-эндпоинт.

### `error`

Бэкенд отправляет ошибку, если не может обработать событие клиента.

```json
{
  "type": "error",
  "payload": {
    "message": "Invalid message format"
  }
}
```

## Client events

### `private_message`

Фронтенд отправляет новое личное сообщение через WebSocket.

```json
{
  "type": "private_message",
  "payload": {
    "to": "maria",
    "text": "Привет"
  }
}
```

Текущее поведение бэкенда:

- бэкенд сам проставляет `id`, `from` и `createdAt`;
- бэкенд сохраняет сообщение в SQLite;
- бэкенд отправляет сохраненное сообщение отправителю и получателю;
- третий пользователь не должен получить это событие.

### `get_history`

Legacy-событие.

```json
{
  "type": "get_history",
  "payload": {
    "withUser": "maria"
  }
}
```

Не использовать как целевое решение для MVP-фронтенда. Эта ответственность должна уйти в REST + TanStack Query.

## Целевой REST contract для истории

Задача бэкенда: CH-013.

Предлагаемый endpoint:

```txt
GET /api/messages/private?user=<currentUsername>&with=<peerUsername>
```

Успешный ответ:

```json
[
  {
    "id": "uuid",
    "from": "alex",
    "to": "maria",
    "text": "Привет",
    "createdAt": "2026-06-27T10:00:00.000Z"
  }
]
```

Требования к endpoint:

- `user` обязателен;
- `with` обязателен;
- ответ отсортирован по `createdAt ASC`;
- формат сообщения совпадает с WebSocket `private_message.payload`;
- endpoint не требует JWT в MVP;
- ошибки validation возвращаются понятным JSON payload.

## TypeScript contracts

```ts
export type User = {
  username: string
}

export type ChatMessage = {
  id: string
  from: string
  to: string
  text: string
  createdAt: string
}

export type ServerEvent =
  | { type: 'users_online'; payload: User[] }
  | { type: 'private_message'; payload: ChatMessage }
  | { type: 'chat_history'; payload: ChatMessage[] }
  | { type: 'error'; payload: { message: string } }

export type ClientEvent =
  | { type: 'private_message'; payload: { to: string; text: string } }
  | { type: 'get_history'; payload: { withUser: string } }
```

## Известные contract gaps

| Gap | Влияние на frontend | Backlog story |
| --- | --- | --- |
| Нет REST endpoint истории сообщений. | Фронтенд пока не может реализовать целевую загрузку истории через TanStack Query. | CH-013 |
| Duplicate usernames сейчас не обработаны безопасно: повторное подключение может перезаписать socket. | Reconnect и auto-connect могут вести себя неоднозначно. | CH-010 |
| Бэкенд пока не валидирует empty private message text и неполный payload. | Фронтенд должен валидировать форму, но backend guarantee еще не зафиксирована кодом. | CH-020 |
| Legacy `get_history` все еще есть в WebSocket protocol. | Фронтенд может случайно использовать нецелевой flow истории. | CH-015 |
| Shared code-level REST/WS contracts еще не выделены. | Пока источники правды - OpenAPI, AsyncAPI и этот markdown-документ. | CH-011 |

Что не является blocker для `CH-021`:

- реализация REST endpoint истории;
- удаление legacy `get_history`;
- создание shared package;
- frontend WebSocket integration.

Эти работы остаются в отдельных backlog stories и не входят в scope human-readable backend API contract.
