
class Rule{

    constructor(public message:string,public cb:() => boolean){

    }
}

class Ability{
    // ammo:number = 1
    // maxammo:number = 1
    // ammorechargerate:number = 1000
    // casttime:number = 2000
    // channelduration:number = 3000

    cooldown:number = 1000
    lastfire = Date.now()
    rules:Rule[] = [
        new Rule('not ready yet',() => (this.lastfire + this.cooldown) < Date.now()),
        //cast while moving rule
        //must have target rule
        //must have valid target rule
        //resource rule
        //ammo rule
        //line of sight rule
    ]
    stopwatch:StopWatch = new StopWatch()
    ventingtime:number = 0
    onCastFinished = new EventSystem()
    shots: number = 0
    firing: boolean = false

    

    constructor(public cb:() => void){

    }

    //positive if you need to wait 0 or negative if you can call it
    timeTillNextPossibleActivation():number{
        return to(Date.now(), this.lastfire + this.cooldown)
    }

    canActivate(){
        return this.rules.every(r => r.cb())
    }

    callActivate(){
        this.cb()
    }

    fire(){//activate
        if(this.firing == false){
            this.startfire()
        }else{
            this.holdfire()
        }
    }

    releasefire(){
        this.firing = false
    }

    tapfire(){
        this.startfire()
        this.releasefire()
    }
    
    private startfire(){
        if(this.rules.some(r => r.cb())){
            this.firing = true
            this.ventingtime = 0
            this.stopwatch.start()
            this.ventingtime -= this.cooldown
            this.shots = 1
            this.lastfire = Date.now()
            this.cb()
        }
    }

    private holdfire(){
        this.ventingtime += this.stopwatch.get()
        this.stopwatch.start()
        this.shots = Math.ceil(this.ventingtime / this.cooldown)
        this.ventingtime -= this.shots * this.cooldown
        this.lastfire = Date.now()
        if(this.shots > 0){
            this.cb()
        }
    }
}
