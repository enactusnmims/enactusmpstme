/* ENACTUS MPSTME shared.js v4 - GSAP + scroll spy + nav effects */

function toggleNav() {
  const nav = document.getElementById('navLinks');
  const ham = document.querySelector('.nav-hamburger');
  if (!nav || !ham) return;
  nav.classList.toggle('open');
  ham.classList.toggle('active');
}


document.addEventListener('DOMContentLoaded', () => {


  const navLinks = document.getElementById('navLinks');
  const ham = document.querySelector('.nav-hamburger');

  if (navLinks) {
    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', (e) => {
        const isMobile = window.innerWidth <= 768;
        const isDropdown = link.parentElement.classList.contains('nav-dropdown');
        
        if (isMobile && isDropdown) {
          e.preventDefault();
          link.parentElement.classList.toggle('active');
          return;
        }

        navLinks.classList.remove('open');
        if (ham) ham.classList.remove('active');
      });
    });
  }

  // Click outside to close
  document.addEventListener('click', (e) => {
    if (navLinks && navLinks.classList.contains('open') && !navLinks.contains(e.target) && ham && !ham.contains(e.target)) {
      navLinks.classList.remove('open');
      ham.classList.remove('active');
    }
  });
});

function initScrollProgress() {
  const bar = document.createElement('div');
  bar.className = 'scroll-progress';
  bar.innerHTML = '<div class="scroll-progress-fill" id="scrollFill"></div>';
  document.body.insertBefore(bar, document.body.firstChild);
  const fill = document.getElementById('scrollFill');
  window.addEventListener('scroll', () => {
    const total = document.documentElement.scrollHeight - window.innerHeight;
    fill.style.width = (total > 0 ? (window.scrollY / total) * 100 : 0) + '%';
  }, { passive: true });
}

function initNavScroll() {
  const nav = document.querySelector('.nav');
  if (!nav) return;
  window.addEventListener('scroll', () => { nav.classList.toggle('scrolled', window.scrollY > 60); }, { passive: true });
}

function initFallbackReveal() {
  const els = document.querySelectorAll('.reveal,.reveal-left,.reveal-right,.reveal-scale,.stagger-child');
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.style.transition = 'opacity 0.7s ease, transform 0.7s cubic-bezier(0.34,1.56,0.64,1)';
        e.target.style.opacity = '1'; e.target.style.transform = 'none';
        obs.unobserve(e.target);
      }
    });
  }, { threshold: 0.08 });
  els.forEach(el => obs.observe(el));
  document.querySelectorAll('.hero-title,.hero-badge,.hero-desc,.hero-actions,.hero-stats-row,.hero-right').forEach((el, i) => {
    if (!el) return;
    el.style.opacity = '0'; el.style.transform = 'translateY(20px)';
    setTimeout(() => {
      el.style.transition = 'opacity 0.8s ease, transform 0.8s cubic-bezier(0.34,1.56,0.64,1)';
      el.style.opacity = '1'; el.style.transform = 'none';
    }, 80 + i * 50);
  });
}

