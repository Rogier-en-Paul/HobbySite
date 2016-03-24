var socket = io.connect("http://localhost:8000");
var words = ["pizza","piraat","edelsteen","discobal","hearthstone","koffieautomaat"];
var alphabet = ["a","b","c","d","e","f","g","h","i","j","k","l","m","n","o","p","q","r","s","t","u","v","w","x","y","z"];
var app = angular.module('app', []);

socket.emit("get");

app.controller('ctrl',function($scope){
    $scope.previousWinner = "loading";
    $scope.word;
    var nUniqueLetters;
    $scope.maxWrongGuesses = 9;
    $scope.wrongGuesses = 0;
    $scope.rightGuesses = 0;
    $scope.remaining = alphabet.slice();
    $scope.guessedChars = [];
    $scope.guess = guess;

    socket.on("get",function(data){
        $scope.word = data.word;
        $scope.previousWinner = data.name;
        nUniqueLetters = countUniqueLetters(data.word);
        $scope.$apply();
    });

    function guess(index){
        if($scope.word.indexOf($scope.remaining[index]) > -1){
            $scope.rightGuesses++;
            if($scope.rightGuesses == nUniqueLetters){
                reset();
                var name = prompt("you won enter your name");
                var newWord = prompt("enter word for next visitor");
                if(isLegalWord(newWord) && newWord.length > 3 && newWord.length < 20){
                    socket.emit("save", {"name":name,"word":newWord});
                    $scope.word = newWord;
                    $scope.previousWinner = name;
                    reset();
                }else{
                    alert("illegal word");
                }
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
        nUniqueLetters = countUniqueLetters($scope.word)
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

function isLegalWord(string){
    if(string == null){
        return false;
    }
    for(var i = 0;i < string.length; i++){
        var char = string[i];
        if(alphabet.indexOf(char) == -1){
            return false;
        }
    }
    return true;
}