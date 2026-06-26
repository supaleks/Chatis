# Критерии готовности

## Общий Definition of Done

Story в Chatis считается завершенной только если выполнены все условия:

- GitHub Issue существует и содержит бизнес-контекст, user story, acceptance criteria, out of scope, technical notes, story points, labels и dependencies.
- Реализация выполнена через Pull Request, связанный с Issue.
- Pull Request содержит понятное описание, скриншоты или запись экрана для UI-изменений и заметки по проверке.
- Код соответствует стеку проекта: React, TypeScript, Vite, shadcn/ui, Tailwind, Feature-Sliced Design, Node.js, ws, SQLite, better-sqlite3.
- TypeScript build проходит для затронутых приложений.
- Lint проходит для затронутых приложений.
- Автор вручную проверил acceptance criteria.
- Новое или измененное поведение покрыто тестами там, где риск это оправдывает.
- Известные регрессии не остаются без учета; все follow-up задачи оформлены отдельными GitHub Issues.
- Tech Lead review завершен, блокирующих комментариев не осталось.

## Фокус ревью

На Pull Request review смотрим в первую очередь на:

- архитектуру и границы ответственности;
- соблюдение Feature-Sliced Design;
- нейминг и читаемость;
- React best practices;
- безопасность и поддерживаемость TypeScript;
- корректность WebSocket lifecycle;
- производительность и лишние rerender'ы;
- безопасность persistence и миграций;
- maintainability.

## Критерии закрытия спринта

Спринт можно закрыть, когда:

- все завершенные stories соответствуют Definition of Done;
- незавершенные stories явно возвращены в backlog или перенесены в следующий sprint;
- sprint risks и найденный technical debt зафиксированы;
- подготовлены demo notes по завершенной пользовательской функциональности.
