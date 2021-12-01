class Knot{
    id:number
    edges:Edge[] = []
    cost:number
    predecessor:Knot
    usedEdge:Edge
    pos:Vector

    constructor(obj:Partial<Knot>){
        Object.assign(this,obj)
    }
}

class Edge{
    id:number
    target:Knot
    cost:number
    data:string

    constructor(obj:Partial<Edge>){
        Object.assign(this,obj)
    }
}

function pathfind(start:Knot,dest:Knot,graph:Knot[]):Edge[]{
    for(var knot of graph){
        knot.cost = Number.MAX_VALUE
        knot.predecessor = null
    }
    start.cost = 0
    var explored:Knot[] = []
    var frontier:Knot[] = [start]

    
    
    while(frontier.length > 0){
        var smallest = 0
        for(var i = 1; i < frontier.length;i++){
            if(frontier[i].cost < frontier[smallest].cost){
                smallest = i
            }
        }
        var current = frontier.splice(smallest,1)[0]
        if(current == dest){
            break
        }
        for(var edge of current.edges){
            if(current.cost + edge.cost < edge.target.cost){
                edge.target.predecessor = current
                edge.target.usedEdge = edge
                edge.target.cost = current.cost + edge.cost
                frontier.push(edge.target)
            }
        }
        explored.push(current)
    }
    return traceback(start,dest)
}

function traceback(start:Knot,destination:Knot):Edge[]{
    var res = []
    var current = destination
    while(current != start && current != null){
        res.push(current.usedEdge)
        current = current.predecessor
    }

    return res.reverse()
}