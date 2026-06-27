# Бэклог продукта Chatis

## Видение продукта

Chatis - веб-мессенджер для общения один на один в режиме реального времени. Проект ведется как production-like учебный продукт: требования, backlog, GitHub Issues, Pull Requests, code review, тестирование и выпуск MVP проходят по процессу, похожему на коммерческую Scrum-команду.

## MVP Scope

В MVP входит:

- вход по имени пользователя;
- локальное сохранение имени и auto-connect;
- список пользователей online с realtime-обновлением;
- выбор собеседника и личные сообщения один на один;
- загрузка истории переписки через REST и TanStack Query;
- новые сообщения через WebSocket;
- хранение истории в SQLite между перезапусками сервера;
- понятные состояния подключения, потеря соединения и reconnect.

Не входит в MVP:

- регистрация, пароли, JWT;
- группы, каналы, звонки, голосовые сообщения;
- поиск, файлы, редактирование и удаление сообщений;
- реакции, уведомления, полноценная мобильная версия.

## Текущее состояние

- GitHub repository: `supaleks/Chatis`.
- GitHub Project: `Chatis Scrum Board`.
- Backend уже содержит WebSocket server, online users, private messages, SQLite persistence и repository layer.
- Frontend подготовлен на React, TypeScript, Vite, Tailwind, shadcn/ui и FSD-структуре, но product UI еще не реализован.
- История сообщений в целевой архитектуре должна идти через REST + TanStack Query, а WebSocket должен отвечать за realtime-события.

## Эпики

### EPIC-01 Delivery Foundation

GitHub workflow, baseline build/lint, документация и Definition of Done.

### EPIC-02 Authentication and Session

Вход по имени, session state, local username persistence и auto-connect.

### EPIC-03 Messenger Shell and Presence

Messenger layout, список online users, выбор active conversation и empty states.

### EPIC-04 History over REST

REST endpoint истории, TanStack Query baseline и загрузка истории conversation.

### EPIC-05 Realtime Private Messaging

Отправка и получение новых private messages через WebSocket, синхронизация с cache.

### EPIC-06 Connection Reliability

Статусы соединения, потеря связи, controlled reconnect и защита от duplicate sockets.

### EPIC-07 Backend Hardening and Contracts

Validation, duplicate usernames, privacy guarantees, protocol cleanup и shared REST/WS contracts.

### EPIC-08 Quality Strategy

Минимальная стратегия тестирования frontend/backend critical paths.

## Product Backlog