function initGSAP() {
  if (typeof gsap === 'undefined') { initFallbackReveal(); return; }
  gsap.registerPlugin(ScrollTrigger);
  
  // Premium Blur Reveal
  document.querySelectorAll('.reveal').forEach(el => gsap.fromTo(el, { opacity:0, y:40, filter:'blur(10px)' }, { opacity:1, y:0, filter:'blur(0px)', duration:1.2, ease:'expo.out', scrollTrigger:{ trigger:el, start:'top 88%', toggleActions:'play none none none' } }));
  document.querySelectorAll('.reveal-left').forEach(el => gsap.fromTo(el, { opacity:0, x:-50, filter:'blur(8px)' }, { opacity:1, x:0, filter:'blur(0px)', duration:1.2, ease:'expo.out', scrollTrigger:{ trigger:el, start:'top 88%', toggleActions:'play none none none' } }));
  document.querySelectorAll('.reveal-right').forEach(el => gsap.fromTo(el, { opacity:0, x:50, filter:'blur(8px)' }, { opacity:1, x:0, filter:'blur(0px)', duration:1.2, ease:'expo.out', scrollTrigger:{ trigger:el, start:'top 88%', toggleActions:'play none none none' } }));
  document.querySelectorAll('.reveal-scale').forEach(el => gsap.fromTo(el, { opacity:0, scale:0.85, filter:'blur(10px)' }, { opacity:1, scale:1, filter:'blur(0px)', duration:1.2, ease:'expo.out', scrollTrigger:{ trigger:el, start:'top 88%', toggleActions:'play none none none' } }));
  
  // Staggered Items
  document.querySelectorAll('[data-stagger]').forEach(parent => {
    const children = parent.querySelectorAll('.stagger-child');
    if (!children.length) return;
    gsap.fromTo(children, { opacity:0, y:30, filter:'blur(6px)' }, { opacity:1, y:0, filter:'blur(0px)', duration:1, stagger:0.05, ease:'expo.out', scrollTrigger:{ trigger:parent, start:'top 85%', toggleActions:'play none none none' } });
  });
  
  // Hero entrance (Ultra Premium)
  const heroEls = ['.hero-badge','.hero-title','.hero-desc','.hero-actions','.hero-stats-row'].map(s => document.querySelector(s)).filter(Boolean);
  if (heroEls.length) gsap.fromTo(heroEls, { opacity:0, y:40, filter:'blur(12px)' }, { opacity:1, y:0, filter:'blur(0px)', duration:1.4, stagger:0.05, ease:'expo.out', delay:0.2 });
  const rightCards = document.querySelectorAll('.hero-project-card');
  if (rightCards.length) gsap.fromTo(rightCards, { opacity:0, x:40, filter:'blur(10px)' }, { opacity:1, x:0, filter:'blur(0px)', duration:1.2, stagger:0.05, ease:'expo.out', delay:0.6 });
  
  // Impact counters and Count Up
  document.querySelectorAll('.impact-num').forEach(el => {
    ScrollTrigger.create({ trigger:el, start:'top 90%', once:true, onEnter:() => gsap.fromTo(el, { scale:0.5, opacity:0 }, { scale:1, opacity:1, duration:1, ease:'elastic.out(1, 0.5)' }) });
  });

  document.querySelectorAll('.count-up').forEach(el => {
    const target = parseInt(el.getAttribute('data-target'), 10) || 0;
    ScrollTrigger.create({
      trigger: el,
      start: 'top 90%',
      once: true,
      onEnter: () => {
        gsap.to({ val: 0 }, {
          val: target,
          duration: 1.5,
          ease: 'power1.out',
          onUpdate: function() {
            el.innerText = Math.floor(this.targets()[0].val);
          }
        });
      }
    });
  });

  // Removed Pinned Horizontal Gallery
}

function initOrganicImpact() {
  const orbs = document.querySelectorAll('.orb');
  if (!orbs.length || typeof gsap === 'undefined') return;

  orbs.forEach((orb, i) => {
    gsap.to(orb, {
      x: "random(-100, 100)",
      y: "random(-100, 100)",
      rotation: "random(-45, 45)",
      scale: "random(0.8, 1.2)",
      duration: "random(10, 20)",
      ease: "sine.inOut",
      repeat: -1,
      yoyo: true,
      delay: i * 2
    });
  });
}

function initTilt() {
  // Advanced 3D Tilt for cards
  const cards = document.querySelectorAll('.project-card, .team-card, .info-card');
  cards.forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateX = ((y - centerY) / centerY) * -4; // Max 4deg tilt
      const rotateY = ((x - centerX) / centerX) * 4;
      
      gsap.to(card, {
        rotateX: rotateX,
        rotateY: rotateY,
        transformPerspective: 1000,
        ease: 'expo.out',
        duration: 0.4
      });
    });
    
    card.addEventListener('mouseleave', () => {
      gsap.to(card, { rotateX: 0, rotateY: 0, duration: 0.9, ease: 'expo.out' });
    });
  });
}

function initMagnetic() {
  document.querySelectorAll('.btn-yellow,.nav-cta').forEach(btn => {
    btn.addEventListener('mousemove', e => {
      const r = btn.getBoundingClientRect();
      const x = (e.clientX - r.left - r.width/2) * 0.4;
      const y = (e.clientY - r.top - r.height/2) * 0.4;
      gsap.to(btn, { x: x, y: y, duration: 0.3, ease: 'expo.out' });
    });
    btn.addEventListener('mouseleave', () => { 
      gsap.to(btn, { x: 0, y: 0, duration: 0.9, ease: 'expo.out' });
    });
  });
}

