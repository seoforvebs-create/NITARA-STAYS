/* ============================================================
   NITARA STAYS — Nav Upgrade Script
   Inspired by matterhornparadise.ch style
   Run once via GitHub to upgrade all pages
   ============================================================ */

(function () {
  'use strict';

  /* ── 1. Inject CSS ── */
  const style = document.createElement('style');
  style.textContent = `
    /* ─── Reset old nav ─── */
    #navbar {
      all: unset;
      position: fixed !important;
      top: 0; left: 0; right: 0;
      z-index: 1000;
      display: flex !important;
      align-items: center;
      justify-content: space-between;
      padding: 0 48px;
      height: 80px;
      background: transparent;
      transition: background 0.4s ease, box-shadow 0.4s ease, height 0.3s ease;
      font-family: var(--font-sans, 'Inter', sans-serif);
    }
    #navbar.scrolled {
      background: rgba(255,255,255,0.97) !important;
      box-shadow: 0 2px 30px rgba(0,0,0,0.10);
      height: 68px;
    }
    #navbar.solid {
      background: rgba(255,255,255,0.97) !important;
      box-shadow: 0 2px 30px rgba(0,0,0,0.08);
    }

    /* ─── Logo ─── */
    .nav-logo {
      font-size: 1.05rem;
      font-weight: 800;
      letter-spacing: 0.22em;
      text-transform: uppercase;
      color: var(--white, #fff);
      text-decoration: none;
      transition: color 0.3s;
      flex-shrink: 0;
      z-index: 2;
    }
    .nav-logo span { color: var(--gold, #C8A96E); }
    #navbar.scrolled .nav-logo,
    #navbar.solid .nav-logo { color: var(--charcoal, #1a1a1a); }

    /* ─── Center Links ─── */
    .nav-links {
      display: flex;
      align-items: center;
      gap: 0;
      list-style: none;
      margin: 0; padding: 0;
      position: absolute;
      left: 50%;
      transform: translateX(-50%);
    }
    .nav-links li { position: relative; }
    .nav-links li a {
      display: block;
      font-size: 0.72rem;
      font-weight: 700;
      letter-spacing: 0.16em;
      text-transform: uppercase;
      color: rgba(255,255,255,0.88);
      text-decoration: none;
      padding: 28px 18px;
      transition: color 0.25s;
      position: relative;
    }
    .nav-links li a::after {
      content: '';
      position: absolute;
      bottom: 20px; left: 18px; right: 18px;
      height: 1px;
      background: var(--gold, #C8A96E);
      transform: scaleX(0);
      transition: transform 0.3s ease;
      transform-origin: left;
    }
    .nav-links li a:hover::after,
    .nav-links li a.active::after { transform: scaleX(1); }
    .nav-links li a:hover { color: var(--white, #fff); }
    #navbar.scrolled .nav-links li a,
    #navbar.solid .nav-links li a { color: var(--charcoal, #1a1a1a); }
    #navbar.scrolled .nav-links li a:hover,
    #navbar.solid .nav-links li a:hover { color: var(--gold, #C8A96E); }
    #navbar.scrolled .nav-links li a::after,
    #navbar.solid .nav-links li a::after { bottom: 16px; }

    /* ─── Dropdown ─── */
    .nav-dropdown {
      position: fixed;
      top: 80px; left: 0; right: 0;
      background: var(--charcoal, #1a1a1a);
      padding: 40px 80px 48px;
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 40px;
      opacity: 0;
      visibility: hidden;
      transform: translateY(-12px);
      transition: opacity 0.3s ease, transform 0.3s ease, visibility 0.3s;
      z-index: 999;
      border-top: 1px solid rgba(200,169,110,0.25);
    }
    #navbar.scrolled ~ .nav-dropdown,
    #navbar.solid ~ .nav-dropdown { top: 68px; }
    .nav-dropdown.open {
      opacity: 1;
      visibility: visible;
      transform: translateY(0);
    }
    .nav-dropdown-col-title {
      font-size: 0.62rem;
      font-weight: 700;
      letter-spacing: 0.22em;
      text-transform: uppercase;
      color: var(--gold, #C8A96E);
      margin-bottom: 18px;
      padding-bottom: 10px;
      border-bottom: 1px solid rgba(255,255,255,0.08);
    }
    .nav-dropdown-col a {
      display: block;
      font-size: 0.85rem;
      color: rgba(255,255,255,0.65);
      text-decoration: none;
      padding: 7px 0;
      transition: color 0.2s, padding-left 0.2s;
      border-bottom: none !important;
    }
    .nav-dropdown-col a:hover { color: var(--gold, #C8A96E); padding-left: 6px; }
    .nav-dropdown-col a::after { display: none !important; }
    .nav-dropdown-overlay {
      position: fixed;
      inset: 0;
      top: 80px;
      background: rgba(0,0,0,0.45);
      z-index: 998;
      opacity: 0;
      visibility: hidden;
      transition: opacity 0.3s;
      backdrop-filter: blur(2px);
    }
    .nav-dropdown-overlay.open { opacity: 1; visibility: visible; }

    /* ─── CTA Button ─── */
    .nav-cta {
      font-size: 0.68rem;
      font-weight: 700;
      letter-spacing: 0.20em;
      text-transform: uppercase;
      color: var(--charcoal, #1a1a1a) !important;
      background: var(--gold, #C8A96E);
      padding: 11px 24px;
      text-decoration: none;
      transition: background 0.25s, transform 0.2s;
      flex-shrink: 0;
      z-index: 2;
      white-space: nowrap;
    }
    .nav-cta:hover { background: #b8955a; transform: translateY(-1px); }
    #navbar:not(.scrolled):not(.solid) .nav-cta {
      background: transparent;
      color: var(--white, #fff) !important;
      border: 1px solid rgba(255,255,255,0.5);
    }
    #navbar:not(.scrolled):not(.solid) .nav-cta:hover {
      background: rgba(255,255,255,0.12);
      border-color: rgba(255,255,255,0.8);
    }

    /* ─── Hamburger ─── */
    .nav-hamburger {
      display: none;
      flex-direction: column;
      gap: 5px;
      background: none;
      border: none;
      cursor: pointer;
      padding: 8px;
      z-index: 1001;
    }
    .nav-hamburger span {
      display: block;
      width: 26px; height: 2px;
      background: var(--white, #fff);
      transition: transform 0.3s, opacity 0.3s, background 0.3s;
      border-radius: 2px;
    }
    #navbar.scrolled .nav-hamburger span,
    #navbar.solid .nav-hamburger span { background: var(--charcoal, #1a1a1a); }
    .nav-hamburger.open span:nth-child(1) { transform: translateY(7px) rotate(45deg); }
    .nav-hamburger.open span:nth-child(2) { opacity: 0; }
    .nav-hamburger.open span:nth-child(3) { transform: translateY(-7px) rotate(-45deg); }

    /* ─── Mobile Panel ─── */
    .nav-mobile-panel {
      position: fixed;
      top: 0; right: 0;
      width: min(360px, 90vw);
      height: 100vh;
      background: var(--charcoal, #1a1a1a);
      z-index: 1002;
      display: flex;
      flex-direction: column;
      padding: 100px 40px 48px;
      transform: translateX(100%);
      transition: transform 0.45s cubic-bezier(0.77,0,0.175,1);
      overflow-y: auto;
    }
    .nav-mobile-panel.open { transform: translateX(0); }
    .nav-mobile-panel a {
      font-size: 0.78rem;
      font-weight: 700;
      letter-spacing: 0.20em;
      text-transform: uppercase;
      color: rgba(255,255,255,0.7);
      text-decoration: none;
      padding: 16px 0;
      border-bottom: 1px solid rgba(255,255,255,0.07);
      transition: color 0.2s, padding-left 0.2s;
      display: block;
    }
    .nav-mobile-panel a:hover { color: var(--gold, #C8A96E); padding-left: 8px; }
    .nav-mobile-panel .mobile-cta {
      margin-top: 36px;
      background: var(--gold, #C8A96E);
      color: var(--charcoal, #1a1a1a) !important;
      text-align: center;
      padding: 16px;
      border-bottom: none;
      font-size: 0.72rem;
    }
    .nav-mobile-panel .mobile-cta:hover { background: #b8955a; padding-left: 0; }
    .nav-mobile-close {
      position: absolute;
      top: 28px; right: 28px;
      background: none;
      border: none;
      cursor: pointer;
      width: 36px; height: 36px;
      display: flex; align-items: center; justify-content: center;
    }
    .nav-mobile-close svg { width: 22px; height: 22px; stroke: rgba(255,255,255,0.6); }
    .nav-mobile-logo {
      position: absolute;
      top: 28px; left: 40px;
      font-size: 0.9rem;
      font-weight: 800;
      letter-spacing: 0.22em;
      color: var(--white, #fff);
      text-decoration: none;
    }
    .nav-mobile-logo span { color: var(--gold, #C8A96E); }
    .nav-overlay {
      position: fixed;
      inset: 0;
      background: rgba(0,0,0,0.55);
      z-index: 1001;
      opacity: 0;
      visibility: hidden;
      transition: opacity 0.4s, visibility 0.4s;
      backdrop-filter: blur(3px);
    }
    .nav-overlay.open { opacity: 1; visibility: visible; }

    /* ─── Responsive ─── */
    @media (max-width: 900px) {
      .nav-links, .nav-cta { display: none !important; }
      .nav-hamburger { display: flex !important; }
      #navbar { padding: 0 24px; }
    }
    @media (max-width: 480px) {
      .nav-mobile-panel { padding: 88px 28px 40px; }
    }
  `;
  document.head.appendChild(style);

  /* ── 2. Build New Navbar HTML ── */
  const navbar = document.getElementById('navbar');
  if (!navbar) return;

  const currentPage = window.location.pathname.split('/').pop() || 'index.html';

  function isActive(page) {
    return currentPage === page ? 'active' : '';
  }

  navbar.innerHTML = `
    <a href="index.html" class="nav-logo">NITARA <span>STAYS</span></a>

    <ul class="nav-links" role="list">
      <li><a href="index.html" class="${isActive('index.html')}">Home</a></li>
      <li>
        <a href="destinations.html" class="${isActive('destinations.html')}" id="nav-dest-trigger">
          Destinations
        </a>
      </li>
      <li><a href="experiences.html" class="${isActive('experiences.html')}">Experiences</a></li>
      <li><a href="gallery.html" class="${isActive('gallery.html')}">Gallery</a></li>
      <li><a href="about.html" class="${isActive('about.html')}">About</a></li>
      <li><a href="contact.html" class="${isActive('contact.html')}">Contact</a></li>
    </ul>

    <a href="booking.html" class="nav-cta">Book Now</a>

    <button class="nav-hamburger" id="nav-hamburger" aria-label="Open menu" aria-expanded="false">
      <span></span><span></span><span></span>
    </button>
  `;

  /* ── 3. Destinations Mega Dropdown ── */
  const dropdown = document.createElement('div');
  dropdown.className = 'nav-dropdown';
  dropdown.id = 'nav-dropdown';
  dropdown.innerHTML = `
    <div class="nav-dropdown-col">
      <p class="nav-dropdown-col-title">Mountain</p>
      <a href="destination-detail.html?id=1">The Dhanachuli House</a>
      <a href="destination-detail.html?id=3">The Summit Suite</a>
      <a href="destination-detail.html?id=4">The Alpine Chalet</a>
      <a href="destination-detail.html?id=5">The Valley Retreat</a>
    </div>
    <div class="nav-dropdown-col">
      <p class="nav-dropdown-col-title">Forest & Village</p>
      <a href="destination-detail.html?id=2">The Forest Terrace</a>
      <a href="destination-detail.html?id=6">The Orchard Cottage</a>
      <a href="destination-detail.html?id=8">The Kumaoni Farmhouse</a>
    </div>
    <div class="nav-dropdown-col">
      <p class="nav-dropdown-col-title">Premium</p>
      <a href="destination-detail.html?id=7">The Ridgeline Studio</a>
      <a href="destination-detail.html?id=9">The Cloud Villa</a>
    </div>
    <div class="nav-dropdown-col">
      <p class="nav-dropdown-col-title">Browse All</p>
      <a href="destinations.html">All Retreats</a>
      <a href="destinations.html?filter=Mountain">Mountain Retreats</a>
      <a href="destinations.html?filter=Forest">Forest Retreats</a>
      <a href="destinations.html?filter=Premium">Premium Collection</a>
    </div>
  `;
  document.body.insertBefore(dropdown, document.body.firstChild.nextSibling);

  const dropOverlay = document.createElement('div');
  dropOverlay.className = 'nav-dropdown-overlay';
  dropOverlay.id = 'nav-dropdown-overlay';
  document.body.insertBefore(dropOverlay, dropdown.nextSibling);

  /* ── 4. Mobile Panel ── */
  const mobilePanel = document.getElementById('nav-mobile-panel');
  if (mobilePanel) {
    mobilePanel.innerHTML = `
      <a href="index.html" class="nav-mobile-logo">NITARA <span>STAYS</span></a>
      <button class="nav-mobile-close" id="nav-mobile-close" aria-label="Close menu">
        <svg viewBox="0 0 24 24" fill="none" stroke-width="1.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
      </button>
      <a href="index.html" class="${isActive('index.html')}">Home</a>
      <a href="destinations.html" class="${isActive('destinations.html')}">Destinations</a>
      <a href="experiences.html" class="${isActive('experiences.html')}">Experiences</a>
      <a href="gallery.html" class="${isActive('gallery.html')}">Gallery</a>
      <a href="about.html" class="${isActive('about.html')}">About</a>
      <a href="contact.html" class="${isActive('contact.html')}">Contact</a>
      <a href="booking.html" class="mobile-cta">Book Your Stay ✦</a>
    `;
  }

  /* ── 5. Scroll Behaviour ── */
  function handleScroll() {
    if (window.scrollY > 40) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }

  // Pages without hero should always be solid
  const solidPages = ['booking.html', 'contact.html', 'about.html', 'gallery.html'];
  if (solidPages.includes(currentPage)) {
    navbar.classList.add('solid');
  } else {
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
  }

  /* ── 6. Dropdown Hover ── */
  const destTrigger = document.getElementById('nav-dest-trigger');
  let dropTimer;

  function openDrop() {
    clearTimeout(dropTimer);
    dropdown.classList.add('open');
    dropOverlay.classList.add('open');
  }
  function closeDrop() {
    dropTimer = setTimeout(() => {
      dropdown.classList.remove('open');
      dropOverlay.classList.remove('open');
    }, 120);
  }

  destTrigger && destTrigger.addEventListener('mouseenter', openDrop);
  destTrigger && destTrigger.addEventListener('mouseleave', closeDrop);
  dropdown.addEventListener('mouseenter', () => clearTimeout(dropTimer));
  dropdown.addEventListener('mouseleave', closeDrop);
  dropOverlay.addEventListener('click', closeDrop);

  /* ── 7. Mobile Toggle ── */
  const hamburger     = document.getElementById('nav-hamburger');
  const navOverlay    = document.getElementById('nav-overlay');
  const mobileClose   = document.getElementById('nav-mobile-close');

  function openMobile() {
    if (!mobilePanel) return;
    mobilePanel.classList.add('open');
    navOverlay && navOverlay.classList.add('open');
    hamburger.classList.add('open');
    hamburger.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  }
  function closeMobile() {
    if (!mobilePanel) return;
    mobilePanel.classList.remove('open');
    navOverlay && navOverlay.classList.remove('open');
    hamburger.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }

  hamburger && hamburger.addEventListener('click', () => {
    mobilePanel && mobilePanel.classList.contains('open') ? closeMobile() : openMobile();
  });
  mobileClose && mobileClose.addEventListener('click', closeMobile);
  navOverlay && navOverlay.addEventListener('click', closeMobile);

  // Close on Escape
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') { closeMobile(); closeDrop(); }
  });

})();
