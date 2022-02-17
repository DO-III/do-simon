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
        } else if (this.game.click /*&& this.game.mouse*/) {
            this.checkClicked(this.game.click.x, this.game.click.y);
        }
    }

    flash() {
        this.activated = true;
        this.activeColor = "White";
        this.timeForFlash = 0.1;
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

    constructor(game) {
        this.game = game;
        

        this.gameIsOver = false;
        this.score = 0;
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
    }

    static checkIfGood() {
        let size = GremlinManager.PlayerSequence.length - 1;
        console.log(size);
        console.log(
            GremlinManager.PlayerSequence[size].color 
            === GremlinManager.ObjectiveSequence[size].color
        );
        //if Player
        
    }


    draw(ctx) {
        //TODO: #1 Make separate canvases for score, lives, etc.
        ctx.fillText(this.score, 20, 20);

    }

    update() {

    }


}