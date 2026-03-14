/* =============================================
   SQUARED — script.js
   ============================================= */

/* --- Nav: letter-by-letter hover animation --- */
function buildNavLetters() {
  document.querySelectorAll('.nav-link').forEach(link => {
    const text   = link.dataset.text;
    const inner  = link.querySelector('.nav-link-inner');
    const real   = link.querySelector('.nav-link-real');

    if (!text || !inner) return;

    inner.innerHTML = '';

    for (const char of text) {
      const slot = document.createElement('span');
      slot.className = 'nav-letter-slot';

      const top = document.createElement('span');
      top.className = 'nav-letter-top';
      top.textContent = char === ' ' ? '\u00A0' : char;

      const bot = document.createElement('span');
      bot.className = 'nav-letter-bot';
      bot.textContent = char === ' ' ? '\u00A0' : char;

      slot.appendChild(top);
      slot.appendChild(bot);
      inner.appendChild(slot);
    }
  });
}

/* --- Horizontal scroll: silk-smooth lerp pan via RAF --- */
function initHScroll() {
  const outer  = document.querySelector('.hscroll-outer');
  const track  = document.querySelector('.hscroll-track');
  const dots   = document.querySelectorAll('.hscroll-dot');
  const dotsEl = document.querySelector('.hscroll-dots');
  const hint   = document.querySelector('.hscroll-hint');
  if (!outer || !track) return;

  // Mobile: layout stacks vertically, no JS needed
  if (window.innerWidth <= 768) return;

  const PANELS      = 4;
  const LIGHT       = new Set([1, 2, 3]); // 0-indexed panels with light backgrounds
  const LERP_FACTOR = 0.09;               // lower = smoother / more lag; 0.09 = silk

  let targetX   = 0;
  let currentX  = 0;
  let hintFaded = false;
  let rafId     = null;

  /* Map vertical scroll progress → target horizontal offset */
  function calcTargetX() {
    const rect        = outer.getBoundingClientRect();
    const scrolled    = -rect.top;
    const totalScroll = outer.offsetHeight - window.innerHeight;
    const progress    = Math.max(0, Math.min(1, scrolled / totalScroll));
    return progress * (PANELS - 1) * window.innerWidth;
  }

  /* Sync dot states to current x position */
  function updateDots(x) {
    const active = Math.round(x / window.innerWidth);
    dots.forEach((dot, i) => dot.classList.toggle('hscroll-dot--active', i === active));
    if (dotsEl) dotsEl.classList.toggle('is-light', LIGHT.has(active));
  }

  /* Animation loop — runs only while track is in motion */
  function tick() {
    targetX       = calcTargetX();
    const delta   = targetX - currentX;

    /* Lerp toward target */
    currentX += delta * LERP_FACTOR;

    /* Snap to exact value to avoid infinite micro-drift */
    if (Math.abs(delta) < 0.3) currentX = targetX;

    track.style.transform = `translateX(${-currentX}px)`;
    updateDots(currentX);

    /* Fade hint on first scroll movement */
    if (!hintFaded && currentX > 50) {
      if (hint) hint.style.opacity = '0';
      hintFaded = true;
    }

    /* Keep looping while animating; stop when settled */
    if (Math.abs(delta) > 0.3) {
      rafId = requestAnimationFrame(tick);
    } else {
      rafId = null;
    }
  }

  /* Scroll triggers RAF loop (avoids running at 60fps when idle) */
  window.addEventListener('scroll', () => {
    if (!rafId) rafId = requestAnimationFrame(tick);
  }, { passive: true });

  /* Initial render */
  tick();
}

/* --- Folder flip: click to open one folder at a time --- */
function initFolders() {
  const folders = document.querySelectorAll('.folder');
  if (!folders.length) return;

  // Skip on mobile — all folders shown open via CSS
  if (window.innerWidth <= 768) return;

  folders.forEach(folder => {
    folder.addEventListener('click', () => {
      // Already open — do nothing
      if (folder.classList.contains('is-open')) return;

      // Close every folder, then open the clicked one
      folders.forEach(f => f.classList.remove('is-open'));
      folder.classList.add('is-open');
    });
  });
}

/* --- Problem section: count-up animation on scroll into view --- */
function initProbCountUp() {
  const stats = document.querySelectorAll('.prob-stat[data-count]');
  if (!stats.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;

      const el     = entry.target;
      const target = parseInt(el.dataset.count, 10);
      const suffix = el.dataset.suffix || '';
      const dur    = 2000;
      const start  = performance.now();

      function tick(now) {
        const elapsed  = now - start;
        const progress = Math.min(elapsed / dur, 1);
        // ease-out cubic
        const eased    = 1 - Math.pow(1 - progress, 3);
        el.textContent = Math.round(eased * target) + suffix;
        if (progress < 1) requestAnimationFrame(tick);
      }

      requestAnimationFrame(tick);
      observer.unobserve(el);
    });
  }, { threshold: 0.4 });

  stats.forEach(stat => observer.observe(stat));
}

