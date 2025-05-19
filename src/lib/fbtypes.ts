type Game = {
	last_interaction: number
	truthteller: string
	access: {
		[key: string]: {
			article: string
			id: string
		}
	}
	data: {
		players: {
			[id: string]: {
				name?: string
				pic?: string
				points?: number
			}
		}
		chosenArticle?: string
		host: string
		readies: Record<string, boolean>
	}
}