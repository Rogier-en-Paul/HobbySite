var generator = 3;
var modulus = 17;
var privateKeyA = 15;
var privateKeyB = 13;

function mixNumbers(n1, n2, modulus){
	return Math.pow(n1,n2).mod(modulus);
}

//alice
var aliceColor = mixNumbers(generator,privateKeyA,modulus);

//bob
var bobColor = mixNumbers(generator,privateKeyB,modulus);

var endColorA = mixNumbers(bobColor,privateKeyA,modulus);
var endColorB = mixNumbers(aliceColor,privateKeyB,modulus);

if(endColorA == endColorB){
	console.log(endColorA);
}

function crackCode(){

}