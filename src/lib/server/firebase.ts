import { dev } from "$app/environment";
import { FIREBASE_SECRET, FIREBASE_URL } from "$env/static/private";
import { timestamp } from "$lib/util";
import admin from "firebase-admin"
import type { Reference } from "firebase-admin/database";

const app = admin.initializeApp({
	credential: admin.credential.cert(JSON.parse(FIREBASE_SECRET)),
	databaseURL: FIREBASE_URL
}, `srv:${dev ? "dev" : "prod"}:` + Math.random().toString());

export const db = admin.database(app);

/** @param ref Reference to `/games` */
export async function cleanupGames(ref: Reference) {
	const ts = timestamp();
	const games = (await ref.get()).val() as any;

	const rm: string[] = [];

	for (const gameID in games) {
		if (gameID == "gameID") continue;
		const element = games[gameID];
		if (ts - element.last_interaction > (60*60*5*1000)) {
			rm.push(gameID)
		}
	}

	rm.forEach(key => {
		ref.child(key).remove()
	})
}