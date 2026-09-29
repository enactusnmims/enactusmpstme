(function(){
  const sec = document.getElementById('gallery'); 
  if(!sec) return;
  const board = sec.querySelector('#gBoard');
  const lb = sec.querySelector('#lb');
  const img = lb.querySelector('.lb-img');
  const cap = lb.querySelector('.lb-cap');
  const rots = [-2, 1.5, -1, 2, -1.6, 1.1, -.8, 1.8];
  const reduce = matchMedia('(prefers-reduced-motion:reduce)').matches;
  
  let all = [], list = [], cur = 0, opener = null;

  // Render HTML from gallerySections
  if (typeof gallerySections !== 'undefined') {
    let boardHTML = '';
    
    gallerySections.forEach(section => {
      // Render section header
      boardHTML += `<div class="g-sec-head">
        <h3 class="g-sec-title">${section.title}</h3>
        <span class="g-sec-note">${section.note}</span>
      </div>`;
      
      // Render prints
      section.items.forEach((item, index) => {
        // First row of first section doesn't get lazy loading
        const isEager = (section.id === gallerySections[0].id && index < 4);
        const loading = isEager ? '' : 'loading="lazy"';
        
        // Add item to all array for lightbox logic
        all.push({ ...item, cat: section.id });
        
        const cls = section.layout === 'portrait' ? 'print print-portrait' : 'print';
        
        boardHTML += `
        <figure class="${cls}" data-cat="${section.id}" data-full="${item.full}" tabindex="0" role="button" aria-label="Open ${item.alt}">
          <img src="${item.thumb}" alt="${item.alt}" ${loading} width="${item.w}" height="${item.h}">
          <figcaption><b>${item.caption}</b><span>${item.meta}</span></figcaption>
        </figure>`;
      });
    });
    
    board.innerHTML = boardHTML;
  }
  
  const prints = [...sec.querySelectorAll('.print')];

  function apply(){
    let n = 0;
    prints.forEach(p => {
      p.style.setProperty('--rot', rots[n % rots.length] + 'deg');
      p.style.setProperty('--i', n);
      if(!reduce){
        void p.offsetWidth;
        p.classList.add('drop');
      }
      n++;
    });
    list = prints;
  }
  apply();

  /* first-scroll drop-in */
  if(!reduce && 'IntersectionObserver' in window){
    sec.classList.add('armed');
    prints.forEach(p => p.classList.remove('drop'));
    new IntersectionObserver((e, o) => { 
      if(e[0].isIntersecting){ 
        sec.classList.add('in');
        prints.forEach(p => { 
          void p.offsetWidth; 
          p.classList.add('drop');
        });
        o.disconnect();
      } 
    }, {threshold: .1}).observe(board);
  }

  function show(i){
    cur = (i + list.length) % list.length;
    const p = list[cur];
    img.src = p.dataset.full; 
    img.alt = p.querySelector('img').alt;
    img.style.animation = 'none'; 
    void img.offsetWidth; 
    img.style.animation = '';
    cap.querySelector('b').textContent = p.querySelector('b').textContent;
    cap.querySelector('span').textContent = (cur + 1) + ' / ' + list.length + '  ·  ' + p.querySelector('span').textContent;
  }
  
  function open(p){ 
    const i = list.indexOf(p); 
    if(i < 0) return; 
    opener = p; 
    show(i); 
    lb.hidden = false; 
    document.body.style.overflow = 'hidden'; 
    lb.querySelector('.lb-close').focus(); 
  }
  
  function close(){ 
    lb.hidden = true; 
    document.body.style.overflow = ''; 
    if(opener) opener.focus(); 
  }

  prints.forEach(p => {
    p.addEventListener('click', () => open(p));
    p.addEventListener('keydown', e => { 
      if(e.key === 'Enter' || e.key === ' '){ 
        e.preventDefault(); open(p); 
      } 
    });
  });
  
  lb.querySelector('.lb-close').onclick = close;
  lb.querySelector('.lb-prev').onclick = () => show(cur - 1);
  lb.querySelector('.lb-next').onclick = () => show(cur + 1);
  lb.addEventListener('click', e => { if(e.target === lb) close(); });
  
  addEventListener('keydown', e => { 
    if(lb.hidden) return;
    if(e.key === 'Escape') close(); 
    if(e.key === 'ArrowLeft') show(cur - 1); 
    if(e.key === 'ArrowRight') show(cur + 1); 
  });
  
  let x0 = null;
  lb.addEventListener('touchstart', e => x0 = e.touches[0].clientX, {passive: true});
  lb.addEventListener('touchend', e => { 
    if(x0 === null) return; 
    const d = e.changedTouches[0].clientX - x0; 
    if(Math.abs(d) > 50) show(cur + (d < 0 ? 1 : -1)); 
    x0 = null; 
  });
})();
