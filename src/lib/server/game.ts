import type { Access } from "$lib/apitypes";
import { timestamp } from "$lib/util";
import type { Reference } from "firebase-admin/database";

export function getIDFromAccessKey(game: Game, accessKey: string): string | undefined {
	return game.access[accessKey]?.id;
}
export async function getIDFromAccessKeyRef(ref: Reference, accessKey: string): Promise<string | undefined> {
	const access = (await ref.child(`/access/${accessKey}`).get()).val() as Access;
	return access?.id;
}

/** @param ref - Should point to the /games/<GameID>/ */
export function verifyHost(game: Game, accessKey: string): null | string {
	const userID = getIDFromAccessKey(game, accessKey);
	const host = game.data.host
	return (userID === host) ? host : null;
}


/** @param ref - Should point to the /games/<GameID>/ */
export function kickPlayer(game: Game, ref: Reference, userID: string, accessKey?: string) {
	if (!accessKey) {
		for (const key in game.access) {
			const info = game.access[key];
			if (info.id == userID) {
				accessKey = key
			}
		}
	}
	if (!accessKey) {
		accessKey = "FAILED_TO_GET_ACCESSKEY"
		console.error("Failed to find accessKey of user with id " + userID)
	}

	ref.update({
		[`/data/players/${userID}`]: null,
		[`/data/readies/${userID}`]: null,
		[`/access/${accessKey}`]: null,
		[`/last_interaction`]: timestamp()
	})
}