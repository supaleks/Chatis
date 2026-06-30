import { create } from 'zustand'
import { devtools } from 'zustand/middleware'

import type { OnlineUsersState } from './types'

export const useOnlineUsersStore = create<OnlineUsersState>()(
	devtools(
		set => ({
			onlineUsers: [],

			updateOnlineUsers: users =>
				set({ onlineUsers: users }, false, 'online-users/updateOnlineUsers')
		}),
		{
			name: 'online-users-store'
		}
	)
)
