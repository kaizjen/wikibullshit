<style>
	.room {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 8px;
	}
	.gameid {
		font-family: monospace;
		font-size: large;
		user-select: all;
		position: relative;
	}
	.hide {
		visibility: hidden;
	}
	.abs {
		position: absolute;
	}
</style>
<script lang="ts">
	import Icon from "$lib/Icon.svelte";

	export let gameID: string;

	let showed = false;
	const hiddenWith = "••••••";
</script>

<svelte:document
	on:copy={(e) => {
		if (document.getSelection()?.toString() == hiddenWith) {
			e.clipboardData?.setData("text/plain", gameID); e.preventDefault();
		}
	}}
/>
<div class="room">
	<span class="gameid">
		{#if showed}
			{gameID}
		{:else}
			{hiddenWith}
		{/if}
	</span>
	<button class="button" on:click={() => showed = !showed}>
		{#if showed}
			<span class="abs">Hide</span>
			<span class="hide">Show</span>
		{:else}
			Show
		{/if}
	</button>
	<button class="hollow" title="Click to copy the link to this game!" on:click={() => navigator.clipboard.writeText(`${location.origin}/join/${gameID}`)}>
		<Icon>link</Icon>
	</button>
</div>