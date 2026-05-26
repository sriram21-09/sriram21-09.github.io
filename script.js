/* ═══════════════════════════════════════════
   Kasukurthi Sriram — Portfolio Scripts
   ═══════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {
  initNav();
  initTyping();
  initScrollReveal();
  initCanvas();
  initCounters();
});

/* ─── Navigation ─── */
function initNav() {
  const nav = document.querySelector('.nav');
  const hamburger = document.querySelector('.hamburger');
  const navLinks = document.querySelector('.nav-links');
  const links = document.querySelectorAll('.nav-links a');

  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 50);
  });

  hamburger?.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navLinks.classList.toggle('open');
    document.body.style.overflow = navLinks.classList.contains('open') ? 'hidden' : '';
  });

  links.forEach(link => {
    link.addEventListener('click', () => {
      hamburger?.classList.remove('active');
      navLinks?.classList.remove('open');
      document.body.style.overflow = '';
    });
  });
}

/* ─── Typing Animation ─── */
function initTyping() {
  const el = document.getElementById('typingText');
  if (!el) return;

  const phrases = [
    'Cybersecurity Engineer',
    'Detection Builder',
    'Systems Architect',
    'Threat Intelligence Developer',
    'Security Automation Engineer'
  ];

  let phraseIndex = 0, charIndex = 0, isDeleting = false;

  function type() {
    const current = phrases[phraseIndex];

    if (isDeleting) {
      el.textContent = current.substring(0, charIndex - 1);
      charIndex--;
    } else {
      el.textContent = current.substring(0, charIndex + 1);
      charIndex++;
    }

    let delay = isDeleting ? 40 : 80;

    if (!isDeleting && charIndex === current.length) {
      delay = 2200;
      isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      phraseIndex = (phraseIndex + 1) % phrases.length;
      delay = 500;
    }

    setTimeout(type, delay);
  }

  type();
}

/* ─── Scroll Reveal ─── */
function initScrollReveal() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
}

/* ─── Hero Canvas Grid ─── */
function initCanvas() {
  const canvas = document.getElementById('heroCanvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let width, height, dots = [];
  let mouse = { x: -1000, y: -1000 };

  function resize() {
    width = canvas.width = canvas.parentElement.offsetWidth;
    height = canvas.height = canvas.parentElement.offsetHeight;
    createDots();
  }

  function createDots() {
    dots = [];
    const spacing = 60;
    for (let x = 0; x < width; x += spacing) {
      for (let y = 0; y < height; y += spacing) {
        dots.push({ x, y, baseX: x, baseY: y, opacity: Math.random() * 0.3 + 0.05 });
      }
    }
  }

  function animate() {
    ctx.clearRect(0, 0, width, height);

    dots.forEach(dot => {
      const dx = mouse.x - dot.x;
      const dy = mouse.y - dot.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const maxDist = 150;

      let opacity = dot.opacity;
      let size = 1;

      if (dist < maxDist) {
        const factor = 1 - dist / maxDist;
        opacity = Math.min(dot.opacity + factor * 0.5, 0.7);
        size = 1 + factor * 1.5;
      }

      ctx.beginPath();
      ctx.arc(dot.x, dot.y, size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(0, 240, 255, ${opacity})`;
      ctx.fill();

      // Draw connections to nearby dots on hover
      if (dist < maxDist) {
        dots.forEach(other => {
          const odx = dot.x - other.x;
          const ody = dot.y - other.y;
          const odist = Math.sqrt(odx * odx + ody * ody);
          if (odist < 80 && odist > 0) {
            const factor = 1 - dist / maxDist;
            ctx.beginPath();
            ctx.moveTo(dot.x, dot.y);
            ctx.lineTo(other.x, other.y);
            ctx.strokeStyle = `rgba(0, 240, 255, ${factor * 0.15})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        });
      }
    });

    requestAnimationFrame(animate);
  }

  canvas.addEventListener('mousemove', (e) => {
    const rect = canvas.getBoundingClientRect();
    mouse.x = e.clientX - rect.left;
    mouse.y = e.clientY - rect.top;
  });

  canvas.addEventListener('mouseleave', () => {
    mouse.x = -1000;
    mouse.y = -1000;
  });

  window.addEventListener('resize', resize);
  resize();
  animate();
}

/* ─── Counter Animation ─── */
function initCounters() {
  const counters = document.querySelectorAll('[data-count]');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !entry.target.dataset.counted) {
        entry.target.dataset.counted = 'true';
        animateCounter(entry.target);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(el => observer.observe(el));
}

function animateCounter(el) {
  const target = parseInt(el.dataset.count);
  const suffix = el.dataset.suffix || '';
  const duration = 1800;
  const start = performance.now();

  function update(now) {
    const elapsed = now - start;
    const progress = Math.min(elapsed / duration, 1);
    // Ease out cubic
    const eased = 1 - Math.pow(1 - progress, 3);
    const current = Math.round(eased * target);

    el.textContent = current.toLocaleString() + suffix;

    if (progress < 1) requestAnimationFrame(update);
  }

  requestAnimationFrame(update);
}

/* ─── Smooth scroll for anchor links ─── */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  });
});
