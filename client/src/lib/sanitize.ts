/**
 * XSS Prevention Utilities
 */
export function sanitizeSearchQuery(query: string): string {
	return query
		.replace(/[<>'"\\]/g, "")
		.trim()
		.slice(0, 500);
}
