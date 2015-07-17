function Node(h,g,parent,point){
    this.point = point;
    this.h = h;
    this.g = g;
    this.f = g+h;
    this.parent = parent;
}