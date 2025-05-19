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
</style>
<script lang="ts">
	import { createEventDispatcher } from "svelte";
	import Dialog from "$lib/Dialog.svelte";
	import { joinGame, updateMe } from "$lib/api";
	import { ok } from "$lib/util";
	import { goto } from "$app/navigation";

	const dispatch = createEventDispatcher();

	export let err: any;
</script>
<Dialog title="An error occured:" on:close={() => dispatch('close')}>
	<div class="main">
		<h5>{err}</h5>
	</div>
	<div class="bottom">
		<button class="accent" on:click={() => dispatch('close')}>
			Okay :(
		</button>
	</div>
</Dialog>