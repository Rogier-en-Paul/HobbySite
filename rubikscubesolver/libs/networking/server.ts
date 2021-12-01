/*
class ServerClient{
    
    output = new EventSystem<any>()
    sessionid: number = null

    constructor(public socket, public id){


        this.socket.on('message',(data) => {
            this.output.trigger(data)
        })
    }

    input(type,data){
        this.socket.emit('message',{type,data})
    }
}

class Server{
    // gamemanager: GameManager;
    output = new EventSystem<{type:string,data:any}>()
    clients = new Store<ServerClient>()
    sessionidcounter = 0

    onBroadcast = new EventSystem<{type:string,data:any}>()

    constructor(){
        this.gamemanager = new GameManager()
        Entity.globalEntityStore = this.gamemanager.entityStore;

        this.gamemanager.setupListeners()
        this.gamemanager.eventQueue.addAndTrigger('init',null)

        this.gamemanager.eventQueue.onProcessFinished.listen(() => {
            this.updateClients()
            set synced status of updated entities to true
        })

        this.gamemanager.broadcastEvent.listen((event) => {
            for(var client of this.clients.list()){
                client.input(event.type,event.data)
            }
        })

        this.gamemanager.sendEvent.listen((event) => {
            this.clients.list().filter(c => c.sessionid == event.sessionid).forEach(c => c.input(event.type,event.data))
        })

        setInterval(() => {
            var longdcedplayers = this.gamemanager.helper.getPlayers().filter(p => p.disconnected == true && (Date.now() - p.dctimestamp) > 5_000 )
            longdcedplayers.forEach(p => {
                console.log(`removed disconnected player:${p.name}`)
                p.remove()
            })
            if(longdcedplayers.length > 0){
                this.updateClients()
            }
        },5000)
    }

    updateClients(){
        this.gamemanager.broadcastEvent.trigger({type:'update',data:this.gamemanager.entityStore.list()})
    }

    connect(client:ServerClient){
        this.clients.add(client)
        let players = this.gamemanager.helper.getPlayers()

        //client does a handshake
        //if client sends sessionID look for a player with that sessionid
        //if not found or client sends no sessionid create a new player with a new sessionid
        //finish handshake by sending client and sessionid
        //when a client disconnects flag player as dc'ed and set dc timestamp after 2 min delete dc'ed players

        //client should connect, check for sessionid in localstore/sessionstorage
        //then initiate handshake send found sessionid
        //save session and client id on client and look in database for player with sessionid = client.sessionid
        client.socket.on('handshake',(data,fn) => {
            
            let sessionid = data.sessionid
            if(sessionid == null){
               sessionid = this.sessionidcounter++
            }
            this.sessionidcounter = Math.max(sessionid,this.sessionidcounter)//should create random guid instead
            client.sessionid = sessionid
            console.log(`user connected:${client.sessionid}`)

            let foundplayer = players.find(p => p.sessionid == sessionid)
            if(foundplayer == null){
                let player = new Player({clientid:client.id,sessionid:sessionid})
                player.inject(this.gamemanager.helper.getPlayersNode())
                
            }else{
                foundplayer.clientid = client.id
                foundplayer.disconnected = false
                //reconnection dont create new player but do change the pointer to the new client
            }

            fn({
                clientid:client.id,
                sessionid:sessionid,
            })
            this.updateClients()
        })

        
        

        client.socket.on('disconnect',() => {
            //watch out for multiple connected clients
            this.clients.remove(client.id)
            var sessionplayer = this.gamemanager.helper.getSessionPlayer(client.sessionid)
            console.log(`user disconnected:${client.sessionid}`)
            //this often goes wrong for some reason
            //maybe when multiple clients are connected the old player's clientid gets overwritten
            //also goes wrong when a second tab connects and disconnects
            // check if other clients use the same sessionid
            
            var connectedclients = this.clients.list().filter(c => c.sessionid == client.sessionid)
            if(connectedclients.length == 0){
                sessionplayer.disconnected = true
                sessionplayer.dctimestamp = Date.now()
            }
            
            this.updateClients()
        })

        client.output.listen(e => {
            server.input(e.type,{clientid:client.id,sessionid:client.sessionid,data:e.data})
        })
    }

    input(type,data){
        this.gamemanager.eventQueue.addAndTrigger(type,data)
    }

    serialize(){
        //only serialize unsynced entitys
        return JSON.stringify(this.gamemanager.entityStore.list())
    }

    
}

*/