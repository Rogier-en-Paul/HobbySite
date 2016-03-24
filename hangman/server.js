var express = require("express"),
    app = express(),
    server = require("http").createServer(app),
    io = require("socket.io").listen(server),
    mongoose = require("mongoose");
app.use(express.static(__dirname + '/'));
app.get('/', function (req, res) {
    res.sendFile(__dirname + "/hangman.html");
});
server.listen(8000);
console.log("listening on port 8000");
var url = "mongodb://localhost:27017/test";
mongoose.connect(url,function(err){
    if(err){
        console.log(err);
    }else{
        console.log("connected succesfully to mongodb");
    }
});
var wordSchema = mongoose.Schema({
    name:String,
    word:String
});
var Word = mongoose.model('word',wordSchema);

io.sockets.on("connection",function(socket){
    console.log("client connected");
    socket.on("get",function(){
        console.log("received get request");
        Word.find(function(err, docs){
            socket.emit("get",docs[0]);
        }).limit(1).sort({_id:-1});
    });

    socket.on("save",function(data){
        var newWord = new Word({name:data.name,word:data.word});
        newWord.save(function(err,doc){
            console.log("saved:" + doc)
        });
    });
});






var newWord = new Word({name:"wietse",word:"swag"});

//newWord.save(function(err,doc){
//    console.log(doc)
//});
//Word.find(function(err, docs){
//    console.log(docs)
//});