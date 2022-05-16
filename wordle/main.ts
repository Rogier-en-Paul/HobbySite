/// <reference path="libs/vector/vector.ts" />
/// <reference path="libs/utils/rng.ts" />
/// <reference path="libs/utils/store.ts" />
/// <reference path="libs/utils/table.ts" />
/// <reference path="libs/utils/utils.ts" />
/// <reference path="libs/utils/stopwatch.ts" />
/// <reference path="libs/utils/ability.ts" />
/// <reference path="libs/utils/anim.ts" />
/// <reference path="libs/rect/rect.ts" />
/// <reference path="libs/event/eventqueue.ts" />
/// <reference path="libs/event/eventsystem.ts" />
/// <reference path="libs/utils/camera.ts" />
/// <reference path="libs/networking/entity.ts" />
/// <reference path="libs/networking/server.ts" />
/// <reference path="libs/utils/domutils.js" />
/// <reference path="./wordlist.js" />

var alphabet = ["A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V","W","X","Y","Z"];
var correctword = 'CRANE'
var grid = []
var currentrow = 0
var currentletter = 0
var keyboardbuttons = {}

startContext(document.body)
    div({style:'display:flex;justify-content: center; align-items: center; height: 100vh;'});
        div({style:'display:flex; flex-direction:column; color:white;'})
            div({style:'display: flex; flex-direction: column; align-items: center; margin-bottom:50px;'})
                for(var i = 0; i < 6;i++){
                    let row = []
                    grid.push(row)
                    div({style:'display:flex; flex-direction:row'})
                        for(var j = 0; j < 5;j++){
                            var letter = div({style:'width:50px; height:50px; display:inline-flex; justify-content:center; align-items:center; background:black;'});text('');end();
                            row.push(letter)
                        }
                    end()
                }
            end()

            div()
                div({style:'display:flex; justify-content:center;'});
                    for(let letter of alphabet.slice(0,10)){
                        letterButton(letter)
                    }
                end();
                div({style:'display:flex; justify-content:center;'});
                    for(let letter of alphabet.slice(10,19)){
                        letterButton(letter)
                    }
                end();
                div({style:'display:flex; justify-content:center;'});
                    
                    for(let letter of alphabet.slice(19,26)){
                        letterButton(letter)
                    }
                end();
            end()
        end()
    end();
endContext()

function letterButton(letter:string){
    let keyboardbutton = button({style:'border:0px; padding:20px 10px; font-size:20px;'});text(letter);end();
    keyboardbuttons[letter] = keyboardbutton
    keyboardbutton.on('click', e => {
        console.log(letter)
        document.dispatchEvent(new KeyboardEvent('keydown',{
            key:letter.toLowerCase(),
        }))
    })
}

document.addEventListener('keydown',e => {
    if(/^[A-Z]$/i.test(e.key.toUpperCase())){
        
        if(currentletter <= 4){
            grid[currentrow][currentletter].innerText = e.key.toUpperCase()
            currentletter++
        }
    }else if(e.code == 'Enter'){
        var guessedword = grid[currentrow].map(l => l.innerText).join('').toUpperCase()
        var guessedwordlower = guessedword.toLowerCase()
        if(currentletter < 4){
            alert('word not complete')
        }else if(wordlist.findIndex(v => v == guessedwordlower) >= 0){//check if valid word
            evaluaterow()
            if(guessedword == correctword){
                alert('game won')
            }else{
                currentrow++
                currentletter = 0
                if(currentrow > 5){
                    alert('game lost')
                }
            }
        }else{
            alert('word not in dictionary')
        }
    }else if(e.key == 'Backspace'){
        currentletter = clamp(currentletter - 1,0,4)
        grid[currentrow][currentletter].innerText = ''
    }
})

function evaluaterow(){
    for(var i = 0; i < grid[currentrow].length;i++){
        let letterdiv = grid[currentrow][i]
        if(letterdiv.innerText == correctword[i]){
            keyboardbuttons[letterdiv.innerText].style.background = '#538d4e'
            letterdiv.style.background = '#538d4e'
        }else if(correctword.includes(letterdiv.innerText)){
            keyboardbuttons[letterdiv.innerText].style.background = '#b59f3b'
            letterdiv.style.background = '#b59f3b'
        }else{
            keyboardbuttons[letterdiv.innerText].style.background = '#3a3a3c'
            letterdiv.style.background = '#3a3a3c'
        }
    }
}
