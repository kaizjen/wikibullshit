import type { GamePlayer } from '$lib/apitypes.js';
import { isBot } from '$lib/server/nobots';
import { redirect } from '@sveltejs/kit';

export async function GET(req): Promise<Response> {
	if (isBot(req)) {
		return new Response(`
			<html>
				<head>
					<title>New Wikibullshit game</title>
				</head>
				<body>
					<span>We think you're a bot. If not, click <button id="b">here</button></span>
					<script>
						const b = document.getElementById("b");
						b.onclick = async () => {
							const res = await (await fetch("/api/newGame", { method: "POST" })).json();
							location.href = "/play#" + res.gameID + "/" + res.key
						}
					</script>
				</body>
			</html>
		`, { headers: { 'Content-Type': "text/html" } });
	}

	const res = await req.fetch(`/api/newGame`, { method: "POST" });

	if (!res.ok) {
		return res;
	}

	const json = await res.json() as GamePlayer;

	return redirect(302, `/play/#${json.gameID}/${json.key}`);
}