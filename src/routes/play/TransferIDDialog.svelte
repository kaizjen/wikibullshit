<style>
	.main {
		padding: 16px;
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
	import Dialog from "./Dialog.svelte";
	import { gameState } from "./gamestate";
	import { kick, transferHost } from "$lib/api";

	export let id: string;

	let loading = false;

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
		<div class="main">
			Hey, wait, after you transfer the host, you'll just be a regular player, and will have to lie to your friends (evil!).
			You won't get the host controls unless someone transfers the host back to you.
		</div>
		<div class="bottom">
			<button disabled={loading} class="destructive" on:click={go}>
				{loading ? "Wait" : "Do it!"}
			</button>
		</div>
	</form>
</Dialog>