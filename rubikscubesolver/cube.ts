var colormap:[Vector,String][] = [
    [new Vector(0,1,0),'white'],
    [new Vector(0,0,-1),'green'],
    [new Vector(1,0,0),'red'],
    [new Vector(-1,0,0),'orange'],
    [new Vector(0,-1,0),'yellow'],
    [new Vector(0,0,1),'blue'],
]

var color2normalmap:{[k:string]:Vector} = {
    'W':new Vector(0,1,0),
    'G':new Vector(0,0,-1),
    'R':new Vector(1,0,0),
    'O':new Vector(-1,0,0),
    'Y':new Vector(0,-1,0),
    'B':new Vector(0,0,1),
}

var abbrevcolor2colormap = {
    'W':'white',
    'G':'green',
    'R':'red',
    'O':'orange',
    'Y':'yellow',
    'B':'blue',
}

var actionrotate2frontmap = {
    'F':new Vector(1,0,0).scale(1),
    'R':new Vector(0,-1,0).scale(0.25),
    'U':new Vector(1,0,0).scale(0.25),
    'L':new Vector(0,1,0).scale(0.25),
    'D':new Vector(-1,0,0).scale(0.25),
    'B':new Vector(0,1,0).scale(0.5),
    'I':new Vector(0,0,-1).scale(0.5),
    '0':new Vector(0,1,0).scale(1),
}

var rotmap = {
    'F':new Vector(0,0,-1).scale(0.25),
    'R':new Vector(1,0,0).scale(0.25),
    'U':new Vector(0,1,0).scale(0.25),
    'L':new Vector(-1,0,0).scale(0.25),
    'D':new Vector(0,-1,0).scale(0.25),
    'B':new Vector(0,0,1).scale(0.25),
    'F2':new Vector(0,0,-1).scale(0.5),
    'R2':new Vector(1,0,0).scale(0.5),
    'U2':new Vector(0,1,0).scale(0.5),
    'L2':new Vector(-1,0,0).scale(0.5),
    'D2':new Vector(0,-1,0).scale(0.5),
    'B2':new Vector(0,0,1).scale(0.5),
    'Fi':new Vector(0,0,-1).scale(0.75),
    'Ri':new Vector(1,0,0).scale(0.75),
    'Ui':new Vector(0,1,0).scale(0.75),
    'Li':new Vector(-1,0,0).scale(0.75),
    'Di':new Vector(0,-1,0).scale(0.75),
    'Bi':new Vector(0,0,1).scale(0.75),
}



class CubeLetFace{
    normal:Vector
    startnormal:Vector
    color:string
    parent:CubeLet

    constructor(obj:Partial<CubeLetFace>){
        this.startnormal = obj?.normal?.c()
        Object.assign(this,obj)
    }

    getStartPosition2D(cube:Cube){
        return cube.convert3dto2d(this.parent.startpos,this.startnormal)
    }

    getCurrentPosition2D(cube:Cube){
        return cube.convert3dto2d(this.parent.pos,this.normal)
    }
}

class CubeLet{
    type:string
    pos:Vector
    startpos:Vector
    faces:CubeLetFace[] = []

    constructor(obj:Partial<CubeLet>){
        Object.assign(this,obj)
    }
}

class Cube{
    cubelets:CubeLet[] = []
    cubeletFaces:CubeLetFace[] = []
    history:string[] = []
    graph2d:Knot[]
    graph3d:Knot[]
    tempcube: Cube
    RNG = new RNG(0)

    constructor(){
        this.reset()
    }

    reset(){
        this.history = []
        this.RNG.seed = 0
        this.import(`      
        W,W,W,
        W,W,W,
        W,W,W,
  O,O,O,G,G,G,R,R,R,B,B,B,
  O,O,O,G,G,G,R,R,R,B,B,B,
  O,O,O,G,G,G,R,R,R,B,B,B,
        Y,Y,Y,
        Y,Y,Y,
        Y,Y,Y`)
    }

    copy():Cube{
        return new Cube().import(this.export())
    }

    vector2action(vector:Vector):string{
        var entries = Object.entries(rotmap)
        var i = findbestIndex(entries, ([key,value]) => {
            return -vector.to(value).length()
        })
        return entries[i][0]
    }

    action2vector(action:string):Vector{
        return rotmap[action].c()
    }

