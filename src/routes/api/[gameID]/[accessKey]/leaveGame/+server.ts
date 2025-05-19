import { db } from '$lib/server/firebase';
import { getIDFromAccessKey, kickPlayer } from '$lib/server/game.js';
import { respond, type TypedResponse } from '$lib/server/response.js';
import { error } from '@sveltejs/kit';

export async function POST(req): Promise<TypedResponse<{}>> {
	const { gameID, accessKey } = req.params;
	const ref = db.ref(`/games/${gameID}`);
	const game = (await ref.get()).val() as Game;

	const userID = await getIDFromAccessKey(game, accessKey);
	if (!userID) {
		req.cookies.delete("gameID", { path: "/" });
		req.cookies.delete("accessKey", { path: "/" });
		return error(403, "E9; You do not exist")
	}

	const hostID = game.data.host;
	if (userID == hostID) {
		const players = game.data.players;
		const ids = Object.keys(players);
		let newHost = ids[0]
		if (newHost == userID) {
			if (ids.length > 1) {
				newHost = ids[1]

			} else {
				ref.remove();
				return respond({});
			}
		}

		await ref.child(`/data/host`).set(newHost);
		await ref.update({
			[`/truthteller`]: "",
			[`/data/chosenArticle`]: "",
		})
	}

	const truthteller = game.truthteller;
	if (truthteller == userID) {
		await ref.update({
			[`/truthteller`]: "",
			[`/data/chosenArticle`]: "",
		})
	}

	await kickPlayer(game, ref, userID, accessKey);

	req.cookies.delete("gameID", { path: "/" });
	req.cookies.delete("accessKey", { path: "/" });

	return respond({});
}