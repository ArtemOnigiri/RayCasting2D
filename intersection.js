let cnv = document.getElementById('cnv');
let ctx = cnv.getContext('2d');
let w = cnv.width = window.innerWidth;
let h = cnv.height = window.innerHeight;

let circles = [
	{x: 0, y: 20, ra: 100, r: 0.9, g: 0.7, b: 0.4},
	{x: -400, y: -50, ra: 100, r: 0.3, g: 0.7, b: 0.4}
];

ctx.lineWidth = 4;

let vec2 = (x, y) => ({x, y});
let add = (a, b) => ({x: a.x + b.x, y: a.y + b.y});
let sub = (a, b) => ({x: a.x - b.x, y: a.y - b.y});
let mulS = (a, b) => ({x: a.x * b, y: a.y * b});
let dot = (a, b) => a.x * b.x + a.y * b.y;
let length = a => Math.sqrt(a.x * a.x + a.y * a.y);
let norm = a => ({x: a.x / length(a), y: a.y / length(a)});

let sphIntersect = (ro, rd, ra) => {
	let b = dot(ro, rd);
	let c = dot(ro, ro) - ra * ra;
	let h = b * b - c;
	if(h < 0.0) return vec2(-1.0, -1.0);
	h = Math.sqrt(h);
	return vec2(-b - h, -b + h);
}

let mousePos = vec2(0, 0);
let camera = vec2(-w / 2 + 225, 0);
let interval = setInterval(update, 17);

function update() {
	ctx.fillStyle = '#ccc';
	ctx.fillRect(0, 0, w, h);
	drawCamera();
	ctx.strokeStyle = '#fff';
	drawCircles();
	rayCast(camera, norm(sub(mousePos, camera)), {r: 1, g: 1, b: 1});
}

function drawCircles() {
	for (let i = 0; i < circles.length; i++) {
		ctx.fillStyle = 'rgba(' + ~~(circles[i].r * 255) + ', ' + ~~(circles[i].g * 255) + ', ' + ~~(circles[i].b * 255) + ', 1)';
		ctx.beginPath();
		ctx.arc(circles[i].x + w / 2, circles[i].y + h / 2, circles[i].ra, 0, Math.PI * 2, false);
		ctx.fill();
	}
}

function drawCamera() {
	ctx.strokeStyle = '#000';
	ctx.strokeRect(100, h / 2 - 25, 75, 50);
	ctx.beginPath();
	ctx.moveTo(175, h / 2 - 25);
	ctx.lineTo(175, h / 2 + 25);
	ctx.lineTo(225, h / 2 + 45);
	ctx.lineTo(225, h / 2 - 45);
	ctx.lineTo(175, h / 2 - 25);
	ctx.closePath();
	ctx.stroke();
	ctx.beginPath();
	ctx.arc(165, h / 2 - 50, 25, 0, 2 * Math.PI);
	ctx.stroke();
	ctx.beginPath();
	ctx.arc(120, h / 2 - 45, 20, 0, 2 * Math.PI);
	ctx.stroke();
}

function rayCast(ro, rd, rc) {
	let tg = add(ro, mulS(rd, 9999));
	ctx.beginPath();
	ctx.moveTo(ro.x + w / 2, ro.y + h / 2);
	ctx.lineTo(tg.x + w / 2, tg.y + h / 2);
	ctx.stroke();
	for (let i = 0; i < circles.length; i++) {
		let sp = vec2(circles[i].x, circles[i].y);
		let it = sphIntersect(sub(ro, sp), rd, circles[i].ra);
		if(it.x > 0.0) {
			let tg0 = add(ro, mulS(rd, it.x));
			let tg1 = add(ro, mulS(rd, it.y));
			ctx.fillStyle = '#f00';
			ctx.beginPath();
			ctx.arc(tg0.x + w / 2, tg0.y + h / 2, 10, 0, 2 * Math.PI);
			ctx.fill();
			ctx.fillStyle = '#070';
			ctx.beginPath();
			ctx.arc(tg1.x + w / 2, tg1.y + h / 2, 10, 0, 2 * Math.PI);
			ctx.fill();
		}
	}
}

function onMouseUpdate(e) {
	mousePos = vec2(e.pageX - w / 2, e.pageY - h / 2);
}
document.addEventListener('mousemove', onMouseUpdate, false);