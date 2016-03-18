var app = angular.module('app', ['mgcrea.ngStrap']);
var programs = [];

var writeOptions = [0, 1, "None"];
var moveOptions = [-1, 0, 1];
var system = new System();

app.controller('ctrl',function($scope){
    $scope.selectedIcon = "";
    $scope.icons = [{"value":"Gear","label":"<i class=\"fa fa-gear\"></i> Gear"},{"value":"Globe","label":"<i class=\"fa fa-globe\"></i> Globe"},{"value":"Heart","label":"<i class=\"fa fa-heart\"></i> Heart"},{"value":"Camera","label":"<i class=\"fa fa-camera\"></i> Camera"}];


    $scope.writeOptions = writeOptions;
    $scope.moveOptions = moveOptions;
    $scope.tape = "00000";
    $scope.addCard = addCard;
    $scope.deleteCard = deleteCard;
    $scope.run = run;
    $scope.challenges = challenges;
    $scope.outputTape = "";
    $scope.animating = false;
    $scope.debugMode = false;
    $scope.startTour = startTour;
    $scope.programNumber = 0;

    var program = new Program($scope.tape);//prints alternating 1s and 0s to the right
    program.cards[1] = new Card(new Option(1, 1, 1), new Option(1, 1, 1));
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
        var temp = system.currentProgram.run($scope.tape.split("").map(function(entry){
            return parseInt(entry);
        })).join("");
        temp = [temp.slice(0, system.currentProgram.position), "|", temp.slice(system.currentProgram.position, system.currentProgram.position)].join('');
        temp = [temp.slice(0, system.currentProgram.position - 1), "|", temp.slice(system.currentProgram.position - 1, temp.length)].join('');
        $scope.outputTape = temp;

        //insert |'s around writehead location
    }
});