class VastObject {

    spiral ={
        minX:0,
        minY:0,
        maxX:0,
        maxY:0
    };

    __setVast (vast) {
        this.vast = vast;
        this.ctx = vast.ctx;
    }
    __changes () {};
    __draw () {};
    __calculateSpiral(){};
}

module.exports = VastObject;