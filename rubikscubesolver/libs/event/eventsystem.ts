class EventSystem<T>{
    idcounter = 0
    listeners:{id:number, cb: (data: any) => void; }[] = []

    listen(cb:(val:T) => void){
        var listener = {
            id:this.idcounter++,
            cb:cb,
        }
        this.listeners.push(listener)
        return listener.id
    }

    unlisten(id){
        var index = this.listeners.findIndex(o => o.id == id)
        this.listeners.splice(index,1)
    }

    trigger(val:T){
        for (var listener of this.listeners) {
            listener.cb(val)
        }
    }
}