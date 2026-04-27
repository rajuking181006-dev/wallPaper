// ===== CANVAS =====
const canvas = document.getElementById("particleCanvas");
const ctx = canvas.getContext("2d");

canvas.style.pointerEvents = "none";

let particles = [];

// ===== DEVICE DETECT =====
const isMobile = window.innerWidth < 768;

// wallpaper ke liye slightly zyada particles
let particleCount = isMobile ? 40 : 90;


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

    // ⭐ BIGGER SIZE (main fix)
    this.size = isMobile
      ? Math.random() * 4 + 2   // mobile big
      : Math.random() * 3 + 1.5; // desktop

    // ⭐ SLOW SMOOTH SPEED (wallpaper feel)
    this.speedX = (Math.random() - 0.5) * (isMobile ? 0.3 : 0.5);
    this.speedY = (Math.random() - 0.5) * (isMobile ? 0.3 : 0.5);

    this.opacity = Math.random() * 0.6 + 0.4;
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

    // ⭐ GLOW EFFECT
    ctx.shadowBlur = isMobile ? 15 : 10;
    ctx.shadowColor = "rgba(255,255,255,0.8)";

    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(255,255,255,${this.opacity})`;
    ctx.fill();

    ctx.shadowBlur = 0; // reset
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


// ===== CONNECT LINES =====
function connectParticles() {
  let maxDistance = isMobile ? 10000 : 14000;

  for (let a = 0; a < particles.length; a++) {
    for (let b = a; b < particles.length; b++) {

      let dx = particles[a].x - particles[b].x;
      let dy = particles[a].y - particles[b].y;
      let distance = dx * dx + dy * dy;

      if (distance < maxDistance) {
        let opacity = 1 - distance / maxDistance;

        ctx.strokeStyle = `rgba(255,255,255,${opacity * 0.15})`;
        ctx.lineWidth = 1;

        ctx.beginPath();
        ctx.moveTo(particles[a].x, particles[a].y);
        ctx.lineTo(particles[b].x, particles[b].y);
        ctx.stroke();
      }
    }
  }
}


// ===== OPTIONAL INTERACTION =====
let pointer = { x: null, y: null, radius: isMobile ? 80 : 120 };

window.addEventListener("mousemove", (e) => {
  pointer.x = e.x;
  pointer.y = e.y;
});

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
      p.x += dx / 40;
      p.y += dy / 40;
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
