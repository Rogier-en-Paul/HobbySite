var app = angular.module('app', ['mgcrea.ngStrap']);
var programs = [];
var tape = "00000000000000000000000000";

var writeOptions = [0, 1, "None"];
var moveOptions = [-1, 0, 1];
var system = new System();

app.controller('ctrl',function($scope){
    $scope.writeOptions = writeOptions;
    $scope.moveOptions = moveOptions;
    $scope.tape = tape;
    $scope.addCard = addCard;
    $scope.deleteCard = deleteCard;
    $scope.run = run;
    $scope.challenges = challenges;
    $scope.outputTape = "";
    $scope.animating = false;
    $scope.debugMode = false;
    $scope.startTour = startTour;
    $scope.programNumber = 0;

    var program = new Program();//prints alternating 1s and 0s to the right
    program.cards[1] = new Card(new Option(1, 1, 2), new Option(1, 1, 1));
    program.currentCard = program.cards[1];
    //programs[0].cards[2] = new Card(new Option(0, 1, 1), new Option(1, 1, 1));
    //programs[0].cards[3] = new Card(new Option(0, 1, 1), new Option(1, 1, 1));
    //programs[0].cards[4] = new Card(new Option(0, 1, 1), new Option(1, 1, 1));

    //programs[2] = new Program();

    system.programs.push(program);
    $scope.system = system;
    system.currentProgram = system.programs[0];

    setInterval(function(){
        if($scope.animating){
            console.log("step");
        }
    }, 200);

    function addCard(){
        console.log("add");
        var zero = new Option(1,1,$scope.nextCard0);
        var one = new Option(1,1,$scope.nextCard1);
        var newCard = new Card(zero, one);
        //if(system.programs[$scope.programNumber] == null){
        //    system.programs[$scope.programNumber] = new Program();
        //}
        system.programs[0].cards[$scope.cardNumber] = newCard;
    }

    function deleteCard(index){
        system.currentProgram.cards.splice(index, 1);
        console.log("delete" + index);
    }

    function run(){
        $scope.outputTape = system.programs[0].run(tape.split("").map(function(entry){
            return parseInt(entry);
        })).join("");
    }
});