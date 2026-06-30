export type OnlineUser = {
	username: string
}

export interface OnlineUsersState {
	onlineUsers: OnlineUser[]
	updateOnlineUsers: (users: OnlineUser[]) => void
}
