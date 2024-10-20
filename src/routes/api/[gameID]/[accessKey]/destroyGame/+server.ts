import { db } from "$lib/server/firebase";
import { verifyHost } from "$lib/server/game";
import { type TypedResponse, respond } from "$lib/server/response";
import { error } from "@sveltejs/kit";

export async function GET(req): Promise<TypedResponse<{}>> {
	const { gameID, accessKey } = req.params;
	const ref = db.ref(`/games/${gameID}`);

	const hostID = await verifyHost(ref, accessKey);
	if (!hostID) {
		return error(403, "E12; Only the host can destroy the game")
	}

	await ref.remove();

	req.cookies.delete("gameID", { path: "/" });
	req.cookies.delete("accessKey", { path: "/" });

	return respond({});
}