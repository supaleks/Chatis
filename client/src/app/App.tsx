import { useSessionStore } from '@/entities/session'
import { ChatPage } from '@/pages/chat'
import { LoginPage } from '@/pages/login'

export function App() {
	const username = useSessionStore(state => state.username)

	if (!username) {
		return <LoginPage />
	}

	return <ChatPage />
}
