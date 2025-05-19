import type { GamePlayer } from '$lib/apitypes.js';
import { isBot } from '$lib/server/nobots.js';
import { redirect } from '@sveltejs/kit';

export async function GET(req): Promise<Response> {
	if (isBot(req)) {
		return new Response(`
			<html>
				<head>
					<title>Join this Wikibullshit game</title>
				</head>
				<body>
					<span>We think you're a bot. If not, click <button id="b">here</button></span>
					<script>
						const b = document.getElementById("b");
						b.onclick = async () => {
							const res = await (await fetch("/api/${req.params.gameID}/joinGame", { method: "POST" })).json();
							location.href = "/play#" + res.gameID + "/" + res.key
						}
					</script>
				</body>
			</html>
		`, { headers: { 'Content-Type': "text/html" } });
	}

	const alreadyJoinedGame = req.cookies.get('gameID');
	const alreadyAccessKey = req.cookies.get('accessKey');

	if (alreadyJoinedGame == req.params.gameID && alreadyAccessKey) {
		return redirect(302, `/play`);
	}

	const res = await req.fetch(`/api/${req.params.gameID}/joinGame`, { method: "POST" });

	if (!res.ok) {
		return redirect(302, `/?thrown=no_game`);
	}

	const json = await res.json() as GamePlayer;

	return redirect(302, `/play`);
}