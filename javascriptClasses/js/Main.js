var body = $("body");
var dog1 = new Dog("Woody",4);
var dog2 = new Dog("Pluto",3);


dog1.howl();
haveSameHowl(dog1,dog2);
Dog.prototype.howl = function(){
    body.append("my name is "+ this.name +" and now all dogs say waf" + "<br/>");
};
dog2.howl();
haveSameHowl(dog1,dog2);

delete Dog.prototype.howl;
dog1.howl();

var cat1 = new Cat("Mixi",5);
var cat2 = new Cat("biki",7);

cat1.howl();
haveSameHowl(cat1,cat2);
delete cat1.howl;
cat2.howl();

function haveSameHowl(animal1,animal2){
    if(animal1.howl === animal2.howl){
        body.append(animal1.name + " and " + animal2.name + " have the same howl" + "<br/>");
    }
    else{
        body.append(animal1.name + " and " + animal2.name + " do not have the same howl" + "<br/>");
    }
}

