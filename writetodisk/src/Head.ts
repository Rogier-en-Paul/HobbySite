var HeadGeometry = new THREE.BoxGeometry(1,1,1);
var HeadMaterial = new THREE.MeshPhongMaterial( { color: 0x888888 } );
var headSinkDepth = new THREE.Vector3(0,0,-1)
class Head{
    mesh:THREE.Mesh
    originalPosition:THREE.Vector3;

    // for storing color from reading Bits
    value:number

    constructor(pos:THREE.Vector3){
        this.originalPosition = pos.clone();
        this.mesh = new THREE.Mesh( HeadGeometry, HeadMaterial );
        this.mesh.position.add(pos);
        scene.add(this.mesh)
    }

    read(bit:Bit){
        this.value = bit.value
        this.mesh.material = bit.mesh.material
    }

    write(bit:Bit){
        bit.value = this.value
        bit.mesh.material = this.mesh.material
    }

    swap(bit:Bit){
        var temp = bit.value
        bit.value = this.value
        this.value = temp


        var tempMaterial = this.mesh.material
        this.mesh.material = bit.mesh.material
        bit.mesh.material = tempMaterial
    }
}