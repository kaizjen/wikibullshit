import { leaveGame } from "$lib/api";
import type { Access } from "$lib/apitypes";
import { firebase } from "$lib/clientfirebase";
import { FailedResult, ok, type Result } from "$lib/util";
import { child, get, getDatabase, onValue, ref, set, type DatabaseReference } from "firebase/database";

export class Gettable<T> {
	private subscribers: ((v: T, updateID: number) => any)[] = [];
	constructor(private value: T) {

	}

	get() {
		return this.value;
	}
	update(updateID = 0) {
		this.subscribers.forEach(f => f(this.value, updateID))
	}
	subscribe(subscriber: (v: T, updateID: number) => any) {
		this.subscribers.push(subscriber);
		subscriber(this.value, -1);
		return () => {
			this.subscribers.splice(this.subscribers.indexOf(subscriber), 1)
		}
	}
}

type User = {
	id: string
	name: string
	pic: string
	points: number
	ready: boolean
}
type GameState = {
	real: boolean
	gameID: string
	accessKey: string
	users: Record<string, User>
	host: string
	me: string
	chosenArticle: string
	myArticle: string
};

export const gameState = new Gettable<GameState>({
	real: false,
	gameID: "------",
	accessKey: "-this-guy-is-NOT-real-",
	users: {
		"------": {
			id: "------",
			name: "Wait! Loading!",
			pic: "",
			points: 0,
			ready: false
		}
	},
	host: "------",
	me: "------",
	chosenArticle: "",
	myArticle: ""
});

//@ts-ignore
globalThis['gameState'] = gameState;

type GameData = {
	chosenArticle: string
	host: string
	players: Record<string, {
		name: string,
		pic: string,
		points: number
	}>
	readies: Record<string, boolean>
}

let myArticleRef: DatabaseReference | undefined;
let myReadyRef: DatabaseReference | undefined;

export let unsubscribe = () => {};
export async function setupGame(gameID: string, accessKey: string, _firstTime?: boolean): Promise<Result<null>> {
	unsubscribe();

	if (_firstTime && gameState.get().real) {
		return null;
	}

	console.log("[gamestate] Setting up game!");
	try {
		const gameRef = ref(getDatabase(firebase), `/games/${gameID}`);
		const myAccessRef = child(gameRef, `/access/${accessKey}`);
		const dataRef = child(gameRef, `/data`);
	
		const access = (await get(myAccessRef)).val() as Access | undefined;

		if (!access) {
			const res = await leaveGame(gameID, accessKey);
			console.log("leaveGame response:", res)
			location.href = '/?thrown=' + (ok(res) ? 'unknown' : 'kicked')
			return new FailedResult("Kicked out?");
		}
	
		myArticleRef = child(myAccessRef, "/article");
		myReadyRef = child(dataRef, `/readies/${access.id}`);
	
		let unsubscribeData = onValue(dataRef, async snapshot => {
			const data = snapshot.val() as GameData;
			console.log("data:onValue", data)
			const gs = gameState.get()

			if (!data) {
				return;
			}
	
			gs.chosenArticle = data.chosenArticle;
			gs.host = data.host;
			gs.users = {};
			for (const userID in data.players) {
				const player = data.players[userID];
				gs.users[userID] = {
					id: userID,
					name: player.name,
					pic: player.pic,
					points: player.points,
					ready: data.readies[userID] ?? false
				}
			}
	
			gs.real = true;
			gs.me = access.id;
			gs.myArticle = access.article;

			gs.gameID = gameID;
			gs.accessKey = accessKey;

			if (!Object.keys(gs.users).includes(access.id)) {
				console.error("[gamestate] Can't find myself in users, kicked?")
				const res = await leaveGame(gameID, accessKey);
				console.log("leaveGame response:", res)
				location.href = '/?thrown=' + (ok(res) ? 'unknown' : 'kicked');
				return;
			}
	
			console.log("[gamestate] Game state updated!")
			gameState.update();
		})

		let unsubscribeArticle = onValue(myArticleRef, art => {
			const myArticle = art.val() as string;
			console.log("myArticle:onValue", myArticle)
			gameState.get().myArticle = myArticle;
			console.log("[gamestate] Article updated to: ", myArticle)
			gameState.update();
		})
	
		unsubscribe = () => { unsubscribeData(); unsubscribeArticle(); unsubscribe = () => {}; }

		return null;
	} catch (error) {
		return new FailedResult(error)
	}
}

export async function setReady(to: boolean): Promise<Result<null>> {
	if (!myReadyRef) {
		return new FailedResult("Game not initialized")
	}

	await set(myReadyRef, to);
	return null;
}

export async function changeArticle(to: string): Promise<Result<null>> {
	if (!myArticleRef) {
		return new FailedResult("Game not initialized")
	}

	await set(myArticleRef, to);
	return null;
}