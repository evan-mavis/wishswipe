export function debounceSearch(
	func: (query: string) => void | Promise<void>,
	delay: number
) {
	let timeoutId: ReturnType<typeof setTimeout> | null = null;

	const debouncedFunc = (query: string) => {
		if (timeoutId) {
			clearTimeout(timeoutId);
		}

		timeoutId = setTimeout(() => {
			func(query);
		}, delay);
	};

	const cleanup = () => {
		if (timeoutId) {
			clearTimeout(timeoutId);
			timeoutId = null;
		}
	};

	return { debouncedFunc, cleanup };
}
