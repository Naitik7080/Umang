// Sticky header
const header = document.querySelector('.site-header');
const onScroll = () => {
  if (window.scrollY > 40) header.classList.add('is-scrolled');
  else header.classList.remove('is-scrolled');
};
window.addEventListener('scroll', onScroll);
onScroll();

// Mobile nav
const navToggle = document.querySelector('.nav-toggle');
const mobileNav = document.querySelector('.mobile-nav');
const navScrim = document.querySelector('.nav-scrim');
const mobileClose = document.querySelector('.mobile-close');
function closeNav(){ mobileNav?.classList.remove('open'); navScrim?.classList.remove('open'); }
navToggle?.addEventListener('click', () => { mobileNav.classList.add('open'); navScrim.classList.add('open'); });
mobileClose?.addEventListener('click', closeNav);
navScrim?.addEventListener('click', closeNav);

// Scroll reveal
const revealEls = document.querySelectorAll('.reveal');
const io = new IntersectionObserver((entries) => {
  entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
}, { threshold: 0.15 });
revealEls.forEach(el => io.observe(el));

// Animated counters
const counters = document.querySelectorAll('[data-count]');
const cio = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (!e.isIntersecting) return;
    const el = e.target;
    const target = parseInt(el.dataset.count, 10);
    const suffix = el.dataset.suffix || '';
    let cur = 0;
    const step = Math.max(1, Math.round(target / 60));
    const tick = () => {
      cur += step;
      if (cur >= target) { el.textContent = target.toLocaleString() + suffix; return; }
      el.textContent = cur.toLocaleString() + suffix;
      requestAnimationFrame(tick);
    };
    tick();
    cio.unobserve(el);
  });
}, { threshold: 0.4 });
counters.forEach(el => cio.observe(el));

// Gallery filter (gallery.html)
const filterBtns = document.querySelectorAll('.filter-bar button');
const galleryItems = document.querySelectorAll('.gallery-grid a');
filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const cat = btn.dataset.filter;
    galleryItems.forEach(item => {
      const show = cat === 'all' || item.dataset.cat === cat;
      item.style.display = show ? '' : 'none';
    });
  });
});

// Auth tabs (login.html)
const authTabs = document.querySelectorAll('.auth-tabs button');
const authPanels = document.querySelectorAll('.auth-panel');
authTabs.forEach(tab => {
  tab.addEventListener('click', () => {
    authTabs.forEach(t => t.classList.remove('active'));
    authPanels.forEach(p => p.classList.remove('active'));
    tab.classList.add('active');
    document.getElementById(tab.dataset.target).classList.add('active');
  });
});

// Package toggle (donate.html)
const pkgToggle = document.querySelectorAll('.pkg-toggle button');
pkgToggle.forEach(btn => {
  btn.addEventListener('click', () => {
    pkgToggle.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    document.querySelectorAll('[data-cycle]').forEach(el => {
      el.style.display = el.dataset.cycle === btn.dataset.cycle ? '' : 'none';
    });
  });
});

// Real form submissions (signup/login/contact/donate) are now wired to the
// backend API — see js/config.js and js/api.js.
