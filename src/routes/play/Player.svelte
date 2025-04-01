<style>
	.backdrop {
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
	}
	.container {
		display: flex;
		justify-content: end;
		position: relative;
	}
	.playerarea {
		display: flex;
		align-items: center;
		gap: 16px;
	}
	.player {
		flex-direction: column;
		align-items: flex-start;
	}
	.personal {
		display: flex;
		align-items: center;
	}
	.points {
		font-weight: normal;
		font-size: smaller;
		color: var(--color-base--subtle);
		text-align: start;
	}
	
	.playersettings {
		position: absolute;
    top: 100%;
    overflow: hidden auto;
    z-index: 50;
    background-color: var(--background-color-base,#fff);
    padding: 16px 16px;
    font-size: 0.875rem;
    box-shadow: 0 2px 6px -1px rgba(0,0,0,0.2);
    transition-property: opacity;
    transition-duration: 100ms;
    width: max-content;
    max-height: 75vh;
	}
	ul {
		margin: 0;
		padding: 0;
	}
	ul.players {
		margin-inline: 8px;
	}
	li {
		list-style-type: none;
	}
	li > button, .logout {
		width: 100%;
		justify-content: start;
	}

	h4 {
		display: flex;
		align-items: center;
		margin: 0;
		margin-block-start: 16px;
		margin-block-end: 8px;
		color: var(--color-base--subtle);
	}

	.otherplayer {
		display: flex;
		align-items: center;
		gap: 8px;
		justify-content: space-between;
		padding-block: 4px;
	}
	*:not(:last-child) > .otherplayer {
		border-bottom: 1px solid var(--border-color-subtle,#c8ccd1);
	}
	.otherplayername {
		display: flex;
		align-items: center;
	}
	.logoutcontainer {
		border-top: 1px solid var(--border-color-subtle,#c8ccd1);
		margin-top: 16px;
	}
</style>
<script lang="ts">
	import { goto } from "$app/navigation";
	import { leaveGame } from "$lib/api";
	import Icon from "$lib/Icon.svelte";
    import { tick } from "svelte";
	import ChangeNameDialog from "./ChangeNameDialog.svelte";
	import { gameState, stopGame, unsubscribe } from "./gamestate";
	import KickIdDialog from "./KickIDDialog.svelte";
	import { teleport } from "$lib/teleport";
	import TransferIdDialog from "./TransferIDDialog.svelte";

	$: me = $gameState.users[$gameState.me];

	let dropdown = false;
	let moveDropdown = 0;
	let changeNameDialog = false;

	let dropdownElement: HTMLElement | undefined;

	let kickIDDialog = '';
	let transferIDDialog = '';

	$: if (dropdown) {
		tick().then(() => {
			if (!dropdownElement) return console.error("A catastrophe!");
			const { left } = dropdownElement.getBoundingClientRect();
			if (left < 0) {
				moveDropdown = (-left) + 8;
			}
		});

	} else {
		moveDropdown = 0;
	}
</script>
<svelte:document
	on:keyup={(e) => {
		if (dropdown && e.key == "Escape") dropdown = false;
	}}
/>
{#if dropdown}
	<div
		role="presentation"
		class="backdrop"
		use:teleport
		on:click={() => dropdown = false}
	></div>
{/if}
<div class="container">
	<button class="playerarea hollow" on:click={() => dropdown = !dropdown}>
		<div class="player">
			<div class="personal">
				<div class="icon">
					<Icon>
						person
					</Icon>
				</div>
				<b>
					{me.name}
				</b>
				{#if $gameState.host == $gameState.me}
					<div title="You're the host!">
						<Icon>
							bolt
						</Icon>
					</div>
				{/if}
			</div>
			<div class="points">
				<i>Points: {me.points}</i>
			</div>
		</div>
		<div style="display: flex;">
			<Icon>more_horiz</Icon>
		</div>
	</button>
	{#if dropdown}
		<div class="playersettings" style:translate="{moveDropdown}px 0px" bind:this={dropdownElement}>
			<ul>
				<li>
					<button class="hollow" on:click={() => { changeNameDialog = !changeNameDialog; dropdown = false; }}>
						<Icon>edit</Icon>
						Change your name
					</button>
				</li>
			</ul>
			{#if $gameState.host == $gameState.me}
				<h4>
					<Icon>bolt</Icon>
					Host controls
				</h4>
				<ul class="players">
					{#each Object.keys($gameState.users) as userID}
						{@const user = $gameState.users[userID]}
						{#if userID != me.id}
							<li>
								<div class="otherplayer">
									<div class="otherplayername">
										<Icon>person</Icon>
										{user.name}
									</div>
									<div class="personctrl">
										<button class="hollow" title="Transfer the host" on:click={() => transferIDDialog = userID}>
											<Icon>lightning_stand</Icon>
										</button>
										<button class="hollow" title="Kick" on:click={() => kickIDDialog = userID}>
											<Icon>remove</Icon>
										</button>
									</div>
								</div>
							</li>
						{/if}
					{/each}
				</ul>
			{/if}
			<div class="logoutcontainer">
				<button class="hollow logout" on:click={async() => {
					goto('/');
					unsubscribe();
					await leaveGame($gameState.gameID, $gameState.accessKey);
					stopGame();
				}}>
					<Icon>logout</Icon>
					Leave game
				</button>
			</div>
		</div>
	{/if}
</div>

{#if changeNameDialog}
	<ChangeNameDialog on:close={() => changeNameDialog = false} />
{/if}

{#if $gameState.me == $gameState.host}
	{#if transferIDDialog}
		<TransferIdDialog id={transferIDDialog} on:close={() => transferIDDialog = ''} />
	{/if}

	{#if kickIDDialog}
		<KickIdDialog id={kickIDDialog} on:close={() => kickIDDialog = ''} />
	{/if}
{/if}
