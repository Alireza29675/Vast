const VastObject = require('./VastObject');

class Circle extends VastObject {

    constructor (radius, x, y) {
        super();
        this.radius = radius;
        this.color = '#000'
        this.x = x;
        this.y = y;
    }

    draw () {
        const ctx = this.ctx;

        // circle styles
        ctx.fillStyle = this.color;

        // x, y calculations
        const x = this.vast.__calcX(this.x);
        const y = this.vast.__calcY(this.y);

        // drawing a circle in ctx
        ctx.beginPath();
        ctx.arc(x, y, this.radius, 0, Math.PI * 2);
        ctx.closePath();
        ctx.fill();
    }

}

module.exports = Circle;