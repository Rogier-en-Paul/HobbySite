Number.prototype.mod = function(n) { return ((this%n)+n)%n; };
var alphabet = "abcdefghijklmnopqrstuvwxyz";
var message = "abc xyz";
var key = Math.floor(Math.random() * 100);
var cyphertext = caeserEncrypt(message,key);
var $window = $("#window");
$window.append("the message: " + message + " and the key: " + key + "<br>");
$window.append("encrypted message: " + cyphertext + "<br>");
$window.append("decrypted message: " + caeserDecrypt(cyphertext,key));

function caeserEncrypt(plaintext,key){
    var cyphertext = "";
    for(var i = 0; i < plaintext.length; i++){
        var char = plaintext.charAt(i);
        var index = alphabet.indexOf(char);
        if(index == -1){
            cyphertext += " ";
        }else{
            cyphertext += alphabet.charAt((index + key).mod(alphabet.length));
        }
    }
    return cyphertext;
}

function caeserDecrypt(cyphertext,key){
    return caeserEncrypt(cyphertext,-key)
}

