function Program(){
    this.cards = [];
    this.currentCard;
    this.position = Math.floor(tape.length / 2);
}

Program.prototype.run = function(tape){
    while(this.currentCard != null && this.position >= 0 && this.position < tape.length){
        this.execute();
    }
    return tape;
};

Program.prototype.step = function(){
    if(this.currentCard != null && this.position >= 0 && this.position < tape.length){
        this.execute();
    }
    return tape;
};

Program.prototype.execute = function(){
    var answer;
    if(tape[this.position] == 1)answer = this.currentCard.one;
    else answer = this.currentCard.zero;

    if(answer.write != -1)tape[this.position] = answer.write;
    if(answer.move != 0)this.position += answer.move;
    this.currentCard = this.cards[answer.nextCard];
};
