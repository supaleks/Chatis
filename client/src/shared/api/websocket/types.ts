export type UsersOnlineMessage = {
	type: 'users_online'
	payload: string[]
}

export type PrivateMessageMessage = {
	type: 'private_message'
	payload: unknown
}

export type ErrorMessage = {
	type: 'error'
	payload: {
		message: string
	}
}

export type SocketMessage =
	| UsersOnlineMessage
	| PrivateMessageMessage
	| ErrorMessage

export type WebSocketMessageHandler = (message: SocketMessage) => void

export type WebSocketEventHandlers = {
	onOpen?: () => void
	onClose?: () => void
	onError?: () => void
}
