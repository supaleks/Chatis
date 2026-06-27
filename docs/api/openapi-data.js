window.CHATIS_OPENAPI = {
  "openapi": "3.1.0",
  "info": {
    "title": "Chatis API",
    "version": "0.1.0",
    "description": "Обзор REST и WebSocket entrypoint для MVP Chatis. REST отвечает за сохраненную историю сообщений, WebSocket - за realtime-события.",
    "license": {
      "name": "MIT",
      "identifier": "MIT"
    }
  },
  "servers": [
    {
      "url": "http://localhost:3001",
      "description": "Локальный сервер разработки"
    }
  ],
  "security": [],
  "tags": [
    {
      "name": "websocket",
      "description": "WebSocket connection и обзор realtime-событий"
    },
    {
      "name": "messages",
      "description": "История личных сообщений"
    }
  ],
  "paths": {
    "/": {
      "get": {
        "tags": [
          "websocket"
        ],
        "summary": "Открыть WebSocket connection",
        "description": "WebSocket handshake endpoint для realtime-протокола Chatis.\n\nНе вызывай эту операцию через `fetch` или Axios. Используй browser WebSocket API:\n\n```ts\nconst socket = new WebSocket(\n  `ws://localhost:3001?username=${encodeURIComponent(username)}`\n)\n```\n\nОбязательный query parameter:\n\n- `username` - текущий username пользователя в MVP.\n\nServer events, которые нужно слушать:\n\n```json\n{ \"type\": \"users_online\", \"payload\": [{ \"username\": \"alex\" }] }\n```\n\n```json\n{\n  \"type\": \"private_message\",\n  \"payload\": {\n    \"id\": \"uuid\",\n    \"from\": \"alex\",\n    \"to\": \"maria\",\n    \"text\": \"Привет\",\n    \"createdAt\": \"2026-06-27T10:00:00.000Z\"\n  }\n}\n```\n\n```json\n{ \"type\": \"error\", \"payload\": { \"message\": \"Invalid message format\" } }\n```\n\nClient event для отправки личного сообщения:\n\n```json\n{\n  \"type\": \"private_message\",\n  \"payload\": { \"to\": \"maria\", \"text\": \"Привет\" }\n}\n```\n\nLegacy-события истории `get_history` и `chat_history` есть в текущем бэкенде, но MVP frontend должен загружать историю через REST + TanStack Query.\n\nПолный WebSocket message contract хранится в `docs/api/asyncapi.yaml`.\n",
        "operationId": "openWebSocketConnection",
        "x-protocol": "websocket",
        "x-asyncapi-source": "docs/api/asyncapi.yaml",
        "parameters": [
          {
            "name": "username",
            "in": "query",
            "required": true,
            "description": "Текущий username пользователя в MVP, используется как идентификатор WebSocket-сессии.",
            "schema": {
              "type": "string",
              "minLength": 1
            }
          }
        ],
        "responses": {
          "101": {
            "description": "Switching Protocols. HTTP request переключается в WebSocket connection."
          }
        }
      }
    },
    "/api/messages/private": {
      "get": {
        "tags": [
          "messages"
        ],
        "summary": "Получить историю личной переписки",
        "description": "Возвращает сохраненные личные сообщения между текущим пользователем и выбранным собеседником.",
        "operationId": "getPrivateMessageHistory",
        "x-implementation-status": "planned",
        "parameters": [
          {
            "name": "user",
            "in": "query",
            "required": true,
            "description": "Текущий username.",
            "schema": {
              "type": "string",
              "minLength": 1
            }
          },
          {
            "name": "with",
            "in": "query",
            "required": true,
            "description": "Username собеседника для выбранной conversation.",
            "schema": {
              "type": "string",
              "minLength": 1
            }
          }
        ],
        "responses": {
          "200": {
            "description": "История conversation в хронологическом порядке.",
            "content": {
              "application/json": {
                "schema": {
                  "type": "array",
                  "items": {
                    "$ref": "#/components/schemas/ChatMessage"
                  }
                }
              }
            }
          },
          "400": {
            "description": "Обязательный query parameter отсутствует или некорректен.",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/ErrorResponse"
                }
              }
            }
          }
        }
      }
    }
  },
  "components": {
    "schemas": {
      "ChatMessage": {
        "type": "object",
        "required": [
          "id",
          "from",
          "to",
          "text",
          "createdAt"
        ],
        "properties": {
          "id": {
            "type": "string",
            "format": "uuid"
          },
          "from": {
            "type": "string",
            "minLength": 1
          },
          "to": {
            "type": "string",
            "minLength": 1
          },
          "text": {
            "type": "string",
            "minLength": 1
          },
          "createdAt": {
            "type": "string",
            "format": "date-time"
          }
        }
      },
      "ErrorResponse": {
        "type": "object",
        "required": [
          "message"
        ],
        "properties": {
          "message": {
            "type": "string",
            "minLength": 1
          }
        }
      }
    }
  }
};
