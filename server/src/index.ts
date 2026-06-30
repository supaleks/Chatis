import { createReadStream, existsSync, statSync } from 'node:fs'
import { createServer, type IncomingMessage, type ServerResponse } from 'node:http'
import { extname, isAbsolute, join, relative, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { WebSocket, WebSocketServer, type RawData } from 'ws'
import {
	getPrivateHistory,
	saveMessage
} from './repositories/message.repository.js'
import type { ChatMessage, ClientEvent, ServerEvent } from './types/chat.js'

const PORT = Number(process.env.PORT ?? 3001)
const __dirname = fileURLToPath(new URL('.', import.meta.url))
const CLIENT_DIST_PATH =
	process.env.CLIENT_DIST_PATH ?? resolve(__dirname, '../../client/dist')

const wss = new WebSocketServer({ noServer: true })
const clients = new Map<string, WebSocket>()
const contentTypes: Record<string, string> = {
	'.css': 'text/css; charset=utf-8',
	'.html': 'text/html; charset=utf-8',
	'.js': 'text/javascript; charset=utf-8',
	'.json': 'application/json; charset=utf-8',
	'.svg': 'image/svg+xml',
	'.woff2': 'font/woff2'
}

function send(socket: WebSocket, event: ServerEvent) {
	if (socket.readyState !== WebSocket.OPEN) {
		return
	}

	socket.send(JSON.stringify(event))
}

function broadcastOnlineUsers() {
	const users = Array.from(clients.keys())

	const event: ServerEvent = {
		type: 'users_online',
		payload: users
	}

	clients.forEach(socket => {
		send(socket, event)
	})
}

function getRequestUrl(request: IncomingMessage) {
	return new URL(
		request.url ?? '/',
		`http://${request.headers.host ?? `localhost:${PORT}`}`
	)
}

function sendJson(response: ServerResponse, statusCode: number, body: unknown) {
	response.writeHead(statusCode, {
		'Content-Type': 'application/json; charset=utf-8'
	})
	response.end(JSON.stringify(body))
}

function serveStatic(request: IncomingMessage, response: ServerResponse) {
	const url = getRequestUrl(request)
	const pathname = decodeURIComponent(url.pathname)
	const requestedPath = pathname === '/' ? '/index.html' : pathname
	const filePath = resolve(CLIENT_DIST_PATH, `.${requestedPath}`)
	const indexPath = join(CLIENT_DIST_PATH, 'index.html')
	const relativePath = relative(CLIENT_DIST_PATH, filePath)

	if (relativePath.startsWith('..') || isAbsolute(relativePath)) {
		sendJson(response, 403, { status: 'forbidden' })
		return
	}

	const targetPath =
		existsSync(filePath) && statSync(filePath).isFile() ? filePath : indexPath

	if (!existsSync(targetPath)) {
		sendJson(response, 404, { status: 'not_found' })
		return
	}

	response.writeHead(200, {
		'Content-Type':
			contentTypes[extname(targetPath)] ?? 'application/octet-stream'
	})
	createReadStream(targetPath).pipe(response)
}

function parseClientEvent(data: RawData): ClientEvent | null {
	try {
		return JSON.parse(data.toString()) as ClientEvent
	} catch {
		return null
	}
}

wss.on('connection', (socket, request) => {
	const url = getRequestUrl(request)
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
		}
	})

	socket.on('close', () => {
		clients.delete(username)
		console.log(`${username} disconnected`)
		broadcastOnlineUsers()
	})
})

const server = createServer((request, response) => {
	const url = getRequestUrl(request)

	if (request.method === 'GET' && url.pathname === '/api/health') {
		sendJson(response, 200, { status: 'ok' })
		return
	}

	if (request.method !== 'GET') {
		sendJson(response, 405, { status: 'method_not_allowed' })
		return
	}

	serveStatic(request, response)
})

server.on('upgrade', (request, socket, head) => {
	wss.handleUpgrade(request, socket, head, ws => {
		wss.emit('connection', ws, request)
	})
})

server.listen(PORT, () => {
	console.log(`Chatis server started on http://localhost:${PORT}`)
})
