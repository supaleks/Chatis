# Sprint 2: Messenger Shell & Connection

## Цель спринта

Собрать первый рабочий messenger shell после входа, подключить WebSocket lifecycle, показать online users и подготовить auto-connect по сохраненному username.

## Выбранные stories

| Story | Название | Points |
| --- | --- | ---: |
| CH-017 | [Frontend] Собрать desktop-first messenger layout shell | 3 |
| CH-006 | [Фича] WebSocket lifecycle для realtime-событий | 5 |
| CH-007 | [Фича] Список online users и выбор conversation | 3 |
| CH-019 | [Frontend] Сохранять username локально и выполнять auto-connect | 3 |

## Оценка

14

## Риски

- WebSocket lifecycle может разрастись, если в него случайно добавить reconnect logic из CH-018.
- Layout shell должен остаться shell, без преждевременной реализации history и message composer.
- Auto-connect зависит от аккуратного session ownership, иначе легко получить duplicate sockets.
- Duplicate username backend handling закрывается позже в CH-010, поэтому Sprint 2 должен ограничиться controlled client cleanup и не обещать полноценную защиту от конкурирующих сессий.

## Заметки по зависимостям

- CH-017 стартует после CH-005 и не зависит от WebSocket.
- CH-006 стартует после CH-005, CH-021 и CH-022, чтобы frontend использовал зафиксированный WS contract.
- CH-019 стартует после CH-006, потому что auto-connect должен использовать тот же lifecycle.
- CH-007 стартует после CH-006 и CH-017: нужен и realtime users event, и место в layout для списка.

## Критерии демо

- После входа виден desktop-first messenger layout.
- Приложение показывает состояние WebSocket connection.
- Две browser sessions видят друг друга в online users.
- Username восстанавливается после reload и запускает auto-connect.
