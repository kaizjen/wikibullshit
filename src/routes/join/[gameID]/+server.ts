import type { GamePlayer } from '$lib/apitypes.js';
import { redirect } from '@sveltejs/kit';

export async function GET(req): Promise<Response> {
	const alreadyJoinedGame = req.cookies.get('gameID');
	const alreadyAccessKey = req.cookies.get('accessKey');

	if (alreadyJoinedGame == req.params.gameID && alreadyAccessKey) {
		return redirect(302, `/play/#${alreadyJoinedGame}/${alreadyAccessKey}`);
	}

	const res = await req.fetch(`/api/${req.params.gameID}/joinGame`);

	if (!res.ok) {
		return res;
	}

	const json = await res.json() as GamePlayer;

	return redirect(302, `/play/#${json.gameID}/${json.key}`);
}