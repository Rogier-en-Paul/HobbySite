class Symbol{
    constructor(pos, val){
        this.lastChange = Date.now();
        this.changespeed = random(1000,3000)
        
        this.maxage = random(0.2,3);
        this.age = this.maxage;
        this.pos = pos;
        this.val;
        this.first = false;
        this.highlight = false;
        if(val)this.val = val;
        else this.setrandomchar();
    }

    render(){
        if(this.age < this.maxage){
            var bright = 0;
            if(this.highlight || this.first)bright = 150;
            var red = map(this.age, 0,this.maxage,0,0)
            var green = map(this.age, 0,this.maxage,255,0)
            var blue = map(this.age, 0,this.maxage,70,0)
            fill(red + bright,green,blue + bright)
            text(this.val, this.pos.x * symbolSize, this.pos.y * symbolSize)
        }
    }

    update(){
        this.age += dt;
        if((Date.now() - this.lastChange) > this.changespeed){
            this.lastChange = Date.now();
            this.setrandomchar()
        }
    }

    setrandomchar(){
        this.val = String.fromCharCode(0x30A0 + round(random(0, 96)))
    }

}