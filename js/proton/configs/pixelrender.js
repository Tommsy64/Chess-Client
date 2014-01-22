var proton;
var canvas;
var context;
var renderer;
var logoZone;
var emitter;
var rect, rect2;
var gravityBehaviour, randomBehaviour, gravityWellBehaviour;
var rootIndex = 1;

setTimeout(Main, 400);

function Main() {
	canvas = document.getElementById("testCanvas");
	canvas.width = 1003;
	canvas.height = 610;
	context = canvas.getContext('2d');

	initBehaviours();
	canvas.addEventListener('mousedown', mouseDownHandler, false);
	loadImage();
}

function loadImage() {
	logoZone = [];
	var logo = [];
	var loader = new PxLoader();
	logo[0] = loader.addImage('../../../img/logo1.png');
	logo[1] = loader.addImage('../../../img/logo2.png');
	logo[2] = loader.addImage('../../../img/logo3.png');

	loader.addCompletionListener(function() {

		for (var i = 0; i < 3; i++) {
			var imagedata = Proton.Util.getImageData(context, logo[i], rect);
			logoZone.push(new Proton.ImageZone(imagedata, rect.x, rect.y));
		}
		createProton(rect);
		tick();
	});
	loader.start();
}

function initBehaviours() {
	var imageWidth = 342;
	var drawScopeWidth = 710;
	rect = new Proton.Rectangle((canvas.width - imageWidth) / 2, (canvas.height - imageWidth) / 2, imageWidth, imageWidth);
	rect2 = new Proton.Rectangle((canvas.width - drawScopeWidth) / 2, 0, drawScopeWidth, canvas.height);
	var rectZone = new Proton.RectZone(rect2.x, rect2.y, rect2.width, rect2.height);
	gravityBehaviour = new Proton.Gravity(0);
	randomBehaviour = new Proton.RandomDrift(0, 0, 0.05);
	crossBehaviour = new Proton.CrossZone(rectZone, 'bound');
	gravityWellBehaviour = new Proton.GravityWell({
		x : canvas.width / 2,
		y : canvas.height / 2
	}, 0, 0);
}

function createProton() {
	proton = new Proton;
	emitter = new Proton.Emitter();
	emitter.rate = new Proton.Rate(new Proton.Span(1500), new Proton.Span(0.1));
	emitter.addInitialize(new Proton.Mass(1));
	emitter.addInitialize(new Proton.P(new Proton.RectZone(rect2.x, rect2.y, rect2.width, rect2.height)));

	emitter.addBehaviour(new Proton.Color('random'));
	emitter.addBehaviour(gravityBehaviour);
	emitter.addBehaviour(randomBehaviour);
	emitter.addBehaviour(crossBehaviour);
	emitter.addBehaviour(gravityWellBehaviour);
	emitter.addBehaviour(customToZoneBehaviour(logoZone[0], logoZone[1], logoZone[2]));

	emitter.emit('once');
	proton.addEmitter(emitter);

	renderer = new Proton.Renderer('pixel', proton, canvas);
	renderer.createImageData(rect2);
	renderer.start();
}

function customToZoneBehaviour(zone1, zone2, zone3) {
	return {
		initialize : function(particle) {
			particle.R = Math.random() * 10;
			particle.Angle = Math.random() * Math.PI * 2;
			particle.speed = Math.random() * (-1.5) + 0.75;
			particle.zones = [zone1.getPosition().clone(), zone2.getPosition().clone(), zone3.getPosition().clone()];
		},

		applyBehaviour : function(particle) {
			if (rootIndex % 2 != 0) {
				particle.v.clear();
				particle.Angle += particle.speed;
				var index = (rootIndex % 6 + 1) / 2 - 1;
				var x = particle.zones[index].x + particle.R * Math.cos(particle.Angle);
				var y = particle.zones[index].y + particle.R * Math.sin(particle.Angle);
				particle.p.x += (x - particle.p.x) * 0.05;
				particle.p.y += (y - particle.p.y) * 0.05;
			}
		}
	}

}

function mouseDownHandler(e) {
	rootIndex++;
	if (rootIndex % 2 == 0) {
		if (rootIndex % 6 == 2)
			gravityBehaviour.reset(9);
		else if (rootIndex % 6 == 4)
			randomBehaviour.reset(30, 30, 0.001);
		else
			gravityWellBehaviour.reset({
				x : canvas.width / 2,
				y : canvas.height / 2
			}, 3000, 500);
	} else {
		gravityBehaviour.reset(0);
		randomBehaviour.reset(0, 0, 0.001);
		gravityWellBehaviour.reset({
			x : canvas.width / 2,
			y : canvas.height / 2
		}, 0, 0);
	}
}

function tick() {
	requestAnimationFrame(tick);

	proton.update();
}