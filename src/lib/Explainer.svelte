<style>
	.main {
		padding: 16px;
		line-height: 1.4;
		flex-shrink: 1;
	}
	.bottom {
		padding: 8px;
		display: flex;
		justify-content: end;
	}
	h1, h2 {
		font-family: 'Linux Libertine','Georgia','Times','Source Serif Pro',serif;
		line-height: 1.375;
		font-weight: normal;
		position: relative;
	}
	h1 {
		font-size: 1.8em;
		margin: 0;
	}
	h2 {
		font-size: 1.5em;
		margin: 0.25em 0 0.25em 0;
	}
	h1::after, h2::after {
    content: '';
    display: block;
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 1px;
    background-color: #a2a9b1;
  }
	ul {
		margin-left: 1.6em;
		padding: 0;
	}
</style>
<script>
	import { createEventDispatcher } from "svelte";
	import Dialog from "$lib/Dialog.svelte";
	import { updateMe } from "$lib/api";

	const dispatch = createEventDispatcher();

	async function go() {
		dispatch('close')
	}
</script>
<Dialog title="About this game" on:close={() => dispatch('close')}>
	<div class="main">
		<h1>Wikibullshit</h1>
		<p>
			<b>Wikibullshit</b> is a game in which the players try to convince the
			host that they know the contents of a <a href="https://en.wikipedia.org/wiki/Wikipedia" target="_blank">Wikipedia</a>
			article with a specific title.
			Each one of the players chooses an article to memorize, then inputs its title on this
			<a href="https://en.wikipedia.org/wiki/Website" target="_blank">website</a>.
			When the game starts, it picks <i>one</i> of those article titles. One of the players knows what the article actually says,
			and has to retell its contents from memory, while all others need to
			<a href="https://en.wikipedia.org/wiki/Lie" target="_blank">come up</a>
			with something that <i>could be</i> in an article with that title and pretend that they know what they're talking about.
			The host's job is to <a href="https://en.wikipedia.org/wiki/Guessing" target="_blank">guess</a> which one of the players
			is actually correct.
		</p>
		<p>
			The game was <a href="https://en.wikipedia.org/wiki/Plagiarism" target="_blank">heavily inspired</a> by
			<a href="https://en.wikipedia.org/wiki/The_Technical_Difficulties" target="_blank">The Technical Difficulties</a>'
			series "<a href="https://www.youtube.com/playlist?list=PLrkYtXgEpu5QXFgFJO8SxTMa24wv7b40X" target="_blank">
				Two of these people are lying
				<img src="/ext.svg" alt="external link">
			</a>"
		</p>
		<p>
			This website doesn't provide a way to communicate, so the players will need to use something else, like
			<a href="https://en.wikipedia.org/wiki/Discord" target="_blank">Discord</a> or
			<a href="https://en.wikipedia.org/wiki/Touch_grass" target="_blank">touching grass</a>.
		</p>
		<h2>
			Rules
		</h2>
		<p>
			Wikibullshit can mostly be played with <a href="https://en.wikipedia.org/wiki/House_rule" target="_blank">house rules</a>.
			However, here are some useful restrictions and guidelines to have:
		</p>
		<ul>
			<li>
				<a href="https://en.wikipedia.org/wiki/Wikipedia:Stand-alone_lists" target="_blank">List articles</a> are banned because they are boring.
			</li>
			<li>
				Don't always put the name of your article verbatim! Remove all text in parentheses and, perhaps,
				omit some unnecessary details - write "Meager massif" instead of
				"<a href="https://en.wikipedia.org/wiki/Mount_Meager_massif" target="_blank">Mount Meager massif</a>".
				Some articles have synonyms <b>written in bold</b> in their first paragraph - they're fair game too, for example you may
				write "Wikiwars" instead of "<a href="https://en.wikipedia.org/wiki/Wikiracing" target="_blank">Wikiracing</a>", if you're feeling fancy.
			</li>
			<li>
				Pick something interesting and not well known. Try to avoid stubs, although they're okay if they have an interesting title.
			</li>
			<li>
				For the host: give the liars a bit of leeway. When the article title is first revealed, ask each player for a quick description -
				something simple, like "A medieval celebration" - to give the liars some time to think.
			</li>
			<li>
				Be nice to other players! And don't cheat by looking at your article when you're telling it.
			</li>
		</ul>
		<h2>
			How to play
		</h2>
		<p>
			After creating a game, you will see the room code and a button to copy the join link in the top left corner,
			after the "Wikibullshit" logo. Using this link, other people can join the game as players. You need a minimum of
			<b>three people</b> to play the game.
		</p>
		<p>
			In the top right corner there is a menu showing your profile. You can use it to change your name or leave the game. The host
			can use it to kick players out or to transfer the host role onto them.
		</p>
		<p>
			The players go on to pick a Wikipedia article each. They then memorize it and put its title into the input
			field on the website. After they all click <i>"I'm ready"</i>, the host may start the game.
		</p>
		<p>
			The website picks one article title. Each of the players now has to convince the host that they were the one to pick this
			article and that they know its contents. When the time is right, the host has to guess which one of the players picked the
			article. Players get a point for succecfully convincing the host and the host gets a point for guessing correctly.
		</p>
	</div>
	<div class="bottom">
		<button class="accent" on:click={go}>
			Got it!
		</button>
	</div>
</Dialog>