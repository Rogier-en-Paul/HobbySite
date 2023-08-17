//todo
//fix calcback error, anglediff calc
//calculate angle -> time and time -> angle

//look into this
//https://www.youtube.com/watch?v=Pq95tkKZrlU
//https://www.youtube.com/watch?v=jYtA01qIH6E
function posAndVel2OrbitParams(pos:Vector,vel:Vector,mu:number){


    var up = new Vector(0,0,1)
    var right = new Vector(1,0,0)
    var posmag = pos.length()
    var velmag = vel.length()
    var specificenergy = (velmag * velmag) / 2 - mu / posmag
    var a = -(mu / (2*specificenergy))
    var angularMomentumH = pos.cross(vel)
    var hmag = angularMomentumH.length()
    var evec = vel.cross(angularMomentumH).scale(1/mu).sub(pos.c().scale(1/posmag))
    var e = evec.length()
    var inclination = Math.acos(up.dot(angularMomentumH) / hmag);
	if(inclination == 0){
		//flat plane should do somehting special with raan and argofperigee
	}
    var ascendingnode = up.cross(angularMomentumH)//should point to the ascendingnode
    var ran = anglediff2d(right,ascendingnode)
    var argofperigee = anglediff2d(evec,ascendingnode)
    var trueanamoly = anglediff2d(evec,pos)
    var rp = a * (1 - e)
    var ra = a * (1 + e)
    var orbperiod = TAU * Math.pow(a * a * a / mu,0.5)
    var time = trueanomaly2time(trueanamoly,e,orbperiod)
    
    return new OrbitalParameters({
        semimajor:a,
        eccentricity:e,
        inclination:inclination,
        raan:ran,
        argofperigee:argofperigee,
        trueanomaly:trueanamoly,

        orbitalperiod:orbperiod,
        time:time,
        apoaps:ra,
        periaps:rp,
        ascendingnode,
        evec,
    })
}

// https://www.google.com/search?q=calculate+orbital+elements+from+position+and+velocity&oq=calculate+orbital+elements+from+position+and+velocity&gs_lcrp=EgZjaHJvbWUyBggAEEUYOTIGCAEQRRhAMgoIAhAAGIYDGIoFMgoIAxAAGIYDGIoFMgoIBBAAGIYDGIoF0gEJMjU1OTdqMGo3qAIAsAIA&sourceid=chrome&ie=UTF-8
function orbitParams2PosVel2(orbparams:OrbitalParameters){
    
    var a = orbitParams2PosVel(orbparams.semimajor,orbparams.eccentricity,orbparams.inclination,orbparams.raan,orbparams.argofperigee,orbparams.trueanomaly)
    var b = orbitParams2PosVel(orbparams.semimajor,orbparams.eccentricity,orbparams.inclination,orbparams.raan,orbparams.argofperigee,orbparams.trueanomaly + 0.01)
    var vel = a.pos.to(b.pos).normalize().scale(a.vel)
    
    var trueanomaly = time2trueanomaly(orbparams.time,orbparams.semimajor,orbparams.eccentricity)
    return {
        pos:a.pos,
        vel:vel,
        trueanomaly:trueanomaly,
    }
}

function orbitParams2PosVel(a, e, i, raan, argofperigee, trueanomaly){
    // https://www.youtube.com/watch?v=BHSEQggIxmo&list=PLB3Ia8aQsDKgAa9pyjeSDic49oi591zqC&index=21
    // https://www.youtube.com/watch?v=ZiLxfVevkI8&t=225s
    // https://www.youtube.com/watch?v=vpTTYy8wEHQ

	//steps
	//1 find raan angle using raan
	//2 find plane using inclination
	//3 find periaps angle using little omega
	//4 find periaps and apoaps location using a and e
	//5 find satellite location using trueanomaly
	var up = new Vector(0,0,1)

	var ran = new Vector(1,0,0)
	ran.rotate3d(up,raan)
	var normal = up.c().rotate3d(ran,i)
	var periaps = ran.c().rotate3d(normal,argofperigee)
	var apoaps = periaps.c().scale(-1)
	var rp = a * (1 - e)
    var ra = a * (1 + e)
    var minoraxis = a * Math.sqrt(1 - e * e)
	periaps.scale(rp)
	apoaps.scale(ra)
	const r = a * (1 - e * e) / (1 + e * Math.cos(trueanomaly));
	var satpos = periaps.c().rotate3d(normal,trueanomaly).normalize().scale(r)

	var velocity = Math.sqrt(2 * mu / satpos.length() - mu / a)
    
	// https://www.youtube.com/watch?v=6vCl9LHF_8k&t=765s
	// https://space.stackexchange.com/questions/52090/how-can-i-calculate-the-future-position-of-a-satellite-orbiting-a-central-body-a
    // https://duncaneddy.github.io/rastro/user_guide/orbits/anomalies/
    
    // //true -> eccentric -> mean -> tijd
    //tijd -> mean -> eccentric -> true
    // var orbperiod = TAU * Math.sqrt(a * a * a / mu)
    // var meananomaly = time / orbperiod * TAU
    // var eccentricanomaly = 0
    // var trueanomaly = meananomaly + (2*e - 0.25*(e*e*e)) * Math.sin(meananomaly) + 1.25*(e*e)*Math.sin(2*meananomaly) + (13/12)*(e*e*e)*Math.sin(3*meananomaly) + (26/25) * (e*e*e*e)* Math.sin(4*meananomaly)

	

    
    return {
        pos:satpos,
        vel:velocity,
    }
}

function time2trueanomaly(time,a,e){
    var orbperiod = TAU * Math.sqrt(a * a * a / mu)
    var meananomaly = time / orbperiod * TAU
    var trueanomaly = meananomaly + (2*e - 0.25*(e*e*e)) * Math.sin(meananomaly) + 1.25*(e*e)*Math.sin(2*meananomaly) + (13/12)*(e*e*e)*Math.sin(3*meananomaly) + (26/25) * (e*e*e*e)* Math.sin(4*meananomaly)
    return trueanomaly
}

function trueanomaly2time(trueanamoly,e,orbperiod){
    // https://www.sciencedirect.com/topics/physics-and-astronomy/eccentric-anomaly#:~:text=Eccentric%20anomaly%20E%20is%20related,%CE%B8%201%20%2B%20e%20cos%20%CE%B8%20.
    var eccentricanomaly = Math.acos((e + Math.cos(trueanamoly)) / (1 + e * Math.cos(trueanamoly)))
    if(trueanamoly > Math.PI){
        eccentricanomaly = TAU - eccentricanomaly
    }
	var E = eccentricanomaly
	// https://space.stackexchange.com/questions/22144/difference-between-true-anomaly-and-mean-anomaly
	var meananomaly = E - e * Math.sin(E)
	var time = orbperiod * (meananomaly / TAU)
    return time
}

function anglediff2d(a:Vector,b:Vector){
    var aangle = Math.atan2(a.y,a.x)
	var bangle = Math.atan2(b.y,b.x)
	var angle = bangle - aangle
	if(angle < 0){
		angle += TAU
	}
	return angle
}

function sampleOrbit(orbitalparams:OrbitalParameters,mu){
    var positions = []

    var steps = 100
    for(var i = 0; i < steps; i++){
        //todo determine orbitalperiod and sample at even spacing
        orbitalparams.trueanomaly = (i / steps) * TAU
        var res = orbitParams2PosVel2(orbitalparams)
        positions.push(res.pos)
    }

    return positions
}