function initCustomCursor() {
  const cursor = document.createElement('div');
  cursor.className = 'custom-cursor';
  document.body.appendChild(cursor);

  let mouseX = window.innerWidth / 2, mouseY = window.innerHeight / 2;
  let cursorX = mouseX, cursorY = mouseY;
  
  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX; mouseY = e.clientY;
  });

  gsap.ticker.add(() => {
    cursorX += (mouseX - cursorX) * 0.35;
    cursorY += (mouseY - cursorY) * 0.35;
    gsap.set(cursor, { x: cursorX, y: cursorY });
  });

  document.querySelectorAll('a, button, .nav-hamburger, .project-card, .team-card, .info-card, input, textarea').forEach(el => {
    el.addEventListener('mouseenter', () => cursor.classList.add('hover'));
    el.addEventListener('mouseleave', () => cursor.classList.remove('hover'));
  });
}

function initPageTransitions() {
  const shutter = document.createElement('div');
  shutter.className = 'page-shutter';
  document.body.appendChild(shutter);
  
  const pageContent = document.querySelector('.page-content');
  
  document.querySelectorAll('a[href]:not([target="_blank"]):not([href^="mailto:"]):not([href^="tel:"])').forEach(link => {
    link.addEventListener('click', (e) => {
      const target = link.getAttribute('href');
      
      if (e.ctrlKey || e.metaKey) return;
      
      if (target.includes('#')) {
        const parts = target.split('#');
        const isSamePage = parts[0] === '' || window.location.pathname.includes(parts[0]);
        if (isSamePage) {
          e.preventDefault();
          const hashId = parts[1];
          const targetEl = document.getElementById(hashId);
          if (targetEl && typeof lenisInstance !== 'undefined' && lenisInstance) {
            lenisInstance.scrollTo(targetEl, { offset: -80, duration: 1.2, easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)) });
          } else if (targetEl) {
            targetEl.scrollIntoView({ behavior: 'smooth' });
          }
          const navLinks = document.getElementById('navLinks');
          if (navLinks && navLinks.classList.contains('open')) toggleNav();
          return;
        }
      }
      
      e.preventDefault();
      
      const tl = gsap.timeline({ onComplete: () => window.location.href = target });
      if (pageContent) {
        tl.to(pageContent, { 
          opacity: 0, 
          filter: 'blur(20px)', 
          scale: 0.98, 
          duration: 0.5, 
          ease: 'power2.inOut' 
        });
      }
    });
  });
  
  // Entrance: Glass shutter slides down to reveal content
  // Note: Shutter starts at top: 0 and content at opacity: 0 via CSS to prevent flickering
  const tlIn = gsap.timeline({ delay: 0.1 });
  
  tlIn.to(shutter, { 
    top: '100%', 
    duration: 1.1, 
    ease: 'expo.inOut' 
  });
  
  if (pageContent) {
    tlIn.to(pageContent, 
      { opacity: 1, filter: 'blur(0px)', y: 0, duration: 0.9, ease: 'expo.out' },
      0.3
    );
  }
}

function initCinematicText() {
  if (typeof SplitType === 'undefined') return;
  document.querySelectorAll('.cinematic-text').forEach(title => {
    const text = new SplitType(title, { types: 'lines, words' });
    // Wrap lines for overflow hidden
    text.lines.forEach(line => {
      const wrapper = document.createElement('div');
      wrapper.style.overflow = 'hidden';
      wrapper.style.display = 'block'; // ensure block context for lines
      wrapper.style.paddingBottom = '16px'; // Prevent descender clipping (like 'g')
      wrapper.style.marginBottom = '-16px';
      line.parentNode.insertBefore(wrapper, line);
      wrapper.appendChild(line);
    });
    gsap.from(text.lines, {
      y: '100%', opacity: 0, duration: 1.2, stagger: 0.05, ease: 'expo.out',
      scrollTrigger: { trigger: title, start: 'top 85%' }
    });
  });
}

function initParallax() {
  document.querySelectorAll('.page-hero-bg').forEach(bg => {
    gsap.to(bg, {
      yPercent: 30, ease: 'none',
      scrollTrigger: { trigger: bg.closest('.page-hero'), start: 'top top', end: 'bottom top', scrub: true }
    });
  });
}

