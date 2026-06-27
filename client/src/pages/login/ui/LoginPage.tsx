import { UsernameForm } from '@/features/auth'
import { AppSurface } from '@/shared/ui/app-surface'
import { BrandMark } from '@/shared/ui/brand-mark'
import { StatusBadge } from '@/shared/ui/status-badge'

export const LoginPage = () => {
	return (
		<main className="flex min-h-screen w-full items-center justify-center px-5 py-8">
			<AppSurface className="grid w-full max-w-4xl overflow-hidden md:grid-cols-[1.05fr_0.95fr]">
				<section className="flex min-h-[420px] flex-col justify-between bg-sidebar p-7 text-sidebar-foreground">
					<BrandMark className="[&_p]:text-sidebar-foreground [&_p:last-child]:text-sidebar-foreground/68" />

					<div className="max-w-md space-y-5">
						<StatusBadge
							variant="online"
							className="border-white/15 bg-white/10 text-sidebar-foreground"
						>
							Realtime ready
						</StatusBadge>

						<div className="space-y-3">
							<h1 className="text-3xl font-semibold leading-tight">
								Личные сообщения без лишнего шума
							</h1>
							<p className="max-w-sm text-sm leading-6 text-sidebar-foreground/72">
								Вход по имени, список онлайн-пользователей и быстрый диалог один
								на один.
							</p>
						</div>
					</div>
				</section>

				<section className="flex min-h-[420px] flex-col justify-center p-7">
					<div className="mx-auto w-full max-w-sm space-y-6">
						<div className="space-y-2">
							<p className="text-sm font-medium text-primary">Вход в Chatis</p>
							<h2 className="text-2xl font-semibold leading-tight">
								Представьтесь для чата
							</h2>
							<p className="text-sm leading-6 text-muted-foreground">
								Имя сохранится локально и будет использоваться для подключения к
								WebSocket-серверу.
							</p>
						</div>

						<UsernameForm />
					</div>
				</section>
			</AppSurface>
		</main>
	)
}
