import type { GamePlayer } from '$lib/apitypes';
import { db } from '$lib/server/firebase.js';
import { respond, type TypedResponse } from '$lib/server/response.js';
import { error } from '@sveltejs/kit';
import { randomBytes } from "crypto";
//@ts-ignore
import njr from "name-jam-rator";

export async function GET(req): Promise<TypedResponse<GamePlayer>> {
	const gameID = req.params.gameID;
	const ref = db.ref(`/games/${gameID}`);
	if (!(await ref.get()).exists()) {
		return error(404, "E1; Game does not exist")
	}

	const userID = Math.floor(Math.random() * 10e12).toString(36);
	const accessKey = randomBytes(32).toString('base64url')
	if ((await ref.child(`/data/players/${userID}`).get()).exists()) {
		return error(500, "E2; Failed to join, try again")
	}

	ref.update({
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