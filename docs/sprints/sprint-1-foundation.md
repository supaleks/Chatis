# Sprint 1: Основа проекта и первый пользовательский срез

## Цель спринта

Настроить процесс разработки через GitHub и подготовить проект к первой пользовательской части мессенджера: стабилизировать frontend quality gates и определить начальный путь входа пользователя.

## Выбранные stories

| Story | Название | Points |
| --- | --- | ---: |
| CH-001 | [Процесс] Инициализировать GitHub repository и project workflow | 2 |
| CH-002 | [Техдолг] Исправить frontend build baseline | 1 |
| CH-003 | [Техдолг] Исправить frontend lint baseline | 1 |
| CH-004 | [Процесс] Добавить root developer documentation | 2 |
| CH-005 | [Фича] Экран ввода username | 3 |

## Оценка

9

## Риски

- В корне проекта уже появился локальный Git repository, но remote пока не подключен, поэтому GitHub Issues и Pull Requests еще не могут быть источником правды.
- Frontend baseline пока не зеленый, поэтому обычный Definition of Done для frontend stories заблокирован.
- Frontend сейчас слишком маленький, чтобы заранее увидеть все FSD-границы; первые PR должны быть прагматичными и без лишних абстракций.
- У backend пока нет automated tests, поэтому WebSocket-изменения нужно тщательно проверять вручную до планирования задач на тестирование.

## Заметки по sprint backlog

- CH-001 нужно завершить до начала implementation stories.
- CH-002 и CH-003 маленькие, но приоритетные: они разблокируют quality gates.
- CH-005 - первая пользовательская story и не должна включать WebSocket messaging.

## Критерии демо

На sprint demo команда должна показать:

- GitHub Project/Issues/PR workflow или подтвержденный setup plan, если repository ownership еще не завершен.
- Проходящие frontend build и lint.
- Root documentation с объяснением запуска проекта.
- Username entry screen с переходом в следующее состояние приложения.
