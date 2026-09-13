// ── CURSOR ──────────────────────────────────────────────
const dot  = document.getElementById('cursorDot');
const ring = document.getElementById('cursorRing');
let mouseX = 0, mouseY = 0, ringX = 0, ringY = 0;

if (matchMedia('(hover:hover) and (pointer:fine)').matches) {
  window.addEventListener('mousemove', e => {
    mouseX = e.clientX; mouseY = e.clientY;
    dot.style.left = mouseX + 'px';
    dot.style.top  = mouseY + 'px';
  });
  (function animRing() {
    ringX += (mouseX - ringX) * 0.12;
    ringY += (mouseY - ringY) * 0.12;
    ring.style.left = ringX + 'px';
    ring.style.top  = ringY + 'px';
    requestAnimationFrame(animRing);
  })();

  document.querySelectorAll('a, button, .skill-card, .project-card, .cert-card, .edu-card').forEach(el => {
    el.addEventListener('mouseenter', () => {
      dot.style.width  = '20px'; dot.style.height = '20px';
      dot.style.background = 'var(--gold)';
      ring.style.width = '54px'; ring.style.height = '54px';
      ring.style.borderColor = 'var(--gold)';
    });
    el.addEventListener('mouseleave', () => {
      dot.style.width  = '10px'; dot.style.height = '10px';
      dot.style.background = 'var(--accent)';
      ring.style.width = '36px'; ring.style.height = '36px';
      ring.style.borderColor = 'var(--accent)';
    });
  });
}

// ── NAV SCROLL ──────────────────────────────────────────
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 20);
}, { passive: true });

// ── MOBILE NAV ──────────────────────────────────────────
const navToggle = document.getElementById('navToggle');
const navLinks  = document.getElementById('navLinks');
let navOpen = false;
if (navToggle) {
  navToggle.addEventListener('click', () => {
    navOpen = !navOpen;
    if (navOpen) {
      navLinks.style.cssText = `
        display:flex;flex-direction:column;position:fixed;top:63px;left:0;right:0;
        background:rgba(246,245,241,0.97);backdrop-filter:blur(16px);
        padding:28px 32px;gap:22px;border-bottom:1px solid #dcdad2;
        box-shadow:0 8px 32px rgba(21,23,28,0.12);z-index:99;
      `;
    } else {
      navLinks.style.cssText = '';
    }
    const spans = navToggle.querySelectorAll('span');
    spans[0].style.transform = navOpen ? 'translateY(7px) rotate(45deg)' : '';
    spans[1].style.opacity   = navOpen ? '0' : '1';
    spans[2].style.transform = navOpen ? 'translateY(-7px) rotate(-45deg)' : '';
  });
  document.querySelectorAll('#navLinks a').forEach(a => {
    a.addEventListener('click', () => {
      navOpen = false;
      navLinks.style.cssText = '';
      navToggle.querySelectorAll('span').forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
    });
  });
}

// ── SCROLL REVEAL ────────────────────────────────────────
const revealEls = document.querySelectorAll('.reveal');
const revealIO  = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      entry.target.style.transitionDelay = (i % 5) * 0.09 + 's';
      entry.target.classList.add('in');
      revealIO.unobserve(entry.target);
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -50px 0px' });
revealEls.forEach(el => revealIO.observe(el));

// ── COUNTER ANIMATION ─────────────────────────────────────
document.querySelectorAll('.fact-num').forEach(el => {
  const counterIO = new IntersectionObserver((entries) => {
    if (!entries[0].isIntersecting) return;
    const target = parseFloat(el.dataset.count);
    const isDecimal = String(target).includes('.');
    const duration = 1500;
    const start = performance.now();
    function tick(now) {
      const t = Math.min((now - start) / duration, 1);
      const e = 1 - Math.pow(1 - t, 4);
      const v = target * e;
      el.textContent = isDecimal ? v.toFixed(2) : Math.round(v);
      if (t < 1) requestAnimationFrame(tick);
      else el.textContent = isDecimal ? target.toFixed(2) : target;
    }
    requestAnimationFrame(tick);
    counterIO.unobserve(el);
  }, { threshold: 0.5 });
  counterIO.observe(el);
});

// ── 3D TILT ON CARDS ─────────────────────────────────────
document.querySelectorAll('.skill-card, .cert-card').forEach(card => {
  card.addEventListener('mousemove', e => {
    const rect = card.getBoundingClientRect();
    const dx = (e.clientX - rect.left - rect.width  / 2) / (rect.width  / 2);
    const dy = (e.clientY - rect.top  - rect.height / 2) / (rect.height / 2);
    card.style.transform = `translateY(-8px) rotateX(${-dy * 7}deg) rotateY(${dx * 7}deg)`;
  });
  card.addEventListener('mouseleave', () => { card.style.transform = ''; });
});

// ── ACTIVE NAV HIGHLIGHT ─────────────────────────────────
const sections   = document.querySelectorAll('section[id], header[id]');
const navLinkEls = document.querySelectorAll('.nav-links a');
new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      navLinkEls.forEach(a => a.classList.remove('active'));
      const active = document.querySelector(`.nav-links a[href="#${entry.target.id}"]`);
      if (active) active.classList.add('active');
    }
  });
}, { rootMargin: '-40% 0px -55% 0px' }).observe && sections.forEach(s =>
  new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting) {
      navLinkEls.forEach(a => a.classList.remove('active'));
      const active = document.querySelector(`.nav-links a[href="#${s.id}"]`);
      if (active) active.classList.add('active');
    }
  }, { rootMargin: '-40% 0px -55% 0px' }).observe(s)
);

// ── PARALLAX ORBS ────────────────────────────────────────
const orb1 = document.querySelector('.orb-1');
const orb2 = document.querySelector('.orb-2');
window.addEventListener('scroll', () => {
  const y = window.scrollY;
  if (orb1) orb1.style.transform = `translateY(${y * 0.15}px)`;
  if (orb2) orb2.style.transform = `translateY(${-y * 0.1}px)`;
}, { passive: true });

// ── FOOTER YEAR ──────────────────────────────────────────
document.getElementById('year').textContent = new Date().getFullYear();
