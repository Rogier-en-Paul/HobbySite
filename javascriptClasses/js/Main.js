var dog1 = new Dog("Paul",10);
var dog2 = new Dog("test",404);

dog1.howl();
dog2.howl();
//$("body").append("asd");
//$("body").append("asd");
$("body").append(dog1.name);
$("body").append(dog1.age);