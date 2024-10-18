import { json } from "@sveltejs/kit";

export type TypedResponse<T> = Response & { __DO_NOT_USE__: T };

export function respond<R>(obj: R): TypedResponse<R> {
	return json(obj) as TypedResponse<R>;
}