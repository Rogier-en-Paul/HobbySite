var app = angular.module('app', []);
var programs = [];
var tape = Array.apply(null, new Array(30)).map(Number.prototype.valueOf,0);
var writeOptions = [0, 1, "None"];
var moveOptions = [-1, 0, 1];

app.controller('ctrl',function($scope){
    $scope.writeOptions = writeOptions;
    $scope.moveOptions = moveOptions;
    $scope.tape = tape;
    $scope.addCard = addCard;
    $scope.run = run;

    programs[0] = new Program();//prints alternating 1s and 0s to the right
    programs[0].cards[1] = new Card(new Option(1, 1, 2), new Option(1, 1, 1));
    programs[0].cards[2] = new Card(new Option(0, 1, 1), new Option(1, 1, 1));
    programs[0].cards[3] = new Card(new Option(0, 1, 1), new Option(1, 1, 1));
    programs[0].cards[4] = new Card(new Option(0, 1, 1), new Option(1, 1, 1));

    programs[2] = new Program();


    $scope.programs = programs;

});

function addCard(programN, cardN, write, move, nextCard){
    programs[parseInt(programN)].cards[parseInt(cardN)] = new Card(new Option(write, move, parseInt(nextCard)), new Option(1, 1, 1));
}

function run(){
    tape = programs[0].execute(tape);
}