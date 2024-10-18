import type { Access } from "$lib/apitypes";
import type { Reference } from "firebase-admin/database";

export async function getIDFromAccessKey(ref: Reference, accessKey: string): Promise<string | undefined> {
	const userID = (await ref.child(`/access/${accessKey}/id`).get()).val();
	return userID;
}

/** @param ref - Should point to the /games/<GameID>/ */
export async function verifyHost(ref: Reference, accessKey: string): Promise<null | string> {
	const userID = await getIDFromAccessKey(ref, accessKey);
	const host = (await ref.child(`/data/host`).get()).val()
	return (userID === host) ? host : null;
}


/** @param ref - Should point to the /games/<GameID>/ */
export async function kickPlayer(ref: Reference, userID: string, accessKey?: string): Promise<void> {
	if (!accessKey) {
		const access = (await ref.child(`/access`).get()).val() as Record<string, Access>;
		for (const key in access) {
			const info = access[key];
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
		[`/access/${accessKey}`]: null
	})
}