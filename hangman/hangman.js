//var socket = io.connect();
var words = ["pizza","piraat","edelsteen","discobal","hearthstone","koffieautomaat"];
var alphabet = ["a","b","c","d","e","f","g","h","i","j","k","l","m","n","o","p","q","r","s","t","u","v","w","x","y","z"];
var app = angular.module('app', []);

app.controller('ctrl',function($scope){
    $scope.word = words[Math.floor(Math.random() * words.length)];
    var nUniqueLetters = countUniqueLetters($scope.word);
    $scope.maxWrongGuesses = 9;
    $scope.wrongGuesses = 0;
    $scope.rightGuesses = 0;
    $scope.remaining = alphabet.slice();
    $scope.guessedChars = [];
    $scope.guess = guess;


    function guess(index){
        if($scope.word.indexOf($scope.remaining[index]) > -1){
            $scope.rightGuesses++;
            if($scope.rightGuesses == nUniqueLetters){
                reset();
                alert("won");
                return;
            }
        }else{
            $scope.wrongGuesses++;
            if($scope.wrongGuesses == $scope.maxWrongGuesses){
                reset();
                return;
            }
        }
        $scope.guessedChars.push($scope.remaining[index]);
        $scope.remaining.splice(index, 1);
    }

    function reset(){
        $scope.rightGuesses = 0;
        $scope.wrongGuesses = 0;
        $scope.guessedChars = [];
        $scope.remaining = alphabet.slice();
    }
});

function countUniqueLetters(string){
    var readLetters = [];
    var uniques = 0;
    for(var i = 0;i < string.length; i++){
        var char = string[i];
        if(readLetters.indexOf(char) == -1){
            readLetters.push(char);
            uniques++;
        }
    }
    return uniques;
}