import { db } from "$lib/server/firebase";
import { kickPlayer, verifyHost } from "$lib/server/game";
import { type TypedResponse, respond } from "$lib/server/response";
import { error } from "@sveltejs/kit";

export async function GET(req): Promise<TypedResponse<{}>> {
	const { gameID, accessKey, userID } = req.params;
	const ref = db.ref(`/games/${gameID}`);

	const hostID = await verifyHost(ref, accessKey);
	if (!hostID) {
		return error(403, "E10; Only the host can kick players")
	}

	if (userID == hostID) {
		return error(400, "E11; Tried to kick yourself")
	}

	await ref.update({
		[`/truthteller`]: "",
		[`/data/chosenArticle`]: "",
	})

	await kickPlayer(ref, userID);
	return respond({});
}