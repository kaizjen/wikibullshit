import type { GamePlayer } from '$lib/apitypes.js';
import { redirect } from '@sveltejs/kit';

export async function GET(req): Promise<Response> {
	const res = await req.fetch(`/api/newGame`);

	if (!res.ok) {
		return res;
	}

	const json = await res.json() as GamePlayer;

	return redirect(302, `/play/#${json.gameID}/${json.key}`);
}