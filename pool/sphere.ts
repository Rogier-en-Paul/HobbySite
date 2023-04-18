class Sphere{
    pos:Vector
    vel:Vector
    radius
    mass
    color
    number
    isFilled

    constructor(data:Partial<Sphere>){
        Object.assign(this,data)
    }

    calcMass(){
        this.mass = 3.14 * (this.radius * this.radius)
    }
}