    changePerspective(compositeActions:string[],perspectives:string):string[]{
        var res = []
        for(var perspective of perspectives.split(/\s+/)){
            for(var compositeAction of compositeActions){
                var rotatedCompositeAction = ''
                for(var action of compositeAction.split(/\s+/)){
                    var vector = this.action2vector(action)
                    axisRotate(vector,actionrotate2frontmap[perspective],actionrotate2frontmap[perspective].length())
                    rotatedCompositeAction += `${this.vector2action(vector)} `
                     
                }
                rotatedCompositeAction = rotatedCompositeAction.trim()
                res.push(rotatedCompositeAction)
            }
        }

        return res
    }

    //could also give higher level actions
    generateGraph(actions:string[]){
        this.graph2d = []
        this.graph3d = []
        
        var tempcube = new Cube()
        this.tempcube = tempcube

        //3d ------------------------------------------
        for(var cubelet of tempcube.cubelets){
            this.graph3d.push(new Knot({
                pos:cubelet.startpos.c(),
            }))
        }

        for(var action of actions){
            tempcube.reset()
            tempcube.apply(action)
            for(var cubelet of tempcube.cubelets){
                //edges are only usefull if the action moves the cubelet
                if(cubelet.pos.equals(cubelet.startpos) == false){
                    var orginalknot = this.graph3d.find(k => k.pos.equals(cubelet.startpos))
                    var newknot = this.graph3d.find(k => k.pos.equals(cubelet.pos))
                    orginalknot.edges.push(new Edge({
                        target:newknot,
                        data:action,
                        cost:action.split(/\s+/).length,
                    }))
                }
            }
        }
        //3d -------------------------------------------------

        //2d ----------------------------------------------
        for(var face of tempcube.cubeletFaces){
            var pos2d = face.getCurrentPosition2D(this)
            this.graph2d.push(new Knot({
                pos:pos2d,
            }))
        }

        for(var action of actions){
            tempcube.reset()
            tempcube.apply(action)
            for(var face of tempcube.cubeletFaces){
                if(face.getCurrentPosition2D(this).equals(face.getStartPosition2D(this)) == false){
                    var originalknot = this.graph2d.find(k => k.pos.equals(face.getStartPosition2D(this)))
                    var newknot = this.graph2d.find(k => k.pos.equals(face.getCurrentPosition2D(this)))

                    originalknot.edges.push(new Edge({
                        target:newknot,
                        data:action,
                        cost:action.split(/\s+/).length,
                    }))
                }
            }
        }
    }

    pathfind2d(dest:Vector):string{
        var misplacedface = this.cubeletFaces.find(f => f.getStartPosition2D(this).equals(dest))
        var start = this.graph2d.find(k => k.pos.equals(misplacedface.getCurrentPosition2D(this)));
        var goal = this.graph2d.find(k => k.pos.equals(misplacedface.getStartPosition2D(this)));
        return pathfind(start,goal,this.graph2d).map(e => e.data).join(' ')
    }

    pathfind3d(position:Vector){
        var misplacedpiece = this.cubelets.find(c => c.startpos.equals(position))
        var start = this.graph3d.find(k => k.pos.equals(misplacedpiece.pos))
        var dest = this.graph3d.find(k => k.pos.equals(misplacedpiece.startpos))
        return pathfind(start,dest,this.graph3d).map(e => e.data).join(' ')
    }
    


    apply(rotations:string, savehistory = true,perspective = 'F'){
        if(rotations){
            rotations = this.changePerspective([rotations],perspective)[0]
            if(savehistory){
                this.history = this.history.concat(rotations.split(/\s+/)) 
            }
            var rots = this.string2rots(rotations)
            for(var rot of rots){
                this.rot(rot.c().normalize(),rot.length())
            }
        }
        return rotations
    }

    undo(){
        if(this.history.length){
            var lastmove = this.history.splice(this.history.length - 1, 1)[0]
            var reverseaction = this.getReverseAction(lastmove)
            this.apply(reverseaction,false)
            return lastmove
        }
    }

    string2rots(input:string):Vector[]{
        return input.split(/\s+/).map(op => rotmap[op])
    }

    rot(faceNormal:Vector,turns:number){
        var cubelets = this.cubelets.filter(c => c.pos.c().normalize().dot(faceNormal) > 0.1)

        for(var cubelet of cubelets){
            axisRotate(cubelet.pos,faceNormal,turns)

            for(var cubeletface of cubelet.faces){
                axisRotate(cubeletface.normal,faceNormal,turns)
            }
        }
    }

