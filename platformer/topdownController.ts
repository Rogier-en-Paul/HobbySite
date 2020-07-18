import { Entity, World, applyStoppingForce, moveTowards } from './world'
import Vector from './vector'
import { get2DMoveInputYflipped, keys } from './utils'

export class TopDownController{
    private moveforce = 3000
    accforce:Vector = new Vector(this.moveforce,this.moveforce)
    stopforce:Vector = new Vector(this.moveforce,this.moveforce)

    constructor(public body:Entity,public  world:World){
        body.minspeed = new Vector(-300,-300)
        body.maxspeed = new Vector(300,300)
        world.entities.push(body)


        world.beforeUpdate.listen((dt) => {
            if(keys['p']){
                debugger
            }
            var input = get2DMoveInputYflipped()
            var scaledstopforce = this.stopforce.c().scale(dt)
            if(input.x == 0){
                body.vel.x = moveTowards(body.vel.x,0,scaledstopforce.x)
            }
            if(input.y == 0){
                body.vel.y = moveTowards(body.vel.y,0,scaledstopforce.y)
            }
            
            if(input.length() > 0){
                var acc = this.accforce.c().mul(input.c().normalize())
                body.vel.add(acc.scale(dt))
            }
            

            // this
        })

        document.addEventListener('keydown',e => {
            if(e.key == ' ' && e.repeat == false){
                this.dash(this.body.dir.c().scale(100))
            }
        })

        world.afterUpdate.listen((dt) => {

        })
    }

    dash(dir:Vector){
        this.world.move(this.body,dir)
    }
}