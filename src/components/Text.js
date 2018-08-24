const VastObject = require('./VastObject');

class Text extends VastObject {

    constructor (text, x = 0, y = 0) {
        super();
        this.text = text;
        this.size = 30;
        this.color = '#000';
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
        const size = this.size * this.vast.camera.zoom;

        // drawing a rectangle in ctx
        ctx.font = `${size}px Skia`;
        ctx.fillText(this.text, x, y);
    }

    // public methods

    export () {
        let exported = '';
        exported += `type=Text\n`;
        //...
        return exported;
    }

}

module.exports = Text;