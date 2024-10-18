import type { CorrectAnswer, GamePlayer } from "./apitypes";
import { FailedResult, type Result } from "./util";

async function call(method: string, init?: RequestInit): Promise<Result<any>> {
	try {
		const res = await fetch("/api" + method, init);
		
		if (!res.ok) {
			return new FailedResult(new Error("Request failed: " + await res.text()));
		}

		const json = await res.json();
		return json as any;

	} catch (error) {
		return new FailedResult(error);
	}
}

export function newGame(): Promise<Result<GamePlayer>> {
	return call(`/newGame`)
}

export function joinGame(gameID: string): Promise<Result<GamePlayer>> {
	return call(`/${gameID}/joinGame`)
}

export function destroyGame(gameID: string, accessKey: string): Promise<Result<{}>> {
	return call(`/${gameID}/${accessKey}/destroyGame`)
}

export function guess(gameID: string, accessKey: string, userID: string): Promise<Result<CorrectAnswer>> {
	return call(`/${gameID}/${accessKey}/guess/${userID}`)
}

export function kick(gameID: string, accessKey: string, userID: string): Promise<Result<{}>> {
	return call(`/${gameID}/${accessKey}/kick/${userID}`)
}

export function transferHost(gameID: string, accessKey: string, userID: string): Promise<Result<{}>> {
	return call(`/${gameID}/${accessKey}/transferHost/${userID}`)
}

export function leaveGame(gameID: string, accessKey: string): Promise<Result<{}>> {
	return call(`/${gameID}/${accessKey}/leaveGame`)
}

export function selectArticle(gameID: string, accessKey: string): Promise<Result<{}>> {
	return call(`/${gameID}/${accessKey}/selectArticle`)
}

export function resetArticle(gameID: string, accessKey: string): Promise<Result<{}>> {
	return call(`/${gameID}/${accessKey}/resetArticle`)
}

export function updateMe(gameID: string, accessKey: string, obj: { name?: string, pic?: string }): Promise<Result<{}>> {
	return call(`/${gameID}/${accessKey}/updateMe`, { method: "POST", body: JSON.stringify(obj) })
}

export function whoAmI(gameID: string, accessKey: string): Promise<Result<{}>> {
	return call(`/${gameID}/${accessKey}/whoAmI`)
}