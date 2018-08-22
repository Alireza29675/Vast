const VastObject = require('./VastObject');

class Path extends VastObject {

    constructor (points, tickness = 2) {
        super();
        this.points = points || [];
        this.tickness = tickness;
        this.color = '#000';
    }

    addPoint (point) {
        // if (!point.x) throw Error ('Point must have { x: Number } property');
        // if (!point.y) throw Error ('Point must have { x: Number } property');
        this.points.push(point)
    }

    __draw () {
        const ctx = this.ctx;
        const points = this.points;

        // path styles
        ctx.strokeStyle = this.color;
        ctx.lineWidth = this.tickness;

        // drawing a path in ctx

        ctx.beginPath();


        ctx.moveTo(this.vast.__calcX(points[0].x), this.vast.__calcY(points[0].y));

        for (let i = 1; i < points.length; i ++)
        {
            ctx.lineTo(this.vast.__calcX(points[i].x), this.vast.__calcY(points[i].y))
        }

        ctx.stroke();
    }

}

module.exports = Path;