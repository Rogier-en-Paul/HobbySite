var app = angular.module('app', ['mgcrea.ngStrap']);
var programs = [];

var moveOptions = [{
    value:1,
    icon:'glyphicon-arrow-right'
},{
    value:0,
    icon:'glyphicon-minus'
},{
    value:-1,
    icon:'glyphicon-arrow-left'
}];
var writeOptions = [0, 1, "None"];
var system = new System();

app.controller('ctrl',function($scope){
    $scope.addCard = addCard;
    $scope.deleteCard = deleteCard;
    $scope.run = run;
    $scope.autoRun = autoRun;
    $scope.step = step;
    $scope.cont = cont;
    $scope.runChallenge = runChallenge;
    $scope.writeOptions = writeOptions;
    $scope.moveOptions = moveOptions;
    $scope.tape = "000011110000";
    $scope.challenges = challenges;
    $scope.outputTape = "";
    $scope.animating = false;
    $scope.debugMode = {on:false};
    $scope.startTour = startTour;
    $scope.programNumber = 0;
    $scope.startPosition = 0;

    var program = new Program($scope.tape.split("").map(function(entry){
        return parseInt(entry);
    }));
    program.cards[0] = new Card(new Option(0, 0, 0), new Option(0, 0, 0));
    program.cards[1] = new Card(new Option(1, 1, 2), new Option(-1, -1, 1));
    program.cards[2] = new Card(new Option(1, -1, 1), new Option(-1, 1, 2));
    program.currentCard = program.cards[1];

    system.programs.push(program);
    $scope.system = system;
    system.currentProgram = system.programs[0];
    program.debugmode = $scope.debugMode;

    setInterval(function(){
        //console.log($scope.animating);
        if($scope.animating){
            var temp = system.currentProgram.step().join("");
            temp = placeHead(temp, system.currentProgram.position);
            $scope.outputTape = temp;
            $scope.$apply();
        }

    },200);

    function run(){
        $scope.animating = false;
        system.currentProgram.tape = $scope.tape.split("").map(function(entry){//reset tape
            return parseInt(entry);
        });
        system.currentProgram.position = Math.floor($scope.startPosition).mod(system.currentProgram.tape.length);//reset position
        //currentcard is reset in the run function
        var temp = system.currentProgram.run().join("");//run the program and get the output
        temp = placeHead(temp, system.currentProgram.position);//place head cosmetics
        $scope.outputTape = temp;//write output onto page
    }

    function autoRun(){
        system.currentProgram.currentCard = system.currentProgram.cards[1];
        system.currentProgram.tape = $scope.tape.split("").map(function(entry){//reset tape
            return parseInt(entry);
        });
        system.currentProgram.position = Math.floor($scope.startPosition).mod(system.currentProgram.tape.length);//reset position
        $scope.animating = !$scope.animating;
    }

    function step(){
        var temp = system.currentProgram.step().join("");
        temp = placeHead(temp, system.currentProgram.position);
        $scope.outputTape = temp;
    }

    function cont(){
        var temp = system.currentProgram.continue().join("");
        temp = placeHead(temp, system.currentProgram.position);
        $scope.outputTape = temp;
    }

    function runChallenge(index){
        challenges[index].tryChallenge(system.currentProgram)
    }

    function addCard(){
        var write0 = parseInt(writeOption0.find("option:selected").text());
        var move0 = parseInt(moveOption0.find("option:selected").text());
        var write1 = parseInt(writeOption1.find("option:selected").text());
        var move1 = parseInt(moveOption1.find("option:selected").text());
        if(isNaN(write0))write0 = -1;
        if(isNaN(write1))write1 = -1;

        var nextCard0 = parseInt($scope.nextCard0);
        var nextCard1 = parseInt($scope.nextCard1);
        var cardNumber = parseInt($scope.cardNumber);
        if(isNaN(nextCard0) || isNaN(nextCard1) || isNaN(cardNumber) || nextCard0 < 0 || nextCard1 < 0 || cardNumber < 1){
            alert("all fields are required");
           return;
        }
        
        var zero = new Option(write0, move0, nextCard0);
        var one = new Option(write1, move1, parseInt(nextCard1));
        system.currentProgram.cards[parseInt(cardNumber)] = new Card(zero, one);
        system.currentProgram.currentCard = system.currentProgram.cards[1];
    }

    function deleteCard(index){
        system.currentProgram.cards.splice(index, 1);
    }
});

function placeHead(stringTape, position){
    stringTape = [stringTape.slice(0, position + 1), "|", stringTape.slice(position + 1, stringTape.length)].join('');
    stringTape = [stringTape.slice(0, position), "|", stringTape.slice(position, stringTape.length)].join('');
    return stringTape;
}

function compareArray(a, b){
    var equal = true;
    if(a.length != b.length)return false;
    for(var i = 0;i < a.length; i++)if(a[i] != b[i])return false;
    return equal;
}

Number.prototype.mod = function(n) {
    return ((this % n) + n) % n;
};