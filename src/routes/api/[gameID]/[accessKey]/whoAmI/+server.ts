import type { GamePlayer } from '$lib/apitypes.js';
import { db } from '$lib/server/firebase';
import { getIDFromAccessKey } from '$lib/server/game.js';
import { respond, type TypedResponse } from '$lib/server/response.js';
import { error } from '@sveltejs/kit';

export async function GET(req): Promise<TypedResponse<GamePlayer>> {
	const { gameID, accessKey } = req.params;
	const ref = db.ref(`/games/${gameID}`);

	const userID = await getIDFromAccessKey(ref, accessKey);
	if (!userID) {
		return error(403, "E9; You do not exist")
	}

	return respond({ gameID, key: accessKey, uid: userID });
}