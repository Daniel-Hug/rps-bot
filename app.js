/*global Firebase, $, _ */
var app = (function() {
	'use strict';


	// setup variables:
	var app = {};
	//            ┌─────────────────────┐
	//            │  ┌─────┐ ┌───────┐  │
	//            │  ▼     │ ▼       │  ▼
	app.picks = ['rock', 'paper', 'scissors'];
	app.gamesStr = '';
	app.gamesArr = [];
	app.outcomeCount = [0, 0, 0];


	// Setup model:
	app.history = [];
	app.rpsFbRef = new Firebase('https://js.firebaseIO.com/rpsHistories');
	app.rpsFbRef.once('value', function(snapshot) {
		var historiesObj = snapshot.val();
		if (historiesObj) {
			app.history = Object.keys(historiesObj).map(function(key) {
				return _.split2(historiesObj[key]);
			});
		}
		app.history.push(app.gamesArr = _.split2(app.gamesStr));
	});


	// Create bot pick els:
	app.botPickEls = $.renderMultiple($.qs('.col-bot'), app.picks, function(pick) {
		var botPickEl = document.createElement('div');
		botPickEl.className = 'bot-pick';
		botPickEl.textContent = pick;
		return botPickEl;
	});


	// Create user pick buttons:
	app.buttons = $.renderMultiple($.qs('.col-btns'), app.picks, function(pick, indexOfPick) {
		var button = document.createElement('button');
		button.textContent = pick;

		button.addEventListener('click', function() {
			// Let the bot pick:
			var indexOfBotPick = _.getIndexOfNextBotPick();

			// Determine the game outcome:
			var indexOfOutcome = _.getOutcomeIndex(indexOfPick, indexOfBotPick);

			// record game
			_.recordGame(indexOfPick, indexOfBotPick, indexOfOutcome);

			// update DOM:
			_.hideStartMsg();
			_.showPicks(indexOfPick, indexOfBotPick);

			// Show message:
			_.updateOutcomeMsg(indexOfBotPick, indexOfOutcome);
			_.updateStatMsg();
		});

		return button;
	});


	// export `app` as a global:
	return app;
})();