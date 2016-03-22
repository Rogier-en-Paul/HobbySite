var Rule = function(write, move, next){
    //rulesymbol is used as a key in state which holds a hashmap of rules
    this.write = write;
    this.move = move;
    this.next = next;
};