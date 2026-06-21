// Nav scroll state
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 20);
});

// Mobile nav toggle
const navToggle = document.getElementById('navToggle');
const navLinksEl = document.querySelector('.nav-links');
if (navToggle) {
  navToggle.addEventListener('click', () => {
    navLinksEl.style.display = navLinksEl.style.display === 'flex' ? 'none' : 'flex';
    navLinksEl.style.cssText += 'flex-direction:column;position:fixed;top:64px;left:0;right:0;background:#f6f5f1;padding:24px 32px;gap:20px;border-bottom:1px solid #dcdad2;';
  });
  document.querySelectorAll('.nav-links a').forEach(a => {
    a.addEventListener('click', () => { navLinksEl.style.display = 'none'; });
  });
}

// Custom cursor dot (desktop only)
const cursorDot = document.getElementById('cursorDot');
if (cursorDot && matchMedia('(hover:hover) and (pointer:fine)').matches) {
  window.addEventListener('mousemove', e => {
    cursorDot.style.left = e.clientX + 'px';
    cursorDot.style.top = e.clientY + 'px';
  });
  document.querySelectorAll('a, button').forEach(el => {
    el.addEventListener('mouseenter', () => { cursorDot.style.width = '18px'; cursorDot.style.height = '18px'; });
    el.addEventListener('mouseleave', () => { cursorDot.style.width = '8px'; cursorDot.style.height = '8px'; });
  });
}

// Scroll reveal
const revealEls = document.querySelectorAll('.reveal');
const io = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('in');
      io.unobserve(entry.target);
    }
  });
}, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });
revealEls.forEach((el, i) => {
  el.style.transitionDelay = (i % 6) * 0.06 + 's';
  io.observe(el);
});

// Animated counters
const counters = document.querySelectorAll('.fact-num');
const counterIO = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const el = entry.target;
    const target = parseFloat(el.dataset.count);
    const isDecimal = String(target).includes('.');
    const duration = 1200;
    const start = performance.now();
    function tick(now) {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const value = target * eased;
      el.textContent = isDecimal ? value.toFixed(1) : Math.round(value);
      if (progress < 1) requestAnimationFrame(tick);
      else el.textContent = isDecimal ? target.toFixed(1) : target;
    }
    requestAnimationFrame(tick);
    counterIO.unobserve(el);
  });
}, { threshold: 0.5 });
counters.forEach(c => counterIO.observe(c));

// Footer year
document.getElementById('year').textContent = new Date().getFullYear();
