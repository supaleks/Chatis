import type { ConnectionStatus } from '../model/types'

type ConnectionStatusVariant = 'online' | 'idle' | 'offline'

type ConnectionStatusView = {
	label: string
	variant: ConnectionStatusVariant
}

export const getConnectionStatusView = (
	status: ConnectionStatus
): ConnectionStatusView => {
	switch (status) {
		case 'connected':
			return {
				label: 'Онлайн',
				variant: 'online'
			}

		case 'connecting':
			return {
				label: 'Подключение',
				variant: 'idle'
			}

		case 'disconnected':
			return {
				label: 'Нет соединения',
				variant: 'offline'
			}

		case 'error':
			return {
				label: 'Ошибка соединения',
				variant: 'offline'
			}

		case 'idle':
		default:
			return {
				label: 'Ожидание',
				variant: 'idle'
			}
	}
}
