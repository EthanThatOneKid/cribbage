module.exports = class Cribbage {

	constructor(hand = Cribbage.randomHand()) {
		this.hand = hand;
		this.fifteens = Cribbage.fifteens(this.hand);
		this.matches = Cribbage.matches(this.hand);
		this.flush = Cribbage.flush(this.hand);
		this.run = Cribbage.run(this.hand);
		this.knob = Cribbage.knob(this.hand);
		this.isValid = Cribbage.isValid(this.hand);
		this.total = Cribbage.total(this);
	}

	log() {
		console.log(this);
	}

  summary() {
    return this.total;
  }

	static randomHand(len = 5) {
		let result = [];
		const suits = ["S", "C", "D", "H"];
		const royalty = {
			"1": "A",
			"11": "J",
			"12": "Q",
			"13": "K"
		};
		for (let i = 0; i < len; i++) {
			const val = Math.floor(Math.random() * 13) + 1;
			result.push({
				"value": val > 10 ? 10 : val,
				"suit": suits[Math.floor(Math.random() * suits.length)],
				"card": val > 10 || val == 1 ? royalty[val] : val
			});
		}
		return result;
	}

	static fifteens(hand) {
		let score = 0;
		(function recurse(j = 0, total = 0) {
			for (; j < hand.length; j++) {
				let subtotal = total + hand[j].value;
				if (subtotal == 15) score++;
				else if (subtotal < 15) recurse(j + 1, subtotal);
			}
		})();
		return score;
	}

	static matches(hand) {
		return Object.entries(hand.reduce((a, c) => {
			c = c.card;
			a[c] = a[c] ? a[c] + 1 : 1;
			return a;
		}, {})).filter(x => x[1] > 1);
	}

	static flush(hand) {
		return Object.entries(hand.reduce((a, c) => {
			c = c.suit;
			a[c] = a[c] ? a[c] + 1 : 1;
			return a;
		}, {})).filter(x => x[1] > 3);
	}

	static run(temp_hand) {
		let hand = Object.entries(temp_hand.map(x =>
			x.card == "K" ? 13 :
			x.card == "Q" ? 12 :
			x.card == "J" ? 11 :
			x.card == "A" ? 1 : x.value
		).reduce((a, c) => {
			a[c] = a[c] ? a[c] + 1 : 1;
			return a;
		}, {})).map(x => [Number(x[0]), x[1]]).sort((a, b) => a[0] - b[0]);
		let run = [hand[0]];
		for (let i = 1; i < hand.length; i++) {
			if (hand[i - 1][0] + 1 == hand[i][0]) {
				if (hand[i][0] - 1 == run[run.length - 1][0])
					run.push(hand[i]);
			} else if (run.length < 3) run = [hand[i]];
		}
		return run.length > 2 ? run : [];
	}

	static knob(hand) {
		if (hand.length != 5) return 0;
		const starter = hand[4];
		for (let i = 0; i < 4; i++)
			if (hand[i].card == "J")
				if (hand[i].suit == starter.suit) return 1;
		return 0;
	}

	static isValid(hand) {
		return Object.values(hand.reduce((a, c) => {
			c = c.card + c.suit;
			a[c] = a[c] ? a[c] + 1 : 1;
			return a;
		}, {})).length == hand.length;
	}

	static total(crib) {
		let data = {};
		let total = 0;

		data["fifteens"] = crib.fifteens;
		total += crib.fifteens * 2;

		data["flush"] = crib.flush.length ? `${crib.flush[0][1]} ${crib.flush[0][0]}'s` : "none";
		total += crib.flush.reduce((acc, cur) => {
			if (cur[1] == 4) acc += 4;
			else if (cur[1] == 5) acc += 5;
			return acc;
		}, 0);

		data["run"] = crib.run.length ? JSON.stringify(crib.run) : "none";
		let run = crib.run.length,
			scl = crib.run.reduce((acc, cur) => acc <= cur[1] ? acc * cur[1] : acc, 1);
		total += scl == 1 ? run :
			scl == 2 && run == 3 ? 8 :
			scl == 2 && run == 4 ? 10 :
			scl == 3 ? 15 : 16;

		data["match"] = JSON.stringify(crib.matches);
		if (scl == 1) {
			total += crib.matches.reduce((acc, cur) => {
				if (cur[1] == 2) acc += 2;
				else if (cur[1] == 3) acc += 6;
				else if (cur[1] == 4) acc += 12;
				return acc;
			}, 0);
		}

		data["knob"] = crib.knob;
		total += crib.knob;

		data["total"] = total;

		return data;
	}

}
