import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import type { ConnectionState } from './types'

export const useConnectionStore = create<ConnectionState>()(
	devtools(
		set => ({
			status: 'idle',

			error: null,

			setStatus: status =>
				set({ status, error: null }, false, 'connection/setStatus'),

			setError: error =>
				set({ status: 'error', error }, false, 'connection/setError'),

			reset: () =>
				set({ status: 'idle', error: null }, false, 'connection/reset')
		}),
		{
			name: 'connection-store'
		}
	)
)
