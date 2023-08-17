class BodyA{
    direction:number
    mass:number
    pos:Vector
    vel:Vector


    constructor(data:Partial<BodyA>){
        Object.assign(this,data)
    }

}


class Orbit{
    eccentricity
    semimajoraxis// apogee->pergiee / 2
    rotation
    completion



    apogee
    perigee

    calcEccentricity(){
        // e= c/a
        //distance between focal points / length of major axis
    }

    fromVelAndPos(pos:Vector,vel:Vector){
        //kepllers laws
        //area swept is same at every part of orbit, S1 = S2
        //period is related to size of major axis p^2/m^3 = constant


        var theta = Math.atan2(pos.x,pos.y)//radians
        var r = pos.length()
        var V = vel.length()
        var semiMAxis = r / (2 - r * V * V)
    }

    getOrbitalPeriod(){

    }

}