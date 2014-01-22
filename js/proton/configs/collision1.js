var canvas;
var context;
var proton;
var renderer;
var emitter;

setTimeout(Main, 500);

function Main() {
	canvas = document.getElementById("protonCanvas");
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;
	context = canvas.getContext('2d');
	//canvas.getContext('2d').globalCompositeOperation = "lighter";

	createProton();
	tick();
	canvas.addEventListener('mousedown', mousedownHandler, false);
	canvas.addEventListener('mouseup', mouseupHandler, false);
	canvas.addEventListener('mousemove', mousemoveHandler, false);
	window.onresize = function(e) {
		canvas.width = window.innerWidth;
		canvas.height = window.innerHeight;
	}
}

function createProton() {
	proton = new Proton;
	emitter = new Proton.Emitter();
	emitter.rate = new Proton.Rate(new Proton.Span(1, 2), .012);
	emitter.addInitialize(new Proton.Mass(1));
	emitter.addInitialize(new Proton.Radius(2, 20));
	emitter.addInitialize(new Proton.Life(20, 23));
	emitter.addInitialize(new Proton.Velocity(new Proton.Span(1, 2), [45, 135, 225, 315], 'polar'));
	emitter.addBehaviour(new Proton.Collision(emitter));
	emitter.addBehaviour(new Proton.Color('#dddddd'));
	emitter.addBehaviour(new Proton.CrossZone(new Proton.RectZone(0, 0, canvas.width, canvas.height), 'bound'));
	emitter.damping = 0.02;
	proton.addEmitter(emitter);
	renderer = new Proton.Renderer('canvas', proton, canvas);
	renderer.onProtonUpdate = function() {
		context.fillStyle = "rgba(0, 0, 0, 0.09)";
		context.fillRect(0, 0, canvas.width, canvas.height);
	};
	renderer.start();
}

function mousedownHandler(e) {
	emitter.emit();
}

function mouseupHandler(e) {
	emitter.stopEmit();
}

function mousemoveHandler(e) {
	if (e.layerX || e.layerX == 0) {
		emitter.p.x = e.layerX;
		emitter.p.y = e.layerY;
	} else if (e.offsetX || e.offsetX == 0) {
		emitter.p.x = e.offsetX;
		emitter.p.y = e.offsetY;
	}
}

function tick() {
	requestAnimationFrame(tick);
	proton.update();
}