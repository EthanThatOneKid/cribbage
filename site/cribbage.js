var factorial = function(n_) {
    var n = n_;
    for (var i = n - 1; i > 0; i--) {
        n *= i;
    }
    return n;
};

var isFifteen = function(additives) {
    var endUp = 15;
    for (var i = 0; i < additives.length; i++) {
        let gimmeNum = additives[i].card;
        let isFace = (gimmeNum === "J" || gimmeNum === "Q" || gimmeNum === "K");
        gimmeNum = (isFace) ? 10 : gimmeNum;
        gimmeNum = (gimmeNum === "A") ? 1 : gimmeNum;
        endUp -= gimmeNum;
    }
    return endUp === 0;
};

var C = function(n, r) {
    // nCr
    return factorial(n) / (factorial(r) * factorial(n - r));
};
var fifteens = function(hand) {
    var amt = hand.length;
    var total = [];
    // comparing all pairs
    for (var i = 0; i < amt; i++) {
        for (var j = i + 1; j < amt; j++) {
            var addUp = [];
            addUp.push(hand[j]);
            addUp.push(hand[i]);
            if (isFifteen(addUp)) {
                total.push([hand[j], hand[i]]);
            }
        }
    }
    // comparing all triplets
    for (var i = 0; i < amt; i++) {
        for (var j = i + 1; j < amt; j++) {
            for (var k = j + 1; k < amt; k++) {
                var addUp = [];
                addUp.push(hand[j]);
                addUp.push(hand[i]);
                addUp.push(hand[k]);
                if (isFifteen(addUp)) {
                    total.push([hand[j], hand[i], hand[k]]);
                }
            }
        }
    }
    // comparing all quadruplets
    for (var i = 0; i < amt; i++) {
        for (var j = i + 1; j < amt; j++) {
            for (var k = j + 1; k < amt; k++) {
                for (var l = k + 1; l < amt; l++) {
                    var addUp = [];
                    addUp.push(hand[j]);
                    addUp.push(hand[i]);
                    addUp.push(hand[k]);
                    addUp.push(hand[l]);
                    if (isFifteen(addUp)) {
                        total.push([hand[j], hand[i], hand[k], hand[l]]);
                    }
                }
            }
        }
    }
    // add up the whole hand
    if (hand.length > 4) {
        var addUp = [];
        addUp.push(hand[0]);
        addUp.push(hand[1]);
        addUp.push(hand[2]);
        addUp.push(hand[3]);
        addUp.push(hand[4]);
        if (isFifteen(addUp)) {
            total.push([hand[0], hand[1], hand[2], hand[3], hand[4]]);
        }
    }
    return total.length;
};

var matches = function(hand) {
    var runs = [];
    for (var i = 0; i < hand.length; i++) {
        if (runs.some((function(x) {
            return x["num"] === hand[i].card;
        }
        ))) {
            continue;
        }
        var num = hand[i].value;
        var run = 1;
        for (var j = 0; j < hand.length; j++) {
            if (i === j) {
                continue;
            }
            if (num === hand[j].value) {
                run++;
            }
        }
        if (run > 1) {
            runs.push({
                "num": hand[i].card,
                "len": run
            });
        }
    }
    return runs;
};
var sequences = function(hand) {
    var seq = [];
    for (var i = 0; i < hand.length; i++) {
        for (var j = 0; j < hand.length; j++) {
            if (hand[j].value + 1 == hand[i].value || hand[j].value - 1 == hand[i].value) {
                seq.push(hand[j].card);
            }
        }
    }
    seq = Array.from(new Set(seq)).sort(function(a, b) {
        return a - b
    });
	// GLITCH WITH SEQUENCES: TWO SEPERATE SEQUENCES COULD GET COMBINED
    return (seq.length >= 3) ? seq : [];
};

var flush = function(hand) {
    var suits = ["C", "D", "H", "S"];
    for (var suit = 0; suit < suits.length; suit++) {
        var sameSuit = 0;
        for (var i = 0; i < hand.length; i++) {
            if (hand[i].suit === suits[suit]) {
                sameSuit++;
            }
        }
        if (sameSuit >= 4) {
            return {
                "flush": sameSuit,
                "suit": suits[suit]
            };
        }
    }
    return null;
};

