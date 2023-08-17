
class EventQueue{
    idcounter = 0
    listeners:{id:number, type: string; cb: (data: any) => void; }[]
    events:{type:string,data:any}[]
    onProcessFinished = new EventSystem<any>()
    onRuleBroken = new EventSystem<any>()
    rules:{type:string,error:string,rulecb:(data: any) => boolean}[] = []
    discoveryidcounter = 0

    constructor(){
        this.listeners = []
        this.events = []
    }

    // listenDiscovery(type:string,megacb:(data:any,cb:(cbdata:any) => void) => void){
    //     this.listen(type,(dataAndCb:{data:any,cb:(ads:any) => void}) => {
    //         megacb(dataAndCb.data,dataAndCb.cb)
    //     })
    // }

    // startDiscovery(type:string,data: any, cb: (cbdata: any) => void) {
    //     this.addAndTrigger(type,{data,cb})
    // }

    listenDiscovery(type: string, cb: (data: any, id: any) => void) {
        this.listen(type,(discovery) => {
            cb(discovery.data,discovery.id)
        })
    }


    
    startDiscovery(type: string, data: any, cb: (cbdata: any) => void) {
        let createdid = this.discoveryidcounter++
        
        let listenerid = this.listen('completediscovery',(discovery:{data,id}) => {
            if(discovery.data.id == createdid){
                this.unlisten(listenerid)
                cb(discovery.data.data)
            }
        })
        this.addAndTrigger(type,{data,id: createdid})
    }

    completeDiscovery(data: any, id: any) {
        this.addAndTrigger('completediscovery',{data,id})
    }


    listen(type:string,cb:(data:any) => void){
        var id = this.idcounter++
        this.listeners.push({
            id:id,
            type: type,
            cb,
        })
        return id
    }

    listenOnce(type:string,cb:(data:any) => void){
        let id = this.listen(type,(data) => {
            this.unlisten(id)
            cb(data)
        })
        return id
    }

    unlisten(id:number){
        var index = this.listeners.findIndex(o => o.id == id)
        this.listeners.splice(index,1)
    }

    process(){
        
        while(this.events.length > 0){
            let currentEvent = this.events.shift()
            let listeners = this.listeners.filter(l => l.type == currentEvent.type)
            
            let brokenrules = this.rules.filter(r => r.type == currentEvent.type && r.rulecb(currentEvent.data) == false)
            
            if(brokenrules.length == 0){
                for(let listener of listeners){
                    listener.cb(currentEvent.data)
                }
            }else{
                console.log(first(brokenrules).error)
                this.onRuleBroken.trigger({event:currentEvent,error:first(brokenrules).error})
            }
        }
        this.onProcessFinished.trigger(0)
    }
    
    add(type:string,data:any){
        this.events.push({
            type: type,
            data:data,
        })
    }

    addAndTrigger(type:string,data:any){
        this.add(type,data)
        this.process()
    }

    addRule(type,error,rulecb:(e:any) => boolean){
        this.rules.push({type,error,rulecb})
    }
}