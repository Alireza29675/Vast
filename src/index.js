const Circle = require('./components/Circle');

class Vast {

    camera = { x: 0, y: 0 }
    objects = [];

    static Circle = Circle;

    constructor () {
        this.__createView();
        this.__render();
    }

    // Private Methods

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

        // rendering all vast objects
        const vastCenterX = -this.camera.x + this.width/2;
        const vastCenterY = -this.camera.y + this.height/2;
        for (let object of this.objects) object.render(this.ctx, vastCenterX, vastCenterY);
    }

    // Public Methods

    add (object) {
        this.objects.push(object)
    }

}

export default Vast;