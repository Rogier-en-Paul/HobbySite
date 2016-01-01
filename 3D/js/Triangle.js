function Triangle(A, B, C){
    this.A = A;
    this.B = B;
    this.C = C;
    this.color = new Color();
    this.average = A.add(B).add(C).scale(1/3);
    this.normal = Vector().normal(A, B, C);
    this.area = Vector.area(A,B,C);
}