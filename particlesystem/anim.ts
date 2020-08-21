enum AnimType{once,repeat,pingpong,extend}

class Anim{
    animType:AnimType = AnimType.once
    reverse:boolean = false
    duration:number = 1000
    stopwatch:StopWatch = new StopWatch()
    begin:number = 0
    end:number = 1

    constructor(){

    }

    write(begin:number,end:number,duration:number,animType:AnimType){
        this.begin = begin
        this.end = end
        this.duration = duration
        this.animType = animType
        this.stopwatch.start()
        return this
    }

    get():number{
        var cycles = this.stopwatch.get() / this.duration
        var small = Math.min(this.begin,this.end)
        var big = Math.max(this.begin,this.end)
        switch (this.animType) {
            case AnimType.once:
                return clamp(lerp(this.begin,this.end,cycles),small,big) 
            case AnimType.repeat:
                return lerp(this.begin,this.end,mod(cycles,1))
            case AnimType.pingpong:
                
                var pingpongcycle = mod(cycles, 2)
                if(pingpongcycle <= 1){
                    return lerp(this.begin,this.end,pingpongcycle)
                }else{
                    return lerp(this.end,this.begin,pingpongcycle - 1)
                }

            case AnimType.extend:
                var distPerCycle = to(this.begin,this.end)
                return Math.floor(cycles) * distPerCycle + lerp(this.begin,this.end,mod(cycles,1))
        }
    }
}