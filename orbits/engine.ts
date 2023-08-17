class Engine{
    thrustatm:number
    thrustvac:number
    ispatm:number
    ispvac:number
    mass:number
    throttle:number
    throttlespeed:number
    fuelpersecond:number
    exhaustvel:number


    constructor(data:Partial<Engine>){
        Object.assign(this,data)
    }

    thrust(){

    }
}

class FuelType{
    name:string
    density:number

    constructor(data:Partial<FuelType>){
        Object.assign(this,data)
    }

}

class FuelContainer{
    mass:number
    fueltype:FuelType
    maxfuel:number
    currentfuel:number

    constructor(data:Partial<FuelContainer>){
        Object.assign(this,data)
    }

    getMass(){
        return this.mass + this.currentfuel * this.fueltype.density
    }
}

class Part{

}

class OrbitalParameters{
    semimajor:number
    eccentricity:number
    inclination:number
    raan:number
    argofperigee:number
    trueanomaly:number

    orbitalperiod:number
    time:number
    apoaps:number
    periaps:number
    ascendingnode
    evec

    constructor(data:Partial<OrbitalParameters>){
        Object.assign(this,data)
    }

}

class Rocket{
    onrails:boolean
    turnrate:number
    body:BodyA
    engine:Engine
    fuelContainer:FuelContainer
    landed:boolean
    orbitalParams:OrbitalParameters

    constructor(data:Partial<Rocket>){
        Object.assign(this,data)
    }

    getWetMass(){
        return this.engine.mass + this.fuelContainer.getMass()
    }

    getDryMass(){
        return this.engine.mass + this.fuelContainer.mass
    }
}

class Planet{
    body:BodyA
    radius:number
    atmosphereheight:number
    atmoshpericdensity:number

    constructor(data:Partial<Planet>){
        Object.assign(this,data)
    }
}