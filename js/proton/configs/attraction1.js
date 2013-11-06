var canvas;
var context;
var proton;
var renderer;
var emitter;
var stats;
var _mousedown = false;
var mouseObj;
var attractionBehaviour, crossZoneBehaviour;

Main();

function Main() {
	canvas = document.getElementById("protonCanvas");
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;
	context = canvas.getContext('2d');

	createProton();
	createRenderer();
	tick();
	canvas.addEventListener('mousedown', mousedownHandler, false);
	canvas.addEventListener('mouseup', mouseupHandler, false);
	canvas.addEventListener('mousemove', mousemoveHandler, false);
	window.onresize = function(e) {
		canvas.width = window.innerWidth;
		canvas.height = window.innerHeight;
		crossZoneBehaviour.reset(new Proton.RectZone(0, 0, canvas.width, canvas.height), 'cross');
	}
}

function createProton() {
	proton = new Proton;
	emitter = new Proton.Emitter();
	emitter.damping = 0.008;
	emitter.rate = new Proton.Rate(250);
	emitter.addInitialize(new Proton.Mass(1));
	emitter.addInitialize(new Proton.Radius(4));
	emitter.addInitialize(new Proton.Velocity(new Proton.Span(1.5), new Proton.Span(0, 360), 'polar'));

	mouseObj = {
		x : 1003 / 2,
		y : 610 / 2
	};
	attractionBehaviour = new Proton.Attraction(mouseObj, 0, 0);
	crossZoneBehaviour = new Proton.CrossZone(new Proton.RectZone(0, 0, canvas.width, canvas.height), 'cross');
	emitter.addBehaviour(new Proton.Color('random'));
	emitter.addBehaviour(attractionBehaviour, crossZoneBehaviour);
	emitter.addBehaviour(new Proton.RandomDrift(10, 10, .05));
	emitter.p.x = canvas.width / 2;
	emitter.p.y = canvas.height / 2;
	emitter.emit('once');
	proton.addEmitter(emitter);
}

function mousedownHandler(e) {
	_mousedown = true;
	attractionBehaviour.reset(mouseObj, 10, 1200);
	mousemoveHandler(e);
}

function mousemoveHandler(e) {
	if (_mousedown) {
		var _x, _y;
		if (e.layerX || e.layerX == 0) {
			_x = e.layerX;
			_y = e.layerY;
		} else if (e.offsetX || e.offsetX == 0) {
			_x = e.offsetX;
			_y = e.offsetY;
		}

		mouseObj.x = _x;
		mouseObj.y = _y;
	}
}

function mouseupHandler(e) {
	_mousedown = false;
	attractionBehaviour.reset(mouseObj, 0, 0);
}

function createRenderer() {
	renderer = new Proton.Renderer('other', proton);
	renderer.onProtonUpdate = function() {
		context.fillStyle = "rgba(0, 0, 0, 0.02)";
		context.fillRect(0, 0, canvas.width, canvas.height);
	};

	renderer.onParticleUpdate = function(particle) {
		context.beginPath();
		context.strokeStyle = particle.color;
		context.lineWidth = 1;
		context.moveTo(particle.old.p.x, particle.old.p.y);
		context.lineTo(particle.p.x, particle.p.y);
		context.closePath();
		context.stroke();
	};

	renderer.start();
}

function tick() {
	requestAnimationFrame(tick);

	proton.update();
}
