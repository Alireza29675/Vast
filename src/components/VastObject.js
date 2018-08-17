class VastObject {
    setVast (vast) {
        this.vast = vast;
        this.ctx = vast.ctx;
    }
    changes () {};
    draw () {};
}

module.exports = VastObject;