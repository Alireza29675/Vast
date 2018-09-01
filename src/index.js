const Circle = require('./components/Circle');
const Rectangle = require('./components/Rectangle');
const Path = require('./components/Path');
const Text = require('./components/Text');

class Vast {

    camera = { x: 0, y: 0, zoom: 1 }
    mouse = { x: 0, y: 0, down: false, onDragInfo: {} }
    objects = [];

    grids = true;

    static Circle = Circle;
    static Rectangle = Rectangle;
    static Path = Path;
    static Text = Text;

    constructor () {
        this.__createView();
        this.__trackMouse();
        this.__draggableScreen();
        this.__zoomableScreen();
        this.__render();
    }

    // Private Methods

    __trackMouse () {
        this.view.addEventListener('mousemove', (e) => {
            this.mouse.x = e.clientX;
            this.mouse.y = e.clientY;
        })
    }

    __draggableScreen () {
        this.view.addEventListener('mousedown', () => {
            this.mouse.down = true;
            this.mouse.onDragInfo.x = this.mouse.x;
            this.mouse.onDragInfo.y = this.mouse.y;
            this.mouse.onDragInfo.cameraX = this.camera.x;
            this.mouse.onDragInfo.cameraY = this.camera.y;
        });
        this.view.addEventListener('mousemove', (e) => {
            if (this.mouse.down && !e.altKey) {
                this.mouse.onDragInfo.x = this.mouse.x;
                this.mouse.onDragInfo.y = this.mouse.y;
                this.mouse.onDragInfo.cameraX = this.camera.x;
                this.mouse.onDragInfo.cameraY = this.camera.y;
            }
            if (this.mouse.down && e.altKey) {
                this.camera.x = this.mouse.onDragInfo.cameraX + (this.mouse.onDragInfo.x - this.mouse.x) / this.camera.zoom;
                this.camera.y = this.mouse.onDragInfo.cameraY + (this.mouse.onDragInfo.y - this.mouse.y) / this.camera.zoom;
            }
        })
        this.view.addEventListener('mouseup', () => {
            this.mouse.down = false;
        });
    }

    __zoomableScreen () {
        window.addEventListener('mousewheel', e => {
            this.camera.zoom += e.deltaY / 500;
            this.camera.zoom = Math.max(this.camera.zoom, 0.2);
            this.camera.zoom = Math.min(this.camera.zoom, 5);
        })
    }

    __drawGrids () {
        this.ctx.strokeStyle = '#EEE';
        const size = 50 * this.camera.zoom;
        const gridBiasX = this.width/2 % size;
        const gridBiasY = this.height/2 % size;
        for (let i = -this.camera.x * this.camera.zoom % size + gridBiasX; i < this.width; i += size) {
            this.ctx.beginPath();
            this.ctx.moveTo(i, 0);
            this.ctx.lineTo(i, this.height);
            this.ctx.closePath();
            this.ctx.stroke();
        }
        for (let i = -this.camera.y * this.camera.zoom % size + gridBiasY; i < this.height; i += size) {
            this.ctx.beginPath();
            this.ctx.moveTo(0, i);
            this.ctx.lineTo(this.width, i);
            this.ctx.closePath();
            this.ctx.stroke();
        }
    }

    __createView () {
        this.view = document.createElement('canvas');
        this.ctx = this.view.getContext('2d');
        this.__setSize();
        window.addEventListener('resize', this.__setSize.bind(this));
    }

    __setSize () {
        this.view.width = this.width = window.innerWidth;
        this.view.height = this.height = window.innerHeight;
    }

    __render () {
        // re-calling render function in the next frame
        requestAnimationFrame(() => this.__render());

        // re-clearing all the canvas
        this.ctx.clearRect(0, 0, this.width, this.height);

        // Drawing helper grids if it was supposed to be drawn
        if (this.grids) this.__drawGrids();

        // rendering all vast objects
        for (let object of this.objects) object.__changes();
        for (let object of this.objects) {
            object.__draw();
            object.__calculateSpiral();
            if(object.showSpiral){
                object.__drawSpiral();
            }
        }
    }

    __calcX (x) {
        return ((x - this.camera.x) * this.camera.zoom) + this.width/2;
    }

    __calcY (y) {
        return ((y - this.camera.y) * this.camera.zoom) + this.height/2;
    }

    __deCalcX (x) {
        return (x - this.width/2) / this.camera.zoom + this.camera.x;
    }

    __deCalcY (y) {
        return (y - this.height/2) / this.camera.zoom + this.camera.y;
    }

    // Public Methods

    add (object) {
        object.__setVast(this);
        this.objects.push(object)
    }

    getSelectedObjects(x, y){

        let selectedObjects = [];

        for(let object of this.objects){
            if(object.__isInside(x,y)){
                selectedObjects.push(object)
            }
        }

        return selectedObjects;
    }

}

export default Vast;