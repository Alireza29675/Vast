class Vast {

    constructor () {
        this.__createView();
    }

    __createView () {
        this.view = document.createElement('canvas');
        this.__setSize();
        window.addEventListener('resize', this.__setSize.bind(this));
    }

    __setSize () {
        this.view.width = this.width = window.innerWidth;
        this.view.height = this.height = window.innerWidth;
    }

}

export default Vast;