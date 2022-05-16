class Store<T>{

    map = new Map<number,T>()
    counter = 0

    get(id:number){
        return this.map.get(id)
    }

    add(item:T){
        (item as any).id = this.counter++
        this.map.set((item as any).id,item)
    }

    list(){
        return Array.from(this.map.values())
    }

    remove(id){
        var val = this.map.get(id)
        this.map.delete(id)
        return val
    }
}