    directionsposmap = [
        [new Vector(0,0,-1),new Vector(4,4),Quaternion.fromAxisAngle(new Vector(0,1,0).vals,TAU * 0)],
        [new Vector(0,0,1),new Vector(10,4),Quaternion.fromAxisAngle(new Vector(0,1,0).vals,TAU * 0.5)],
        [new Vector(0,1,0),new Vector(4,1),Quaternion.fromAxisAngle(new Vector(1,0,0).vals,TAU * -0.25)],
        [new Vector(0,-1,0),new Vector(4,7),Quaternion.fromAxisAngle(new Vector(1,0,0).vals,TAU * 0.25)],
        [new Vector(1,0,0),new Vector(7,4),Quaternion.fromAxisAngle(new Vector(0,1,0).vals,TAU * 0.25)],
        [new Vector(-1,0,0),new Vector(1,4),Quaternion.fromAxisAngle(new Vector(0,1,0).vals,TAU * -0.25)],
    ]

    convert3dto2d(pos3d:Vector,normal:Vector):Vector{
        var [valnormal,offset,quat] = this.directionsposmap.find(vals => vals[0].equals(normal))
        var frontrotated = Vector.fromArray(quat.rotateVector(pos3d.c().vals)).round()
        return new Vector(frontrotated.x + offset.x,frontrotated.y * -1 + offset.y)
    }

    convert2dto3d(pos:Vector):{pos:Vector,normal:Vector}{
        return null
    }

    genrandomize(count:number):String{
        var rots = Object.keys(rotmap)
        var res = ''
        for(var i = 0; i < count;i++){
            res += rots[Math.floor(Math.random() * rots.length)]
        }
        return res
    }

    getReverseAction(action:string){
        var v = this.action2vector(action)
        v.setMagnitude((v.length() * 3) % 1)
        return this.vector2action(v)
    }

