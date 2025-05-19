<style>
	.main {
		padding: 16px;
	}
	.bottom {
		padding: 8px;
		display: flex;
		justify-content: end;
	}
	h5 {
		margin: 0;
		margin-bottom: 8px;
	}
	.err {
		color: var(--color-destructive);
	}
</style>
<script>
	import { createEventDispatcher } from "svelte";
	import Dialog from "$lib/Dialog.svelte";
	import { gameState } from "./gamestate";
	import { updateMe } from "$lib/api";

	let name = $gameState.users[$gameState.me].name;

	let loading = false;
	$: invalid = name.length >= 48;

	const dispatch = createEventDispatcher();

	async function go() {
		if (loading) return;
		loading = true
		await updateMe($gameState.gameID, $gameState.accessKey, { name });
		loading = false
		dispatch('close')
	}
</script>
<Dialog title="Change your name" on:close={() => dispatch('close')}>
	<form action="" on:submit|preventDefault={go}>
		<div class="main">
			<h5>Enter your new name:</h5>
			<input disabled={loading} type="text" bind:value={name}>
			{#if invalid}
				<span class="err">
					Your name can't be longer than 48 characters.
				</span>
			{/if}
		</div>
		<div class="bottom">
			<button disabled={loading || invalid} class="accent" on:click={go}>
				{loading ? "Saving" : "Save"}
			</button>
		</div>
	</form>
</Dialog>