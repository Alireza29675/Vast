class VastObject {
    __setVast (vast) {
        this.vast = vast;
        this.ctx = vast.ctx;
    }
    __changes () {};
    __draw () {};
}

module.exports = VastObject;