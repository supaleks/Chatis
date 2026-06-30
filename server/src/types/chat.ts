export type User = {
	username: string
}

export type ChatMessage = {
	id: string
	from: string
	to: string
	text: string
	createdAt: string
}

export type ServerEvent =
	| {
			type: 'users_online'
			payload: string[]
	  }
	| {
			type: 'private_message'
			payload: ChatMessage
	  }
	| {
			type: 'chat_history'
			payload: ChatMessage[]
	  }
	| {
			type: 'error'
			payload: {
				message: string
			}
	  }

export type ClientEvent =
	| {
			type: 'private_message'
			payload: {
				to: string
				text: string
			}
	  }
	| {
			type: 'get_history'
			payload: {
				withUser: string
			}
	  }
