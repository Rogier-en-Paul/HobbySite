function Triangle(A, B, C){
    this.A = A;
    this.B = B;
    this.C = C;
    this.color = new Color();
    this.centroid = A.add(B).add(C).scale(1/3);
    this.normal = Vector.normal(A, B, C);
    this.area = Vector.getTriangleArea(this);
}

Triangle.prototype.rotate = function(x,y,z){
    this.A.rotate(x,y,z,this.centroid);
    this.B.rotate(x,y,z,this.centroid);
    this.C.rotate(x,y,z,this.centroid);
    this.normal.rotate(x,y,z,this.centroid);
};

Triangle.prototype.translate = function(vector){
    this.A.add(vector);
    this.B.add(vector);
    this.C.add(vector);
    this.centroid.add(vector);
};

Triangle.prototype.scale = function(scalar){

};