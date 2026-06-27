# Sprint 5: Reliability & Technical Hardening

## Цель спринта

Закрыть надежность и технические хвосты MVP: reconnect, cleanup legacy history protocol, shared contracts и минимальную test strategy.

## Выбранные stories

| Story | Название | Points |
| --- | --- | ---: |
| CH-018 | [Frontend] Обработать reconnect, потерю и восстановление WebSocket connection | 5 |
| CH-015 | [Техдолг] Убрать history loading из WebSocket protocol | 2 |
| CH-011 | [Техдолг] Определить shared REST и WebSocket contracts | 5 |
| CH-012 | [Качество] Добавить минимальную test strategy | 2 |

## Оценка

14

## Риски

- Reconnect logic не должен создавать несколько WebSocket connections для одного username.
- Удаление `get_history` должно происходить только после полной миграции history на REST.
- Shared contracts не должны превращаться в большой restructuring проекта.
- Test strategy должна привести к понятным follow-up задачам, если tooling не добавляется сразу.

## Заметки по зависимостям

- CH-018 стартует после CH-006, CH-010, CH-019 и CH-020: нужен базовый WS lifecycle, auto-connect, duplicate handling и backend validation.
- CH-015 стартует после CH-009, CH-013, CH-014 и CH-016: history уже должна жить в REST/TanStack Query, а cache sync не должен зависеть от legacy `get_history`.
- CH-011 стартует после CH-015, CH-021 и CH-022: shared contracts фиксируются после cleanup целевого protocol surface.
- CH-012 стартует после CH-006, CH-008, CH-009 и CH-018: strategy должна покрыть реальные critical paths, а не абстрактные планы.

## Критерии демо

- После server stopped -> server started UI показывает восстановление connection.
- REST/WS split задокументирован и отражен в contracts.
- `get_history` не является целевым MVP protocol.
- Есть минимальная test strategy для critical paths.