/* --- Programs accordion: toggle expanded state --- */
function initPrograms() {
  const items = document.querySelectorAll('.prog-item');
  if (!items.length) return;

  items.forEach(item => {
    const row = item.querySelector('.prog-row');
    row.addEventListener('click', () => {
      const isOpen = item.classList.contains('prog-item--expanded');
      items.forEach(i => i.classList.remove('prog-item--expanded'));
      if (!isOpen) item.classList.add('prog-item--expanded');
    });
  });
}

/* --- Mobile menu: hamburger open / close --- */
function initMobileMenu() {
  const hamburger = document.getElementById('navHamburger');
  const menu      = document.getElementById('mobileMenu');
  const closeBtn  = document.getElementById('mobileMenuClose');
  if (!hamburger || !menu) return;

  function openMenu() {
    menu.classList.add('is-open');
    menu.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeMenu() {
    menu.classList.remove('is-open');
    menu.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  hamburger.addEventListener('click', openMenu);
  if (closeBtn) closeBtn.addEventListener('click', closeMenu);

  /* Close when any menu link is tapped */
  menu.querySelectorAll('.mobile-menu-link, .mobile-menu-cta').forEach(link => {
    link.addEventListener('click', closeMenu);
  });

  /* Close on Escape key */
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeMenu();
  });
}

/* --- Events page: countdown timer to March 31 2025 --- */
function initCountdown() {
  const daysEl  = document.getElementById('cdDays');
  const hoursEl = document.getElementById('cdHours');
  const minsEl  = document.getElementById('cdMins');
  if (!daysEl || !hoursEl || !minsEl) return;

  const target = new Date('2025-03-31T00:00:00');

  function pad(n) { return String(n).padStart(2, '0'); }

  function update() {
    const diff = target - new Date();

    if (diff <= 0) {
      daysEl.textContent  = '00';
      hoursEl.textContent = '00';
      minsEl.textContent  = '00';
      return;
    }

    const days  = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const mins  = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

    daysEl.textContent  = pad(days);
    hoursEl.textContent = pad(hours);
    minsEl.textContent  = pad(mins);
  }

  update();
  setInterval(update, 60000); // refresh every minute
}

/* --- Community page: role expand toggles --- */
function initRoleToggles() {
  const toggles = document.querySelectorAll('.cm-rp-toggle');
  if (!toggles.length) return;

  toggles.forEach(btn => {
    btn.addEventListener('click', () => {
      const group  = btn.closest('.cm-rp-group');
      const panel  = group.querySelector('.cm-rp-expand');
      const isOpen = panel.classList.contains('cm-rp-expand--open');

      panel.classList.toggle('cm-rp-expand--open', !isOpen);
      btn.setAttribute('aria-expanded', String(!isOpen));
      btn.textContent = isOpen ? "What's this role? ↓" : 'Close ↑';
    });
  });
}

/* --- Join page: FAQ accordion --- */
function initFaqAccordion() {
  const items = document.querySelectorAll('.jnfaq-item');
  if (!items.length) return;

  items.forEach(item => {
    const btn    = item.querySelector('.jnfaq-q');
    const answer = item.querySelector('.jnfaq-a');
    if (!btn || !answer) return;

    btn.addEventListener('click', () => {
      const isOpen = item.classList.contains('jnfaq-item--open');

      /* Close all others */
      items.forEach(other => {
        other.classList.remove('jnfaq-item--open');
        other.querySelector('.jnfaq-q').setAttribute('aria-expanded', 'false');
        other.querySelector('.jnfaq-a').hidden = true;
      });

      /* Toggle clicked item */
      if (!isOpen) {
        item.classList.add('jnfaq-item--open');
        btn.setAttribute('aria-expanded', 'true');
        answer.hidden = false;
      }
    });
  });
}

/* --- Comparison table mobile tab switcher --- */
function initCmpTabs() {
  const tabs   = document.querySelectorAll('.cmp-tab');
  const panels = document.querySelectorAll('.cmp-panel');

  if (!tabs.length) return;

  function switchTab(target) {
    /* Update tab active states */
    tabs.forEach(t => t.classList.remove('cmp-tab--active'));
    const activeTab = document.querySelector(`.cmp-tab[data-tab="${target}"]`);
    if (activeTab) activeTab.classList.add('cmp-tab--active');

    /* Show/hide panels via inline style — bypasses all CSS cascade issues */
    panels.forEach(p => { p.style.display = 'none'; });
    const activePanel = document.querySelector(`.cmp-panel[data-panel="${target}"]`);
    if (activePanel) {
      activePanel.style.display = 'block';
    }
  }

  /* Set initial state via JS to be consistent */
  switchTab('core');

  tabs.forEach(tab => {
    tab.addEventListener('click', () => switchTab(tab.dataset.tab));
  });
}

document.addEventListener('DOMContentLoaded', () => {
  buildNavLetters();
  initHScroll();
  initFolders();
  initProbCountUp();
  initPrograms();
  initMobileMenu();
  initCountdown();
  initRoleToggles();
  initFaqAccordion();
  initCmpTabs();
});
