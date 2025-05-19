<style>
	.main {
		padding: 16px;
	}
	.warn {
		color: var(--color-destructive);
	}
	.bottom {
		padding: 8px;
		display: flex;
		justify-content: end;
	}
</style>
<script lang="ts">
	import { createEventDispatcher } from "svelte";
	import Dialog from "$lib/Dialog.svelte";
	import { gameState } from "./gamestate";
	import { kick } from "$lib/api";

	export let id: string;

	let loading = false;
	$: gameInProgress = $gameState.chosenArticle != '';

	const dispatch = createEventDispatcher();

	async function go() {
		if (loading) return;
		loading = true
		await kick($gameState.gameID, $gameState.accessKey, id);
		loading = false
		dispatch('close')
	}
</script>
<Dialog title="Kick {$gameState.users[id]?.name ?? "(wait who?)"}?" on:close={() => dispatch('close')}>
	<form action="" on:submit|preventDefault={go}>
		<div class="main">
			They'll still be able to join if they have the room code.
			{#if gameInProgress}
				<div class="warn">Warning: This action will forcefully end the current round.</div>
			{/if}
		</div>
		<div class="bottom">
			<button disabled={loading} class="destructive" on:click={go}>
				{loading ? "Wait" : "Kick 'em!"}
			</button>
		</div>
	</form>
</Dialog>