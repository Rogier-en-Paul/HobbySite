$( document ).ready(function() {
    var words = ["pizza","piraat","edelsteen","discobal","hearthstone","koffieautomaat"];
    var word = words[Math.floor(Math.random() * words.length)];
    
    var allowedChars = ["a","b","c","d","e","f","g","h","i","j","k","l","m","n","o","p","q","r","s","t","u","v","w","x","y","z"];
    var guessedLetters = [];
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
                console.log("yay");
                guessedRight = true;
                break;
            }
        }
        if(guessedRight == false){
            nOfWrongGuesses++;
        }
        if(nOfWrongGuesses > 7){
            word = words[Math.floor(Math.random() * words.length)];
            console.log(word);
            nOfWrongGuesses = 0;
            alert("u got rekt m8");
        }
        for(var i = 0;i<word.length;i++){
            $("#answer").val("-");
        }
    });
    
    $("#guess").on("keyup",function(e){
        var input = String.fromCharCode(e.keyCode).toLowerCase(); 
        for(var i = 0;i< allowedChars.length;i++){
            if(input == allowedChars[i]){
                allowed = true;
                $("#guess").val(input);
                return;
            }    
        }
        console.log("character is not allowed");
        $("#guess").val("");
    });
});