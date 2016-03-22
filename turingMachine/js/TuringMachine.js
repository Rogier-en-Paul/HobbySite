var TuringMachine = function(blankSymbol){
    this.position = 0;
    this.tape = new Array(49).fill(blankSymbol);
    this.currentState;

    this.states = {};
    this.haltStates = {};
};

TuringMachine.prototype.addState = function(stateName){
    this.states[stateName] = new State();
};

TuringMachine.prototype.run = function(){
    var i = 0;
    while(this.currentState != null && !(this.currentState in this.haltStates) && i < 1000){
        i++;
        if(this.tape[this.position] in this.currentState.rules){
            this.execute();
        }else return 1;
    }
    if(this.currentState in this.haltStates){
        return 0;
    }else return 1;
};

TuringMachine.prototype.step = function(){
    if(this.currentState != null && this.tape[this.position] in this.currentState.rules && !(this.currentState in this.haltStates)){
        this.execute();
    }else return 1;
};

TuringMachine.prototype.execute = function(){
    var rule = this.currentState.rules[this.tape[this.position]];
    this.tape[this.position] = rule.write;
    this.position += rule.move;
    this.position.mod(this.tape.length);
    this.currentState = this.states[rule.next];
};
