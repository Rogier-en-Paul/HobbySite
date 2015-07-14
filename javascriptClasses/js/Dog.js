function Dog (name,legs) {
    Animal.call(this,name);
    this.legs = legs;
}
Dog.prototype = Object.create(Animal.prototype);
//Dog.prototype.constructor = Dog;
Dog.prototype.howl = function(){
    body.append("bark my name is "+ this.name + " and i have this many legs " + this.legs + "<br/>");
};