function initProjectFilter() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const items = document.querySelectorAll('.filter-item');
  if (!filterBtns.length || typeof Flip === 'undefined') return;

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      // Toggle Active Class
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');
      const state = Flip.getState(items);

      items.forEach(item => {
        const cat = item.getAttribute('data-category');
        if (filter === 'all' || cat === filter) {
          item.style.display = 'block';
        } else {
          item.style.display = 'none';
        }
      });

      Flip.from(state, {
        duration: 0.6,
        ease: 'expo.out',
        scale: true,
        absolute: true,
        onEnter: elements => gsap.fromTo(elements, {opacity: 0, scale: 0.9}, {opacity: 1, scale: 1, duration: 0.4, ease: 'expo.out', stagger: 0.05}),
        onLeave: elements => gsap.to(elements, {opacity: 0, scale: 0.9, duration: 0.3, ease: 'expo.out'})
      });
    });
  });
}

function initFaq() {
  document.querySelectorAll('.faq-q').forEach(btn => {
    btn.addEventListener('click', () => {
      const item = btn.closest('.faq-item');
      const isOpen = item.classList.contains('open');
      document.querySelectorAll('.faq-item.open').forEach(i => i.classList.remove('open'));
      if (!isOpen) item.classList.add('open');
    });
  });
}

function initScrollSpy() {
  const items = document.querySelectorAll('.timeline-item[id]');
  const navItems = document.querySelectorAll('.timeline-nav-item');
  if (!items.length || !navItems.length) return;
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) { const id = e.target.id; navItems.forEach(n => n.classList.toggle('active', n.dataset.target === id)); } });
  }, { rootMargin:'-20% 0px -65% 0px', threshold:0 });
  items.forEach(el => obs.observe(el));
  navItems.forEach(n => { n.addEventListener('click', () => { const t = document.getElementById(n.dataset.target); if(t) t.scrollIntoView({ behavior:'smooth', block:'start' }); }); });
}

function submitForm() {
  const fields = ['ffname', 'flname', 'femail', 'forg', 'finterest', 'fmessage'];
  const data = {};
  let valid = true;

  fields.forEach(id => {
    const el = document.getElementById(id);
    if (!el) return;
    if (el.required || id === 'femail' || id === 'ffname') {
      if (!el.value.trim()) valid = false;
    }
    data[id] = el.value.trim();
  });

  if (!valid) {
    alert('Please fill in at least your name and email.');
    return;
  }

  // Save to "backend" (localStorage)
  const submissions = JSON.parse(localStorage.getItem('enactus_submissions') || '[]');
  data.id = Date.now();
  data.date = new Date().toLocaleString();
  data.status = 'new';
  submissions.unshift(data);
  localStorage.setItem('enactus_submissions', JSON.stringify(submissions));

  const msg = document.getElementById('formSuccess');
  if (msg) {
    msg.style.display = 'block';
    fields.forEach(id => { const el = document.getElementById(id); if (el) el.value = ''; });
    const sel = document.getElementById('finterest'); if (sel) sel.selectedIndex = 0;
    setTimeout(() => { msg.style.display = 'none'; }, 6000);
  }
}

// --- ADMIN LOGIC ---
const ADMIN_PASS = "admin123"; // Default password as requested

function checkAuth() {
  if (sessionStorage.getItem('enactus_admin_auth') !== 'true') {
    window.location.href = 'login.html';
  }
}

function login(pass) {
  if (pass === ADMIN_PASS) {
    sessionStorage.setItem('enactus_admin_auth', 'true');
    window.location.href = 'admin.html';
    return true;
  }
  return false;
}

function logout() {
  sessionStorage.removeItem('enactus_admin_auth');
  window.location.href = 'login.html';
}

function getSubmissions() {
  return JSON.parse(localStorage.getItem('enactus_submissions') || '[]');
}

function updateSubmission(id, updates) {
  const subs = getSubmissions();
  const index = subs.findIndex(s => s.id === id);
  if (index !== -1) {
    subs[index] = { ...subs[index], ...updates };
    localStorage.setItem('enactus_submissions', JSON.stringify(subs));
    return true;
  }
  return false;
}

function deleteSubmission(id) {
  const subs = getSubmissions();
  const filtered = subs.filter(s => s.id !== id);
  localStorage.setItem('enactus_submissions', JSON.stringify(filtered));
}

