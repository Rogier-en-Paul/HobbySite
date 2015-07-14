function Cat (name,age) {
    Animal.call(this,name);
    this.age = age;
    this.howl = function howl(){
        body.append("meow my name is "+ this.name + " and my age is " + this.age  + "<br/>");
    }
}
