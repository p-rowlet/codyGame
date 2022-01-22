const app = new PIXI.Application({
	width: 1200,
	height: 750,
	antialias: true,
	backgroundColor: 0xeffefe,
	resolution: window.devicePixelRatio || 1,
});

app.loader
	.add("spritesheet", "./images/character_ani.json")
	.load(gameView)
	.load(characterLoaded)
	.load(clothAndDrag);

function characterLoaded() {
	const characterTextures = [];

	for (let i = 0; i <= 22; i++) {
		const texture = PIXI.Texture.from(`char_${i}.png`);
		characterTextures.push(texture);
	}

	const animated = new PIXI.AnimatedSprite(characterTextures);
	animated.animationSpeed = 0.1;
	animated.scale.set(0.8);
	animated.x = 760;
	animated.play();
	app.stage.addChild(animated);
}

const game = document.querySelector(".game");
const graphics = new PIXI.Graphics();

function gameView() {
	game.appendChild(app.view);
	app.stage.addChild(graphics);
	setBackground(0xffffff);
}

let cloth = {};

function clothAndDrag() {
	const coordinate = [
		null,
		{ x: 700, y: 650 },
		{ x: 250, y: 100 },
		{ x: 100, y: 100 },
		{ x: 400, y: 400 },
		{ x: 100, y: 300 },
		{ x: 250, y: 500 },
		{ x: 420, y: 550 },
		{ x: 100, y: 500 },
		{ x: 420, y: 300 },
		{ x: 1100, y: 600 },
		{ x: 420, y: 200 },
		{ x: 430, y: 100 },
		{ x: 250, y: 200 },
	];

	for (let i = 1; i <= 13; i++) {
		cloth[`${i}`] = PIXI.Sprite.from(`./images/cloth${i}.png`);
		cloth[`${i}`].interactive = true;
		cloth[`${i}`].buttonMode = true;
		cloth[`${i}`].anchor.set(0.5);
		cloth[`${i}`].scale.set(0.8);
		app.stage.addChild(cloth[`${i}`]);

		cloth[`${i}`]
			.on("pointerdown", onDragStart)
			.on("pointerup", onDragEnd)
			.on("pointerupoutside", onDragEnd)
			.on("pointermove", onDragMove);

		cloth[`${i}`].x = coordinate[`${i}`].x;
		cloth[`${i}`].y = coordinate[`${i}`].y;
	}

	function onDragStart(event) {
		this.data = event.data;
		this.alpha = 0.5;
		this.dragging = true;
	}

	function onDragEnd() {
		this.alpha = 1;
		this.dragging = false;
		this.data = null;
	}

	function onDragMove() {
		if (this.dragging) {
			const newPosition = this.data.getLocalPosition(this.parent);
			this.x = newPosition.x;
			this.y = newPosition.y;
		}
	}
}

let saveCount = 0;
const btn = document.querySelector(".saveBtn");
btn.addEventListener("click", characterSave);

function characterSave() {
	const copiedCanvas = document.createElement("canvas");
	copiedCanvas.setAttribute("width", "650");
	copiedCanvas.setAttribute("height", "550");
	const picture = app.renderer.extract.canvas(app.stage);
	const ctx = copiedCanvas.getContext("2d");
	ctx.drawImage(picture, 570, 0, 630, 510, 0, 0, 630, 510);
	const imageURL = copiedCanvas.toDataURL();
	const link = document.createElement("a");
	link.href = imageURL;
	link.download = `코디${saveCount}`;
	saveCount++;
	link.click();
}

const selectColorBtn = document.querySelector(".colorset");
selectColorBtn.addEventListener("click", colorSetting);

function setBackground(color) {
	graphics.clear();
	graphics.beginFill(color);
	graphics.drawRect(570, 0, 630, 500);
}

function colorSetting(e) {
	const color = e.target.dataset.color || e.target.parentNode.dataset.color;
	color && setBackground(color);
}
