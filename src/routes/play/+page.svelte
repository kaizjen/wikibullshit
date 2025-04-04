<style>
	.top {
		display: flex;
		flex-wrap: wrap;
		justify-content: space-between;
		align-items: center;
		padding-inline: 16px;
		gap: 16px;
	}

	.leftside {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: 32px;
	}

	.logo {
		position: relative;
		font-size: xxx-large;
		display: flex;
	}
	.logo img {
		height: 1em;
	}

	.gamearea {
		display: flex;
		justify-content: center;
		align-items: center;
		margin-top: 16px;
	}
</style>
<script lang="ts">
	import { goto } from "$app/navigation";
	import { ok } from "$lib/util";
	import { onMount } from "svelte";
  import GameId from "./GameID.svelte";
	import { setupGame } from "./gamestate";
	import Player from "./Player.svelte";
	import { setPortal } from "$lib/teleport";
	import Game from "./Game.svelte";

	export let data;

	let [gameID, accessKey] = location.hash.slice(1).split('/');

	if (!gameID || !accessKey) {
		gameID = data.gameID || '';
		accessKey = data.accessKey || '';
	}

	if (!gameID || !accessKey) {
		goto("/?thrown=unknownGame");

	} else {
		setupGame(gameID, accessKey, true).then(result => {
			if (!ok(result)) {
				goto("/?thrown=gameFinished");

			} else {
				localStorage.setItem('gameID', gameID);
				localStorage.setItem('accessKey', accessKey);
				location.hash = '';
			}
		});
	}

	let portal: HTMLElement;

	onMount(() => {
		setPortal(portal);
	})
</script>
<div class="portal" bind:this={portal}></div>
<main>
	<div class="top">
		<div class="leftside">
			<div class="logo">
				<img src="/wikibullshit-transparent.png" alt="Wikibullshit's logo">
			</div>
			<GameId {gameID} />
		</div>
		<Player />
	</div>
	<div class="gamearea">
		<Game />
	</div>
</main>