var checkRun = function(runs_) {
    var runs = runs_.sort();
    for (var i = 0; i < runs.length - 1; i++) {
        if (runs[i] + 1 !== runs[i + 1]) {return false;}
    }
    return true;
};

var computeTotal = function(hand, rules) {
    var points = 0;
    points += rules.fifteens(fifteens(hand));
    // fifteens
    points += rules.run(sequences(hand).length);
    // runs
    points += (flush(hand)) ? rules.flush(flush(hand).flush) : 0;
    // flush
    var pairs = matches(hand);
    // matches
    for (var i = 0; i < pairs.length; i++) {
        points += rules.matches(pairs[i].len);
    }
    if (hand.length > 4) {
        points += rules.knob(hand, hand[4]);
    }
    var data = {
        "fifteens": fifteens(hand),
        "runs": sequences(hand),
        "flush": (flush(hand)) ? flush(hand) : 0,
        "matches": matches(hand),
	"knob": rules.knob(hand, hand[4]),
        "points": points
    };
    console.log(data);
    return data;
};

var hand = [];

var eval = function(T) {
	if (T === "K") {return 13;}
	if (T === "Q") {return 12;}
	if (T === "J") {return 11;}
	if (T === "A") {return 1;}
	return parseInt(T);
};

var setHand = function(id) {
	hand = [];
	var cards = document.getElementById(id).getElementsByClassName("card");
	var suits = document.getElementById(id).getElementsByClassName("suit");
	for (var i = 0; i < cards.length; i++) {
		let gimmeCard = {
			"card": (cards[i].value.match(/\d/g)) ? parseFloat(cards[i].value) : cards[i].value,
			"value": eval(cards[i].value),
			"suit": suits[i].value
		};
		hand.push(gimmeCard);
	}	
	var handData = computeTotal(hand, rules);
	printAns(handData);
};

var gimmeList = function(arr, index, index2) {
	var text = '';
	for (var i = 0; i < arr.length; i++) {
		text += (index) ? '{card: ' + arr[i][index] + ', ' : arr[i];
		text += (index2) ? 'amt: ' + arr[i][index2] + '}': '';
		text += (arr.length - 1 !== i) ? ', ' : '';
	}
	return (text !== '') ? text : 0;
};

var printAns = function(data) {
	var inner = "<table align='center'><tr><td></td>";
	inner += "<td>results</td>";
	inner += "</tr><tr>";
	inner += "<td><em>fifteens</em></td>";
	inner += "<td align='center'>" + data.fifteens + "</td>";
	inner += "</tr><tr>";
	inner += "<td><em>matches</em></td>";
	inner += "<td align='center'>" + gimmeList(data.matches, 'num', 'len') + "</td>";
	inner += "</tr><tr>";
	inner += "<td><em>sequences</em></td>";
	inner += "<td align='center'>" + gimmeList(data.runs) + "</td>";
	inner += "</tr><tr>";
	inner += "<td><em>flushes</em></td>";
	inner += "<td align='center'>flush: " + data.flush.suit + ", amt: " + data.flush.flush + "</td>";
	inner += "</tr><tr>";
	inner += "<td><em>knob</em></td>";
	inner += "<td align='center'>" + data.knob + "</td>";
	inner += "</tr><tr>";
	inner += "<td><strong>total</strong></td>";
	inner += "<td align='center'>" + data.points + "</td>";
	inner += "</tr></table>";

	document.getElementById('ans').innerHTML = inner;
};
			
var rules = {
    "fifteens": function(x) {
        return x * 2;
    },
    "run": function(x) {
        return x;
    },
    "flush": function(x) {
        return x;
    },
    "matches": function(x) {
        if (x === 2) {return 2;}
	if (x === 3) {return 6;}
	if (x === 4) {return 12;}
    },
    "knob": function(hand, starter) {
        for (var i = 0; i < hand.length; i++) {
            if (starter.suit === hand[i].suit && starter.value === hand[i].value) {
                continue;
            }
            if (starter.suit === hand[i].suit && hand[i].card === "J") {
                return 1;
            }
        }
        return 0;
    }
};
