import type { PageServerLoad } from "./$types"

export const load: PageServerLoad = (req) => {
	return {
		accessKey: req.cookies.get('accessKey'),
		gameID: req.cookies.get('gameID')
	}
}