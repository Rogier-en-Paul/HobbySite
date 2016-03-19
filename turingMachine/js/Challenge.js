function Challenge(description, startTape, expected, startPosition){
    this.completed = false;
    this.description = description;

    this.startTape = startTape;
    this.expected = expected;
    this.startPosition = startPosition;
}

Challenge.prototype.tryChallenge = function(program){
    program.position = this.startPosition;
    program.tape = this.startTape.slice();
    var equal = true;

    var processedTape = program.run();
    for(var i = 0; i < processedTape.length; i++){
        if(processedTape[i] != this.expected[i]){
            equal = false;
        }
    }
    this.completed = equal;
};