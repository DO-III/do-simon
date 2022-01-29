const gameEngine = new GameEngine();

const ASSET_MANAGER = new AssetManager();

ASSET_MANAGER.downloadAll(() => {
	const canvas = document.getElementById("gameWorld");
	const ctx = canvas.getContext("2d");



	gameEngine.addEntity(new GButton(0, 100, "Red"));
	gameEngine.addEntity(new GButton(150, 100, "Blue"));
	gameEngine.addEntity(new GButton(300, 100, "Green"));
	gameEngine.addEntity(new GButton(0, 250, "Yellow"));
	gameEngine.addEntity(new GButton(150, 250, "Black"));
	gameEngine.addEntity(new GButton(300, 250, "Pink"));
	gameEngine.addEntity(new GButton(0, 400, "Purple"));
	gameEngine.addEntity(new GButton(150, 400, "Cyan"));
	gameEngine.addEntity(new GButton(300, 400, "Brown"));

	gameEngine.init(ctx);

	gameEngine.start();
});
