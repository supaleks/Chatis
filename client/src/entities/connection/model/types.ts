export type ConnectionStatus =
	| 'idle'
	| 'connecting'
	| 'connected'
	| 'disconnected'
	| 'error'

export type ConnectionState = {
	status: ConnectionStatus
	error: string | null
	setStatus: (status: ConnectionStatus) => void
	setError: (error: string) => void
	reset: () => void
}
