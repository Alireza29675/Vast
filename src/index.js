const Circle = require('./components/Circle');

class Vast {

    camera = { x: 0, y: 0 }
    mouse = { x: 0, y: 0, down: false }
    objects = [];

    grids = true;

    static Circle = Circle;

    constructor () {
        this.__createView();
        this.__draggableScreen();
        this.__render();
    }

    // Private Methods

    __draggableScreen () {
        this.view.addEventListener('mousedown', () => {
            this.mouse.down = true;
            this.mouse.onDragInfo = {
                x: this.mouse.x,
                y: this.mouse.y,
                cameraX: this.camera.x,
                cameraY: this.camera.y
            }
        });
        this.view.addEventListener('mousemove', (e) => {
            this.mouse.x = e.clientX;
            this.mouse.y = e.clientY;
            if (this.mouse.down) {
                this.camera.x = this.mouse.onDragInfo.cameraX + (this.mouse.onDragInfo.x - this.mouse.x);
                this.camera.y = this.mouse.onDragInfo.cameraY + (this.mouse.onDragInfo.y - this.mouse.y);
            }
        })
        this.view.addEventListener('mouseup', () => {
            this.mouse.down = false;
        });
    }

    __drawGrids () {
        this.ctx.strokeStyle = '#EEE';
        const size = 50;
        const gridBiasX = this.width/2 % size;
        const gridBiasY = this.height/2 % size;
        for (let i = -this.camera.x % size + gridBiasX; i < this.width; i += size) {
            this.ctx.beginPath();
            this.ctx.moveTo(i, 0);
            this.ctx.lineTo(i, this.height);
            this.ctx.closePath();
            this.ctx.stroke();
        }
        for (let i = -this.camera.y % size + gridBiasY; i < this.height; i += size) {
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
        for (let object of this.objects) object.changes();
        for (let object of this.objects) object.draw();
    }

    __calcX (x) {
        return -this.camera.x + this.width/2 + x;
    }

    __calcY (y) {
        return -this.camera.y + this.height/2 + y;
    }

    // Public Methods

    add (object) {
        object.setVast(this);
        this.objects.push(object)
    }

}

export default Vast;