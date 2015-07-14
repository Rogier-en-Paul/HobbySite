function Cat (name,age) {
    Animal.call(this,name);
    this.age = age;
    this.howl = function howl(){
        console.log("meow"+ this.name + "age:" + this.age);
    }
}
