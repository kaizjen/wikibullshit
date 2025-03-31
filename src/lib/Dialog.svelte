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
	.dialog {
		background-color: var(--background-color-base);
		display: flex;
		flex-direction: column;
		box-shadow: 1px 1px 6px 0px var(--background-color-backdrop-dark);
		min-width: 20vw;
		max-width: 40vw;
		border-radius: 2px;
	}
	.header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 8px;
		padding-inline-start: 16px;
		border-bottom: 1px solid var(--border-color-subtle,#c8ccd1);
	}
	h4 {
		margin: 0;
	}
</style>
<script lang="ts">
	import Icon from "$lib/Icon.svelte";
	import { createEventDispatcher } from "svelte";
	import { teleport } from "$lib/teleport";
	import { fade, scale } from "svelte/transition";
	import { cubicOut } from "svelte/easing";

	export let title: string;

	const dispatch = createEventDispatcher();
</script>

<svelte:document
	on:keyup={e => {
		if (e.key == "Escape") {
			dispatch('close')
		}
	}}
/>
<div use:teleport class="backdrop" transition:fade={{ duration: 200 }}>
	<div transition:scale={{ duration: 200, opacity: 0.1, start: 0.8, easing: cubicOut }} role="dialog" aria-label={title} class="dialog">
		<div class="header">
			<h4>{title}</h4>
			<button class="hollow" on:click={() => dispatch('close')}>
				<Icon>close</Icon>
			</button>
		</div>
		<div class="content">
			<slot />
		</div>
	</div>
</div>