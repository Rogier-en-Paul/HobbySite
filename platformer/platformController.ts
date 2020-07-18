import {  World, Entity, applyStoppingForce } from "./world";
import Vector from "./vector";
import { get2DMoveInputYflipped, keys, clamp, to } from "./utils";

export class PlatformController{
    gravity:Vector = new Vector(0,800)
    jumpspeed:number = 400
    
    accforce = 3000
    passiveStopForce = 3000
    airaccforce = 1000
    airpassiveStopForce = 350
    
    jumpMaxAmmo = 1
    jumpAmmo = this.jumpMaxAmmo
    climbforce = 2000
    wallhangResetsJumpAmmo = true
    fallStart = 0

    constructor(public body:Entity,public  world:World){
        world.entities.push(body)

        world.beforeUpdate.listen((dt) => {
            var input = get2DMoveInputYflipped()

            
            this.body.vel.add(this.gravity.c().scale(dt))
            if(keys['w'] && this.body.grounded.y == 1){
                this.jump()
            }
            //move
            if(input.x != 0){
                var accForce = this.body.grounded.y == 0 ? this.airaccforce : this.accforce
                this.body.vel.x += input.x * accForce * dt

                var hanging = this.isHanging()
                if(hanging != 0 && this.body.vel.y > 0){
                    applyStoppingForce(this.body.vel,new Vector(0,this.climbforce * dt))
                }
            }
            //passive stop
            if(input.x == 0){
                var stopstrength = this.body.grounded.y == 0 ? this.airpassiveStopForce : this.passiveStopForce
                applyStoppingForce(this.body.vel,new Vector(stopstrength * dt,0))
            }
            
        })

        document.addEventListener('keydown',(e) => {
            if(e.repeat){
                return
            }
            if(e.key == ' ' || e.key == 'w'){
                this.jump()
            }
        })

        world.afterUpdate.listen(() => {
            if(this.body.grounded.y == 1){
                this.jumpAmmo = this.jumpMaxAmmo
            }
            if(this.body.grounded.x != 0 && this.wallhangResetsJumpAmmo){
                this.jumpAmmo = this.jumpMaxAmmo
            }
        })
    }

    

    
    jump(){
        var hanging = this.isHanging()
        
        var jump = () => {
            if(hanging != 0 && this.body.grounded.y == 0){
                this.body.vel = new Vector(-hanging,-1).normalize().scale(this.jumpspeed)
            }else{
                this.body.vel.y = -this.jumpspeed
            }
        }

        if(hanging != 0 || this.body.grounded.y == 1){
            jump()
        }else if(this.jumpAmmo > 0){
            jump()
            this.jumpAmmo--
        }
    }
    
    isHanging():number{
        var hanging = 0
        if(this.world.boxCast(this.body.block,0,0.01).hit){
            hanging = 1
        }else if(this.world.boxCast(this.body.block,0,-0.01).hit){
            hanging = -1
        }
        return hanging
    }
    
}