import { db } from '$lib/server/firebase';
import { getIDFromAccessKey } from '$lib/server/game.js';
import { respond, type TypedResponse } from '$lib/server/response.js';
import { error } from '@sveltejs/kit';

export async function POST(req): Promise<TypedResponse<{}>> {
	const { gameID, accessKey } = req.params;
	const json = await req.request.json() as { name?: string, pic?: string };

	const ref = db.ref(`/games/${gameID}`);

	const userID = await getIDFromAccessKey(ref, accessKey);
	if (!userID) {
		return error(403, "E9; You do not exist")
	}

	const updates: Record<string, any> = {};
	if (json.name) {
		if (typeof json.name != "string") return error(400, "E15; name must be a string");
		updates[`/data/players/${userID}/name`] = json.name;
	}
	if (json.pic) {
		if (typeof json.pic != "string") return error(400, "E16; pic must be a string");
		updates[`/data/players/${userID}/pic`] = json.pic;
	}

	await ref.update(updates);

	return respond({});
}