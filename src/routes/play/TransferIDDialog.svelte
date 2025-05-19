<style>
	.main {
		padding: 16px;
	}
	.danger {
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
	import { transferHost } from "$lib/api";

	export let id: string;

	let loading = false;

	$: gameInProgress = $gameState.chosenArticle != '';

	const dispatch = createEventDispatcher();

	async function go() {
		if (loading) return;
		loading = true
		await transferHost($gameState.gameID, $gameState.accessKey, id);
		loading = false
		dispatch('close')
	}
</script>
<Dialog title="Make {$gameState.users[id].name} the new host?" on:close={() => dispatch('close')}>
	<form action="" on:submit|preventDefault={go}>
		<div class="main" class:danger={!gameInProgress}>
			{#if gameInProgress}
				You cannot transer the host until this round ends.
				You can click the panic button to end it forcefully (no points will be awarded).
			{:else}
				After you transfer the host, you'll become a regular player, and will have to lie to your friends (evil!).<br>
				You won't get the host controls unless someone transfers the host back to you.
			{/if}
		</div>
		<div class="bottom">
			<button disabled={loading || gameInProgress} class="destructive" on:click={go}>
				{gameInProgress ? "Nuh-uh" : (loading ? "Wait" : "Do it!")}
			</button>
		</div>
	</form>
</Dialog>