class TableMap<T>{
    idcounter = 0
    primarymap = new Map<number,T>()
    foreignmaps = new Map<string,Map<number,T[]>>()

    constructor(public primarykey:string,public foreignkeys:string[]){
        for(var foreignkey of this.foreignkeys){
            this.foreignmaps.set(foreignkey,new Map<number,T[]>())
        }
    }

    add(item:T){
        var id = this.idcounter++
        item[this.primarykey] = id
        this.primarymap.set(item[this.primarykey],item)

        for(var foreignkey of this.foreignkeys){
            var array = this.foreignmaps.get(foreignkey).get(item[foreignkey])
            if(array == null){
                array = []
                this.foreignmaps.get(foreignkey).set(item[foreignkey],array)
            }
            array.push(item)
        }
        return id
    }

    get(id:number):T{
        return this.primarymap.get(id)
    }

    getForeign(key:string,id:number):T[]{
        return this.foreignmaps.get(key).get(id)
    }

    delete(id:number){
        var item = this.primarymap.get(id)
        this.primarymap.delete(id)

        for(var foreignkey of this.foreignkeys){
            var array = this.foreignmaps.get(foreignkey).get(item[foreignkey])
            var  i = array.findIndex(v => v[this.primarykey] == id)
            array.splice(i,1) 
        }
    }
}