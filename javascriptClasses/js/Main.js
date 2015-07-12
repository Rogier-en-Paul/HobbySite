var dog1 = new Dog("Paul",10);
var dog2 = new Dog("test",404);

dog1.howl();
dog2.howl();

var body = $("body");
body.append(dog1.name + "<br/>");
body.append(dog1.age + "<br/>");