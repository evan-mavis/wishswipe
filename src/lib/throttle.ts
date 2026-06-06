export function throttle<A extends unknown[]>(
	fn: (...args: A) => void,
	waitMs: number
) {
	let lastInvokeAt = 0;
	let timeoutId: ReturnType<typeof setTimeout> | null = null;
	let pendingArgs: A | null = null;

	const invoke = () => {
		lastInvokeAt = Date.now();
		timeoutId = null;
		if (pendingArgs) {
			fn(...pendingArgs);
			pendingArgs = null;
		}
	};

	return (...args: A) => {
		const now = Date.now();
		const remaining = waitMs - (now - lastInvokeAt);
		pendingArgs = args;

		if (remaining <= 0) {
			if (timeoutId) {
				clearTimeout(timeoutId);
				timeoutId = null;
			}
			invoke();
		} else if (!timeoutId) {
			timeoutId = setTimeout(invoke, remaining);
		}
	};
}
