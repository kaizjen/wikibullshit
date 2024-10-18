export type GamePlayer = {
	gameID: string,
	uid: string,
	key: string
}

export type CorrectAnswer = {
	/** User ID who inputted the article */
	truthteller: string
}

export type Access = {
	article: string,
	id: string
}