    gensolve():string{
        // https://rubiks-cube-solver.com/
        // https://cubesolve.com/
        // https://rubikscu.be/
        var errors = this.detectErrors()
        if(errors.length > 0){
            throw errors
        }
        var result = ''
        var tempcube = this.copy()
        this.tempcube = tempcube


        // 1 solve white edges
        var composites = ['R Di Ri','R D Ri','L Di Li','L D Li']
        composites = composites.concat(tempcube.changePerspective(composites,'R L B'))
        
        tempcube.generateGraph(['F','B','R','L','U','D','Fi','Bi','Ri','Li','Ui','Di'].concat(composites))
        result += tempcube.apply(tempcube.pathfind2d(new Vector(4,0))) + '\n'
        tempcube.generateGraph(['F','R','L','D','Fi','Ri','Li','Di'].concat(composites))
        result += tempcube.apply(tempcube.pathfind2d(new Vector(5,1))) + '\n'
        tempcube.generateGraph(['F','L','D','Fi','Li','Di'].concat(composites))
        result += tempcube.apply(tempcube.pathfind2d(new Vector(4,2))) + '\n'
        tempcube.generateGraph(['L','D','Li','Di'].concat(composites))
        result += tempcube.apply(tempcube.pathfind2d(new Vector(3,1))) + '\n '
        result += '\n'

        // 2 solve white corners
        composites = ['Ri Di R D','F D Fi Di','Ri D2 R D Ri Di R']
        composites = composites.concat(tempcube.changePerspective(composites,'R L B'))
        tempcube.generateGraph(['D','Di'].concat(composites));
        result += tempcube.apply(tempcube.pathfind2d(new Vector(3,0))) + '\n'
        result += tempcube.apply(tempcube.pathfind2d(new Vector(5,0))) + '\n'
        result += tempcube.apply(tempcube.pathfind2d(new Vector(5,2))) + '\n'
        result += tempcube.apply(tempcube.pathfind2d(new Vector(3,2))) + '\n'
        result += '\n'

        // 3 MIDDLE
        composites = tempcube.changePerspective(['Ui Li U L U F Ui Fi','U R Ui Ri Ui Fi U F'],'I')
        composites = composites.concat(tempcube.changePerspective(composites,'R L B'))
        tempcube.generateGraph(['D','Di'].concat(composites));
        result += tempcube.apply(tempcube.pathfind2d(new Vector(3,4))) + '\n'//2,4
        result += tempcube.apply(tempcube.pathfind2d(new Vector(5,4))) + '\n'//6,4
        result += tempcube.apply(tempcube.pathfind2d(new Vector(0,4))) + '\n'//11,4
        result += tempcube.apply(tempcube.pathfind2d(new Vector(8,4))) + '\n'//9,4
        result += '\n'

        
        
        // 4 CROSS
        //can this be done with pathfinding?
        //by creating graphs from different perspectives maybe
        //detect cross state
        composites = tempcube.changePerspective(['F R U Ri Ui Fi'],'I')
        for(var i = 0; i < 10; i++){//while not cross
            var output = []
            if(tempcube.detect('X Y X - Y Y Y - X Y X',new Vector(4,7),[1],output)){
                break
            }else if(tempcube.detect('X X X - Y Y Y - X X X',new Vector(4,7),[1,0.25],output)){
                var rots = ['0','R']
                var rotcomposites = tempcube.changePerspective(composites,rots[output[0]]).join(' ')
                result += tempcube.apply(rotcomposites) + '\n'
            }else if(tempcube.detect('X Y X - Y Y X - X X X',new Vector(4,7),[1,0.25,0.5,0.75],output)){
                var rots = ['B','R','0','L']//todo check if R and L are in the right spot
                var rotcomposites = tempcube.changePerspective(composites,rots[output[0]]).join(' ')
                result += tempcube.apply(rotcomposites) + '\n'
            }else{
                result += tempcube.apply(composites[0]) + '\n'
            }
        }
        // result += '\n'

        // 5 swap last layer edges
        composites = ['R U Ri U R U2 Ri U']//, 'R U Ri U R U2 Ri U y2 U yi R U Ri U R U2 Ri U'
        composites = composites.concat(tempcube.changePerspective(tempcube.changePerspective(composites,'I'),'R L B'))
        tempcube.generateGraph(composites);
        result += tempcube.apply(tempcube.pathfind2d(new Vector(4,6))) + '\n'
        result += tempcube.apply(tempcube.pathfind2d(new Vector(5,7))) + '\n'
        result += tempcube.apply(tempcube.pathfind2d(new Vector(4,8))) + '\n'
        result += tempcube.apply(tempcube.pathfind2d(new Vector(3,7))) + '\n'
        // result += '\n'

        // 6 position last layer corners
        composites = ['U R Ui Li U Ri Ui L']
        composites = tempcube.changePerspective(tempcube.changePerspective(composites,'I'),'F R L B')
        tempcube.generateGraph(composites);
        result += tempcube.apply(tempcube.pathfind3d(new Vector(-1,-1,-1))) + '\n'

        composites = tempcube.changePerspective(['U R Ui Li U Ri Ui L'],'I')
        tempcube.generateGraph(composites);
        result += tempcube.apply(tempcube.pathfind3d(new Vector(1,-1,-1))) + '\n'
        // result += '\n'

        //7 orient corners
        //for every corner
        //move it to FRU position
        //move yellow up with 2 x rdrd
        //last stup use U too fix top

        composites = tempcube.changePerspective(['Ri Di R D Ri Di R D'],'I')
        for(var i = 0; i < 4; i++){
            for(var j = 0;tempcube.detect('Y X X - X X X - X X X', new Vector(4,7),[1],[]) == false && j < 2; j++){
                result += tempcube.apply(composites[0]) + '\n'
            }
            result += tempcube.apply('D') + '\n'
        }
        tempcube.generateGraph(['D']);
        result += tempcube.apply(tempcube.pathfind2d(new Vector(4,5))) + '\n'

        return result.replace(/ +/g,' ').trim()
    }

    //check pattern against 2dgrid
    detect(pattern:string,center:Vector,rotations:number[],output:number[]){
        var rows = pattern.split('-')
        var grid = rows.map(r => r.trim().split(/\s+/))
        var samplepoints = [
            new Vector(-1,-1),new Vector(0,-1),new Vector(1,-1),
            new Vector(-1,0),new Vector(0,0),new Vector(1,0),
            new Vector(-1,1),new Vector(0,1),new Vector(-1,1)]
        
        for(var i = 0; i < rotations.length; i++){
            var rotation = rotations[i]
            var match = true
            for(var samplepoint of samplepoints){
                
                var rotatedpoint =  axisRotate(samplepoint.c(),new Vector(0,0,1),rotation).add(new Vector(1,1))
                var patterncolor = grid[rotatedpoint.y][rotatedpoint.x]
                var face = this.getFace(samplepoint.c().add(center))
                if(patterncolor != 'X' && face.color[0].toUpperCase() != patterncolor){
                    match = false
                    break
                }
            }
            if(match){
                output.push(i)
            }
        }
        
        return output.length > 0
    }

    getFace(position:Vector){
        return this.cubeletFaces.find(f => f.getCurrentPosition2D(this).equals(position))
    }
    
    scramble(){
        rngseedelement.valueAsNumber = this.RNG.seed
        var options = ['F','R','U','L','D','B']
        var actions = ''
        for(var i = 0; i < 20; i++){
            actions += `${options[Math.floor(this.RNG.range(0,options.length))]} `
        }
        actions = actions.trim()
        return actions
    }

