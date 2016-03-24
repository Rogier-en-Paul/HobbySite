var express = require("express"),
    app = express(),
    server = require("http").createServer(app),
    io = require("socket.io").listen(server);

var url = "mongodb://paul:paull@ds043180.mlab.com:43180/hangman";
var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');
MongoClient.connect(url, function(err, db) {
    assert.equal(null, err);
    console.log("Connected correctly to server.");
    db.close();
});






server.listen(8000);
app.use(express.static(__dirname + '/../'));
app.get('/', function (req, res) {
    res.sendFile(__dirname + "hangman.html");
});
console.log("listening on port http://localhost:8000");

io.sockets.on('connection', function (socket) {

});


