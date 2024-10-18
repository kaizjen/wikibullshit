<style>
	.main {
		padding: 16px;
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
	import { resetArticle } from "$lib/api";

	let loading = false;

	const dispatch = createEventDispatcher();

	async function go() {
		if (loading) return;
		loading = true
		await resetArticle($gameState.gameID, $gameState.accessKey);
		loading = false
		dispatch('close')
	}
</script>
<Dialog title="Are you sure?" on:close={() => dispatch('close')}>
	<form action="" on:submit|preventDefault={go}>
		<div class="main">
			Even if you generally know what "{$gameState.chosenArticle}" means,
			give the players a chance to explain themselves, becasue this game is about
			<i>Wikipedia articles</i>, not definitions of words. (Think Apple the company vs Apple the fruit)<br>
			But it's your call, you're the <s>boss</s> host. 
		</div>
		<div class="bottom">
			<button disabled={loading} class="destructive" on:click={go}>
				{loading ? "As you wish..." : "Yes, stop the game!"}
			</button>
		</div>
	</form>
</Dialog>