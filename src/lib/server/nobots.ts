import type { RequestEvent } from "@sveltejs/kit";

export function isBot(req: RequestEvent): boolean {
	const ua = req.request.headers.get("User-Agent");
	if (!ua) return true;

	if (ua.toLowerCase().includes("bot") || ua.includes("facebookexternalhit")) {
		return true
	}
	return false;
}