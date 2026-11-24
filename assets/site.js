// Léo Lacoste — shared interactions. Everything degrades to readable static content.
document.documentElement.classList.add('js');
(() => {
  const still = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const io = (els, fn, opt = { threshold: .15 }) => {
    if (!('IntersectionObserver' in window)) return els.forEach(fn);
    const o = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { fn(e.target); o.unobserve(e.target); } }), opt);
    els.forEach(el => o.observe(el));
  };

  // Reveal on scroll
  io($$('.rv'), el => el.classList.add('in'), { threshold: .08, rootMargin: '0px 0px -40px 0px' });

  // Logo band: duplicate the list so the loop is seamless
  $$('.marquee ul').forEach(ul => { if (still) return; ul.innerHTML += ul.innerHTML.replace(/<li/g, '<li aria-hidden="true"'); });

  // Hero photos: crossfade, pause on hover or with the button. Add <img> tags inside .photo to add photos.
  const photo = $('[data-photos]');
  if (photo) {
    // photos whose file is missing are taken out, so an empty slot never shows
    const ok = im => im.complete ? Promise.resolve(im.naturalWidth > 0) : new Promise(r => { im.onload = () => r(true); im.onerror = () => r(false); });
    Promise.all($$('img', photo).map(im => ok(im).then(good => { if (!good) im.hidden = true; return good ? im : null; })))
      .then(list => slides(photo, list.filter(Boolean)));
  }
  function slides(photo, imgs) {
    const cap = $('.cap span', photo), btn = $('.pause', photo);
    let i = 0, hover = false, stop = false;
    if (!imgs.length) return;
    imgs.forEach((im, n) => im.classList.toggle('on', n === 0));
    if (cap && imgs[0].dataset.cap) cap.textContent = imgs[0].dataset.cap;
    const show = n => { imgs[i].classList.remove('on'); i = n; imgs[i].classList.add('on'); if (cap && imgs[i].dataset.cap) cap.textContent = imgs[i].dataset.cap; };
    if (imgs.length > 1 && !still) {
      btn.hidden = false;
      setInterval(() => { if (!hover && !stop && !document.hidden) show((i + 1) % imgs.length); }, 3600);
      photo.addEventListener('mouseenter', () => hover = true);
      photo.addEventListener('mouseleave', () => hover = false);
      btn.addEventListener('click', () => { stop = !stop; btn.textContent = stop ? 'Play' : 'Pause'; });
    }
  }

  // Europe map: tap a city, a country or a pill
  const map = $('[data-map]');
  if (map) {
    const data = JSON.parse($('#map-data').textContent);
    const info = $('[data-map-info]'), def = info.innerHTML;
    const pills = $$('[data-k]', map);
    const pick = k => {
      pills.forEach(p => p.setAttribute('aria-pressed', p.dataset.k === k));
      $$('.land path', map).forEach(p => p.classList.toggle('hl', !!k && (data[k]?.c || []).includes(p.dataset.c)));
      $$('.city', map).forEach(c => c.classList.toggle('hl', c.dataset.k === k));
      if (!k) { info.innerHTML = def; return; }
      const d = data[k];
      info.innerHTML = `<div class="fade"><p class="where">${d.where}</p><h3>${d.t}</h3><p>${d.p}</p>${d.s ? `<div class="stats">${d.s.map(s => `<div><div class="num">${s[0]}</div><span>${s[1]}</span></div>`).join('')}</div>` : ''}<div class="pills who">${d.co.map(c => `<span class="pill">${c}</span>`).join('')}</div><p><button class="link" type="button" data-reset style="background:none;border:0;padding:0;cursor:pointer">Back to the overview</button></p></div>`;
    };
    let cur = null;
    const toggle = k => { cur = cur === k ? null : k; pick(cur); };
    pills.forEach(p => p.addEventListener('click', () => toggle(p.dataset.k)));
    $$('.city', map).forEach(c => { c.addEventListener('click', () => toggle(c.dataset.k)); c.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggle(c.dataset.k); } }); });
    $$('.land path[data-c]', map).forEach(p => p.addEventListener('click', () => {
      const k = Object.keys(data).find(k => data[k].tap?.includes(p.dataset.c));
      if (k) toggle(k);
    }));
    info.addEventListener('click', e => { if (e.target.closest('[data-reset]')) { cur = null; pick(null); } });
  }

  // Playbook: hover or tap a step
  const flow = $('[data-flow]');
  if (flow) {
    const btns = $$('.track button', flow), out = $('[data-flow-out]', flow);
    const set = b => { btns.forEach(x => x.setAttribute('aria-pressed', x === b)); out.innerHTML = b.nextElementSibling.innerHTML; out.firstElementChild?.classList.add('fade'); };
    btns.forEach(b => { b.addEventListener('click', () => set(b)); b.addEventListener('pointerenter', e => { if (e.pointerType === 'mouse') set(b); }); });
  }

  // Quotes
  const qs = $('[data-quotes]');
  if (qs) {
    const figs = $$('figure', qs), dots = $$('.qnav button', qs);
    let q = 0, t;
    const go = n => { q = n; figs.forEach((f, i) => f.classList.toggle('on', i === n)); dots.forEach((d, i) => d.setAttribute('aria-pressed', i === n)); };
    const auto = () => { clearInterval(t); if (!still) t = setInterval(() => go((q + 1) % figs.length), 7000); };
    dots.forEach((d, i) => d.addEventListener('click', () => { go(i); auto(); }));
    auto();
  }

  // Ladder (career): role tabs light up the skills it used
  $$('[data-ladder]').forEach(l => {
    const tabs = $$('[role="tab"]', l), sk = $$('.skills span', l), body = $('[data-lbody]', l);
    const set = t => {
      tabs.forEach(x => x.setAttribute('aria-selected', x === t));
      const on = t.dataset.on.split(',');
      sk.forEach(s => s.classList.toggle('on', on.includes(s.textContent)));
      body.innerHTML = t.nextElementSibling.innerHTML;
    };
    tabs.forEach(t => t.addEventListener('click', () => set(t)));
    set(tabs[0]);
  });

  // Career chapter pills follow the scroll
  const chap = $$('.chapters a');
  if (chap.length && 'IntersectionObserver' in window) {
    const secs = chap.map(a => $(a.getAttribute('href'))).filter(Boolean);
    const o = new IntersectionObserver(es => es.forEach(e => {
      if (e.isIntersecting) chap.forEach(a => a.classList.toggle('on', a.getAttribute('href') === '#' + e.target.id));
    }), { rootMargin: '-45% 0px -50% 0px' });
    secs.forEach(s => o.observe(s));
  }

  // Language bars fill when seen
  io($$('.langs'), el => el.classList.add('in'), { threshold: .3 });

  // Contact: rotating greeting + copy email
  const g = $('[data-greet]');
  if (g && !still) {
    const w = ['Hello', 'Bonjour', 'Hola', 'Hallo', 'Hoi']; let gi = 0;
    setInterval(() => { g.classList.add('out'); setTimeout(() => { gi = (gi + 1) % w.length; g.textContent = w[gi]; g.classList.remove('out'); }, 300); }, 2400);
  }
  $$('[data-copy]').forEach(b => b.addEventListener('click', async () => {
    const em = $('em', b), addr = $('b', b).textContent;
    try { await navigator.clipboard.writeText(addr); } catch { location.href = 'mailto:' + addr; return; }
    em.textContent = 'Copied'; b.classList.add('copied');
    clearTimeout(b._t); b._t = setTimeout(() => { em.textContent = 'Copy'; b.classList.remove('copied'); }, 1800);
  }));
})();