| Order | Issue | Story | Epic | Points | Sprint | Dependencies |
| ---: | --- | --- | --- | ---: | --- | --- |
| 1 | CH-001 | [Процесс] Инициализировать GitHub repository и project workflow | EPIC-01 | 2 | Sprint 1 | None |
| 2 | CH-021 | [Контракт] Зафиксировать Backend API contract для frontend-разработки | EPIC-01 | 2 | Sprint 1 | CH-001 |
| 3 | CH-022 | [Инструмент] Добавить validation и generation для API contracts | EPIC-08 | 3 | Sprint 1 | CH-021 |
| 4 | CH-002 | [Техдолг] Исправить frontend build baseline | EPIC-01 | 1 | Sprint 1 | CH-001 |
| 5 | CH-003 | [Техдолг] Исправить frontend lint baseline | EPIC-01 | 1 | Sprint 1 | CH-001 |
| 6 | CH-004 | [Процесс] Добавить root developer documentation | EPIC-01 | 2 | Sprint 1 | CH-001, CH-021, CH-022 |
| 7 | CH-005 | [Фича] Авторизация по имени пользователя | EPIC-02 | 3 | Sprint 1 | CH-002, CH-003, CH-021 |
| 8 | CH-017 | [Frontend] Собрать desktop-first messenger layout shell | EPIC-03 | 3 | Sprint 2 | CH-005 |
| 9 | CH-006 | [Фича] WebSocket lifecycle для realtime-событий | EPIC-06 | 5 | Sprint 2 | CH-005, CH-021, CH-022 |
| 10 | CH-019 | [Frontend] Сохранять username локально и выполнять auto-connect | EPIC-02 | 3 | Sprint 2 | CH-005, CH-006 |
| 11 | CH-007 | [Фича] Список online users и выбор conversation | EPIC-03 | 3 | Sprint 2 | CH-006, CH-017 |
| 12 | CH-013 | [Backend] Добавить REST endpoint истории private messages | EPIC-04 | 5 | Sprint 3 | CH-021, CH-022 |
| 13 | CH-014 | [Frontend] Подключить TanStack Query baseline | EPIC-04 | 3 | Sprint 3 | CH-002, CH-003, CH-022 |
| 14 | CH-009 | [Фича] Загружать историю conversation через REST и TanStack Query | EPIC-04 | 5 | Sprint 3 | CH-007, CH-013, CH-014 |
| 15 | CH-010 | [Баг] Обработать duplicate usernames на backend | EPIC-07 | 3 | Sprint 4 | CH-006, CH-021 |
| 16 | CH-020 | [Backend] Валидировать private message payload и приватную доставку | EPIC-07 | 3 | Sprint 4 | CH-006, CH-021, CH-022 |
| 17 | CH-008 | [Фича] Отправка и получение новых private messages по WebSocket | EPIC-05 | 5 | Sprint 4 | CH-007, CH-020 |
| 18 | CH-016 | [Frontend] Синхронизировать TanStack Query cache с новыми WS messages | EPIC-05 | 3 | Sprint 4 | CH-008, CH-009, CH-014 |
| 19 | CH-018 | [Frontend] Обработать reconnect, потерю и восстановление WebSocket connection | EPIC-06 | 5 | Sprint 5 | CH-006, CH-010, CH-019, CH-020 |
| 20 | CH-015 | [Техдолг] Убрать history loading из WebSocket protocol | EPIC-07 | 2 | Sprint 5 | CH-009, CH-013, CH-014, CH-016 |
| 21 | CH-011 | [Техдолг] Определить shared REST и WebSocket contracts | EPIC-07 | 5 | Sprint 5 | CH-015, CH-021, CH-022 |
| 22 | CH-012 | [Качество] Добавить минимальную test strategy | EPIC-08 | 2 | Sprint 5 | CH-006, CH-008, CH-009, CH-018 |

## Backlog Refinement - 2026-06-27

- Контрактные задачи `CH-021` и `CH-022` стоят перед frontend integration work: frontend должен видеть REST/WS contracts и команды validation до реализации WS/REST клиентов.
- `CH-010` перенесена в Sprint 4 перед reconnect: duplicate username behavior влияет на повторное подключение и auto-connect.
- `CH-018` перенесена в Sprint 5: reconnect должен опираться на готовый базовый lifecycle, auto-connect, duplicate handling и backend validation.
- `CH-020` идет перед `CH-008`: frontend message composer должен интегрироваться с backend, где уже явно зафиксированы validation и private delivery guarantees.
- `CH-015` и `CH-011` остаются после REST history/cache sync: legacy `get_history` нельзя убирать до полной миграции history на REST + TanStack Query.

## Sprint Plan

| Sprint | Goal | Points |
| --- | --- | ---: |
| Sprint 1 - Foundation | Настроить процесс, API contracts/tooling и разблокировать первый frontend user slice. | 14 |
| Sprint 2 - Messenger Shell & Connection | Собрать shell, подключение, online users и auto-connect. | 14 |
| Sprint 3 - REST History & Messaging | Подготовить REST history и TanStack Query loading. | 13 |
| Sprint 4 - Realtime Messaging & Backend Guarantees | Реализовать private messages, cache sync, duplicate username handling и backend validation. | 14 |
| Sprint 5 - Reliability & Technical Hardening | Закрыть reconnect, protocol cleanup, shared contracts и test strategy. | 14 |

## Управление в GitHub

- GitHub Issues являются источником правды для задач.
- GitHub Milestones используются как sprint milestones.
- Label `release:mvp` используется для фильтрации задач MVP, потому что GitHub Issue поддерживает только один milestone.
- API surface фиксируется в `docs/api/openapi.yaml` и `docs/api/asyncapi.yaml`; markdown используется только для пояснений и ownership.
- Каждая задача должна идти через Pull Request и ссылаться на Issue.
- Реализация не начинается, пока backlog и Sprint 1 не согласованы.
