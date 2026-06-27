import { useSessionStore } from '@/entities/session'
import { Button } from '@/shared/ui/button'
import { Input } from '@/shared/ui/input'
import type { SubmitEvent } from 'react'
import { useState } from 'react'

export const UsernameForm = () => {
	const [username, setUsername] = useState('')
	const [error, setError] = useState('')
	const login = useSessionStore(state => state.login)

	const handleSubmit = (e: SubmitEvent<HTMLFormElement>) => {
		e.preventDefault()

		const trimmedUsername = username.trim()

		if (!trimmedUsername) {
			setError('Введите имя пользователя')
			return
		}

		setError('')
		login(trimmedUsername)
	}

	return (
		<form
			onSubmit={handleSubmit}
			className="space-y-4"
		>
			<div className="space-y-2">
				<Input
					id="username"
					type="text"
					value={username}
					onChange={e => {
						setUsername(e.target.value)
						setError('')
					}}
					placeholder="Например, Alex"
					autoComplete="off"
				/>

				{error && <p className="text-sm text-destructive">{error}</p>}
			</div>

			<Button
				type="submit"
				className="w-full"
				size="lg"
			>
				Войти
			</Button>
		</form>
	)
}
