var TuringMachine = function(symbols, blankSymbol, inputSymbols, initialState){
    this.position = 0;
    this.tape = [];
    this.currentState = initialState;

    this.symbols = symbols;//array of strings(could)
    this.states = {};//array of those Cards
    this.blankSymbol = symbols[blankSymbol];//points to 1 of the symbols


    this.haltStates = {};
};

TuringMachine.prototype.addState = function(stateName){
    this.states[stateName] = new State();
};

TuringMachine.prototype.run = function(){
    while(this.currentState != null && !(this.currentState in this.haltStates)){
        if(this.tape[this.position] in this.currentState.rules){
            this.execute();
        }else return 1;
    }
    if(this.currentState in this.haltStates){
        return 0;
    }else return 1;
};

TuringMachine.prototype.step = function(){
    if(this.tape[this.position] in this.currentState.rules){
        this.execute();
    }else return 1;
};

TuringMachine.prototype.execute = function(){
    var rule = this.currentState.rules[this.tape[this.position]];
    this.tape[this.position] = rule.write;
    this.position += rule.move;
    this.currentState = this.states[rule.next];
};
