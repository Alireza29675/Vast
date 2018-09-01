class VastObject {

    showSpiral = false;
    
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
    __drawSpiral(){
        this.ctx.strokeRect(this.spiral.minX-2, this.spiral.minY-2, this.spiral.maxX - this.spiral.minX + 4, this.spiral.maxY - this.spiral.minY+4);
    }
}

module.exports = VastObject;