var State = function(){
    this.rules = {};
};

//probably dont need this method
State.prototype.addRule = function(ruleSymbol, write, move, next){
    this.rules[ruleSymbol] = new Rule(write, move, next);
};