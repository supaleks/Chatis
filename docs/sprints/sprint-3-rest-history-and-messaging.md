# Sprint 3: REST History & Messaging

## Цель спринта

Разделить responsibilities транспорта: history загружается через REST и TanStack Query, а WebSocket остается каналом realtime-событий.

## Выбранные stories

| Story | Название | Points |
| --- | --- | ---: |
| CH-013 | [Backend] Добавить REST endpoint истории private messages | 5 |
| CH-014 | [Frontend] Подключить TanStack Query baseline | 3 |
| CH-009 | [Фича] Загружать историю conversation через REST и TanStack Query | 5 |

## Оценка

13

## Риски

- Backend может потребовать аккуратного объединения HTTP server и WebSocket upgrade.
- Query key convention нужно определить до реализации history UI.
- Историю нельзя снова завести через legacy WS event `get_history`.

## Заметки по зависимостям

- CH-013 стартует после CH-021 и CH-022, потому что endpoint должен соответствовать OpenAPI contract и проходить validation.
- CH-014 стартует после CH-002, CH-003 и CH-022, чтобы frontend baseline и REST generated types были готовы.
- CH-009 стартует только после CH-007, CH-013 и CH-014: нужен selected conversation, готовый REST endpoint и TanStack Query baseline.
- CH-009 не включает WebSocket message sending; это отдельный realtime flow в CH-008.

## Критерии демо

- REST endpoint возвращает историю private conversation из SQLite.
- Frontend использует TanStack Query для загрузки history.
- При переключении conversation показывается корректная история.
- Manual notes подтверждают, что history не грузится через WebSocket.
