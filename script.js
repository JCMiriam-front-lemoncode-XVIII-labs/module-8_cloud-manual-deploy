const canvas = document.querySelector('#space');
const ctx = canvas.getContext('2d');
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
const keys = new Set();
const controls = new Set([
  'ArrowUp',
  'ArrowDown',
  'ArrowLeft',
  'ArrowRight',
  'w',
  'a',
  's',
  'd',
  ' ',
]);

let width;
let height;
let stars = [];
let particles = [];
let previousTime = 0;
let pointerActive = false;
let pressed = false;

const pointer = { x: 0, y: 0 };
const ship = { x: 0, y: 0, angle: 0 };

function resize() {
  width = window.innerWidth;
  height = window.innerHeight;

  const ratio = Math.min(window.devicePixelRatio || 1, 2);

  canvas.width = Math.round(width * ratio);
  canvas.height = Math.round(height * ratio);
  ctx.setTransform(ratio, 0, 0, ratio, 0, 0);

  ship.x = width / 2;
  ship.y = height / 2;
  pointer.x = ship.x;
  pointer.y = ship.y;

  stars = Array.from(
    { length: Math.min(240, Math.round((width * height) / 5000)) },
    () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      size: Math.random() * 1.5 + 0.4,
      phase: Math.random() * Math.PI * 2,
    }),
  );
}

window.addEventListener('resize', resize);

canvas.addEventListener('pointermove', (event) => {
  pointer.x = event.clientX;
  pointer.y = event.clientY;
  pointerActive = true;
});

canvas.addEventListener('pointerdown', (event) => {
  canvas.focus({ preventScroll: true });
  canvas.setPointerCapture(event.pointerId);

  pointer.x = event.clientX;
  pointer.y = event.clientY;
  pointerActive = true;
  pressed = true;
});

window.addEventListener('pointerup', () => {
  pressed = false;
});

window.addEventListener('pointercancel', () => {
  pressed = false;
});

window.addEventListener('keydown', (event) => {
  const key = event.key.length === 1 ? event.key.toLowerCase() : event.key;

  if (!controls.has(key)) return;

  event.preventDefault();
  keys.add(key);

  if (key !== ' ') pointerActive = false;
});

window.addEventListener('keyup', (event) => {
  keys.delete(event.key.length === 1 ? event.key.toLowerCase() : event.key);
});

window.addEventListener('blur', () => {
  keys.clear();
  pressed = false;
});

function ellipse(x, y, rx, ry, color) {
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.ellipse(x, y, rx, ry, 0, 0, Math.PI * 2);
  ctx.fill();
}

function drawPlanet() {
  const radius = Math.min(width, height) * 0.13;

  ctx.save();
  ctx.translate(width * 0.78, height * 0.25);
  ctx.rotate(-0.4);

  ctx.strokeStyle = '#a6bc9140';
  ctx.lineWidth = radius * 0.17;
  ctx.beginPath();
  ctx.ellipse(0, 0, radius * 1.8, radius * 0.42, 0, 0, Math.PI * 2);
  ctx.stroke();

  const gradient = ctx.createLinearGradient(-radius, -radius, radius, radius);

  gradient.addColorStop(0, '#84977a');
  gradient.addColorStop(1, '#304d45');
  ellipse(0, 0, radius, radius, gradient);

  ctx.strokeStyle = '#bacba670';
  ctx.beginPath();
  ctx.ellipse(0, 0, radius * 1.8, radius * 0.42, 0, 0, Math.PI);
  ctx.stroke();
  ctx.restore();
}

