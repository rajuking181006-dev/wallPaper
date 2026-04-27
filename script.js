// ===== CANVAS SETUP =====
const canvas = document.getElementById("particleCanvas");
const ctx = canvas.getContext("2d");

canvas.style.pointerEvents = "none"; // UI clickable rahe

let particles = [];

// ===== DEVICE DETECT =====
const isMobile = window.innerWidth < 768;
let particleCount = isMobile ? 30 : 70; // auto adjust


// ===== RESIZE =====
function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener("resize", resizeCanvas);


// ===== PARTICLE CLASS =====
class Particle {
  constructor() {
    this.x = Math.random() * canvas.width;
    this.y = Math.random() * canvas.height;

    this.size = Math.random() * 2 + 1;

    this.speedX = (Math.random() - 0.5) * (isMobile ? 0.4 : 0.7);
    this.speedY = (Math.random() - 0.5) * (isMobile ? 0.4 : 0.7);

    this.opacity = Math.random() * 0.5 + 0.3;
  }

  move() {
    this.x += this.speedX;
    this.y += this.speedY;

    // bounce
    if (this.x < 0 || this.x > canvas.width) this.speedX *= -1;
    if (this.y < 0 || this.y > canvas.height) this.speedY *= -1;
  }

  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(255,255,255,${this.opacity})`;
    ctx.fill();
  }
}


// ===== INIT =====
function initParticles() {
  particles = [];
  for (let i = 0; i < particleCount; i++) {
    particles.push(new Particle());
  }
}
initParticles();


// ===== CONNECT =====
function connectParticles() {
  let maxDistance = isMobile ? 9000 : 12000;

  for (let a = 0; a < particles.length; a++) {
    for (let b = a; b < particles.length; b++) {

      let dx = particles[a].x - particles[b].x;
      let dy = particles[a].y - particles[b].y;
      let distance = dx * dx + dy * dy;

      if (distance < maxDistance) {
        let opacity = 1 - distance / maxDistance;

        ctx.strokeStyle = `rgba(255,255,255,${opacity * 0.2})`;
        ctx.lineWidth = 1;

        ctx.beginPath();
        ctx.moveTo(particles[a].x, particles[a].y);
        ctx.lineTo(particles[b].x, particles[b].y);
        ctx.stroke();
      }
    }
  }
}


// ===== INTERACTION =====
let pointer = { x: null, y: null, radius: isMobile ? 80 : 120 };

// mouse (desktop)
window.addEventListener("mousemove", (e) => {
  pointer.x = e.x;
  pointer.y = e.y;
});

// touch (mobile)
window.addEventListener("touchmove", (e) => {
  pointer.x = e.touches[0].clientX;
  pointer.y = e.touches[0].clientY;
});

function interactionEffect() {
  particles.forEach(p => {
    let dx = p.x - pointer.x;
    let dy = p.y - pointer.y;
    let distance = Math.sqrt(dx * dx + dy * dy);

    if (distance < pointer.radius) {
      p.x += dx / 25;
      p.y += dy / 25;
    }
  });
}


// ===== ANIMATION =====
function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  interactionEffect();

  particles.forEach(p => {
    p.move();
    p.draw();
  });

  connectParticles();

  requestAnimationFrame(animate);
}

animate();