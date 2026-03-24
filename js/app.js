/* ═══════════════════════════════════════════
   GOATSat · SHARED APP
   js/app.js
═══════════════════════════════════════════ */

/* ── Theme ── */
const THEME_KEY = 'goatsat-theme';

function getTheme() {
  return localStorage.getItem(THEME_KEY) ||
    (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
}

function applyTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  localStorage.setItem(THEME_KEY, theme);
  const btn = document.getElementById('themeBtn');
  if (btn) btn.textContent = theme === 'dark' ? '☽' : '☀';
}

// Init theme immediately (before render to avoid flash)
applyTheme(getTheme());

document.addEventListener('DOMContentLoaded', () => {

  /* ── Theme toggle ── */
  const themeBtn = document.getElementById('themeBtn');
  if (themeBtn) {
    themeBtn.addEventListener('click', () => {
      applyTheme(getTheme() === 'dark' ? 'light' : 'dark');
    });
  }

  /* ── Nav scroll effect ── */
  const nav = document.getElementById('nav');
  if (nav) {
    const onScroll = () => nav.classList.toggle('scrolled', window.scrollY > 60);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* ── Active nav link ── */
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a').forEach(a => {
    const href = a.getAttribute('href');
    if (href === currentPage || (currentPage === '' && href === 'index.html')) {
      a.classList.add('active');
    }
  });

  /* ── Hamburger ── */
  const hamburger = document.querySelector('.nav-hamburger');
  const mobileMenu = document.querySelector('.nav-mobile-menu');
  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', () => {
      const open = hamburger.classList.toggle('open');
      mobileMenu.classList.toggle('open', open);
      document.body.style.overflow = open ? 'hidden' : '';
      hamburger.setAttribute('aria-expanded', String(open));
    });
    // Close on link click
    mobileMenu.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => {
        hamburger.classList.remove('open');
        mobileMenu.classList.remove('open');
        document.body.style.overflow = '';
      });
    });
    // Close on outside click
    document.addEventListener('click', e => {
      if (!hamburger.contains(e.target) && !mobileMenu.contains(e.target)) {
        hamburger.classList.remove('open');
        mobileMenu.classList.remove('open');
        document.body.style.overflow = '';
      }
    });
  }

  /* ── Reveal on scroll ── */
  if ('IntersectionObserver' in window) {
    const revealObs = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('in-view');
          // Don't unobserve so staggered children stay
        }
      });
    }, { threshold: 0.1 });
    document.querySelectorAll('.reveal').forEach(el => revealObs.observe(el));
  } else {
    // Fallback — just show everything
    document.querySelectorAll('.reveal').forEach(el => el.classList.add('in-view'));
  }

  /* ── Starfield ── */
  initStarfield();

});

/* ── Starfield canvas ── */
function initStarfield() {
  const canvas = document.getElementById('starfield');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let W, H;
  const NUM_STARS = 200;
  const stars = [];

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize, { passive: true });

  for (let i = 0; i < NUM_STARS; i++) {
    stars.push({
      x:     Math.random(),
      y:     Math.random(),
      r:     Math.random() * 1.3 + 0.15,
      phase: Math.random() * Math.PI * 2,
      speed: Math.random() * 0.0003 + 0.00008,
    });
  }

  let raf;
  function draw() {
    ctx.clearRect(0, 0, W, H);
    const isDark = document.documentElement.getAttribute('data-theme') !== 'light';
    stars.forEach(s => {
      s.phase += s.speed;
      const alpha = (Math.sin(s.phase) + 1) / 2 * (isDark ? 0.65 : 0.55) + 0.08;
      ctx.beginPath();
      ctx.arc(s.x * W, s.y * H, s.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${isDark ? '168,200,255' : '60,110,220'},${alpha})`;
      ctx.fill();
    });
    raf = requestAnimationFrame(draw);
  }
  draw();

  // Pause when tab hidden
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) cancelAnimationFrame(raf);
    else draw();
  });
}
