import type { GamePlayer } from '$lib/apitypes';
import { cleanupGames, db } from '$lib/server/firebase.js';
import { respond, type TypedResponse } from '$lib/server/response.js';
import { timestamp } from '$lib/util.js';
import { error } from '@sveltejs/kit';
import { randomBytes } from "crypto";
//@ts-ignore
import njr from "name-jam-rator";

export async function POST(req): Promise<TypedResponse<GamePlayer>> {
	const gameID = req.params.gameID;
	if (gameID == "gameID") {
		return error(404, "E1; Game does not exist")
	}

	cleanupGames(db.ref('/games'));
	const ref = db.ref(`/games/${gameID}`);
	const game = (await ref.get()).val() as Game;

	if (!game) {
		return error(404, "E1; Game does not exist")
	}

	const userID = Math.floor(Math.random() * 10e12).toString(36);
	const accessKey = randomBytes(32).toString('base64url')
	if (userID in game.data.players) {
		// TODO: reroll user id (ew)
		return error(500, "E2; Failed to join, try again")
	}

	ref.update({
		[`/last_interaction`]: timestamp(),
		[`/data/players/${userID}`]: {
			name: njr()[0],
			pic: "",
			points: 0,
		},
		[`/data/readies/${userID}`]: false,
		[`/access/${accessKey}`]: {
			article: "",
			id: userID
		}
	})

	req.cookies.set("gameID", gameID, { path: "/" });
	req.cookies.set("accessKey", accessKey, { path: "/" });

	return respond({
		gameID, uid: userID, key: accessKey
	})
}