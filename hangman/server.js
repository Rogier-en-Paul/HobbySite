var express = require("express"),
    app = express(),
    server = require("http").createServer(app),
    io = require("socket.io").listen(server);
server.listen(8000);
app.use(express.static(__dirname + '/../'));
app.get('/', function (req, res) {
    res.sendFile(__dirname + "hangman.html");
});
console.log("listening on port http://localhost:8000");
var mongoose = require("mongoose");
mongoose.connect("mongodb://localhost/words",function(err){
    if(err){
        console.log(err);
    }else{
        console.log("connected succesfully to mongodb");
    }
});



var wordSchema = mongoose.Schema({
    name:String,
    word:String,
    created:{type:Date,default:Date.now}
});

var Word = mongoose.model('word',wordSchema);

io.sockets.on('connection', function (socket) {
    socket.on("requestWord",function(){
        Word.find({"word":{$ne:null}},function(err,docs){
            if(err){
                console.log(err);
            } else{
                console.log(docs[0]);
                socket.emit("requestWord",docs[0]);
            }
        }).limit(1).sort({created:-1});
    });


    socket.on('won', function (data) {
        console.log(data.name + " has guessed the word and has changed it to: " + data.newWord);
        var newWord = new Word({name:data.name,word:data.newWord});
        newWord.save(function(err){
            if(err){
                console.log(err);
            }
        });
    });
});

