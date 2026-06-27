import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import type { SessionState } from './types'

export const useSessionStore = create<SessionState>()(
	devtools(
		set => ({
			username: null,

			login: username => set({ username }, false, 'session/login'),

			logout: () => set({ username: null }, false, 'session/logout')
		}),
		{
			name: 'session-store'
		}
	)
)
