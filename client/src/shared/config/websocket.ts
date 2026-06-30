function getWebSocketUrl() {
	const envUrl = import.meta.env.VITE_WS_URL

	if (envUrl) {
		return envUrl
	}

	if (window.location.hostname === 'localhost') {
		return 'ws://localhost:3001'
	}

	const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:'

	return `${protocol}//${window.location.host}`
}

export const WS_URL = getWebSocketUrl()
