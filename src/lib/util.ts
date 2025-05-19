export class FailedResult<E> {
	constructor(public error: E) {}
}

export type Result<T, E = any> = T | FailedResult<E>

export function ok<T, E>(result: Result<T, E>): result is T {
	return !(result instanceof FailedResult);
}

export function timestamp() {
	const now = new Date();
	return Date.UTC(
		now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(),
		now.getUTCHours(), now.getUTCMinutes(), now.getUTCSeconds(), now.getUTCMilliseconds()
	);
}