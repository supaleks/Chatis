import { useConnectionStore } from '@/entities/connection'
import { useOnlineUsersStore } from '@/entities/online-users'
import { useSessionStore } from '@/entities/session'
import { websocketClient } from '@/shared/api/websocket'
import { useEffect } from 'react'

export const useWebSocket = () => {
	const username = useSessionStore(state => state.username)
	const setStatus = useConnectionStore(state => state.setStatus)
	const setError = useConnectionStore(state => state.setError)
	const updateOnlineUsers = useOnlineUsersStore(
		state => state.updateOnlineUsers
	)

	useEffect(() => {
		if (!username) return
		setStatus('connecting')
		websocketClient.connect(username, {
			onOpen: () => setStatus('connected'),
			onClose: () => setStatus('disconnected'),
			onError: () => setError('Ошибка соединения с сервером')
		})
		const unsubscribe = websocketClient.subscribe(message => {
			if (message.type === 'users_online') {
				updateOnlineUsers(message.payload)
			}
		})
		return () => {
			unsubscribe()
			websocketClient.disconnect()
		}
	}, [setError, setStatus, updateOnlineUsers, username])
}
