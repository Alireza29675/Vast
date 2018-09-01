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
    __isInside(x, y){
        if(x > this.spiral.minX && x < this.spiral.maxX && y < this.spiral.maxY && y > this.spiral.minY){
            return true;
        }
        return false;
    }
}

module.exports = VastObject;