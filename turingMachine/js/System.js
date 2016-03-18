function System(tapeLength){
    this.halted = false;
    this.programs = [];
    this.currentProgram = programs[0];
}

System.prototype.run = function(){
    console.log("run");
};

System.prototype.step = function(){
    console.log("step");
};


