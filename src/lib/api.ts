import type { CorrectAnswer, GamePlayer } from "./apitypes";
import { FailedResult, type Result } from "./util";

async function call(method: string, init?: RequestInit): Promise<Result<any>> {
	try {
		const res = await fetch("/api" + method, init);
		
		if (!res.ok) {
			return new FailedResult(await res.text());
		}

		const json = await res.json();
		return json as any;

	} catch (error) {
		return new FailedResult(error);
	}
}

export function newGame(): Promise<Result<GamePlayer>> {
	return call(`/newGame`, { method: "POST" })
}

export function joinGame(gameID: string): Promise<Result<GamePlayer>> {
	return call(`/${gameID}/joinGame`, { method: "POST" })
}

export function destroyGame(gameID: string, accessKey: string): Promise<Result<{}>> {
	return call(`/${gameID}/${accessKey}/destroyGame`, { method: "POST" })
}

export function guess(gameID: string, accessKey: string, userID: string): Promise<Result<CorrectAnswer>> {
	return call(`/${gameID}/${accessKey}/guess/${userID}`, { method: "POST" })
}

export function kick(gameID: string, accessKey: string, userID: string): Promise<Result<{}>> {
	return call(`/${gameID}/${accessKey}/kick/${userID}`, { method: "POST" })
}

export function transferHost(gameID: string, accessKey: string, userID: string): Promise<Result<{}>> {
	return call(`/${gameID}/${accessKey}/transferHost/${userID}`, { method: "POST" })
}

export function leaveGame(gameID: string, accessKey: string): Promise<Result<{}>> {
	return call(`/${gameID}/${accessKey}/leaveGame`, { method: "POST" })
}

export function selectArticle(gameID: string, accessKey: string): Promise<Result<{}>> {
	return call(`/${gameID}/${accessKey}/selectArticle`, { method: "POST" })
}

export function resetArticle(gameID: string, accessKey: string): Promise<Result<{}>> {
	return call(`/${gameID}/${accessKey}/resetArticle`, { method: "POST" })
}

export function updateMe(gameID: string, accessKey: string, obj: { name?: string, pic?: string }): Promise<Result<{}>> {
	return call(`/${gameID}/${accessKey}/updateMe`, { method: "POST", body: JSON.stringify(obj) })
}

export function whoAmI(gameID: string, accessKey: string): Promise<Result<{}>> {
	return call(`/${gameID}/${accessKey}/whoAmI`)
}