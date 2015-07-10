$( document ).ready(function() {
    var socket = io.connect();
    var words = ["pizza","piraat","edelsteen","discobal","hearthstone","koffieautomaat"];
    var word = words[Math.floor(Math.random() * words.length)];
    var previousPlayer = "not initialized";

    var allowedChars = ["a","b","c","d","e","f","g","h","i","j","k","l","m","n","o","p","q","r","s","t","u","v","w","x","y","z"];
    var guessedChars = [];
    var nOfWrongGuesses = 0;
    var maxWrongGuesses = 9;
    var answer;
    
    reset();

    $("#submit").on("click",function(){
        var guess = $("#guess").val();
        if(guess == ""){
            return;
        }
        guessedChars.push(guess);
        
        var guessedRight = false;
        for(var i = 0;i<word.length;i++){
            if(guess == word[i]){
                guessedRight = true;
                break;
            }
        }
        if(!guessedRight){
            nOfWrongGuesses++;
            if(nOfWrongGuesses >= maxWrongGuesses){
                alert("u lost but the answer was: " + word);
                reset();
            }
        }
        set();
        if(answer == word){
            alert("such win");
            var name = prompt("enter your name");
            var newWord = prompt("enter word for next visitor");
            if(isAllowed(newWord)){
                socket.emit("won",{name:name,newWord:newWord});
            }else{
                alert("word wasn't saved because it contained illegal characters or was null");
            }

            reset();
        }
        $("#guess").val("");
    });
    
    $("#guess").on("keyup",function(e){
        var input = String.fromCharCode(e.keyCode).toLowerCase();
        for(var i = 0;i< guessedChars.length;i++){
            if(input == guessedChars[i]){
                $("#alerts").html("character has already been guessed");
                $("#guess").val("");
                return;
            }
        }
        for(var i = 0;i< allowedChars.length;i++){
            if(input == allowedChars[i]){
                $("#guess").val(input);
                $("#alerts").html("");
                return;
            }    
        }
        $("#alerts").html("character is not allowed");
        $("#guess").val("");
    });
    
    $("#guess").on("keydown",function(e){
        $("#guess").val("");
    });

    socket.on("requestWord",function(data){
        console.log(data);
        word = data.word;
        previousPlayer = data.name;
        setAnswer();
    });

    function reset(){
        socket.emit("requestWord");
        console.log(word);
        guessedChars = [];
        nOfWrongGuesses = 0;
        set();
    }
    
    function set(){
        $("#guessedChars").html("guessed characters: " + guessedChars);
        $("#counter").html("number of wrong guesses: " + nOfWrongGuesses + "/" + maxWrongGuesses);
        setAnswer();
    }
    
    function setAnswer(){
        answer = "";
        for(var i = 0;i<word.length;i++){
            var found = false;
            for(var j = 0;j<guessedChars.length;j++){
                if(word[i] == guessedChars[j]){
                    answer += guessedChars[j];
                    found = true;
                    break;
                }
            }
            if(!found){
                answer += "-";
            }
        }
        $("#answer").val(answer);
    }

    function isAllowed(word){
        if(word == null){
            return false;
        }
        for(var i = 0;i< word.length;i++){
            var foundChar = false;
            for(var j = 0;j<allowedChars.length;j++){
                if(word[i] == allowedChars[j]){
                    foundChar = true;
                }
            }
            if(foundChar == false){
                return false;
            }
        }
        return true;
    }
    
});