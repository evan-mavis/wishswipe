/**
 * XSS Prevention Utilities
 */
export function sanitizeSearchQuery(query: string): string {
	return query
		.replace(/[<>'"\\]/g, "") // remove potentially harmful chars
		.trim()
		.slice(0, 500); // limit length
}
