const VastObject = require('./VastObject');

class Circle extends VastObject {

    __showSpiral = false;

    constructor (radius, x = 0, y = 0) {
        super();
        this.radius = radius;
        this.color = '#000'
        this.position = { x, y };
    }

    // private methods

    __draw () {

        const ctx = this.ctx;

        // circle styles
        ctx.fillStyle = this.color;

        // x, y calculations
        const x = this.vast.__calcX(this.position.x);
        const y = this.vast.__calcY(this.position.y);
        const radius = this.radius * this.vast.camera.zoom;

        // drawing a circle in ctx
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI * 2);
        ctx.closePath();
        ctx.fill();

    }

    __calculateSpiral(){

        this.spiral = {
            minX: this.vast.__calcX(this.position.x) - this.radius * this.vast.camera.zoom,
            minY: this.vast.__calcY(this.position.y) - this.radius * this.vast.camera.zoom,
            maxX: this.vast.__calcX(this.position.x) + this.radius * this.vast.camera.zoom,
            maxY: this.vast.__calcY(this.position.y) + this.radius * this.vast.camera.zoom
        };

    }

    // public methods

    export () {
        let exported = '';
        exported += `type=Circle\n`;
        exported += `color=${this.color}\n`;
        exported += `radius=${this.radius}\n`;
        exported += `position=${this.position.x}|${this.position.y}`;
        return exported;
    }

}

module.exports = Circle;