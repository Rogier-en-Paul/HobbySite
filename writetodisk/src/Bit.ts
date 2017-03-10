var BitGeometry = new THREE.BoxGeometry(1,1,1);

class Bit{
    mesh:THREE.Mesh
    value:number

    constructor(pos:THREE.Vector3, val:number, max:number){
        var brightness = val / max
        
        this.mesh = new THREE.Mesh( BitGeometry, new THREE.MeshPhongMaterial( { color: new THREE.Color().setHSL(brightness, 1, 0.5).getHex() } ) );
        this.mesh.position.add(pos);
        scene.add(this.mesh)
    }

    set(value:number){
        this.value = value
    }
}