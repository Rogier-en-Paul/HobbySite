
var contextStack = [[document.body]]

function currentContext(){
    return last(contextStack)
}

function startContext(element){
    contextStack.push([element])
}

function endContext(){
    contextStack.pop()
}


function scr(tag,attributes = {}){
    flush()
    return cr(tag,attributes)
}

function cr(tag,attributes = {}){
    var parent = peek()
    var element = document.createElement(tag)
    if(parent){
        parent.appendChild(element)
    }
    for(var key in attributes){
        element.setAttribute(key,attributes[key])
    }
    currentContext().push(element)
    return element
}

function crend(tag,textstring,attributes = {}){
    cr(tag,attributes)
    text(textstring)
    return end()
}

function text(data){
    peek().textContent = data
    return peek()
}

function html(html){
    peek().innerHTML = html
}

function end(endelement = null){
    var poppedelement = currentContext().pop()
    if(endelement != null && endelement != poppedelement){
        console.warn(poppedelement,' doesnt equal ', endelement)
    }
    return poppedelement
}

HTMLElement.prototype.on = function(event,cb){
    this.addEventListener(event,cb)
    return this
}

function peek(){
    var context = currentContext()
    return last(context)
}

function flush(){
    var context = currentContext()
    var root = context[0]
    context.length = 0
    return root
}

function div(options = {}){
    return cr('div',options)
}

function a(options = {}){
    return cr('a',options)
}

function button(text,options = {}){
    return crend('button',text,options)
}

function input(options = {}){
    return crend('input',options)
}

function img(options = {}){
    return crend('img',options)
}


function stringToHTML (str) {
	var temp = document.createElement('template');
    
    temp.innerHTML = str;
    return temp.content.firstChild;
}

function upsertChild(parent,child){
    if(parent.firstChild){
        parent.replaceChild(child,parent.firstChild)
    }else{
        parent.appendChild(child)
    }
}

function qs(element,query){
    if(typeof element == 'string'){
        return document.body.querySelector(element)    
    }
    return element.querySelector(query)
}

function qsa(element,query){
    return Array.from(element.querySelectorAll(query))
}
