# Бэклог продукта Chatis

## Видение продукта

Chatis - мессенджер, приближенный к production-проекту, для обучения современной frontend-архитектуре и WebSocket-разработке. Проект должен показывать путь от небольшого realtime MVP к поддерживаемому приложению с понятными границами фич, надежным хранением данных и дисциплинированным процессом разработки через GitHub.

## Текущее состояние

- Frontend: Vite, React, TypeScript, Tailwind, основа shadcn/ui, path alias `@/*`.
- Frontend сейчас показывает только заголовок `Chatis`.
- Backend поднимает WebSocket server на порту `3001`.
- Backend уже поддерживает подключения по username, рассылку online users, private messages, запрос истории и хранение в SQLite.
- Backend build проходит.
- Frontend build сейчас падает из-за TypeScript 6 deprecation по `baseUrl`.
- Frontend lint сейчас падает из-за `button.tsx`, где рядом экспортируются компонент и `buttonVariants`, что нарушает правило React Fast Refresh.
- Локальный Git repository уже инициализирован, но GitHub remote пока не подключен.
- Root README и единая документация по запуску пока отсутствуют.

## Эпики

### EPIC-01 Delivery Foundation

Настроить инженерный процесс через GitHub, стабильный локальный workflow и базовые quality gates.

### EPIC-02 Realtime Messaging MVP

Сделать первый пригодный к использованию messenger flow: вход по username, online users, private chat, отправка сообщений и загрузка истории.

### EPIC-03 Chat User Experience

Сделать мессенджер удобным: понятный layout, состояния сообщений, empty states, состояния соединения и responsive behavior.

### EPIC-04 Backend Reliability and Persistence

Укрепить WebSocket server, хранение сообщений, validation, обработку duplicate sessions и поведение при ошибках.

### EPIC-05 Architecture and FSD Scale

Перевести проект из demo app в поддерживаемую Feature-Sliced Design структуру с общими контрактами и четкими module boundaries.

### EPIC-06 Quality, Testing, and Observability

Добавить автоматические проверки, test coverage, logging и diagnostics на уровне production-like learning project.

## Приоритизированные истории

### CH-001: [Процесс] Инициализировать GitHub repository и project workflow

**Бизнес-контекст**

Chatis должен вестись как коммерческий Scrum-проект. Без GitHub repository, Issues, Projects, Pull Requests и review workflow мы не можем сделать GitHub источником правды.

**Пользовательская история**

Как project owner, я хочу подключить Chatis к GitHub с видимым процессом поставки, чтобы вся работа планировалась, ревьюилась и отслеживалась как в настоящей команде.

**Критерии приемки**

- [ ] Chatis имеет Git repository с remote GitHub repository.
- [ ] Определена default branch.
- [ ] GitHub Issues включены.
- [ ] GitHub Project существует со статусами Backlog, Ready, In Progress, In Review, Done.
- [ ] Созданы labels для type, area и priority.
- [ ] Pull Request workflow задокументирован.

**Вне рамок**

- Реализация product features.
- CI automation.

**Технические заметки**

- Локальный Git repository уже есть.
- Remote пока не подключен.
- Рекомендуемая структура: один product repository с `client` и `server`, если нет осознанной причины разделять.

**Критерии готовности**

- [ ] Repository и GitHub Project видимы.
- [ ] Issue template доступен.
- [ ] Sprint 1 stories созданы как GitHub Issues.

**Story Points**

2

**Метки**

`type:process`, `area:github`, `priority:p0`

**Зависимости**

None.

### CH-002: [Техдолг] Исправить frontend build baseline

**Бизнес-контекст**

Frontend нельзя надежно review'ить и shipping'овать, пока `npm run build` падает. Это блокирует Definition of Done для всех frontend stories.

**Пользовательская история**

Как developer, я хочу, чтобы frontend build проходил, чтобы feature Pull Requests имели надежный quality gate.

**Критерии приемки**

- [ ] `npm run build` проходит в `client`.
- [ ] TypeScript 6 `baseUrl` deprecation решен осознанно.
- [ ] Path alias `@/*` продолжает работать.

**Вне рамок**

