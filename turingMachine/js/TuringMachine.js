var TuringMachine = function(states, symbols, blankSymbol, inputSymbols, initialState, haltStates){
    this.position = 0;
    this.tape = [];
    this.currentState = states[initialState];//points to 1 of the states

    this.symbols = symbols;//array of strings(could)
    this.states = states;//array of those Cards
    this.blankSymbol = symbols[blankSymbol];//points to 1 of the symbols
    this.inputSymbols = inputSymbols;//array of pointers

    this.haltStates = haltStates;//array of pointers
};

TuringMachine.prototype.addState = function(id ,expectedSymbol, write, move, next){
    this.states[id](new State(expectedSymbol,this.symbols[write]),move,this.states[next]);
};

TuringMachine.prototype.run = function(){
    while(this.currentState != this.haltStates){

    }
};

TuringMachine.prototype.step = function(){
    if(this.currentState.expectedSymbol == tape[this.position]){
        this.execute(this.currentState.one)
    }else{
        this.execute(this.currentState.zero)
    }
};

TuringMachine.prototype.execute = function(option){
    this.tape[this.position] = option.write;
    this.position += option.move;
    this.currentState = option.next;
};