import type { CorrectAnswer } from "$lib/apitypes.js";
import { db } from "$lib/server/firebase";
import { verifyHost } from "$lib/server/game";
import { type TypedResponse, respond } from "$lib/server/response";
import { error } from "@sveltejs/kit";
import { ServerValue } from "firebase-admin/database";

export async function POST(req): Promise<TypedResponse<{}>> {
	const { gameID, accessKey } = req.params;
	const ref = db.ref(`/games/${gameID}`);

	const hostID = verifyHost((await ref.get()).val(), accessKey);
	if (!hostID) {
		return error(403, "E15; Only the host can reset the game")
	}

	ref.update({
		[`/truthteller`]: "",
		[`/data/chosenArticle`]: "",
	})

	return respond({});
}