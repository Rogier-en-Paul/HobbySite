/// <reference path="node_modules/vectorx/vector.ts" />
/// <reference path="node_modules/utilsx/utils.ts" />
/// <reference path="message.ts" />

//order replies by upvotes/relevance/createddate
//order messages by upvotes/relevance/createddate

function findMessage(messageid:number){
    return messages.find(m => m.id == messageid)
}

function findReplies(messageid:number){
    return mentions.filter(m => m.mentionedMessage == messageid)
}

function findMentions(messageid:number){
    return mentions.filter(m => m.originalMessage == messageid)
}

var textarea = document.querySelector('#textmessage') as HTMLTextAreaElement
var sendbtn = document.querySelector('#sendbtn') as HTMLElement
var messagecontainer = document.querySelector('#messagecontainer') as HTMLElement
var cursorfloater = document.querySelector('#cursorfloater') as HTMLElement
var conversationcontainer = document.querySelector('#conversationcontainer') as HTMLElement
var messageidcounter = 1
var messages:Message[] = []
var mentionidcounter = 0
var mentions:Mention[] = []
var conversationMessages:number[] = []
moment.relativeTimeThreshold('s', 40);
moment.relativeTimeThreshold('ss', 3);

textarea.focus()
textarea.value = '@1 test comment'
sendMessage()
textarea.value = '@1 '

sendbtn.addEventListener('click',e => {
    sendMessage()
})

function sendMessage(){
    addMessage(textarea.value)
    renderMessages(true)
    textarea.value = ''
}

function renderMessages(animate:boolean){
    messagecontainer.innerHTML = ''

    // var sortedmessages = messages.slice().sort((a,b) => (a.netUpvotes() - b.netUpvotes()) * -1)
    var sortedmessages = messages.slice().sort((a,b) => a.createdAt.getTime() - b.createdAt.getTime())


    for (let i = 0; i < sortedmessages.length; i++) {
        const message = sortedmessages[i];
        var messagehtml = renderMessage(message.id,true,(linktarget) => {
            conversationMessages = [linktarget]
            renderConvo()
        })
        if(animate){
            if(i == sortedmessages.length - 1){
                messagehtml.classList.add('animate__animated','animate__fadeInDown')
            }else{
                // messagehtml.classList.add('animate__animated','animate__slideInDown')
            }
        }
        messagecontainer.prepend(messagehtml)
        
    }
}


function renderConvo(){

    conversationcontainer.innerHTML = ''
    for (let i = 0; i < conversationMessages.length; i++) {
        let messageid = conversationMessages[i];
        conversationcontainer.appendChild(renderMessage(messageid,true,(linktarget) => {
            conversationMessages.splice(i + 1)
            conversationMessages.push(linktarget)
            renderConvo()
        }))
    }
}



textarea.addEventListener('keydown', e => {
    if(e.key == 'Enter' && e.shiftKey){
        e.preventDefault()
        sendMessage()
    }
})

document.addEventListener('click', e => {
    var target = e.target as HTMLElement
    if(target.closest('#cursorfloater') != cursorfloater){
        cursorfloater.style.display = 'none'
    }
})

function setCursorFloater(poselement:HTMLElement,targetMessage:number){
    cursorfloater.style.display = ''
    var rect = poselement.getBoundingClientRect()
    cursorfloater.style.top = `${rect.top + window.pageYOffset + 5}px`
    cursorfloater.style.left = `${rect.right + window.pageXOffset + 5}px`
    cursorfloater.replaceChild(renderMessage(targetMessage,false,() => {
        console.log('hover message link')
    }),cursorfloater.firstChild)
}

