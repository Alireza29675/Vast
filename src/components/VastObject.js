class VastObject {

    spiral = [];

    __setVast (vast) {
        this.vast = vast;
        this.ctx = vast.ctx;
    }
    __changes () {};
    __draw () {};
    __calculateSpiral(){};
}

module.exports = VastObject;