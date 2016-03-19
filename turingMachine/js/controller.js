var app = angular.module('app', ['mgcrea.ngStrap']);
var programs = [];

var writeOptions = [0, 1, "None"];
var moveOptions = [-1, 0, 1];
var system = new System();

app.controller('ctrl',function($scope){
    $scope.addCard = addCard;
    $scope.deleteCard = deleteCard;
    $scope.run = run;
    $scope.step = step;
    $scope.reset = reset;
    $scope.runChallenge = runChallenge;
    $scope.writeOptions = writeOptions;
    $scope.moveOptions = moveOptions;
    $scope.tape = "00000";
    $scope.challenges = challenges;
    $scope.outputTape = "";
    $scope.animating = false;
    $scope.debugMode = false;
    $scope.startTour = startTour;
    $scope.programNumber = 0;
    $scope.startPosition = 0;

    var program = new Program($scope.tape.split("").map(function(entry){
        return parseInt(entry);
    }));
    program.cards[1] = new Card(new Option(1, 1, 1), new Option(1, 1, 1));
    program.currentCard = program.cards[1];

    system.programs.push(program);
    $scope.system = system;
    system.currentProgram = system.programs[0];

    setInterval(function(){
        if($scope.animating){
            var temp = system.currentProgram.step().join("");
            temp = placeHead(temp, system.currentProgram.position);
            $scope.outputTape = temp;
            output.val(temp);
        }
    }, 200);

    function addCard(){
        var write0 = parseInt(writeOption0.find("option:selected").text());
        var move0 = parseInt(moveOption0.find("option:selected").text());
        var write1 = parseInt(writeOption1.find("option:selected").text());
        var move1 = parseInt(moveOption1.find("option:selected").text());

        var zero = new Option(write0, move0, $scope.nextCard0);
        var one = new Option(write1, move1, $scope.nextCard1);
        //if(system.programs[$scope.programNumber] == null){
        //    system.programs[$scope.programNumber] = new Program();
        //}
        system.programs[0].cards[$scope.cardNumber] = new Card(zero, one);
    }

    function deleteCard(index){
        system.currentProgram.cards.splice(index, 1);
    }

    function run(){
        system.currentProgram.position = Math.floor($scope.tape.length / 2);
        system.currentProgram.tape = system.currentProgram.tape = $scope.tape.split("").map(function(entry){
            return parseInt(entry);
        });
        var temp = system.currentProgram.run().join("");
        temp = placeHead(temp, system.currentProgram.position);
        $scope.outputTape = temp;
    }

    function step(){
        var temp = system.currentProgram.step().join("");
        temp = placeHead(temp, system.currentProgram.position);
        $scope.outputTape = temp;
    }

    function reset(){
        system.currentProgram.tape = $scope.tape.split("").map(function(entry){
            return parseInt(entry);
        });
        var temp = parseInt($scope.startPosition);
        if(isNaN(temp)){
            temp = 0;
        }
        system.currentProgram.position = temp;
        $scope.outputTape = placeHead($scope.tape, system.currentProgram.position);
    }

    function runChallenge(index){
        challenges[index].tryChallenge(system.currentProgram)
    }
});

function placeHead(stringTape, position){
    stringTape = [stringTape.slice(0, position + 1), "|", stringTape.slice(position + 1, stringTape.length)].join('');
    stringTape = [stringTape.slice(0, position), "|", stringTape.slice(position, stringTape.length)].join('');
    return stringTape;
}