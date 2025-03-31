import type { GamePlayer } from '$lib/apitypes';
import { cleanupGames, db } from '$lib/server/firebase.js';
import { respond, type TypedResponse } from '$lib/server/response.js';
import { timestamp } from '$lib/util.js';
import { error } from '@sveltejs/kit';
import { randomBytes } from "crypto";
//@ts-ignore
import njr from "name-jam-rator";

export async function GET(req): Promise<TypedResponse<GamePlayer>> {
	const gameID = Math.floor(Math.random() * 10e9).toString(36).slice(0, 6).toUpperCase();
	const games = db.ref(`/games`);
	cleanupGames(games);
	const ref = games.child(gameID);
	if ((await ref.get()).exists()) {
		return error(500, "E0; Something went wrong, try again")
	}

	const userID = Math.floor(Math.random() * 10e12).toString(36);
	const accessKey = randomBytes(32).toString('base64url')
	await ref.set({
		truthteller: "",
		last_interaction: timestamp(),
		access: {
			[accessKey]: {
				article: "",
				id: userID
			}
		},
		data: {
			chosenArticle: "",
			host: userID,
			readies: {
				[userID]: true
			},
			players: {
				[userID]: {
					name: njr()[0],
					pic: "",
					points: 0,
				}
			}
		}
	});

	req.cookies.set("gameID", gameID, { path: "/" });
	req.cookies.set("accessKey", accessKey, { path: "/" });

	return respond({
		gameID, uid: userID, key: accessKey
	})
}