import { db } from '$lib/server/firebase';
import { verifyHost } from '$lib/server/game';
import { respond, type TypedResponse } from '$lib/server/response';
import { error } from '@sveltejs/kit';

export async function POST(req): Promise<TypedResponse<{}>> {
	const { gameID, accessKey, userID } = req.params;
	const ref = db.ref(`/games/${gameID}`);
	const game = (await ref.get()).val() as Game;

	const hostID = await verifyHost(game, accessKey);
	if (!hostID) {
		return error(403, "E6; Only the host can transfer the host")
	}

	const chosenArticle = game.data.chosenArticle;
	if (chosenArticle) {
		return error(400, "E7; The host cannot be transferred until this round ends")
	}

	const exists = userID in game.data.players;
	if (!exists) {
		return error(404, "E8; The user to transfer host to doesn't exist")
	}

	await ref.update({
		[`/data/host`]: userID,
		[`/data/readies/${userID}`]: true,
		[`/data/readies/${hostID}`]: false,
	})
	
	return respond({});
}