    export(){
        var gf = (x,y) => {
            return this.getFace(new Vector(x,y)).color[0].toUpperCase()
        }
return `
      ${gf(3,0)},${gf(4,0)},${gf(5,0)},
      ${gf(3,1)},${gf(4,1)},${gf(5,1)},
      ${gf(3,2)},${gf(4,2)},${gf(5,2)},
${gf(0,3)},${gf(1,3)},${gf(2,3)},${gf(3,3)},${gf(4,3)},${gf(5,3)},${gf(6,3)},${gf(7,3)},${gf(8,3)},${gf(9,3)},${gf(10,3)},${gf(11,3)},
${gf(0,4)},${gf(1,4)},${gf(2,4)},${gf(3,4)},${gf(4,4)},${gf(5,4)},${gf(6,4)},${gf(7,4)},${gf(8,4)},${gf(9,4)},${gf(10,4)},${gf(11,4)},
${gf(0,5)},${gf(1,5)},${gf(2,5)},${gf(3,5)},${gf(4,5)},${gf(5,5)},${gf(6,5)},${gf(7,5)},${gf(8,5)},${gf(9,5)},${gf(10,5)},${gf(11,5)},
      ${gf(3,6)},${gf(4,6)},${gf(5,6)},
      ${gf(3,7)},${gf(4,7)},${gf(5,7)},
      ${gf(3,8)},${gf(4,8)},${gf(5,8)}`
       
    }

    import(data:string){
        
        var colorsgrid = data.trim().split('\n').map(row => row.split(',').filter((cell:any) => cell != false).map(cell => cell.trim()))
        for(var i of [0,1,2,6,7,8]){
            colorsgrid[i].splice(0,0,null,null,null)
        }
        this.cubelets = []
        this.cubeletFaces = []
        
        for(var x = -1; x < 2; x++){
            for(var y = -1; y < 2;y++){
                for(var z = -1; z < 2;z++){

                    var normals:Vector[] = []
                    if(x != 0){
                        normals.push(new Vector(x,0,0))
                    }
                    if(y != 0){
                        normals.push(new Vector(0,y,0))
                    }
                    if(z != 0){
                        normals.push(new Vector(0,0,z))
                    }

                    var cubelet = new CubeLet({
                        pos:new Vector(x,y,z),
                        startpos:new Vector(0,0,0),
                        type:{
                            0:'core',
                            1:'center',
                            2:'edge',
                            3:'corner',
                        }[normals.length],
                    })
                    this.cubelets.push(cubelet)

                    for(var normal of normals){
                        var vec2d = this.convert3dto2d(new Vector(x,y,z), normal)
                        var colorabrrev = colorsgrid[vec2d.y][vec2d.x]
                        var startnormal = color2normalmap[colorabrrev]
                        
                        for(var i = 0; i < 3; i++){
                            if(startnormal.vals[i] != 0){
                                cubelet.startpos.vals[i] = startnormal.vals[i]
                            }
                        }
                        
                        var newface = new CubeLetFace({
                            color:abbrevcolor2colormap[colorabrrev],
                            parent:cubelet,
                            normal:normal,
                            startnormal:startnormal,
                        })
                        cubelet.faces.push(newface)
                        this.cubeletFaces.push(newface)
                    }
                }
            }
        }

        
        return this
    }

    detectErrors(){
        var combis = {}
        var errors = []
        for(var cubelet of this.cubelets){
            var sp = vec2string(cubelet.startpos)
            if(sp in combis){
                var colorsofcubelet = cubelet.faces.map(f => f.color).join(',')
                errors.push(`duplicate piece (${colorsofcubelet}) pos:${vec2string(combis[sp])} pos2: ${vec2string(cubelet.pos)}`)
            }
            combis[sp] = cubelet.pos
        }

        return errors
    }
}

function vectorequals(a:Vector,b:Vector):boolean{
    return a.x == b.x && a.y == b.y && a.z == b.z
}

function isSameDirection(a:Vector,b:Vector,slag:number){
    return a.c().normalize().dot(b) > slag
}

function axisRotate(v:Vector,axis:Vector,turns:number){
    var added = false
    if(v.vals.length == 2){
        v.vals.push(0)
        added = true
    }
    var quat = Quaternion.fromAxisAngle(axis.vals,turns * TAU)
    v.vals = quat.rotateVector(v.vals)
    if(added){
        v.vals.splice(v.vals.length - 1,1)
    }
    v.round()
    return v
}

function vec2string(v:Vector){
    return v.vals.join(',')
}