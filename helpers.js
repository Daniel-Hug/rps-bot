var $ = (function() {
	'use strict';


	var $ = {};


	// Get element by CSS selector:
	$.qs = function(selector, scope) {
		return (scope || document).querySelector(selector);
	};

	$.uid = function() {
		return (+(Math.random() + '00').slice(2)).toString(36);
	};

	// 1. Call renderer for each item in array passing the item as the first argument
	//    The renderer should return an element each time it's called.
	// 2. Append each element to a new document fragment in the order they were in the array
	// 3. Append the document to parent
	// 4. Return an array of the new elements
	$.renderMultiple = function(parent, array, renderer) {
		var renderedEls = array.map(renderer); // 1
		var docFrag = document.createDocumentFragment();
		for (var i = 0, l = renderedEls.length; i < l; i++) docFrag.appendChild(renderedEls[i]); // 2
		parent.appendChild(docFrag); // 3
		return renderedEls; // 4
	};

	// Generate random integer within range:
	$.randomInt = function(min, max) {
		return Math.floor(Math.random() * (max - min + 1)) + min;
	};

	// Nicer modulo: http://stackoverflow.com/q/4467539/552067
	$.mod = function(m, n) {
		return ((m % n) + n) % n;
	};

	// Safe native method usage:
	$.sudo = function sudo() {
		var args = arguments;
		var fn = args[1][args[0]];
		sudo[args[2] || args[0]] = fn.call.bind(fn);
	};
	$.sudo('hasOwnProperty', {}, 'has');

	$.vb = {
		//	Accepts an integer and an optional verb:
		//		verbalize.times(1, 'try')
		//	Returns the number of times paired with the verb:
		//		"try once"
		times: function(num, verb) {
			var adv = ['never', 'once', 'twice'][num] || num + ' times';
			return verb ? (num ? verb + ' ' + adv : adv + ' ' + verb) : adv;
		},


		//	Accepts an array of items, and an optional coordinating conjunction ("and" is default):
		//		vb.list(['apples', 'oranges', 'bananas'])
		//	Returns a comma-delimited list with the conjunction before the last item if there are 3 or more:
		//		"apples, oranges, and bananas"
		list: function(items, cunjunction) {
			cunjunction = ' ' + (cunjunction || 'and') + ' ';
			if (items.length < 3) return items.join(cunjunction);
			return items.slice(0, -1).join(', ') + ',' + cunjunction + items[items.length - 1];
		}
	};


	// seq: array || string
	// subseq: array || string

	$.indexesOfSeq = function(seq, subseq) {
		var subseqLen = subseq.length;
		var i = -1;
		var indexes = [];
		if (!subseqLen) return indexes;

		// find the next occurance, in seq, of the first item in subseq:
		// i = index in seq, greater than i, of subseq's first item
		while ((i = seq.indexOf(subseq[0], i + 1)) >= 0) {

			// loop through subseq items starting with second:
			// Make sure that values equivalent to the ones following the first item in subseq,
			// appear in seq, following the found occurance, in sec, of subseq's first item.
			for (var c = 1; c < subseqLen && seq[i + c] === subseq[c]; c++);

			// if they do, return the index, in seq, of the first item in subseq:
			if (c >= subseqLen) indexes.push(i);
		}
		return indexes;
	};


	$.modes = function(array) {
		var modeMap = {};
		var maxCount = 0;
		var m = [];

		array.forEach(function(val) {
			if ($.sudo.has(modeMap, val)) modeMap[val]++;
			else modeMap[val] = 1;

			if (modeMap[val] > maxCount) {
				m = [val];
				maxCount++;
			}
			else if (modeMap[val] === maxCount) {
				m.push(val);
			}
		});
		return m;
	};


	// sequences: an array of sequences (arrays)
	// start: an array containing the first term(s) of a sequence
	$.predictNext = function(sequences, start) {
		var guesses = [];
		var longestSubseqFound = 0;

		if (start.length) {
			// loop backwards through `sequences` skipping ones with length < 2:
			for (var i = 0, l = sequences.length; i < l; i++) {
				var seq = sequences[i];
				if (seq.length < 2) continue;

				// find longest subsequence at end of start that appears in `poppedSeq`
				var poppedSeq = seq.slice(0, -1);
				var sliceI = 0;
				// subseq.length should be > 1 so as to have at least one item after the first is removed:
				var minSubseqLength = longestSubseqFound || 1;
				do {
					var subseq = start.slice(sliceI++);
					var subseqLen = subseq.length;
					var subseqIs = $.indexesOfSeq(poppedSeq, subseq);
					var numFound = subseqIs.length;
					if (numFound) { // subsequence found, keep track of where:
						if (subseqLen > longestSubseqFound) {
							guesses = [];
							longestSubseqFound = subseqLen;
						}
						for (var j = 0; j < numFound; j++) {
							guesses.push(seq[subseqIs[j] + subseqLen]);
						}
						break;
					}
				} while (subseqLen > minSubseqLength);
			}
		}
		else {
			sequences.forEach(function(seq, i) {
				if (seq.length) guesses.push(seq[0]);
			});
		}

		return $.modes(guesses).reverse();
	};


	// export $ as a global:
	return $;
})();