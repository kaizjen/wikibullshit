<style>
	.game {
		width: clamp(13cm, 13cm, 100%);
		display: flex;
		flex-direction: column;
		gap: 16px;
	}
	.instructions {
		display: flex;
		flex-direction: column;
		gap: 16px;
	}
	h2 {
		font-weight: normal;
		font-family: 'Linux Libertine','Georgia','Times','Source Serif Pro', serif;
		font-size: 1.8em;
		margin: 0;
	}
	.articleinput {
		display: flex;
		gap: 8px;
	}
	ul {
		margin: 0;
		margin-top: 16px;
		padding: 0;
	}
	li {
		list-style: none;
	}
	.player {
		display: flex;
		justify-content: space-between;
 		align-items: center;
		gap: 8px;
		padding: 4px;
		padding-inline: 8px;
	}
	.player.green {
		background-color: var(--background-color-success-subtle);
		color: var(--color-content-added); /* TODO: Choose semantically correct values */
	}
	.player.red {
		background-color: var(--background-color-error-subtle);
  	color: var(--color-error);
	}
	.playerinfo {
		display: flex;
 		align-items: center;
	}
	.username {
		overflow: hidden;
    text-overflow: ellipsis;
    min-width: 0;
    white-space: nowrap;
	}
	.otherinfo {
		display: flex;
		align-items: center;
		gap: 16px;
		flex-shrink: 0;
	}
	.readiness {
		color: var(--color-base--subtle);
	}
	.tip {
		color: var(--color-base--subtle);
		font-size: small;
		flex-shrink: 0;
	}
	.green .readiness, .green .tip {
		color: var(--color-success);
	}
	.red .readiness, .red .tip {
		color: var(--color-destructive--active); /* TODO: Choose semantically correct values */
	}
	.footer {
		display: flex;
		justify-content: center;
	}
	.gray {
		color: var(--color-base--subtle);
		font-size: small;
	}
</style>
<script>
	import { guess, selectArticle } from "$lib/api";
	import Icon from "$lib/Icon.svelte";
	import { ok } from "$lib/util";
	import { changeArticle, gameState, setReady } from "./gamestate";
	import PanicDialog from "./PanicDialog.svelte";

	let FUN = Math.floor(Math.random() * 17);

	$: amIReady = $gameState.users[$gameState.me].ready;
	let loading = false;

	$: gameInProgress = $gameState.chosenArticle != '';
	$: isEveryoneReady = Object.keys($gameState.users).every(uid => $gameState.users[uid].ready);

	let myArticle = $gameState.myArticle;
	
	function setMyArticle() {
		myArticle = $gameState.myArticle;
	}
	$: { gameInProgress; setMyArticle(); }

	$: if (myArticle == '') {
		myArticle = $gameState.myArticle
	}
	let myGuess = '';
	let correctAnswer = '';

	let panicDialog = false;

	$: if ($gameState.me != $gameState.host || !gameInProgress) {
		panicDialog = false;
	}

	async function readyUp() {
		if (loading) return;

		loading = true;
		await setReady(!amIReady)
		if (amIReady) {
			await changeArticle(myArticle)
		}
		loading = false;		
	}
</script>
<svelte:head>
	<title>
		{
			gameInProgress ?
			`${$gameState.chosenArticle} - Wikibullshit` :
			"Wikibullshit"
		}
	</title>
