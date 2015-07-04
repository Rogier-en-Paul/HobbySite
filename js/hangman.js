$( document ).ready(function() {
    var words = ["pizza","piraat","edelsteen","discobal","hearthstone","koffieautomaat"];
    var word = words[Math.floor(Math.random() * words.length)];
    
    var allowedChars = ["a","b","c","d","e","f","g","h","i","j","k","l","m","n","o","p","q","r","s","t","u","v","w","x","y","z"];
    var guessedChars = [];
    var nOfWrongGuesses = 0;
    var answer = "";
    for(var i = 0;i<word.length;i++){
        answer += "-"
    }
    $("#answer").val(answer);
    console.log(word);
    
    $("#submit").on("click",function(){
        var guess = $("#guess").val();
        
        guessedRight = false;
        for(var i = 0;i<word.length;i++){
            if(guess == word[i]){
                guessedRight = true;
                guessedChars.push(guess);
                break;
            }
        }
        if(!guessedRight){
            nOfWrongGuesses++;
            if(nOfWrongGuesses > 7){
                word = words[Math.floor(Math.random() * words.length)];
                console.log(word);
                nOfWrongGuesses = 0;
                alert("u got rekt m8");
            }
        }
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
        if(answer == word){
            alert("such win");
            word = words[Math.floor(Math.random() * words.length)];
            console.log(word);
            nOfWrongGuesses = 0;
            guessedChars = [];
            answer = "";
            for(var i = 0;i<word.length;i++){
                answer += "-"
            }
            $("#answer").val(answer);
        }
    });
    
    $("#guess").on("keyup",function(e){
        var input = String.fromCharCode(e.keyCode).toLowerCase();
        for(var i = 0;i< guessedChars.length;i++){
            if(input == guessedChars[i]){
                $("#alerts").replaceWith("character has already been guessed");
                $("#guess").val("");
                return;
            }
        }
        for(var i = 0;i< allowedChars.length;i++){
            if(input == allowedChars[i]){
                $("#guess").val(input);
                return;
            }    
        }
        $("#alerts").replaceWith("character is not allowed");
        $("#guess").val("");
    });
    
    $("#guess").on("keydown",function(e){
        $("#guess").val("");
    });
    
});