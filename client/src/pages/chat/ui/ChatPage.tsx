import {
	getConnectionStatusView,
	useConnectionStore
} from '@/entities/connection'
import { useOnlineUsersStore } from '@/entities/online-users'
import { useSessionStore } from '@/entities/session'
import { useWebSocket } from '@/shared/hooks/use-websocket'
import { AppSurface } from '@/shared/ui/app-surface'
import { BrandMark } from '@/shared/ui/brand-mark'
import { Button } from '@/shared/ui/button'
import { StatusBadge } from '@/shared/ui/status-badge'
import { LogOut, MessageSquareText, UsersRound } from 'lucide-react'

export const ChatPage = () => {
	const username = useSessionStore(state => state.username)
	const logout = useSessionStore(state => state.logout)
	useWebSocket()
	const status = useConnectionStore(state => state.status)
	const connectionView = getConnectionStatusView(status)
	const users = useOnlineUsersStore(state => state.onlineUsers)

	return (
		<main className="min-h-screen p-4 md:p-6">
			<AppSurface className="mx-auto grid min-h-[calc(100vh-2rem)] w-full max-w-6xl overflow-hidden md:min-h-[calc(100vh-3rem)] md:grid-cols-[280px_1fr]">
				<aside className="flex flex-col border-b border-border bg-sidebar p-4 text-sidebar-foreground md:border-b-0 md:border-r">
					<div className="flex items-center justify-between gap-3">
						<BrandMark className="[&_p]:text-sidebar-foreground [&_p:last-child]:text-sidebar-foreground/65" />

						<Button
							type="button"
							variant="ghost"
							size="icon"
							onClick={logout}
							className="text-sidebar-foreground hover:bg-white/10 hover:text-sidebar-foreground"
							aria-label="Выйти"
						>
							<LogOut aria-hidden="true" />
						</Button>
					</div>

					<div className="mt-6 space-y-3">
						<StatusBadge
							variant={connectionView.variant}
							className="border-white/15 bg-white/10 text-sidebar-foreground"
						>
							{connectionView.label}
						</StatusBadge>

						<div className="rounded-lg border border-white/10 bg-white/7 p-3">
							<div className="flex items-center gap-2 text-sm font-medium">
								<UsersRound
									className="size-4"
									aria-hidden="true"
								/>
								Онлайн
							</div>

							{users.length > 0 ? (
								<ul className="mt-3 space-y-2">
									{users.map(user => (
										<li
											key={user.username}
											className="flex min-h-8 items-center justify-between rounded-md bg-white/7 px-2 text-sm"
										>
											<span>{user.username}</span>
											{user.username === username && (
												<span className="text-xs text-sidebar-foreground/55">Вы</span>
											)}
										</li>
									))}
								</ul>
							) : (
								<p className="mt-2 text-sm text-sidebar-foreground/65">
									Список пользователей появится после подключения WebSocket.
								</p>
							)}
						</div>
					</div>
				</aside>

				<section className="flex min-h-[520px] flex-col bg-card">
					<header className="flex min-h-16 items-center justify-between gap-4 border-b border-border px-5">
						<div>
							<p className="text-sm font-medium text-foreground">
								Диалог не выбран
							</p>
							<p className="text-sm text-muted-foreground">
								Выберите пользователя из списка онлайн
							</p>
						</div>

						<StatusBadge variant="idle">Ожидание</StatusBadge>
					</header>

					<div className="grid flex-1 place-items-center p-6">
						<div className="max-w-sm text-center">
							<div className="mx-auto flex size-12 items-center justify-center rounded-lg bg-secondary text-secondary-foreground">
								<MessageSquareText
									className="size-6"
									aria-hidden="true"
								/>
							</div>
							<h1 className="mt-4 text-xl font-semibold">
								Добро пожаловать, {username}
							</h1>
							<p className="mt-2 text-sm leading-6 text-muted-foreground">
								Каркас готов к подключению списка пользователей, истории и
								realtime-сообщений.
							</p>
						</div>
					</div>
				</section>
			</AppSurface>
		</main>
	)
}
