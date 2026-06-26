import { WebSocket, WebSocketServer, type RawData } from 'ws'
import {
	getPrivateHistory,
	saveMessage
} from './repositories/message.repository.js'
import type {
	ChatMessage,
	ClientEvent,
	ServerEvent,
	User
} from './types/chat.js'

const PORT = 3001

const wss = new WebSocketServer({
	port: PORT
})

const clients = new Map<string, WebSocket>()

function send(socket: WebSocket, event: ServerEvent) {
	if (socket.readyState !== WebSocket.OPEN) {
		return
	}

	socket.send(JSON.stringify(event))
}

function broadcastOnlineUsers() {
	const users: User[] = Array.from(clients.keys()).map(username => ({
		username
	}))

	const event: ServerEvent = {
		type: 'users_online',
		payload: users
	}

	clients.forEach(socket => {
		send(socket, event)
	})
}

function parseClientEvent(data: RawData): ClientEvent | null {
	try {
		return JSON.parse(data.toString()) as ClientEvent
	} catch {
		return null
	}
}

wss.on('connection', (socket, request) => {
	const url = new URL(request.url ?? '', `http://localhost:${PORT}`)
	const username = url.searchParams.get('username')

	if (!username) {
		send(socket, {
			type: 'error',
			payload: {
				message: 'Username is required'
			}
		})

		socket.close()
		return
	}

	clients.set(username, socket)
	console.log(`${username} connected`)

	broadcastOnlineUsers()

	socket.on('message', data => {
		const event = parseClientEvent(data)

		if (!event) {
			send(socket, {
				type: 'error',
				payload: {
					message: 'Invalid message format'
				}
			})

			return
		}

		if (event.type === 'private_message') {
			const message: ChatMessage = {
				id: crypto.randomUUID(),
				from: username,
				to: event.payload.to,
				text: event.payload.text,
				createdAt: new Date().toISOString()
			}

			saveMessage(message)

			const senderSocket = clients.get(username)
			const receiverSocket = clients.get(event.payload.to)

			if (senderSocket) {
				send(senderSocket, {
					type: 'private_message',
					payload: message
				})
			}

			if (receiverSocket) {
				send(receiverSocket, {
					type: 'private_message',
					payload: message
				})
			}

			return
		}

		if (event.type === 'get_history') {
			const history = getPrivateHistory(username, event.payload.withUser)

			send(socket, {
				type: 'chat_history',
				payload: history
			})

			return
		}
	})

	socket.on('close', () => {
		clients.delete(username)
		console.log(`${username} disconnected`)
		broadcastOnlineUsers()
	})
})

console.log(`Chatis server started on ws://localhost:${PORT} 🚀`)
