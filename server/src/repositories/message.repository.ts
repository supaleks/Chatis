import { db } from '../database/db.js'
import type { ChatMessage } from '../types/chat.js'

export function saveMessage(message: ChatMessage) {
	db.prepare(
		`
    INSERT INTO messages (id, sender, receiver, text, created_at)
    VALUES (@id, @from, @to, @text, @createdAt)
  `
	).run(message)
}

export function getPrivateHistory(userA: string, userB: string): ChatMessage[] {
	const rows = db
		.prepare(
			`
      SELECT
        id,
        sender as "from",
        receiver as "to",
        text,
        created_at as createdAt
      FROM messages
      WHERE
        (sender = ? AND receiver = ?)
        OR
        (sender = ? AND receiver = ?)
      ORDER BY created_at ASC
    `
		)
		.all(userA, userB, userB, userA)

	return rows as ChatMessage[]
}
