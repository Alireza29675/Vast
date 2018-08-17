class Circle {

    constructor (radius, x, y) {
        this.radius = radius;
        this.x = x;
        this.y = y;
    }

    render (ctx, vastCenterX, vastCenterY) {
        ctx.fillStyle = '#000';

        const x = this.x + vastCenterX;
        const y = this.y + vastCenterY;

        ctx.beginPath();
        ctx.arc(x, y, this.radius, 0, Math.PI * 2);
        ctx.closePath();
        ctx.fill();
    }

}

module.exports = Circle;