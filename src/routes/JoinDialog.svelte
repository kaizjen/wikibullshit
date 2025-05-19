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
<script>
	import { createEventDispatcher } from "svelte";
	import Dialog from "$lib/Dialog.svelte";
	import { joinGame, updateMe } from "$lib/api";
    import { ok } from "$lib/util";
    import { goto } from "$app/navigation";

	let loading = false;
	let code = "";

	const dispatch = createEventDispatcher();

	async function go() {
		if (loading) return;
		loading = true
		if (code.startsWith("http")) {
			try {
				const url = new URL(code);
				if (url.hostname != location.hostname) {
					loading = false;
					dispatch('close')
					dispatch('error', "Incorrect domain.")
					return;
				}
				if (!url.pathname.startsWith('/join/')) {
					loading = false;
					dispatch('close')
					dispatch('error', "Invalid join link.")
					return;
				}
				code = url.pathname.split('/')[2] || '';

			} catch (_) {}
		}
		if (!code || code.length != 6) {
			loading = false;
			dispatch('close')
			dispatch('error', "Invalid code.")
			return;
		}
		code = code.toUpperCase();
		const res = await joinGame(code);
		if (!ok(res)) {
			loading = false;
			dispatch('close')
			try {
				dispatch('error', JSON.parse(res.error).message.split('; ')[1] || 'unknown error')
			} catch (_) {
				dispatch('error', res.error + '')
			}
			return;
		}
		loading = false
		dispatch('close')
		goto('/play')
	}
</script>
<Dialog title="Join game" on:close={() => dispatch('close')}>
	<form action="" on:submit|preventDefault={go}>
		<div class="main">
			<h5>Enter the game code:</h5>
			<input disabled={loading} type="text" bind:value={code}>
		</div>
		<div class="bottom">
			<button disabled={loading || code == ""} class="accent" on:click={go}>
				{loading ? "Just a moment..." : "Join"}
			</button>
		</div>
	</form>
</Dialog>