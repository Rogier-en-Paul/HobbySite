

// class PEvent<T>{
//     cbset:Set<EventListener2<T>> = new Set()
//     handled:boolean = false

//     constructor(public value:T){

//     }
    
// }

// type EventListener2<T> = (val:T,e:PEvent<T>) => void
class EventListener2<T>{
    id:number
    
    constructor(
        public cb:(v:T) => void
    ){

    }
}

class EventSystem<T>{

    listeners = new TableMap<EventListener2<T>>('id',[])

    constructor(){

    }

    listen(cb:(v:T) => void){
        var evl = new EventListener2(cb)
        return this.listeners.add(evl)
    }

    trigger(val:T){
        for(var [key,value] of this.listeners.primarymap.entries()){
            value.cb(val)
        }
    }

    unlisten(id:number){
        return this.listeners.delete(id)
    }
}