import type { Access } from '$lib/apitypes';
import { db } from '$lib/server/firebase.js';
import { verifyHost } from '$lib/server/game.js';
import { respond, type TypedResponse } from '$lib/server/response.js';
import { error } from '@sveltejs/kit';

export async function POST(req): Promise<TypedResponse<{}>> {
	const { gameID, accessKey } = req.params;
	const ref = db.ref(`/games/${gameID}`);
	const game = (await ref.get()).val() as Game;

	const hostID = verifyHost(game, accessKey);
	if (!hostID) {
		return error(403, "E3; Only the host can start the game")
	}

	const readies = game.data.readies;
	for (const uid in readies) {
		if (uid == hostID) continue;
		if (!readies[uid]) {
			return error(400, "E4; The game can start only when all players are ready")
		}
	}

	const playersNoHost: (Access & { key: string })[] = [];

	const access = game.access;

	if (Object.keys(access).length < 3) {
		return error(500, "E16; Meaningless game, find more people.")
	}

	for (const key in access) {
		const info = access[key] as (Access & { key: string });
		info.key = key;

		if (info.id == hostID) continue;

		if (info.article == '') {
			return error(500, "E5; Some articles are blank (bad state)")
		}
		playersNoHost.push(info);
		// Reset the ready state of everyone so that when the game resets it's okay
		readies[info.id] = false;
	}

	const index = Math.floor(Math.random() * playersNoHost.length);
	const chosen = playersNoHost[index];

	await ref.update({
		[`/data/chosenArticle`]: chosen.article,
		[`/truthteller`]: chosen.id,
		// We need the truthteller to choose another article for the next round
		[`/access/${chosen.key}/article`]: "",
		[`/data/readies`]: readies
	})
	return respond({})
}