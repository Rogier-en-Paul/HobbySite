function Program(){
    this.cards = [];
}

Program.prototype.execute = function(tape){
    var currentCard = this.cards[1];
    var position = Math.floor(tape.length / 2);
    var answer;

    while(currentCard != null && position >= 0 && position < tape.length){
        if(tape[position] == 1)answer = currentCard.one;
        else answer = currentCard.zero;

        if(answer.write != -1)tape[position] = answer.write;
        if(answer.move != 0)position += answer.move;
        currentCard = this.cards[answer.nextCard];
    }

    return tape;
};

