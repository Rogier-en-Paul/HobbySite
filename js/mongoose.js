var mongoose = require("mongoose");
mongoose.connect("mongodb://localhost/players",function(err){
    if(err){
        console.log(err);
    }else{
        console.log("connected succesfully");
    }
});

var playerSchema = mongoose.Schema({
    name:String,
    age:Number
});

var Player = mongoose.model('player',playerSchema);
var newPlayer = new Player({name:"jan",age:34});
newPlayer.save(function(err){
    if(err){
        console.log(err);
    }
});

Player.find(function(err,docs){
    if(err){
        console.log(err);
    } else{
        console.log(docs);
    }
});