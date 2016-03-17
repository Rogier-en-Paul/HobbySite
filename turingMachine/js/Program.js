function Program(){
    this.cards = [];
    this.currentCard = this.cards[1];
    this.position = Math.floor(tape.length / 2);
}

Program.prototype.run = function(tape){
    var answer;

    while(this.currentCard != null && position >= 0 && position < tape.length){
        if(tape[this.position] == 1)answer = this.currentCard.one;
        else answer = this.currentCard.zero;

        if(answer.write != -1)tape[this.position] = answer.write;
        if(answer.move != 0)this.position += answer.move;
        this.currentCard = this.cards[answer.nextCard];
    }

    return tape;
};

Program.prototype.step = function(){
    var answer;
    if(this.currentCard != null && position >= 0 && position < tape.length){
        if(tape[this.position] == 1)answer = this.currentCard.one;
        else answer = this.currentCard.zero;

        if(answer.write != -1)tape[this.position] = answer.write;
        if(answer.move != 0)this.position += answer.move;
        this.currentCard = this.cards[answer.nextCard];
    }
};

Program.prototype.execute = function(){

};
