const BUTTON_DIMENSION = 150;


/*
Creates a single button in Gremlin Says.

Buttons flash when clicked or prompted.
 */
class GButton {

    constructor(game, x, y, color) {
        this.game = game;
        this.x = x;
        this.y = y;
        this.color = color;
        this.activeColor = color;

        this.activated = false;
        this.timeForFlash = 0;
    }

    draw(ctx) {
        ctx.fillStyle = this.activeColor;
        ctx.fillRect(this.x, this.y, BUTTON_DIMENSION, BUTTON_DIMENSION);

        
    }

    update() {
        if (this.activated) {
            this.timeForFlash -= this.game.clockTick;
            if (this.timeForFlash < 0) {
                this.activeColor = this.color;
                this.activated = false;
            }
        } else if (this.game.click && GremlinManager.lightingButtons === false) {
            this.checkClicked(this.game.click.x, this.game.click.y);
        }
    }

    flash() {
        this.activated = true;
        this.activeColor = "White";
        this.timeForFlash = 0.1;
    }

    longFlash() {
        this.activated = true;
        this.activeColor = "White";
        this.timeForFlash = 0.35;
    }

    /*
    Make this button flash its assigned color.
    */ 
    checkClicked(X, Y) {
        if(X < this.x + BUTTON_DIMENSION && this.x < X) {
            if (Y < this.y + 150 && this.y < Y) {
                if (this.activated == false) {
                    this.flash();
                    GremlinManager.PlayerSequence.push(this);
                    GremlinManager.checkIfGood();
                }
            }
        }        
    }
}

/*
Manages the Gremlin Says game.

Tracks buttons pressed, and makes them display patterns.
*/
class GremlinManager {

    static GameButtons = [];
    static ObjectiveSequence = [];
    static PlayerSequence = [];
    static lightingButtons = false;
    static playerScore = 0;

    constructor(game) {
        this.game = game;
        

        this.gameIsOver = false;
        this.checkIndex = 0;

    }

    initialize(listOfButtons) {
        listOfButtons.forEach(element => {
            GremlinManager.GameButtons.push(element);
        });

        GremlinManager.GameButtons.forEach(button => {
            this.game.addEntity(button);
        });

        this.startGame();
    }

    startGame() {
        //Test value, make generation later.
        GremlinManager.ObjectiveSequence.push(GremlinManager.GameButtons[0]);
        GremlinManager.ObjectiveSequence.push(GremlinManager.GameButtons[1]);
        GremlinManager.ObjectiveSequence.push(GremlinManager.GameButtons[2]);
        this.lightButtons();
    }

    lightButtons() {
        GremlinManager.lightingButtons = true;
        var cur = 0;
        var size = GremlinManager.ObjectiveSequence.length;
        setTimeout(() => {this.freeButtons()}, 500 * size);

        GremlinManager.ObjectiveSequence.forEach(button => {
            setTimeout(() => {button.longFlash()}, 500 * cur);
            cur++;
        });
    }

    freeButtons() {
        GremlinManager.lightingButtons = false;
    }

    static checkIfGood() {
        let size = GremlinManager.PlayerSequence.length - 1;
        let good = GremlinManager.PlayerSequence[size].color === GremlinManager.ObjectiveSequence[size].color;
        console.log(good);
        if(good) {
            GremlinManager.playerScore++;
        } else {
            //TODO: Lose lives/game logic.
        }
        //if Player
        
    }


    draw(ctx) {
        //TODO: #1 Make separate canvases for score, lives, etc.
        ctx.fillText(GremlinManager.playerScore, 20, 20);

    }

    update() {

    }


}