/*global $, app */

/*
	This file is loaded before app.js, so properties of `app` can only be used
	in a function if the function is called *after* the property of app is set.
*/
var _ = (function() {
	'use strict';


	var _ = {};


	_.split2 = function(str) {
		return str.match(/.{2}/g) || [];
	};

	_.getOutcomeIndex = function(indexOfYourPick, indexOfbotPick) {
		return $.mod(indexOfYourPick - indexOfbotPick, app.picks.length);
	};


	_.getTrumpIndex = function(yourPick) {
		return (yourPick + 1) % app.picks.length;
	};


	_.getIndexOfNextBotPick = function() {
		var next = $.predictNext(app.history, app.gamesArr)[0];
		return next ? _.getTrumpIndex(next[0]) : $.randomInt(0, 2);
	};


	// add an 'active' class to the button the user picked and the one the bot picked:
	_.showPicks = function(indexOfPick, indexOfBotPick) {
		// user's button
		app.buttons.forEach(function(button) {
			button.classList.remove('active');
		});
		app.buttons[indexOfPick].classList.add('active');

		// bot's button
		app.botPickEls.forEach(function(botPickEl) {
			botPickEl.classList.remove('active');
		});
		app.botPickEls[indexOfBotPick].classList.add('active');
	};


	_.recordGame = (function() {
		var fbPushRef;

		return function(indexOfPick, indexOfBotPick, indexOfOutcome) {
			// update local model:
			app.outcomeCount[indexOfOutcome]++;
			var newGameStr = '' + indexOfPick + indexOfBotPick;
			app.gamesStr += newGameStr;
			app.gamesArr.push(newGameStr);

			// update Firebase:
			if (!fbPushRef) fbPushRef = app.rpsFbRef.push();
			fbPushRef.set(app.gamesStr);
		};
	})();


	_.updateStatMsg = (function() {
		var outcomes = ['tied', 'won', 'lost'];
		var statMsgEl = $.qs('#scoreboard');
		return function() {
			statMsgEl.textContent = 'You have ' + $.vb.list(outcomes.map(function(outcome, i) {
				return $.vb.times(app.outcomeCount[i], outcome);
			})) + '.';
		};
	})();


	_.updateOutcomeMsg = (function() {
		var outcomeMsgs = ['It\'s a tie!', 'You win', 'You lose!'];
		var outcomeMsgEl = $.qs('#msg');
		return function(indexOfBotPick, indexOfOutcome) {
			var botPick = app.picks[indexOfBotPick];
			var msg = outcomeMsgs[indexOfOutcome];
			outcomeMsgEl.textContent = 'The bot picked ' + botPick + '. ' + msg;
		};
	})();


	_.hideStartMsg = (function() {
		var startMsg = $.qs('.start-msg');
		var hidden;
		return function() {
			if (hidden) return;
			startMsg.style.display = 'none';
			hidden = true;
		};
	})();


	// export _ as a global:
	return _;
})();
