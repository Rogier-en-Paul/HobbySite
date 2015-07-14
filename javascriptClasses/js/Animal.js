function Animal(name){
    this.name = name;
}
Animal.prototype.howl = function(){
    console.log("i can only howl"+ this.name);
};