function drawShip(moving, boost, time) {
  ctx.save();
  ctx.translate(ship.x, ship.y);
  ctx.rotate(ship.angle);

  if (moving) {
    const length =
      (boost ? 53 : 28) +
      (reducedMotion.matches ? 0 : Math.sin(time * 0.03) * 5);
    const fire = ctx.createLinearGradient(0, 21, 0, 21 + length);

    fire.addColorStop(0, '#e4f796');
    fire.addColorStop(0.4, '#efb66a');
    fire.addColorStop(1, '#efb66a00');
    ellipse(0, 22 + length / 2, 7, length / 2, fire);
  }

  ctx.fillStyle = '#b9cf70';
  ctx.beginPath();
  ctx.moveTo(-11, 7);
  ctx.lineTo(-24, 27);
  ctx.lineTo(-10, 21);
  ctx.moveTo(11, 7);
  ctx.lineTo(24, 27);
  ctx.lineTo(10, 21);
  ctx.fill();

  ctx.fillStyle = '#edf0dc';
  ctx.beginPath();
  ctx.moveTo(0, -33);
  ctx.bezierCurveTo(17, -20, 17, 8, 11, 24);
  ctx.lineTo(-11, 24);
  ctx.bezierCurveTo(-17, 8, -17, -20, 0, -33);
  ctx.fill();

  ctx.fillStyle = '#d9ee72';
  ctx.beginPath();
  ctx.moveTo(0, -33);
  ctx.quadraticCurveTo(10, -25, 12, -13);
  ctx.lineTo(-12, -13);
  ctx.quadraticCurveTo(-10, -25, 0, -33);
  ctx.fill();

  ellipse(0, -2, 8, 8, '#879b65');
  ellipse(0, -2, 5, 5, '#213d46');
  ellipse(-1.5, -3.5, 1.7, 1.7, '#accac5');

  ctx.fillStyle = '#73875b';
  ctx.fillRect(-8, 22, 16, 4);
  ctx.restore();
}

function frame(time) {
  const dt = Math.min((time - previousTime) / 1000 || 0, 0.04);
  previousTime = time;

  const boost = pressed || keys.has(' ');
  let dx =
    Number(keys.has('ArrowRight') || keys.has('d')) -
    Number(keys.has('ArrowLeft') || keys.has('a'));
  let dy =
    Number(keys.has('ArrowDown') || keys.has('s')) -
    Number(keys.has('ArrowUp') || keys.has('w'));

  if (pointerActive) {
    dx = pointer.x - ship.x;
    dy = pointer.y - ship.y;
  }

  const distance = Math.hypot(dx, dy);
  const moving = distance > (pointerActive ? 3 : 0);

  if (moving) {
    const speed = boost ? 520 : 240;
    const step = pointerActive ? Math.min(distance, speed * dt) : speed * dt;

    ship.x += (dx / distance) * step;
    ship.y += (dy / distance) * step;
    ship.x = Math.max(28, Math.min(width - 28, ship.x));
    ship.y = Math.max(35, Math.min(height - 35, ship.y));

    const targetAngle = Math.atan2(dy, dx) + Math.PI / 2;
    const difference = Math.atan2(
      Math.sin(targetAngle - ship.angle),
      Math.cos(targetAngle - ship.angle),
    );

    ship.angle += difference * Math.min(1, dt * 12);

    if (!reducedMotion.matches) {
      particles.push({
        x: ship.x - Math.sin(ship.angle) * 27,
        y: ship.y + Math.cos(ship.angle) * 27,
        vx: -Math.sin(ship.angle) * 40 + (Math.random() - 0.5) * 25,
        vy: Math.cos(ship.angle) * 40 + (Math.random() - 0.5) * 25,
        life: 1,
      });
    }
  }

  ctx.fillStyle = '#101b20';
  ctx.fillRect(0, 0, width, height);

  const glow = ctx.createRadialGradient(
    width * 0.55,
    height * 0.45,
    0,
    width * 0.55,
    height * 0.45,
    Math.max(width, height) * 0.7,
  );

  glow.addColorStop(0, '#243c354d');
  glow.addColorStop(1, '#101b2000');
  ctx.fillStyle = glow;
  ctx.fillRect(0, 0, width, height);

  for (const star of stars) {
    ctx.globalAlpha = reducedMotion.matches
      ? 0.55
      : 0.45 + Math.sin(time * 0.0007 + star.phase) * 0.25;
    ellipse(star.x, star.y, star.size, star.size, '#dae5c8');
  }

  ctx.globalAlpha = 1;
  drawPlanet();
  ellipse(
    width * 0.12,
    height * 0.83,
    Math.min(width, height) * 0.035,
    Math.min(width, height) * 0.035,
    '#526d6350',
  );

  particles = particles.filter((particle) => particle.life > 0);

  for (const particle of particles) {
    particle.life -= dt * 1.2;
    particle.x += particle.vx * dt;
    particle.y += particle.vy * dt;

    ctx.globalAlpha = Math.max(0, particle.life) * 0.6;
    ellipse(
      particle.x,
      particle.y,
      2 * Math.max(0, particle.life),
      2 * Math.max(0, particle.life),
      '#d9ee72',
    );
  }

  ctx.globalAlpha = 1;
  drawShip(moving, boost, time);
  requestAnimationFrame(frame);
}

resize();
requestAnimationFrame(frame);
