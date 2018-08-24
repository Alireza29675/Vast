const VastObject = require('./VastObject');

class Rectangle extends VastObject {

    constructor (width, height, x = 0, y = 0) {
        super();
        this.width = width;
        this.height = height;
        this.color = '#000'
        this.position = { x, y };
    }

    // private methods

    __draw () {
        const ctx = this.ctx;

        // rectangle styles
        ctx.fillStyle = this.color;

        // x, y calculations
        const x = this.vast.__calcX(this.position.x);
        const y = this.vast.__calcY(this.position.y);
        const width = this.width * this.vast.camera.zoom;
        const height = this.height * this.vast.camera.zoom;

        // drawing a rectangle in ctx
        ctx.fillRect(x, y, width, height);
    }

    // public methods

    export () {
        let exported = '';
        exported += `type=Rectangle\n`;
        exported += `color=${this.color}\n`;
        exported += `height=${this.height}\n`;
        exported += `width=${this.width}\n`;
        exported += `position=${this.position.x}|${this.position.y}`;
        return exported;
    }

}

module.exports = Rectangle;