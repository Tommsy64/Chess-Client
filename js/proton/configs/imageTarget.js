var canvas;
var context;
var proton;
var renderer;
var emitter;

setTimeout(Main, 300);

function Main() {
	canvas = document.getElementById("protonCanvas");
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;
	context = canvas.getContext('2d');
	context.globalCompositeOperation = "lighter";
	createProton();
	tick();
	window.onresize = function(e) {
		canvas.width = window.innerWidth;
		canvas.height = window.innerHeight;
	}
}

function createProton(image) {
	proton = new Proton;
	emitter = new Proton.Emitter();
	emitter.rate = new Proton.Rate(new Proton.Span(10, 20), new Proton.Span(.05, .2));
	emitter.addInitialize(new Proton.ImageTarget('../../../img/particle.png', 32));
	emitter.addInitialize(new Proton.Mass(1));
	emitter.addInitialize(new Proton.Radius(1, 12));
	emitter.addInitialize(new Proton.Life(1, 3));
	emitter.addInitialize(new Proton.V(new Proton.Span(1, 3), new Proton.Span(-20, 20), 'polar'));
	emitter.addBehaviour(new Proton.RandomDrift(10, 10, .05));
	emitter.addBehaviour(new Proton.Alpha(1, 0.1));
	
	emitter.addBehaviour(new Proton.Scale(.1, 4));
	emitter.p.x = canvas.width / 2;
	emitter.p.y = canvas.height / 2;
	emitter.emit();
	proton.addEmitter(emitter);

	renderer = new Proton.Renderer('canvas', proton, canvas);
	renderer.start();
}

function tick() {
	requestAnimationFrame(tick);

	emitter.rotation += 1.5;
	proton.update();
}