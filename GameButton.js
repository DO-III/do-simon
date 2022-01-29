const BUTTON_DIMENSION = 150;



class GButton {

    constructor(game, x, y, color) {
        this.game = game;
        this.x = x;
        this.y = y;
        this.color = color;
        
    }

    draw(ctx) {
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, BUTTON_DIMENSION, BUTTON_DIMENSION);

        if (this.game.click && this.game.mouse) {
            this.checkClicked(this.game.click.x, this.game.click.y);
        }
    }

    update() {

    }

    /*
    Make this button flash its assigned color.
    */ 
    checkClicked(X, Y) {
        console.log(X);
        console.log(Y);

        if(X < this.x + 150 && this.x < X) {
            if (Y < this.y + 150 && this.y < Y) {
                this.color = "White";
            }
        }

        this.game.click = null;
    }

}