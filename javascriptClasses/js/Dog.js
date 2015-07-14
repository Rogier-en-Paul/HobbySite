function Dog (name,legs) {
    Animal.call(this,name);
    this.legs = legs;
}
Dog.prototype = Object.create(Animal.prototype);
//Dog.prototype.constructor = Dog;
Dog.prototype.howl = function(){
    console.log("woef"+ this.name + " :" + this.legs);
};
