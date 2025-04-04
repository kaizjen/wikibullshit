<style>
	.backdrop {
		background-color: rgba(255, 255, 255, 0.4);
		z-index: 999;
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		display: flex;
		justify-content: center;
		align-items: center;
	}
	main {
		display: flex;
		flex-direction: column;
		align-items: center;
	}
	.logo {
		max-height: 5em;
		max-width: 100%;
	}
	.catchphrase {
		text-align: center;
	}
	.buttons {
		margin-top: 3em;
		margin-bottom: 1em;
		text-align: center;
	}
	footer {
		position: fixed;
		bottom: 1em;
		left: 0;
		width: 100%;
		padding-inline: .5em;
		box-sizing: border-box;
		text-align: center;
		display: flex;
		justify-content: center;
	}
</style>
<script lang="ts">
	import { goto } from "$app/navigation";
	import { newGame } from "$lib/api";
	import Explainer from "$lib/Explainer.svelte";
	import { setPortal } from "$lib/teleport";
	import { ok } from "$lib/util";
	import { onMount } from "svelte";
	import JoinDialog from "./JoinDialog.svelte";
	import ErrorDialog from "./ErrorDialog.svelte";
	import { fade } from "svelte/transition";

	let portal: HTMLDivElement;

	let explainer = false;
	let joinDialog = false;
	let error = '';

	let loading = false;

	onMount(() => {
		setPortal(portal);
	})

	async function startGame() {
		loading = true;
		const res = await newGame();
		loading = false;
		if (!ok(res)) {
			console.error("can't create new game:", res.error);
			try {
				error = `Can't create a game: ${JSON.parse(res.error).message.split('; ')[1] || 'unknown error'}`
			} catch (_) {
				error = `Can't create a game: ${res.error}`
			}
			return;
		}
		goto('/play');
	}
</script>

<svelte:head>
	<title>Wikibullshit</title>
</svelte:head>

<div class="portal" bind:this={portal}></div>
<main>
	<div>
		<img class="logo" src="/wikibullshit-transparent.png" alt="The Wikibullshit logo">
	</div>
	<div class="catchphrase">
		<i>A game about lies, deception and Wikipedia articles</i>
	</div>
	<div class="buttons">
		<button class="accent" on:click={startGame}>
			New game
		</button>
		<span>or</span>
		<button class="button" on:click={() => { joinDialog = !joinDialog; }}>
			Join game
		</button>
	</div>
	<div>
		<a href="#__" on:click|preventDefault={() => { explainer = !explainer; }}>About & How to play</a>
	</div>
</main>

<footer>
	<div>
		Made with &hearts; by kaizjen
		•
		<a href="https://github.com/kaizjen/wikibullshit" target="_blank">
			Source code
			<img src="/ext.svg" alt="external link">
		</a>
		•
		Idea blatantly stolen from "<a href="https://www.youtube.com/playlist?list=PLrkYtXgEpu5QXFgFJO8SxTMa24wv7b40X" target="_blank">
			Two of these people are lying
			<img src="/ext.svg" alt="external link">
		</a>"
	</div>
</footer>

{#if explainer}
	<Explainer on:close={() => explainer = false} />
{/if}

{#if joinDialog}
	<JoinDialog on:close={() => joinDialog = false} on:error={e => error = e.detail} />
{/if}

{#if error}
	<ErrorDialog err={error} on:close={() => error = ''} />
{/if}

{#if loading}
	<div class="backdrop" transition:fade={{ duration: 200 }}></div>
{/if}