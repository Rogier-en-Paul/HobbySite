class Clock{
    time = 0
    realtime = 0
    speed = 1
    paused = false

    update(dt){
        if(this.paused == false){
            this.time += dt * this.speed
        }
        this.realtime += dt
    }

    get(){
        return this.time
    }

    start(){
        this.paused = false
    }

    reset(){
        this.time = 0
        this.realtime = 0
    }

    pause(){
        this.paused = true
    }
}