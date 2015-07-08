$( document ).ready(function() {
    var words = ["pizza","piraat","edelsteen","discobal","hearthstone","koffieautomaat"];
    var word = words[Math.floor(Math.random() * words.length)];
    
    var allowedChars = ["a","b","c","d","e","f","g","h","i","j","k","l","m","n","o","p","q","r","s","t","u","v","w","x","y","z"];
    var guessedChars = [];
    var nOfWrongGuesses = 0;
    var maxWrongGuesses = 7;
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
                alert("u got rekt m8");
                reset();
            }
        }
        set();
        if(answer == word){
            alert("such win");
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
    
    function reset(){
        word = words[Math.floor(Math.random() * words.length)];
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
    
});