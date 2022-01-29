const BUTTON_DIMENSION = 150;



class GButton {

    constructor(x, y, color) {
        this.x = x;
        this.y = y;
        this.color = color;
        
    }

    draw(ctx) {
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, BUTTON_DIMENSION, BUTTON_DIMENSION);
    }

    update() {

    }

}