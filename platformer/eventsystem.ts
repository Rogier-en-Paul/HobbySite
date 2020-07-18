export class Box<T>{
    value:T
    beforeChange:EventSystem<T> = new EventSystem()
    afterChange:EventSystem<T> = new EventSystem()

    get():T{
        return this.value
    }

    set(val:T){
        this.beforeChange.trigger(this.value)
        this.value = val
        this.afterChange.trigger(this.value)
    }
}

export class PEvent<T>{
    cbset:Set<EventListener<T>> = new Set()
    handled:boolean = false

    constructor(public value:T){

    }
    
}

export type EventListener<T> = (val:T,e:PEvent<T>) => void

export class EventSystem<T>{
    listeners:EventListener<T>[] = []

    constructor(){

    }

    listen(cb:EventListener<T>){
        this.listeners.push(cb)
    }

    trigger(val:T){
        this.continue(new PEvent(val)) 
    }

    continue(e:PEvent<T>){
        for (var cb of this.listeners) {
            if(e.cbset.has(cb) == false){
                e.cbset.add(cb)
                cb(e.value,e)
                if(e.handled){
                    break
                }
            }
        }
    }
}