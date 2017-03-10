var BitGeometry = new THREE.BoxGeometry(1, 1, 1);
class Bit {
    constructor(pos, val, max) {
        var brightness = val / max;
        this.mesh = new THREE.Mesh(BitGeometry, new THREE.MeshPhongMaterial({ color: new THREE.Color().setHSL(brightness, 1, 0.5).getHex() }));
        this.mesh.position.add(pos);
        scene.add(this.mesh);
    }
    set(value) {
        this.value = value;
    }
}
//# sourceMappingURL=Bit.js.map