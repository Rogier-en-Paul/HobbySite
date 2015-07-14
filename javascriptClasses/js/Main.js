var dog1 = new Dog("Paul",10);
var dog2 = new Dog("test",404);
var cat1 = new Cat("acat",25);
var cat2 = new Cat("acat2",2353);

dog1.howl();
dog1.howl = function(){
  console.log("test");
};
dog2.howl();

cat1.howl();
cat1.howl = function(){
    console.log("test");
};
cat2.howl();
dog1.howl = null;
dog1.howl();

var body = $("body");
body.append(dog1.name + "<br/>");
body.append(dog1.legs + "<br/>");