- Большой refactor TypeScript configuration.
- CI setup.

**Технические заметки**

- Текущая ошибка: `Option 'baseUrl' is deprecated and will stop functioning in TypeScript 7.0`.
- Возможные решения: убрать ненужный `baseUrl`, если `paths` можно выразить без него, или временно добавить `ignoreDeprecations` с follow-up задачей на migration.

**Критерии готовности**

- [ ] Pull Request связан с Issue.
- [ ] `client` build проходит.
- [ ] Нет unrelated formatting churn.

**Story Points**

1

**Метки**

`type:tech-debt`, `area:frontend`, `priority:p0`

**Зависимости**

CH-001.

### CH-003: [Техдолг] Исправить frontend lint baseline

**Бизнес-контекст**

Lint должен быть надежным quality gate. Текущая ошибка мешает clean reviews и ослабляет командное соглашение по frontend standards.

**Пользовательская история**

Как developer, я хочу, чтобы frontend lint проходил, чтобы Pull Requests ревьюились на чистом baseline.

**Критерии приемки**

- [ ] `npm run lint` проходит в `client`.
- [ ] `buttonVariants` вынесен или lint configuration изменен осознанно.
- [ ] shadcn/ui Button остается importable и usable.

**Вне рамок**

- Замена UI component library.
- Глобальный redesign lint rules.

**Технические заметки**

- Текущая ошибка: `react-refresh/only-export-components` в `client/src/shared/ui/button.tsx`.
- Предпочтительное решение должно сохранить Fast Refresh behavior и понятные shared UI exports.

**Критерии готовности**

- [ ] Pull Request связан с Issue.
- [ ] `client` lint проходит.
- [ ] Статус `client` build указан в PR notes.

**Story Points**

1

**Метки**

`type:tech-debt`, `area:frontend`, `priority:p0`

**Зависимости**

CH-001.

### CH-004: [Процесс] Добавить root developer documentation

**Бизнес-контекст**

Сейчас есть только default Vite README внутри `client`. Production-like learning project нужен root README с объяснением структуры и запуска.

**Пользовательская история**

Как new contributor, я хочу root-level project documentation, чтобы понять и запустить Chatis без reverse engineering.

**Критерии приемки**

- [ ] Root README описывает product goal.
- [ ] README перечисляет frontend и backend stack.
- [ ] README объясняет local setup и run commands.
- [ ] README документирует WebSocket server port и app assumptions.
- [ ] README ссылается на backlog и sprint documentation.

**Вне рамок**

- Полные Architecture Decision Records.
- Deployment documentation.

**Технические заметки**

- README должен быть коротким и contributor-oriented.
- Нужно явно написать, что implementation идет через Issues и Pull Requests.

**Критерии готовности**

- [ ] Pull Request связан с Issue.
- [ ] Documentation соответствует текущим scripts.
- [ ] В PR нет production code changes.

**Story Points**

2

**Метки**

`type:docs`, `area:process`, `priority:p1`

**Зависимости**

CH-001.

### CH-005: [Фича] Экран ввода username

**Бизнес-контекст**

Frontend пока не дает попасть в messenger experience. Экран ввода username - минимальный product step, который делает WebSocket sessions видимыми пользователю.

**Пользовательская история**

Как user, я хочу ввести username перед входом в Chatis, чтобы другие пользователи могли идентифицировать меня в realtime chat.

**Критерии приемки**

- [ ] На first load приложение показывает username form.
- [ ] Username обязателен перед подключением.
- [ ] Есть client-side validation для empty и whitespace-only values.
- [ ] Submitted username хранится в React state.
- [ ] После submit приложение переходит в messenger layout.

**Вне рамок**

- Password authentication.
- Persistent accounts.
- User avatars.

**Технические заметки**

- Код размещать с учетом FSD conventions, не раздувая `App.tsx`.
- Использовать shadcn/ui primitives там, где они уже есть или добавляются focused PR.

**Критерии готовности**

- [ ] Pull Request связан с Issue.
- [ ] Frontend build и lint проходят.
- [ ] Manual test notes покрывают valid и invalid username entry.

**Story Points**

3

