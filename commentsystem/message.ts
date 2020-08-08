declare var moment
var closehoveronmouseleave = true
var messageRegex = /@(?<targetid>[0-9]{1,6})/g
class Message{
    createdAt:Date = new Date()
    upvotes = 0
    downvotes = 0
    constructor(
        public id:number,
        public text:string,
    ){

    }

    netUpvotes(){
        return this.upvotes - this.downvotes
    }
}

class Mention{
    constructor(
        public id:number,
        public originalMessage:number,
        public mentionedMessage:number,
    ){

    }
}

function addMessage(text:string):number{
    var result = messageRegex.exec(text) as any
    var newmessageid = messageidcounter++
    
    var targetset = new Set<number>()
    while(result != null){
        var targetid = parseInt(result.groups.targetid)
        if(targetset.has(targetid) == false){
            targetset.add(targetid)
            mentions.push(new Mention(mentionidcounter++, newmessageid, targetid))
        }
        
        result = messageRegex.exec(text)
    }
    messages.push(new Message(newmessageid,text))
    
    return newmessageid
}

function renderMessage(id:number,previewLinks:boolean,onlinkClick:(linktarget:number) => void):HTMLElement{
    var mentions = findMentions(id)
    var replies = findReplies(id)
    var message = findMessage(id)

    var sortedreplies = replies.map(a => findMessage(a.originalMessage)).sort((a,b) => (a.netUpvotes() - b.netUpvotes()) * -1)
    // var sortedreplies = replies.map(a => findMessage(a.originalMessage)).sort((a,b) => a.createdAt.getTime() - b.createdAt.getTime())

    var replieselements = sortedreplies.map(rep => {
        var element = string2html(`<a style="margin-right:10px;" href="#${rep.id}">@${rep.id}</a>`)
        if(previewLinks){
            addPreviewAndConversationLink(element,rep.id,onlinkClick)
        }
        return element
    })

    var replaceresult = message.text.replace(messageRegex,(substring,p1) => {
        return `<a href="#${p1}" data-messageid="${p1}">${substring}</a>`
    })

    var html = string2html(`
        <div style="border:1px solid black; margin:10px 0px; padding:10px; max-width:700px; max-height:200px; overflow:auto; background-color: white;">
            <a id="messageid" name="${message.id}" href="#${message.id}">${message.id}</a>
            <span id="upvotes" style="cursor:pointer;">up</span> <span id="upvotecounter">${message.upvotes - message.downvotes}</span> <span style="cursor:pointer;" id="downvotes">down</span> 
            <b>${moment(message.createdAt).fromNow()}</b>
            <span id="replies"></span>
            <pre id="textcontainer" style="font-family:Arial, Helvetica, sans-serif;">${replaceresult}</pre>
            <a href="#" id="replybtn">reply</a>
        </div>
    `)
    var upvotecounter = html.querySelector('#upvotecounter')

    html.querySelector('#upvotes').addEventListener('click', e => {
        message.upvotes++
        renderMessages(false)
        // upvotecounter.innerHTML = `${message.upvotes - message.downvotes}`
    })
    
    html.querySelector('#downvotes').addEventListener('click', e => {
        message.downvotes++
        renderMessages(false)
        // upvotecounter.innerHTML = `${message.upvotes - message.downvotes}`
    })
    
    html.querySelector('#replybtn').addEventListener('click', e => {
        e.preventDefault()
        textarea.value = `@${id} ` + textarea.value
        textarea.focus()
    })

    var repliesContainer = html.querySelector('#replies')
    for(let element of replieselements){
        repliesContainer.appendChild(element)
    }
    
    var mentionelements = Array.from(html.querySelectorAll('pre a')) as HTMLElement[]
    for(let mention of mentionelements){
        if(previewLinks){
            addPreviewAndConversationLink(mention,parseInt(mention.dataset.messageid),onlinkClick)
        }
    }
    return html
}

function addPreviewAndConversationLink(linkelement:HTMLElement,targetmessageid:number,onlinkClick:(linktarget:number) => void){
    if(findMessage(targetmessageid) == null){
        return
    }else{
        linkelement.addEventListener('mouseenter', e => {
            setCursorFloater(linkelement, targetmessageid)
        })

        linkelement.addEventListener('mouseleave',e => {
            if(closehoveronmouseleave){
                cursorfloater.style.display = 'none'
            }
        })

        linkelement.addEventListener('click', e => {
            e.preventDefault()
            onlinkClick(targetmessageid)
        })
    }
}
