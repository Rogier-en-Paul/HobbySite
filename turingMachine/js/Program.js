function Program(tape){
    this.cards = [];
    this.currentCard;
    this.position = 0;
    this.tape = tape;
}

Program.prototype.run = function(){
    var step = 0;
    this.currentCard = this.cards[1];
    while(this.currentCard != null && this.position >= 0 && this.position < this.tape.length && step < 1000){
        step++;
        this.execute();
    }
    return this.tape;
};

Program.prototype.step = function(){
    if(this.currentCard != null && this.position >= 0 && this.position < this.tape.length){
        this.execute();
    }
    return this.tape;
};

Program.prototype.execute = function(){
    var answer;
    if(this.tape[this.position] == 1)answer = this.currentCard.one;
    else answer = this.currentCard.zero;

    if(answer.write != -1) this.tape[this.position] = answer.write;
    if(answer.move != 0) this.position += answer.move;
    this.currentCard = this.cards[answer.nextCard];
};
