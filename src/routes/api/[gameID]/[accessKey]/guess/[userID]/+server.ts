import type { CorrectAnswer } from "$lib/apitypes.js";
import { db } from "$lib/server/firebase";
import { verifyHost } from "$lib/server/game";
import { type TypedResponse, respond } from "$lib/server/response";
import { error } from "@sveltejs/kit";
import { ServerValue } from "firebase-admin/database";

export async function GET(req): Promise<TypedResponse<CorrectAnswer>> {
	const { gameID, accessKey, userID } = req.params;
	const ref = db.ref(`/games/${gameID}`);

	const hostID = await verifyHost(ref, accessKey);
	if (!hostID) {
		return error(403, "E13; Only the host can guess")
	}

	const truthteller = (await ref.child(`/truthteller`).get()).val();

	const thisGuyIsReal = (await ref.child(`/data/players/${truthteller}`).get()).exists()
	if (!thisGuyIsReal) {
		await ref.update({
			[`/truthteller`]: "",
			[`/data/chosenArticle`]: "",
		})
		return error(500, "E14; The truth-teller does not exist, everyone is lying! (bad state, no points awarded)")
	}

	ref.update({
		[`/truthteller`]: "",
		[`/data/chosenArticle`]: "",
		[`/data/players/${userID}/points`]: ServerValue.increment(1),
		[`/data/players/${hostID}/points`]: ServerValue.increment(userID == truthteller ? 1 : 0),
	})

	return respond({ truthteller });
}