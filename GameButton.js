const BUTTON_DIMENSION = 150;
const TEXT_LASTING_PERIOD = 1;



/*
Creates a single button in Gremlin Says.

Buttons flash when clicked or prompted.
 */
class GButton {

    static curBut = 0;





    constructor(game, x, y, color) {
        this.graphic = ASSET_MANAGER.getAsset("./gfx/button.png");
        this.game = game;
        this.x = x;
        this.y = y;
        this.color = color;
        this.activeColor = color;
        this.clickSFX = new Audio('sfx/button' + GButton.curBut + '.mp3');
        GButton.curBut++;

        this.activated = false;
        this.timeForFlash = 0;
    }

    draw(ctx) {
        ctx.fillStyle = this.activeColor;
        ctx.fillRect(this.x, this.y, BUTTON_DIMENSION, BUTTON_DIMENSION);
        ctx.drawImage(this.graphic, this.x, this.y);

        
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

    gameOver() {
        this.color = "gray";
        this.activeColor = "gray";
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
        if (this.clickSFX.paused) {
            this.clickSFX.play();
        }else{
            this.clickSFX.currentTime = 0
        }
    }

    /*
    Make this button flash its assigned color.
    */ 
    checkClicked(X, Y) {
        if(X < this.x + BUTTON_DIMENSION && this.x < X) {
            if (Y < this.y + 150 && this.y < Y) {
                if (this.activated == false) {
                    this.flash();
                    if (this.clickSFX.paused) {
                        this.clickSFX.play();
                    }else{
                        this.clickSFX.currentTime = 0
                    }
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
    static strikes = 0;
    
    static playerDidSequence = false;

    static textSelected = "nothing";

    static goodText = [
        "GOOD STUFF",
        "YEET",
        "NICE WORK",
        "EPIC GAMER",
        "NOT BAD",
        "COOL",
        "WICKED",
        "POGCHAMP",
        "5HEAD",
        "BIG BRAIN",
        "EUPHORIA",
        "ASCENDED"
    ];

    static badText = [
        "NOPE",
        "TRY AGAIN",
        "NOT IT",
        "L",
        "RATIO",
        "SKILL ISSUE",
        "OOF",
        ":KAPPA:",
        "WRONG",
        "WASTED",
        "UM, NO",
        "SORRY",
        "PRESS F"
    ];

    static endText = "GAME OVER";

    constructor(game) {
        this.game = game;
        //Setup for score and response text
        this.sc = document.createElement('canvas');
        this.sc.width = 225;
        this.sc.height = 100;
        this.scoreCtx = this.sc.getContext('2d');
        this.scoreCtx.textAlign = 'center';
        this.scoreCtx.font = 'small-caps 700 30px courier';
        this.scoreCtx.strokeStyle = 'red';
        this.scoreCtx.fillStyle = 'red';

        GremlinManager.gameOverSFX = new Audio ('sfx/gameOver.mp3');
        GremlinManager.wrongSFX = new Audio ('sfx/wrong.mp3');
        
        

        this.gameIsOver = false;
        this.checkIndex = 0;
        this.timeOut = 0;
        this.strikeAsset = ASSET_MANAGER.getAsset("./gfx/strikes0.png");
        this.bgUiAsset = ASSET_MANAGER.getAsset("./gfx/ui.png");

    }

    initialize(listOfButtons) {
        listOfButtons.forEach(element => {
            GremlinManager.GameButtons.push(element);
        });

        GremlinManager.GameButtons.forEach(button => {
            this.game.addEntity(button);
        });

        GremlinManager.startGame();
    }

    static startGame() {
        //Test value, make generation later.
        GremlinManager.strikes = 3;
        GremlinManager.incrementSequence();
    }

    static incrementSequence() {
        GremlinManager.ObjectiveSequence.push(this.getRandomButton());
        console.log(GremlinManager.ObjectiveSequence[0]);
        GremlinManager.lightButtons();
        GremlinManager.getRandomButton();
    }

    testSequence() {
        GremlinManager.ObjectiveSequence.push(GremlinManager.GameButtons[0]);
        GremlinManager.ObjectiveSequence.push(GremlinManager.GameButtons[1]);
        GremlinManager.ObjectiveSequence.push(GremlinManager.GameButtons[2]);
    }



    static lightButtons() {
        GremlinManager.lightingButtons = true;
        var cur = 1;
        var size = GremlinManager.ObjectiveSequence.length;
        setTimeout(() => {GremlinManager.freeButtons()}, 500 * (size + 1));

        GremlinManager.ObjectiveSequence.forEach(button => {
            setTimeout(() => {button.longFlash()}, 500 * cur);
            cur++;
        });
    }

    static freeButtons() {
        GremlinManager.lightingButtons = false;
    }

    static checkIfGood() {
        let size = GremlinManager.PlayerSequence.length - 1;
        let good = GremlinManager.PlayerSequence[size].color === GremlinManager.ObjectiveSequence[size].color;
        if(good) {
            GremlinManager.playerScore++;
            if(size + 1 === GremlinManager.ObjectiveSequence.length) {
                GremlinManager.playerDidSequence = true;
                GremlinManager.setText(GremlinManager.playerDidSequence);
                GremlinManager.PlayerSequence = [];
                GremlinManager.incrementSequence();
                GremlinManager.lightButtons();
                if (GremlinManager.strikes < 3) {
                    GremlinManager.strikes++;
                }
            }
        } else {
            //Discrepancy! Flash the right one and repeat the pattern.
            GremlinManager.setText(GremlinManager.playerDidSequence);
            GremlinManager.playerDidSequence = true;
            GremlinManager.PlayerSequence = [];
            GremlinManager.strikes--;
            this.lightingButtons = true;
            //Unless the player has ran out of lives. If they did, the game is over!
            if (GremlinManager.strikes === 0) {
                for (var i = 0; i < GremlinManager.GameButtons.length; i++) { //
                    GremlinManager.GameButtons[i].gameOver();
                    this.gameOverSFX.play();
                }
            } else {
                
                for(var i = 0; i < 3; i++) {
                    setTimeout(() => {GremlinManager.ObjectiveSequence[size].flash();}, 250 * i);
                    setTimeout(() => {
                        
                        if (GremlinManager.wrongSFX.paused) {
                            GremlinManager.wrongSFX.play();
                        }else{
                            GremlinManager.wrongSFX.currentTime = 0
                        }



                    }, 250 * i);
                }
                
                GremlinManager.lightButtons();
            }
        }
        //if Player
        
    }


    static getRandomButton() {
        return GremlinManager.GameButtons[Math.floor(Math.random() * 9)]; //The maximum is exclusive and the minimum is inclusive
    }

    static setText(wasCorrect) {
        console.log(wasCorrect)

        if (wasCorrect === true) {
            GremlinManager.textSelected = GremlinManager.goodText[
                GremlinManager.getRandomInt(GremlinManager.goodText.length)];
        } else {
            GremlinManager.textSelected = GremlinManager.badText[
                GremlinManager.getRandomInt(GremlinManager.badText.length)];
            console.log("s")
        }
    }
      


    draw(ctx) {
        
        ctx.strokeStyle = "red";
        //Draw image assets first.
        ctx.drawImage(this.strikeAsset, 0, 0);
        ctx.drawImage(this.bgUiAsset, 225, 0);

        //Then we draw any necessary text.
        //Clear it first to avoid an obnoxious bug.
        this.scoreCtx.clearRect(0, 0, 225, 100);
        this.scoreCtx.fillText("Score: " + GremlinManager.playerScore, 110, 35);
        if(GremlinManager.playerDidSequence && !(GremlinManager.strikes === 0)) {
            this.scoreCtx.fillText(GremlinManager.textSelected, 110, 85); 
        } else if (GremlinManager.strikes === 0) {
            this.scoreCtx.fillText("GAME OVER", 110, 85); 
        }


        
        

        ctx.drawImage(this.sc, 225, 0);
        

        

    }

    static getRandomInt(max) {
        return Math.floor(Math.random() * max);
    }

    update() {
        this.strikeAsset = ASSET_MANAGER.getAsset("./gfx/strikes" + GremlinManager.strikes + ".png");

        if (GremlinManager.playerDidSequence) {
            this.timeOut += this.game.clockTick;
            console.log(this.timeOut);
            if (this.timeOut >= TEXT_LASTING_PERIOD) {
                GremlinManager.playerDidSequence = false;
                this.timeOut = 0;
            }
        }

        if(GremlinManager.strikes === 0) {
            GremlinManager.textSelected = "GAME OVER";
        }
    }


}