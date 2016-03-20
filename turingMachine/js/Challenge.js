function Challenge(description, test){
    this.completed = false;
    this.description = description;
    this.test = test;
}

Challenge.prototype.tryChallenge = function(program){
    if(this.test(program))this.completed = true;
};