**Метки**

`type:feature`, `area:frontend`, `priority:p1`

**Зависимости**

CH-002, CH-003.

### CH-006: [Фича] Lifecycle WebSocket client connection

**Бизнес-контекст**

Frontend нужен надежный WebSocket integration, прежде чем строить chat UI поверх backend events.

**Пользовательская история**

Как user, я хочу, чтобы приложение подключало меня к Chatis server после выбора username, чтобы я мог участвовать в realtime messaging.

**Критерии приемки**

- [ ] Client открывает WebSocket connection к backend с выбранным username.
- [ ] UI показывает connecting, connected, disconnected и error states.
- [ ] Connection закрывается, когда user leaves или меняет session.
- [ ] Invalid server events не ломают приложение.

**Вне рамок**

- Automatic reconnection strategy.
- Offline message queue.

**Технические заметки**

- WebSocket URL не должен быть hardcoded глубоко внутри UI components.
- Рассмотреть небольшой shared client module или feature-level hook.

**Критерии готовности**

- [ ] Pull Request связан с Issue.
- [ ] Frontend build и lint проходят.
- [ ] Manual test notes описывают кейсы server running и server stopped.

**Story Points**

5

**Метки**

`type:feature`, `area:frontend`, `area:websocket`, `priority:p1`

**Зависимости**

CH-005.

### CH-007: [Фича] Список online users

**Бизнес-контекст**

Private messaging требует выбора другого online participant. Backend уже отправляет `users_online`, но frontend это не показывает.

**Пользовательская история**

Как user, я хочу видеть, кто online, чтобы выбрать человека для переписки.

**Критерии приемки**

- [ ] App показывает online users из события `users_online`.
- [ ] Current user исключен из списка или clearly marked.
- [ ] User может выбрать другого online user как active conversation.
- [ ] Empty state показан, когда больше никого online нет.

**Вне рамок**

- Search.
- Avatars.
- Presence states beyond online.

**Технические заметки**

- Selection state держать отдельно от raw server event state.
- Users list не должен быть tightly coupled с message rendering internals.

**Критерии готовности**

- [ ] Pull Request связан с Issue.
- [ ] Frontend build и lint проходят.
- [ ] Manual test notes покрывают two browser sessions.

**Story Points**

3

**Метки**

`type:feature`, `area:frontend`, `area:websocket`, `priority:p1`

**Зависимости**

CH-006.

### CH-008: [Фича] Отправка и получение private messages

**Бизнес-контекст**

Главная ценность Chatis - отправка и получение private realtime messages. Backend это уже поддерживает, frontend experience пока нет.

**Пользовательская история**

Как user, я хочу отправлять и получать private messages в выбранной conversation, чтобы общаться realtime.

**Критерии приемки**

- [ ] User может набрать message для active conversation.
- [ ] Empty messages нельзя отправить.
- [ ] Sent message появляется в conversation.
- [ ] Incoming private messages появляются в правильной conversation.
- [ ] Message bubbles отличают outgoing и incoming messages.

**Вне рамок**

- Delivery/read receipts.
- Typing indicators.
- Attachments.

**Технические заметки**

- Message shape должен совпадать с backend `ChatMessage`.
- UI должен оставаться usable на desktop и mobile widths.

**Критерии готовности**

- [ ] Pull Request связан с Issue.
- [ ] Frontend build и lint проходят.
- [ ] Manual test notes покрывают two active browser sessions.

**Story Points**

5

**Метки**

`type:feature`, `area:frontend`, `area:websocket`, `priority:p1`

**Зависимости**

CH-007.

### CH-009: [Фича] Загрузка истории conversation

**Бизнес-контекст**

SQLite persistence уже есть в backend. Пользователь должен видеть previous private messages при открытии conversation.

**Пользовательская история**

Как user, я хочу видеть previous messages при выборе conversation, чтобы продолжать переписку с прошлого места.

**Критерии приемки**

- [ ] При выборе user отправляется `get_history`.
- [ ] Ответ `chat_history` отображается в chronological order.
- [ ] При switching conversations показывается корректная history для каждого user.
- [ ] Empty history state показан для новых conversations.

