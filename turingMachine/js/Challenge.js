function Challenge(description, expected){
    this.completed = false;
    this.description = description;


    this.startTape = [];
    this.expected = expected;
}

Challenge.prototype.tryChallenge = function(system){
    if(system.run(this.startTape) == this.expected){
        this.completed = true;
    }
};