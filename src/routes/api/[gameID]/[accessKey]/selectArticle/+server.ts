import type { Access } from '$lib/apitypes';
import { db } from '$lib/server/firebase.js';
import { verifyHost } from '$lib/server/game.js';
import { respond, type TypedResponse } from '$lib/server/response.js';
import { error } from '@sveltejs/kit';

export async function GET(req): Promise<TypedResponse<{}>> {
	const { gameID, accessKey } = req.params;
	const ref = db.ref(`/games/${gameID}`);

	const hostID = await verifyHost(ref, accessKey);
	if (!hostID) {
		return error(403, "E3; Only the host can start the game")
	}

	const readies = (await ref.child(`/data/readies`).get()).val() as Record<string, boolean>;
	for (const uid in readies) {
		if (uid == hostID) continue;
		if (!readies[uid]) {
			return error(400, "E4; The game can start only when all players are ready")
		}
	}

	const articles: Access[] = [];
	
	const access = (await ref.child(`/access`).get()).val() as Record<string, Access>;
	const peoples: string[] = Object.keys(access);

	if (peoples.length < 3) {
		return error(400, "E16; Meaningless game, find more people.")
	}

	for (const key in access) {
		const info = access[key];
		if (info.id == hostID) continue;

		if (info.article == '') {
			return error(500, "E5; Some articles are blank (invalid state)")
		}
		articles.push(info);
		// Reset the ready state of everyone so that when the game resets it's okay
		readies[info.id] = false;
	}

	const index = Math.floor(Math.random() * articles.length);
	const chosen = articles[index];
	const chosenAccessKey = peoples[index];

	await ref.update({
		[`/data/chosenArticle`]: chosen.article,
		[`/truthteller`]: chosen.id,
		// We need the correct article to be re-chosen by the truthteller
		[`/access/${chosenAccessKey}/article`]: "",
		[`/data/readies`]: readies
	})
	return respond({})
}