import type { ComponentPropsWithoutRef } from 'react'

import { cn } from '@/shared/lib/utils'

type AppSurfaceProps = ComponentPropsWithoutRef<'div'>

export const AppSurface = ({ className, ...props }: AppSurfaceProps) => {
	return (
		<div
			className={cn(
				'rounded-xl border border-border bg-card/90 text-card-foreground shadow-sm backdrop-blur',
				className
			)}
			{...props}
		/>
	)
}
