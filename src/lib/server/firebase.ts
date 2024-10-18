import { dev } from "$app/environment";
import { FIREBASE_SECRET, FIREBASE_URL } from "$env/static/private";
import admin from "firebase-admin"

const app = admin.initializeApp({
	credential: admin.credential.cert(JSON.parse(FIREBASE_SECRET)),
	databaseURL: FIREBASE_URL
}, `srv:${dev ? "dev" : "prod"}:` + Math.random().toString());

export const db = admin.database(app);