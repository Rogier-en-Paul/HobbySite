var HeadGeometry = new THREE.BoxGeometry(1, 1, 1);
var HeadMaterial = new THREE.MeshPhongMaterial({ color: 0x888888 });
var headSinkDepth = new THREE.Vector3(0, 0, -1);
class Head {
    constructor(pos) {
        this.originalPosition = pos.clone();
        this.mesh = new THREE.Mesh(HeadGeometry, HeadMaterial);
        this.mesh.position.add(pos);
        scene.add(this.mesh);
    }
    read(bit) {
        this.value = bit.value;
        this.mesh.material = bit.mesh.material;
    }
    write(bit) {
        bit.value = this.value;
        bit.mesh.material = this.mesh.material;
    }
    swap(bit) {
        var temp = bit.value;
        bit.value = this.value;
        this.value = temp;
        var tempMaterial = this.mesh.material;
        this.mesh.material = bit.mesh.material;
        bit.mesh.material = tempMaterial;
    }
}
//# sourceMappingURL=Head.js.map