</svelte:head>
<div class="game">
	<div class="instructions">
		{#if gameInProgress}
			<div class="desc beforearticle">
				{#if $gameState.host == $gameState.me}
					Guess which one of the players is telling the truth about
				{:else}
					Convince the host that
				{/if}
			</div>
		{/if}
		<h2>
			{#if gameInProgress}
				{$gameState.chosenArticle}
			{:else}
				{#if $gameState.host == $gameState.me}
					You're the host
				{:else}
					You're a player
				{/if}
			{/if}
		</h2>
		{#if $gameState.me != $gameState.host && !gameInProgress}
			<form on:submit|preventDefault={readyUp}>
				<div class="articleinput">
					<input disabled={amIReady} type="text" placeholder="" bind:value={myArticle}>
					<button
						disabled={myArticle == '' && !amIReady}
						title={myArticle == '' ? "Hey, you have to put in an article name first, cheater!" : "Click me!!!!!!"}
						class="button"
						
						on:click={readyUp}
					>
						{#if amIReady}
							WAIT, I'm not ready!!
						{:else}
							I'm ready
						{/if}
					</button>
				</div>
			</form>
		{/if}
		<div class="desc">
			{#if gameInProgress}
				{#if $gameState.host == $gameState.me}
					and what players are just making up stuff about it.
					Remember, this game isn't about the truth, but about Wikipedia.<br>
					If you already know what's written in the article with
					the name "{$gameState.chosenArticle}", you may press the panic button:
					<a href="#__" on:click|preventDefault={() => { panicDialog = !panicDialog; }}>
						STOP THE GAME RIGHT NOW!
					</a>
					(Or if you want to end this round preemptively in any other case)
				{:else}
					is your article. If it is, just retell its contents.
					If it's not, make up something that an article with that
					name could say.
				{/if}
			{:else}
				{#if $gameState.host == $gameState.me}
					When all the players are ready, press the Big Blue Button™ below
					to start the game! Then, it's all up to your skills of interrogation :)
				{:else}
					Pick an interesting article on Wikipedia, memorize it (just well enough) and
					input its title into the field above (strip it of all parentheses and the like).
					Then click the button and wait until the game starts.
				{/if}
			{/if}
		</div>
	</div>
	<div class="players">
		{#if !gameInProgress}
			{@const host = $gameState.users[$gameState.host]}
			<div class="player">
				<div class="playerinfo">
					<Icon>bolt</Icon>
					<b>{host.name}</b>
					{#if host.id == $gameState.me}
						<i class="tip">
							☜ Hey, you're the host!
						</i>
					{:else}
						<i class="tip">
							☜ That's the host!
						</i>
					{/if}
				</div>
				<div class="otherinfo">
					<b> {host.points}¤ </b>
				</div>
			</div>
		{/if}
		<ul>
			{#each Object.keys($gameState.users) as userID}
				{@const user = $gameState.users[userID]}
				{#if $gameState.host != userID}
					<li>
						<div
							class="player"
							class:green={(myGuess != '' && correctAnswer == userID) || user.ready}
							class:red={(myGuess != '' && myGuess != correctAnswer && myGuess == userID)}
						>
							<div class="playerinfo">
								<Icon>person</Icon>
								<b class="username">{user.name}</b>
								<i class="tip">
									{#if myGuess == userID}
										{#if myGuess == correctAnswer}
											☜ You guessed correctly!
										{:else}
											☜ Liar! (your guess)
										{/if}
									{:else if correctAnswer == userID}
										☜ The truthteller
									{/if}
									{#if userID == $gameState.me}
										{#if $gameState.users[userID].points == FUN}
											☜ Despite everything, it's still you
										{:else}
											☜ Hey, that's you!
										{/if}
									{/if}
								</i>
							</div>
							<div class="otherinfo">
								{#if gameInProgress}
									{#if $gameState.host == $gameState.me}
										<button
											class="hollow"
											title="Press this button if you think this player is telling the truth!"
											on:click={async() => {
												if (loading) return;

												loading = true;
												let result = await guess($gameState.gameID, $gameState.accessKey, userID);
												if (!ok(result)) return loading = false;

												myGuess = userID;
												correctAnswer = result.truthteller;

												console.log({ myGuess, correctAnswer });

												setTimeout(() => {
													myGuess = correctAnswer = '';
												}, 4000)

												loading = false;
											}}
										>
											☜ Guess!
										</button>
									{/if}
									
								{:else}
									<span class="readiness">
										{#if user.ready}
											[Ready!]
										{:else}
											[Not ready]
										{/if}
									</span>
									<b>
										{user.points}¤
									</b>
								{/if}
							</div>
						</div>
					</li>
				{/if}
			{/each}
		</ul>
	</div>
	<div class="footer">
		{#if Object.keys($gameState.users).length < 3}
			<span class="gray">
				Invite more people to play this game!
			</span>
		{:else if isEveryoneReady}
			{#if $gameState.host == $gameState.me}
				<button disabled={loading} class="accent" title="AKA the Big Blue Button™" on:click={async() => {
					if (loading) return;

					loading = true;
					await selectArticle($gameState.gameID, $gameState.accessKey)
					loading = false;
				}}>
					{#if loading}
						Hang on tight!
					{:else}
						Start the game
					{/if}
				</button>
			{:else}
				<span class="gray">
					Waiting for the host to start the game...
				</span>
			{/if}
		{:else}
			<span class="gray">
				The game can start when everyone is ready.
			</span>
		{/if}
	</div>
</div>

{#if panicDialog}
	<PanicDialog on:close={() => panicDialog = false} />
{/if}