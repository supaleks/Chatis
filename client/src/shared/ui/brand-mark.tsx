import { MessageCircle } from 'lucide-react'

import { cn } from '@/shared/lib/utils'

type BrandMarkProps = {
	className?: string
}

export const BrandMark = ({ className }: BrandMarkProps) => {
	return (
		<div className={cn('flex items-center gap-3', className)}>
			<div className="flex size-10 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-sm">
				<MessageCircle
					className="size-5"
					aria-hidden="true"
				/>
			</div>

			<div>
				<p className="text-base font-semibold leading-tight text-foreground">Chatis</p>
				<p className="text-xs font-medium leading-tight text-muted-foreground">
					private realtime messenger
				</p>
			</div>
		</div>
	)
}
