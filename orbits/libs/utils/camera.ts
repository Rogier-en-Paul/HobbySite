class Camera{

    pos:Vector = new Vector(0,0)
    scale:Vector = new Vector(1,1)

    constructor(public ctxt:CanvasRenderingContext2D){
        
    }

    begin(){
        ctxt.save()
        var m = this.createMatrixScreen2World().inverse()
        ctxt.transform(1, 0, 0, -1, 0, canvas.height)
        ctxt.transform(m.a,m.b,m.c,m.d,m.e,m.f)
    }

    end(){
        ctxt.restore()
    }

    createMatrixScreen2World(){
        var a = new DOMMatrix([
            1,0,0,1,-screensize.x / 2,-screensize.y / 2
        ])
        
        var b = new DOMMatrix([
            this.scale.x,0,0,this.scale.y,this.pos.x,this.pos.y
        ])
        

        return b.multiply(a)
    }

    screen2world(pos:Vector):Vector{
        var dompoint = this.createMatrixScreen2World().transformPoint(new DOMPoint(pos.x,pos.y))
        return new Vector(dompoint.x,dompoint.y)
    }

    world2screen(pos:Vector):Vector{
        var dompoint = this.createMatrixScreen2World().inverse().transformPoint(new DOMPoint(pos.x,pos.y))
        return new Vector(dompoint.x,dompoint.y)
    }

}


// https://github.com/robashton/camera/blob/master/camera.js
class Camera2 {
    distance: any
    lookAt: any
    context: any
    fieldOfView: any
    viewport: { left: number; right: number; top: number; bottom: number; width: number; height: number; scale: any[] }
    aspectRatio: number
    

    constructor(context, settings:any = {}) {
        this.distance = settings.distance || 1000.0;
        this.lookAt = settings.initialPosition || [0, 0];
        this.context = context;
        this.fieldOfView = settings.fieldOfView || Math.PI / 4.0;
        this.viewport = {
            left: 0,
            right: 0,
            top: 0,
            bottom: 0,
            width: 0,
            height: 0,
            scale: [settings.scaleX || 1.0, settings.scaleY || 1.0]
        };
        this.init();
    }

    /**
     * Camera Initialization
     * -Add listeners.
     * -Initial calculations.
     */
    init() {
        this.addListeners();
        this.updateViewport();
    }

    /**
     * Applies to canvas context the parameters:
     *  -Scale
     *  -Translation
     */
    begin() {
        this.context.save();
        this.applyScale();
        this.applyTranslation();
    }

    /**
     * 2d Context restore() method
     */
    end() {
        this.context.restore();
    }

    /**
     * 2d Context scale(Camera.viewport.scale[0], Camera.viewport.scale[0]) method
     */
    applyScale() {
        this.context.scale(this.viewport.scale[0], this.viewport.scale[1]);
    }

    /**
     * 2d Context translate(-Camera.viewport.left, -Camera.viewport.top) method
     */
    applyTranslation() {
        this.context.translate(-this.viewport.left, -this.viewport.top);
    }

    /**
     * Camera.viewport data update
     */
    updateViewport() {
        this.aspectRatio = this.context.canvas.width / this.context.canvas.height;
        this.viewport.width = this.distance * Math.tan(this.fieldOfView);
        this.viewport.height = this.viewport.width / this.aspectRatio;
        this.viewport.left = this.lookAt[0] - (this.viewport.width / 2.0);
        this.viewport.top = this.lookAt[1] - (this.viewport.height / 2.0);
        this.viewport.right = this.viewport.left + this.viewport.width;
        this.viewport.bottom = this.viewport.top + this.viewport.height;
        this.viewport.scale[0] = this.context.canvas.width / this.viewport.width;
        this.viewport.scale[1] = this.context.canvas.height / this.viewport.height;
    }

    /**
     * Zooms to certain z distance
     * @param {*z distance} z 
     */
    zoomTo(z) {
        this.distance = z;
        this.updateViewport();
    }

    /**
     * Moves the centre of the viewport to new x, y coords (updates Camera.lookAt)
     * @param {x axis coord} x 
     * @param {y axis coord} y 
     */
    moveTo(pos:Vector) {
        this.lookAt[0] = pos.x;
        this.lookAt[1] = pos.y;
        this.updateViewport();
    }

    /**
     * Transform a coordinate pair from screen coordinates (relative to the canvas) into world coordinates (useful for intersection between mouse and entities)
     * Optional: obj can supply an object to be populated with the x/y (for object-reuse in garbage collection efficient code)
     * @param {x axis coord} x 
     * @param {y axis coord} y 
     * @param {obj can supply an object to be populated with the x/y} obj 
     * @returns 
     */
    screenToWorld(x, y, obj) {
        obj = obj || {};
        obj.x = (x / this.viewport.scale[0]) + this.viewport.left;
        obj.y = (y / this.viewport.scale[1]) + this.viewport.top;
        return obj;
    }

    /**
     * Transform a coordinate pair from world coordinates into screen coordinates (relative to the canvas) - useful for placing DOM elements over the scene.
     * Optional: obj can supply an object to be populated with the x/y (for object-reuse in garbage collection efficient code).
     * @param {x axis coord} x 
     * @param {y axis coord} y  
     * @param {obj can supply an object to be populated with the x/y} obj 
     * @returns 
     */
    worldToScreen(pos:Vector) {
        var obj = new Vector(0,0)
        obj.x = (pos.x - this.viewport.left) * (this.viewport.scale[0]);
        obj.y = (pos.y - this.viewport.top) * (this.viewport.scale[1]);
        return obj;
    }

    /**
     * Event Listeners for:
     *  -Zoom and scroll around world
     *  -Center camera on "R" key
     */
    addListeners() {
        window.onwheel = e => {
            if (true) {
                // Your zoom/scale factor
                let zoomLevel = this.distance - (e.deltaY * 20);
                if (zoomLevel <= 1) {
                    zoomLevel = 1;
                }

                this.zoomTo(zoomLevel);
            } else {
                // Your track-pad X and Y positions
                const x = this.lookAt[0] + (e.deltaX * 2);
                const y = this.lookAt[1] + (e.deltaY * 2);

                // this.moveTo(x, y);
            }
        };

        window.addEventListener('keydown', e => {
            if (e.key === 'r') {
                this.zoomTo(1000);
                // this.moveTo(0, 0);
            }
        });
    }
};