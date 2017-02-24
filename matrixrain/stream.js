class Stream{
    constructor(pos){
        this.lastdrop = Date.now() / 1000;
        this.timebetweendrops = 30;
        this.pos = pos;
        this.highlight = Math.random() > 0.5;
    }

    update(){
        if((Date.now() - this.lastdrop) > this.timebetweendrops){
            this.lastdrop = Date.now()
            grid[this.pos.x][this.pos.y].first = false;
            this.pos.y += 1;
            if(this.pos.y <= gridsm.y && this.highlight)grid[this.pos.x][this.pos.y].first = true;
        }
    }

    draw(){
        grid[this.pos.x][this.pos.y].age = 0;
    }
}