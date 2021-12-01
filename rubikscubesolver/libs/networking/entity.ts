class Entity{
    static globalEntityStore:Store<Entity>

    id:number = null
    parent:number = null
    type:string = ''
    name:string =''
    children:number[] = []
    // ordercount = 0
    // sortorder = 0
    synced = false

    public constructor(init?:Partial<Entity>) {
        Object.assign(this, init);
        this.type = 'entity'
    }

    setChild(child:Entity){
        //remove child from old parent
        var oldparent = Entity.globalEntityStore.get(child.parent)
        if(oldparent != null){
            remove(oldparent.children,child.id)
        }
        this.children.push(child.id)
        child.parent = this.id
        // child.sortorder = this.ordercount++
    }

    setParent(parent:Entity){
        if(parent == null){
            this.parent = null
        }else{
            parent.setChild(this)
        }
    }

    getParent(){
        return Entity.globalEntityStore.get(this.parent)
    }

    descendant(cb:(ent:Entity) => boolean):Entity{
        return this.descendants(cb)[0]

    }

    descendants(cb:(ent:Entity) => boolean):Entity[]{
        var children = this._children(cb)
        var grandchildren = children.flatMap(c => c.descendants(cb))
        return children.concat(grandchildren)
    }
    
    child(cb:(ent:Entity) => boolean):Entity{
        return this._children(cb)[0]
    }

    _children(cb:(ent:Entity) => boolean):Entity[]{
        return this.children.map(id => Entity.globalEntityStore.get(id)).filter(cb)
    }

    allChildren(){
        return this._children(() => true)
    }

    remove(){
        remove(this.getParent().children,this.id)
        Entity.globalEntityStore.remove(this.id)
        this.removeChildren()
        return this
    }

    inject(parent){
        Entity.globalEntityStore.add(this)
        this.setParent(parent)
        return this
    }

    removeChildren(){
        this.descendants(() => true).forEach(e => Entity.globalEntityStore.remove(e.id))
        this.children = []
    }

    ancestor(cb:(ent:Entity) => boolean):Entity{
        var current:Entity = this
        while(current != null && cb(current) == false){
            current = Entity.globalEntityStore.get(current.parent)
        }
        return current
    }
}

class Player extends Entity{

    public constructor(init?:Partial<Player>) {
        super()
        Object.assign(this, init);
        this.type = 'player'
    }

    clientid
    sessionid
    disconnected = false
    dctimestamp = 0
}