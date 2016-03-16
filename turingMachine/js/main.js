var tape = Array.apply(null, new Array(30)).map(Number.prototype.valueOf,0);

var program = new Program();//prints alternating 1s and 0s to the right
program.cards[1] = new Card(new Option(1, 1, 2), new Option(1, 1, 1));
program.cards[2] = new Card(new Option(0, 1, 1), new Option(1, 1, 1));

console.log(program.execute(tape).toString());
