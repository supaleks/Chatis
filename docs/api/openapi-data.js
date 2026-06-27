window.CHATIS_OPENAPI = {
  "openapi": "3.1.0",
  "info": {
    "title": "Chatis API",
    "version": "0.1.0",
    "description": "REST and WebSocket entrypoint overview for Chatis MVP. REST is responsible for persisted history; WebSocket is responsible for realtime events.",
    "license": {
      "name": "MIT",
      "identifier": "MIT"
    }
  },
  "servers": [
    {
      "url": "http://localhost:3001",
      "description": "Local development server"
    }
  ],
  "security": [],
  "tags": [
    {
      "name": "websocket",
      "description": "WebSocket connection and realtime event overview"
    },
    {
      "name": "messages",
      "description": "Private message history"
    }
  ],
  "paths": {
    "/": {
      "get": {
        "tags": [
          "websocket"
        ],
        "summary": "Open WebSocket connection",
        "description": "WebSocket handshake endpoint for the realtime Chatis protocol.\n\nDo not call this operation with `fetch` or Axios. Use the browser WebSocket API:\n\n```ts\nconst socket = new WebSocket(\n  `ws://localhost:3001?username=${encodeURIComponent(username)}`\n)\n```\n\nRequired query parameter:\n\n- `username` - current MVP username.\n\nServer events to listen for:\n\n```json\n{ \"type\": \"users_online\", \"payload\": [{ \"username\": \"alex\" }] }\n```\n\n```json\n{\n  \"type\": \"private_message\",\n  \"payload\": {\n    \"id\": \"uuid\",\n    \"from\": \"alex\",\n    \"to\": \"maria\",\n    \"text\": \"Привет\",\n    \"createdAt\": \"2026-06-27T10:00:00.000Z\"\n  }\n}\n```\n\n```json\n{ \"type\": \"error\", \"payload\": { \"message\": \"Invalid message format\" } }\n```\n\nClient event for sending a private message:\n\n```json\n{\n  \"type\": \"private_message\",\n  \"payload\": { \"to\": \"maria\", \"text\": \"Привет\" }\n}\n```\n\nLegacy history events `get_history` and `chat_history` exist in the current backend, but the MVP frontend should load history through REST + TanStack Query.\n\nFull WebSocket message contract is stored in `docs/api/asyncapi.yaml`.\n",
        "operationId": "openWebSocketConnection",
        "x-protocol": "websocket",
        "x-asyncapi-source": "docs/api/asyncapi.yaml",
        "parameters": [
          {
            "name": "username",
            "in": "query",
            "required": true,
            "description": "Current MVP username used as WebSocket session identity.",
            "schema": {
              "type": "string",
              "minLength": 1
            }
          }
        ],
        "responses": {
          "101": {
            "description": "Switching Protocols. The HTTP request is upgraded to a WebSocket connection."
          }
        }
      }
    },
    "/api/messages/private": {
      "get": {
        "tags": [
          "messages"
        ],
        "summary": "Get private conversation history",
        "description": "Returns persisted private messages between the current user and selected peer.",
        "operationId": "getPrivateMessageHistory",
        "x-implementation-status": "planned",
        "parameters": [
          {
            "name": "user",
            "in": "query",
            "required": true,
            "description": "Current username.",
            "schema": {
              "type": "string",
              "minLength": 1
            }
          },
          {
            "name": "with",
            "in": "query",
            "required": true,
            "description": "Peer username for the selected conversation.",
            "schema": {
              "type": "string",
              "minLength": 1
            }
          }
        ],
        "responses": {
          "200": {
            "description": "Conversation history in chronological order.",
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
            "description": "Required query parameter is missing or invalid.",
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