**Вне рамок**

- Pagination.
- Infinite scroll.
- History search.

**Технические заметки**

- Backend сейчас сортирует history по `created_at ASC`.
- Client должен избегать duplicate messages при пересечении live events и history.

**Критерии готовности**

- [ ] Pull Request связан с Issue.
- [ ] Frontend build и lint проходят.
- [ ] Manual test notes покрывают reconnect после сохраненных messages.

**Story Points**

5

**Метки**

`type:feature`, `area:frontend`, `area:backend`, `area:websocket`, `priority:p1`

**Зависимости**

CH-008.

### CH-010: [Баг] Обработать duplicate usernames на backend

**Бизнес-контекст**

Backend хранит clients в `Map<string, WebSocket>`. Второе подключение с тем же username перезаписывает первый socket reference, что может ломать delivery и presence behavior.

**Пользовательская история**

Как user, я хочу, чтобы username представлял одну active session, чтобы messages и online status были предсказуемыми.

**Критерии приемки**

- [ ] Backend detects duplicate username connection attempts.
- [ ] Duplicate connection получает понятный error event.
- [ ] Existing connection не перезаписывается silently.
- [ ] Online users list остается корректным после duplicate attempt.

**Вне рамок**

- Multi-device support.
- Authentication.

**Технические заметки**

- Текущая логика вызывает `clients.set(username, socket)` без duplicate handling.
- Нужно выбрать стратегию: reject duplicate или replace previous session; решение описать в PR.

**Критерии готовности**

- [ ] Pull Request связан с Issue.
- [ ] Server build проходит.
- [ ] Manual WebSocket test notes добавлены.

**Story Points**

3

**Метки**

`type:bug`, `area:backend`, `area:websocket`, `priority:p1`

**Зависимости**

CH-001.

### CH-011: [Техдолг] Определить shared WebSocket contracts

**Бизнес-контекст**

Frontend и backend должны говорить на одном event protocol. Сейчас contract живет только в backend types, что повышает риск drift после начала frontend integration.

**Пользовательская история**

Как developer, я хочу shared WebSocket event contracts, чтобы frontend и backend changes оставались type-aligned.

**Критерии приемки**

- [ ] Определен single source of truth для `ClientEvent`, `ServerEvent`, `ChatMessage` и `User`.
- [ ] Frontend использует тот же event contract, что backend, или имеет explicit generated/synced copy.
- [ ] Contract ownership задокументирован.

**Вне рамок**

- Runtime schema validation.
- Monorepo package publishing.

**Технические заметки**

- Возможно потребуется решение по root workspace или shared package.
- Scope держать узким; не restructuring всего проекта в этой story.

**Критерии готовности**

- [ ] Pull Request связан с Issue.
- [ ] Client и server builds проходят.
- [ ] Import boundaries documented.

**Story Points**

5

**Метки**

`type:tech-debt`, `area:architecture`, `area:websocket`, `priority:p2`

**Зависимости**

CH-001, CH-002, CH-003.

### CH-012: [Качество] Добавить минимальную test strategy

**Бизнес-контекст**

Chatis - learning project, но production-like. Команде нужна уверенность в WebSocket behavior и frontend state transitions по мере роста приложения.

**Пользовательская история**

Как Tech Lead, я хочу минимальную test strategy, чтобы critical chat behavior менялся не только через manual testing.

**Критерии приемки**

- [ ] Test approach documented для frontend и backend.
- [ ] Определен хотя бы один backend test target.
- [ ] Определен хотя бы один frontend test target.
- [ ] Follow-up implementation stories созданы, если tooling не добавляется сразу.

**Вне рамок**

- Full E2E suite.
- Performance testing.

**Технические заметки**

- Candidate tools можно обсудить отдельно перед установкой.
- Приоритет: protocol behavior, message persistence и UI state transitions.

**Критерии готовности**

- [ ] Pull Request связан с Issue.
- [ ] Testing decision documented.
- [ ] Follow-up issues существуют для implementation work.

**Story Points**

2

**Метки**

`type:quality`, `area:testing`, `priority:p2`

**Зависимости**

CH-001.
