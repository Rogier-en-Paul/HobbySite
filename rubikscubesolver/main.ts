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
/// <reference path="cube.ts" />
/// <reference path="pathfind.ts" />
declare var Quaternion

//seeds that cant be solved atm
// G,R,O,
// G,W,O,
// G,W,G,
// O,Y,Y,R,O,R,W,G,Y,G,B,W,
// Y,O,W,R,G,W,G,R,G,R,B,O,
// B,O,Y,R,B,R,W,B,W,O,R,Y,
// B,Y,B,
// B,Y,W,
// O,Y,B,




var gridsize = 50
var screensize = new Vector(1000,500)
var {canvas,ctxt} = createCanvas(screensize.x,screensize.y)
var cube = new Cube()


var rotbtncontainer = document.querySelector('#rotbtncontainer')
var rngseedelement = document.querySelector('#seedvalue') as HTMLInputElement
var erroroutput = document.querySelector('#erroroutput') as HTMLElement
cube.RNG.seed = rngseedelement.valueAsNumber
rngseedelement.addEventListener('change', e => {
    cube.RNG.seed = rngseedelement.valueAsNumber
})

for(let action of 'F B R L U D'.split(/\s+/)){
    rotbtncontainer.insertAdjacentHTML('beforeend',`<button>${action}</button>`)
    let btn = rotbtncontainer.lastElementChild as any
    btn.addEventListener('click',() => {
        cube.apply(action,true,perspectiveSelect.value)
    })
}
var invrotbtncontainer = document.querySelector('#invrotbtncontainer')
for(let action of 'Fi Bi Ri Li Ui Di'.split(/\s+/)){
    invrotbtncontainer.insertAdjacentHTML('beforeend',`<button>${action}</button>`)
    let btn = invrotbtncontainer.lastElementChild as any
    btn.addEventListener('click',() => {
        cube.apply(action,true,perspectiveSelect.value)
    })
}

var doublerotbtncontainer = document.querySelector('#doublerotbtncontainer')
for(let action of 'F2 B2 R2 L2 U2 D2'.split(/\s+/)){
    doublerotbtncontainer.insertAdjacentHTML('beforeend',`<button>${action}</button>`)
    let btn = doublerotbtncontainer.lastElementChild as any
    btn.addEventListener('click',() => {
        cube.apply(action,true,perspectiveSelect.value)
    })
}

function createButton(name,callback){
    var specialbuttoncontainer = document.querySelector('#specialbtncontainer')

    specialbuttoncontainer.insertAdjacentHTML('beforeend',`<button>${name}</button>`)
    specialbuttoncontainer.lastElementChild.addEventListener('click', callback)
}

var perspectiveSelect = document.querySelector('#perspectiveSelect') as HTMLSelectElement
var outputinput = document.querySelector('#outputinput') as HTMLTextAreaElement
createButton('Reset', e => cube.reset())
createButton('Scramble', e => outputinput.value = cube.scramble())
createButton('Solve', e => {
    try {
        outputinput.value = cube.gensolve()
        erroroutput.innerText = ''
    } catch (errors) {
        erroroutput.innerText = errors.join('\n')
    }
    
})
createButton('Apply', (e) => {
    cube.apply(outputinput.value,true,perspectiveSelect.value)
    if(e.ctrlKey == false){
        outputinput.value = ''
    }
})
createButton('Apply1', e => {
    cube.apply(take1fromoutputinput(),true,perspectiveSelect.value)
})
createButton('Undo', e => {
    var out = cube.undo()
    if(out){
        outputinput.value = out + ' ' + outputinput.value
    }
})
createButton('Scramble & Solve', e => {
    cube.apply(cube.scramble())
    try {
        var out = cube.gensolve()
        cube.apply(out)
        outputinput.value = out
        erroroutput.innerText = ''
    } catch (errors) {
        erroroutput.innerText = errors.join('\n')
    }
    
})
createButton('export', e => {
    outputinput.value = cube.export()
})
createButton('import', e => {cube.import(outputinput.value)})


document.addEventListener('keydown',e => {
    var keymap = {
        'KeyU':'U',
        'KeyF':'F',
        'KeyD':'D',
        'KeyL':'L',
        'KeyB':'B',
        'KeyR':'R',
    }
    if(keymap[e.code] && document.activeElement != outputinput){
        cube.apply(keymap[e.code],true,perspectiveSelect.value)
    }
})



loop((dt) => {
    ctxt.fillStyle = 'black'
    ctxt.fillRect(0,0,screensize.x,screensize.y)

    drawCube(cube,ctxt)
})

function drawCube(cube:Cube,ctxt){

    for(var face of cube.cubeletFaces){
        var pos2d = cube.convert3dto2d(face.parent.pos,face.normal)
        var abs = pos2d.c().scale(gridsize)
        ctxt.fillStyle = face.color
        ctxt.fillRect(abs.x,abs.y,gridsize,gridsize)
        // ctxt.fillStyle = 'black'
        // ctxt.textAlign = 'center'
        // ctxt.textBaseline = 'middle'
        // ctxt.fillText(`${pos2d.x},${pos2d.y}`,abs.x + gridsize / 2,abs.y + gridsize / 2)
    }
}

function take1fromoutputinput(){
    var index = outputinput.value.search(/\s+/)
    var out = outputinput.value.substr(0,index)
    outputinput.value = outputinput.value.substr(index).trim()
    return out
}