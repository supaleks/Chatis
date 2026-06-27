export type Username = string

export type SessionState = {
	username: Username | null

	login: (username: Username) => void

	logout: () => void
}
