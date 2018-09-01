const VastObject = require('./VastObject');

class Path extends VastObject {

    constructor (points, tickness = 2) {
        super();
        this.points = points || [];
        this.tickness = tickness;
        this.smooth = false;
        this.color = '#000';
    }

    // private methods

    __smoothDraw () {
        const ctx = this.ctx;
        const points = this.points;

        // path styles
        ctx.strokeStyle = this.color;
        ctx.lineWidth = this.tickness;

        ctx.beginPath()

        if(points == undefined || points.length == 0)
        {
            return true;
        }
        if(points.length == 1)
        {
            ctx.moveTo(this.vast.__calcX(points[0].x), this.vast.__calcY(points[0].y));
            ctx.lineTo(this.vast.__calcX(points[0].x), this.vast.__calcY(points[0].y));
            return true;
        }
        if(points.length == 2)
        {
            ctx.moveTo(this.vast.__calcX(points[0].x), this.vast.__calcY(points[0].y));
            ctx.lineTo(this.vast.__calcX(points[1].x), this.vast.__calcY(points[1].y));
            return true;
        }
        ctx.moveTo(this.vast.__calcX(points[0].x), this.vast.__calcY(points[0].y));
        for (var i = 1; i < points.length - 2; i ++)
        {
            let xc = (this.vast.__calcX(points[i].x) + this.vast.__calcX(points[i + 1].x)) / 2;
            let yc = (this.vast.__calcY(points[i].y) + this.vast.__calcY(points[i + 1].y)) / 2;
            ctx.quadraticCurveTo(this.vast.__calcX(points[i].x), this.vast.__calcY(points[i].y), xc, yc);
        }
        ctx.quadraticCurveTo(this.vast.__calcX(points[i].x), this.vast.__calcY(points[i].y), this.vast.__calcX(points[i+1].x), this.vast.__calcY(points[i+1].y));
        ctx.stroke();
    }

    __hardDraw () {
        const ctx = this.ctx;
        const points = this.points;

        // path styles
        this.ctx.strokeStyle = this.color;
        this.ctx.lineWidth = this.tickness;

        // drawing a path in ctx

        ctx.beginPath();

        ctx.moveTo(this.vast.__calcX(points[0].x), this.vast.__calcY(points[0].y));

        for (let i = 1; i < points.length; i ++)
        {
            ctx.lineTo(this.vast.__calcX(points[i].x), this.vast.__calcY(points[i].y))
        }
        ctx.stroke();
    }

    __draw () {

        // choosing between hard or smooth draw
        return this.smooth ? this.__smoothDraw() : this.__hardDraw();
        
    }

    __calculateSpiral(){

        let xCoordinates = [];
        let yCoordinates = [];

        for(let point of this.points){
            xCoordinates.push(this.vast.__calcX(point.x));
            yCoordinates.push(this.vast.__calcY(point.y));
        }

        this.spiral = {
            minX: Math.min.apply(Math, xCoordinates),
            maxX: Math.max.apply(Math, xCoordinates),
            minY: Math.min.apply(Math, yCoordinates),
            maxY: Math.max.apply(Math, yCoordinates)
        }

    }

    // public methods

    export () {
        let exported = '';
        exported += `type=Path\n`;
        exported += `color=${this.color}\n`;
        exported += `tickness=${this.tickness}\n`;
        exported += `smooth=${this.smooth}\n`;
        exported += `points=${this.points.map(point => `${point.x},${point.y}`).join('|')}`;
        return exported;
    }

    addPoint (point) {
        this.points.push(point)
    }

}

module.exports = Path;