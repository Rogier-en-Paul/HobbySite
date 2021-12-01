class StopWatch{

    starttimestamp = Date.now()
    pausetimestamp = Date.now()
    pausetime = 0
    paused = true

    get():number{
        var currentamountpaused = 0
        if(this.paused){
            currentamountpaused = to(this.pausetimestamp,Date.now())
        }
        return to(this.starttimestamp, Date.now()) - (this.pausetime + currentamountpaused)
    }



    start(){
        this.paused = false
        this.starttimestamp = Date.now()
        this.pausetime = 0
    }

    continue(){
        if(this.paused){
            this.paused = false
            this.pausetime += to(this.pausetimestamp, Date.now())
        }
    }

    pause(){
        if(this.paused == false){
            this.paused = true
            this.pausetimestamp = Date.now()
        }
    }

    reset(){
        this.paused = true
        this.starttimestamp = Date.now()
        this.pausetimestamp = Date.now()
        this.pausetime = 0
    }
}