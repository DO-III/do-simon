const gameEngine = new GameEngine();

const ASSET_MANAGER = new AssetManager();
ASSET_MANAGER.queueDownload("./gfx/button.png");
ASSET_MANAGER.queueDownload("./gfx/strikes0.png");
ASSET_MANAGER.queueDownload("./gfx/strikes1.png");
ASSET_MANAGER.queueDownload("./gfx/strikes2.png");
ASSET_MANAGER.queueDownload("./gfx/strikes3.png");

ASSET_MANAGER.downloadAll(() => {
	const canvas = document.getElementById("gameWorld");
	const ctx = canvas.getContext("2d");
	gameEngine.init(ctx);

	const gm = new GremlinManager(gameEngine);
	gameEngine.addEntity(gm);

	var buttons = [
		new GButton(gameEngine, 0, 100, "Red"),
		new GButton(gameEngine, 150, 100, "Blue"),
		new GButton(gameEngine, 300, 100, "Green"),
		new GButton(gameEngine, 0, 250, "Yellow"),
		new GButton(gameEngine, 150, 250, "Orange"),
		new GButton(gameEngine, 300, 250, "Fuchsia"),
		new GButton(gameEngine, 0, 400, "Purple"),
		new GButton(gameEngine, 150, 400, "Cyan"),
		new GButton(gameEngine, 300, 400, "Brown")
	];
	gm.initialize(buttons);
	
	gameEngine.start();
});
