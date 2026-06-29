import { WS_URL } from '@/shared/config/websocket'
import type {
	SocketMessage,
	WebSocketEventHandlers,
	WebSocketMessageHandler
} from './types'

let socket: WebSocket | null = null

const listeners = new Set<WebSocketMessageHandler>()

function connect(username: string, handlers?: WebSocketEventHandlers) {
	if (
		socket &&
		(socket.readyState === WebSocket.OPEN ||
			socket.readyState === WebSocket.CONNECTING)
	) {
		return
	}

	socket = new WebSocket(`${WS_URL}?username=${encodeURIComponent(username)}`)

	socket.onopen = () => {
		handlers?.onOpen?.()
	}

	socket.onclose = () => {
		handlers?.onClose?.()
	}

	socket.onerror = () => {
		handlers?.onError?.()
	}

	socket.onmessage = event => {
		const message = JSON.parse(event.data) as SocketMessage

		listeners.forEach(listener => listener(message))
	}
}

function disconnect() {
	socket?.close()
	socket = null
}

function send(message: SocketMessage) {
	if (socket?.readyState !== WebSocket.OPEN) {
		throw new Error('WebSocket is not connected')
	}

	socket.send(JSON.stringify(message))
}

function subscribe(listener: WebSocketMessageHandler) {
	listeners.add(listener)

	return () => {
		listeners.delete(listener)
	}
}

export const websocketClient = {
	connect,
	disconnect,
	send,
	subscribe
}
