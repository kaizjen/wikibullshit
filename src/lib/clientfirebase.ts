// Import the functions you need from the SDKs you need

import { initializeApp } from "firebase/app";

// TODO: Add SDKs for Firebase products that you want to use

// https://firebase.google.com/docs/web/setup#available-libraries


// Your web app's Firebase configuration

const firebaseConfig = {
	apiKey: "AIzaSyCvxwypYtSLLPQbsamgKz-XXfy1I4xy5vo",
	authDomain: "wikibullshit.firebaseapp.com",
	databaseURL: "https://wikibullshit-default-rtdb.europe-west1.firebasedatabase.app",
	projectId: "wikibullshit",
	storageBucket: "wikibullshit.appspot.com",
	messagingSenderId: "1009129156060",
	appId: "1:1009129156060:web:b889229348b388508ef319"
};


// Initialize Firebase

export const firebase = initializeApp(firebaseConfig);