function initHistoryTimeline() {
  const body = document.querySelector('.timeline-body');
  if (!body || typeof gsap === 'undefined') return;

  const line = document.createElement('div');
  line.className = 'timeline-draw-line';
  line.style.position = 'absolute';
  line.style.left = '0';
  line.style.top = '8px';
  line.style.bottom = '8px';
  line.style.width = '2px';
  line.style.background = 'var(--yellow)';
  line.style.transformOrigin = 'top';
  line.style.transform = 'scaleY(0)';
  line.style.boxShadow = '0 0 10px rgba(255, 209, 0, 0.5)';
  
  body.appendChild(line);
  
  gsap.to(line, {
    scaleY: 1,
    ease: 'none',
    scrollTrigger: {
      trigger: body,
      start: 'top 60%',
      end: 'bottom 80%',
      scrub: true
    }
  });
}

function enhanceTeamCards() {
  document.querySelectorAll('.team-card').forEach(card => {
    // Background image
    const bg = document.createElement('div');
    bg.className = 'team-bg';
    // Abstract pattern or placeholder
    bg.style.backgroundImage = `url('data:image/svg+xml,%3Csvg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"%3E%3Crect width="100" height="100" fill="%23050505"/%3E%3Ccircle cx="50" cy="50" r="40" fill="%23FFD100" opacity="0.05"/%3E%3C/svg%3E')`;
    
    // Overlay
    const overlay = document.createElement('div');
    overlay.className = 'team-overlay glass';
    
    const linkedin = document.createElement('a');
    linkedin.className = 'team-social';
    linkedin.href = '#';
    linkedin.innerText = 'in';
    
    const quote = document.createElement('div');
    quote.className = 'team-quote';
    quote.innerText = `"Dedicated to driving sustainable impact."`;
    
    overlay.appendChild(linkedin);
    overlay.appendChild(quote);
    
    card.insertBefore(bg, card.firstChild);
    card.appendChild(overlay);
  });
}

let lenisInstance = null;

document.addEventListener('DOMContentLoaded', () => {
  initScrollProgress(); initNavScroll(); initFaq(); initScrollSpy(); enhanceTeamCards();
  
  const scriptsToLoad = [
    'https://unpkg.com/split-type',
    'https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js'
  ];
  
  let loadedCount = 0;
  
  function initializeAdvanced() {
    if (false) { // Lenis removed — using native scroll for performance

      // Handle alumni/history sidebar scrolling
      document.querySelectorAll('.timeline-nav-item, .alumni-nav-item').forEach(item => {
        item.addEventListener('click', () => {
          const targetId = item.getAttribute('data-target');
          if (targetId) {
            const targetEl = document.getElementById(targetId);
            if (targetEl) {
              lenisInstance.scrollTo(targetEl, { offset: -100, duration: 1.5, easing: (t) => 1 - Math.pow(1 - t, 4) });
              
              // Update active state
              const siblings = item.parentElement.querySelectorAll('.timeline-nav-item, .alumni-nav-item');
              siblings.forEach(s => s.classList.remove('active'));
              item.classList.add('active');
            }
          }
        });
      });

      // Handle direct hash navigation on page load
      if (window.location.hash) {
        setTimeout(() => {
          const el = document.getElementById(window.location.hash.substring(1));
          if (el) lenisInstance.scrollTo(el, { offset: -80, immediate: true });
        }, 100);
      }
    }
    
    const stScript = document.createElement('script');
    stScript.src = 'https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/ScrollTrigger.min.js';
    stScript.onload = () => {
      const flipScript = document.createElement('script');
      flipScript.src = 'https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/Flip.min.js';
      flipScript.onload = () => {
        // Native scroll — no Lenis override
        ScrollTrigger.refresh();

        initGSAP(); initTilt(); initMagnetic(); initCustomCursor(); 
        initPageTransitions(); initCinematicText(); initParallax(); initProjectFilter();
        initHistoryTimeline(); initOrganicImpact();
      };
      document.head.appendChild(flipScript);
    };
    document.head.appendChild(stScript);
  }

  scriptsToLoad.forEach(src => {
    const s = document.createElement('script');
    s.src = src;
    s.onload = () => {
      loadedCount++;
      if (loadedCount === scriptsToLoad.length) initializeAdvanced();
    };
    document.head.appendChild(s);
  });
});
