# Sprint 4: Realtime-сообщения и гарантии бэкенда

## Цель спринта

Довести основной realtime chat loop до MVP: зафиксировать гарантии бэкенда для WebSocket, обработать duplicate usernames, реализовать отправку новых личных сообщений и синхронизировать их с кэшем TanStack Query.

## Выбранные задачи

| Задача | Название | Оценка |
| --- | --- | ---: |
| CH-010 | [Баг] Обработать duplicate usernames на backend | 3 |
| CH-020 | [Backend] Валидировать private message payload и приватную доставку | 3 |
| CH-008 | [Фича] Отправка и получение новых private messages по WebSocket | 5 |
| CH-016 | [Frontend] Синхронизировать TanStack Query cache с новыми WS messages | 3 |

## Оценка

14

## Риски

- Синхронизация кэша может породить duplicate messages, если не использовать стабильный `message.id`.
- Обработка duplicate username должна быть определена до reconnect story, иначе восстановление connection может вести себя непредсказуемо.
- Backend validation должна сохранить текущий SQLite persistence и не сломать private delivery.

## Заметки по зависимостям

- CH-010 стартует после CH-006 и CH-021: нужно понимать базовый lifecycle и зафиксированный username contract.
- CH-020 стартует после CH-006, CH-021 и CH-022: валидация должна соответствовать WS-контракту.
- CH-008 стартует после CH-007 и CH-020: frontend отправки должен опираться на выбранный диалог и backend validation/private delivery guarantees.
- CH-016 стартует после CH-008, CH-009 и CH-014: синхронизация кэша имеет смысл только после REST history, TanStack Query baseline и realtime messages.

## Критерии демо

- Два пользователя обмениваются личными сообщениями в realtime.
- Третий online user не получает чужие личные сообщения.
- Новые WS-сообщения не дублируются с REST history.
- Duplicate username behavior предсказуем и вручную проверен.
