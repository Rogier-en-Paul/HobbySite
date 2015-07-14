var dog1 = new Dog("a",1);
var dog2 = new Dog("b",2);

dog1.howl();
console.log(dog1.howl === dog2.howl);
Dog.prototype.howl = function(){
  console.log("test");
};
dog2.howl();

console.log(dog1.howl === dog2.howl);

delete Dog.prototype.howl;
dog1.howl();


