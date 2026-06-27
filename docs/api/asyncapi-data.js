window.CHATIS_ASYNCAPI = {
  "asyncapi": "3.1.0",
  "info": {
    "title": "Chatis WebSocket API",
    "version": "0.1.0",
    "description": "WebSocket contract for Chatis MVP. WebSocket is responsible for realtime events only."
  },
  "defaultContentType": "application/json",
  "servers": {
    "local": {
      "host": "localhost:3001",
      "protocol": "ws",
      "pathname": "/",
      "description": "Local WebSocket server. The frontend connects with the username query parameter.",
      "x-connection-example": "ws://localhost:3001?username=alex"
    }
  },
  "channels": {
    "chatisSocket": {
      "address": "/",
      "messages": {
        "usersOnline": {
          "$ref": "#/components/messages/UsersOnline"
        },
        "privateMessageReceived": {
          "$ref": "#/components/messages/PrivateMessageReceived"
        },
        "privateMessageSend": {
          "$ref": "#/components/messages/PrivateMessageSend"
        },
        "getHistoryLegacy": {
          "$ref": "#/components/messages/GetHistoryLegacy"
        },
        "chatHistory": {
          "$ref": "#/components/messages/ChatHistory"
        },
        "error": {
          "$ref": "#/components/messages/Error"
        }
      }
    }
  },
  "operations": {
    "receiveOnlineUsers": {
      "action": "receive",
      "channel": {
        "$ref": "#/channels/chatisSocket"
      },
      "messages": [
        {
          "$ref": "#/channels/chatisSocket/messages/usersOnline"
        }
      ]
    },
    "receivePrivateMessage": {
      "action": "receive",
      "channel": {
        "$ref": "#/channels/chatisSocket"
      },
      "messages": [
        {
          "$ref": "#/channels/chatisSocket/messages/privateMessageReceived"
        }
      ]
    },
    "sendPrivateMessage": {
      "action": "send",
      "channel": {
        "$ref": "#/channels/chatisSocket"
      },
      "messages": [
        {
          "$ref": "#/channels/chatisSocket/messages/privateMessageSend"
        }
      ]
    },
    "receiveError": {
      "action": "receive",
      "channel": {
        "$ref": "#/channels/chatisSocket"
      },
      "messages": [
        {
          "$ref": "#/channels/chatisSocket/messages/error"
        }
      ]
    },
    "requestChatHistoryLegacy": {
      "action": "send",
      "channel": {
        "$ref": "#/channels/chatisSocket"
      },
      "messages": [
        {
          "$ref": "#/channels/chatisSocket/messages/getHistoryLegacy"
        }
      ],
      "summary": "Legacy history request. Do not use for the target MVP frontend flow."
    },
    "receiveChatHistoryLegacy": {
      "action": "receive",
      "channel": {
        "$ref": "#/channels/chatisSocket"
      },
      "messages": [
        {
          "$ref": "#/channels/chatisSocket/messages/chatHistory"
        }
      ],
      "summary": "Legacy history response. REST + TanStack Query is the target MVP flow."
    }
  },
  "components": {
    "messages": {
      "UsersOnline": {
        "name": "users_online",
        "title": "Online users changed",
        "payload": {
          "type": "object",
          "required": [
            "type",
            "payload"
          ],
          "properties": {
            "type": {
              "const": "users_online"
            },
            "payload": {
              "type": "array",
              "items": {
                "$ref": "#/components/schemas/User"
              }
            }
          }
        }
      },
      "PrivateMessageReceived": {
        "name": "private_message",
        "title": "Private message received",
        "payload": {
          "type": "object",
          "required": [
            "type",
            "payload"
          ],
          "properties": {
            "type": {
              "const": "private_message"
            },
            "payload": {
              "$ref": "#/components/schemas/ChatMessage"
            }
          }
        }
      },
      "PrivateMessageSend": {
        "name": "private_message",
        "title": "Send private message",
        "payload": {
          "type": "object",
          "required": [
            "type",
            "payload"
          ],
          "properties": {
            "type": {
              "const": "private_message"
            },
            "payload": {
              "type": "object",
              "required": [
                "to",
                "text"
              ],
              "properties": {
                "to": {
                  "type": "string",
                  "minLength": 1
                },
                "text": {
                  "type": "string",
                  "minLength": 1
                }
              }
            }
          }
        }
      },
      "GetHistoryLegacy": {
        "name": "get_history",
        "title": "Legacy history request",
        "payload": {
          "type": "object",
          "required": [
            "type",
            "payload"
          ],
          "properties": {
            "type": {
              "const": "get_history"
            },
            "payload": {
              "type": "object",
              "required": [
                "withUser"
              ],
              "properties": {
                "withUser": {
                  "type": "string",
                  "minLength": 1
                }
              }
            }
          }
        }
      },
      "ChatHistory": {
        "name": "chat_history",
        "title": "Legacy chat history response",
        "payload": {
          "type": "object",
          "required": [
            "type",
            "payload"
          ],
          "properties": {
            "type": {
              "const": "chat_history"
            },
            "payload": {
              "type": "array",
              "items": {
                "$ref": "#/components/schemas/ChatMessage"
              }
            }
          }
        }
      },
      "Error": {
        "name": "error",
        "title": "Backend error",
        "payload": {
          "type": "object",
          "required": [
            "type",
            "payload"
          ],
          "properties": {
            "type": {
              "const": "error"
            },
            "payload": {
              "$ref": "#/components/schemas/ErrorPayload"
            }
          }
        }
      }
    },
    "schemas": {
      "User": {
        "type": "object",
        "required": [
          "username"
        ],
        "properties": {
          "username": {
            "type": "string",
            "minLength": 1
          }
        }
      },
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
      "ErrorPayload": {
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
