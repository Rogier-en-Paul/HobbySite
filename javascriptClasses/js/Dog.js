function Dog (name,age) {
    Animal.call(this,name);
    this.age = age;
    this.howl = function howl(){
        console.log("woef"+ this.name);
    }
}
