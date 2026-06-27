# Backend API contract для frontend

Этот документ фиксирует контракт между backend-разработчиком и frontend-разработчиком. Frontend не должен угадывать WebSocket events или REST endpoints из backend-кода.

## Где фиксируем контракт

Контракт фиксируется в трех местах, у каждого места своя роль:

1. `docs/api/openapi.yaml` - machine-readable source of truth для REST.
2. `docs/api/asyncapi.yaml` - machine-readable source of truth для WebSocket/events.
3. `docs/contracts/backend-api-contract.md` - human-readable пояснение решений и ownership.
4. GitHub Issue `CH-021` - задача на согласование и ревью контракта в Sprint 1.
5. Code-level TypeScript types - будут выделены отдельной задачей `CH-011`, когда появится реальная необходимость шарить типы между frontend и backend кодом.

До закрытия `CH-011` frontend реализует интеграцию по `docs/api/openapi.yaml` и `docs/api/asyncapi.yaml`, а backend implementation обязан им соответствовать. Если backend behavior отличается от спецификаций, это считается bug или contract drift.

## Ownership и change process

На текущем этапе Codex эмулирует backend developer role и отвечает за backend contract.

Правила изменения контракта:

- любое изменение WebSocket event или REST endpoint идет через GitHub Issue;
- breaking change нельзя вносить тихо внутри feature PR;
- Pull Request с изменением backend API должен обновлять этот документ;
- frontend-задачи не должны стартовать, если нужный endpoint/event не описан здесь;
- review проверяет не только код, но и соответствие контракту.

Роли:

- Backend owner: Codex в роли backend developer.
- Frontend consumer: пользователь в роли frontend developer.
- Process owner / reviewer: Codex в роли Engineering Manager и Tech Lead.

## Текущее состояние backend

Backend сейчас поднимает WebSocket server на порту `3001`.

```txt
ws://localhost:3001
```

REST endpoint истории сообщений для MVP пока не реализован. До его появления в backend есть legacy WebSocket event `get_history`, но целевая архитектура MVP: history через REST + TanStack Query, новые события через WebSocket.

## Авторизация / подключение пользователя

В MVP нет регистрации, паролей, JWT и server-side accounts.

Пользователь идентифицируется через `username` в query string при открытии WebSocket connection:

```ts
const socket = new WebSocket(
  `ws://localhost:3001?username=${encodeURIComponent(username)}`
)
```

Если `username` отсутствует, backend отправляет error event и закрывает соединение:

```json
{
  "type": "error",
  "payload": {
    "message": "Username is required"
  }
}
```

## Server events

### `users_online`

Backend отправляет событие всем подключенным клиентам после подключения или отключения пользователя.

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

Frontend использует это событие для списка online users.

### `private_message`

Backend отправляет событие отправителю и получателю после сохранения сообщения.

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

Frontend использует это событие только для новых realtime-сообщений.

### `chat_history`

Legacy event. Сейчас backend может вернуть историю через WebSocket в ответ на `get_history`.

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

Для MVP frontend не должен строить целевую загрузку истории на этом событии. История должна быть перенесена на REST endpoint.

### `error`

Backend отправляет ошибку, если не может обработать событие клиента.

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

Frontend отправляет новое private message через WebSocket.

```json
{
  "type": "private_message",
  "payload": {
    "to": "maria",
    "text": "Привет"
  }
}
```

Текущее backend-поведение:

- backend сам проставляет `id`, `from` и `createdAt`;
- backend сохраняет сообщение в SQLite;
- backend отправляет сохраненное сообщение отправителю и получателю;
- третий пользователь не должен получить это событие.

### `get_history`

Legacy event.

```json
{
  "type": "get_history",
  "payload": {
    "withUser": "maria"
  }
}
```

Не использовать как целевое решение для MVP frontend. Эта ответственность должна уйти в REST + TanStack Query.

## Целевой REST contract для истории

Задача backend: CH-013.

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

- Нет REST endpoint истории сообщений.
- Нет явного HTTP health endpoint.
- Duplicate usernames сейчас не обработаны безопасно: повторное подключение может перезаписать socket.
- Backend пока не валидирует empty private message text.
- `get_history` нужно удалить или явно задепрекейтить после REST migration.

Эти gaps уже покрыты backlog stories: CH-010, CH-013, CH-015, CH-020 и CH-011.
