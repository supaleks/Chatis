import { Circle, Wifi, WifiOff } from 'lucide-react'

import { cn } from '@/shared/lib/utils'

type StatusBadgeVariant = 'online' | 'idle' | 'offline'

type StatusBadgeProps = {
	children: string
	className?: string
	variant?: StatusBadgeVariant
}

const variantClassName: Record<StatusBadgeVariant, string> = {
	online: 'border-online/25 bg-online/10 text-foreground',
	idle: 'border-warning/30 bg-warning/15 text-foreground',
	offline: 'border-border bg-muted text-muted-foreground'
}

const iconByVariant = {
	online: Wifi,
	idle: Circle,
	offline: WifiOff
}

export const StatusBadge = ({
	children,
	className,
	variant = 'offline'
}: StatusBadgeProps) => {
	const Icon = iconByVariant[variant]

	return (
		<span
			className={cn(
				'inline-flex h-7 items-center gap-1.5 rounded-md border px-2 text-xs font-medium',
				variantClassName[variant],
				className
			)}
		>
			<Icon
				className="size-3.5"
				aria-hidden="true"
			/>
			{children}
		</span>
	)
}
