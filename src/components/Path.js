const VastObject = require('./VastObject');

class Path extends VastObject {

    constructor (points, tickness = 2) {
        super();
        this.points = points;
        this.tickness = tickness;
        this.color = '#000';
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

        for (let i = 1; i < points.length - 2; i ++)
        {
            var xc = (this.vast.__calcX(points[i].x) + this.vast.__calcX(points[i + 1].x)) / 2;
            var yc = (this.vast.__calcY(points[i].y) + this.vast.__calcY(points[i + 1].y)) / 2;
            ctx.quadraticCurveTo(this.vast.__calcX(points[i].x), points[i].y, xc, yc);
        }
        
        ctx.quadraticCurveTo(this.vast.__calcX(points[points.length - 2].x), this.vast.__calcY(points[points.length - 2].y), this.vast.__calcX(points[points.length - 1].x),this.vast.__calcY(points[points.length - 1].y));

        ctx.stroke();
    }

}

module.exports = Path;