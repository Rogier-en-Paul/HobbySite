function Program(tape){
    this.cards = [];
    this.currentCard;
    this.position = 0;
    this.tape = tape;
    this.halted = false;
}

Program.prototype.run = function(){
    var step = 0;
    this.currentCard = this.cards[1];
    this.halted = false;
    while(this.currentCard != null && step < 1000 && !this.halted){
        if(this.currentCard == this.cards[0])break;
        if(this.currentCard.isBreakpoint && this.debugmode.on){
            this.halted = true;
            break;
        }
        step++;
        this.execute();
    }
    return this.tape;
};

Program.prototype.step = function(){
    if(this.currentCard != null && this.currentCard!= this.cards[0]){
        this.execute();
    }
    return this.tape;
};

Program.prototype.continue = function(){
    this.halted = false;
    var step = 0;
    while(this.currentCard != null && step < 1000 && !this.halted){
        if(this.currentCard == this.cards[0])break;
        if(this.currentCard.isBreakpoint){
            this.halted = true
        }
        step++;
        this.execute();
    }
    return this.tape;
};

Program.prototype.execute = function(){
    var answer;
    if(this.tape[this.position] == 1)answer = this.currentCard.one;
    else answer = this.currentCard.zero;

    if(answer.write != -1) this.tape[this.position] = answer.write;
    this.position += answer.move;
    this.position %= this.tape.length;
    this.currentCard = this.cards[answer.nextCard];
};
