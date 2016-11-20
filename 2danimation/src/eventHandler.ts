class EventHandler{

    private static instance:EventHandler
    private static eventMap:Map<string, ((any?) => any)[]> = new Map();

    

    // static getInstance():EventHandler{
    //     if(EventHandler.instance == null){
    //         EventHandler.instance = new EventHandler();
    //     }
        
    //     return EventHandler.instance;
    // }

    static trigger(event:string, data?:any){
        if(EventHandler.eventMap.get(event) == null)return
        for(var callback of EventHandler.eventMap.get(event))callback(data)
    }

    static subscribe(event:string, callback:(data:any) => void){
        if(EventHandler.eventMap.get(event) == null)EventHandler.eventMap.set(event, [])
        EventHandler.eventMap.get(event).push(callback)
    }

    static detach(event:string, callback:() => void):void{
        var sublist = EventHandler.eventMap.get(event);
        for(var i = 0; i < sublist.length; i++){
            var callbackInMap = sublist[i];
            if(callbackInMap == callback){
                sublist.splice(i,1)
                return  
            }
        }
    }
}

export = EventHandler