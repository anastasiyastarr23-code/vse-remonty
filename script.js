document.addEventListener('DOMContentLoaded', () => {

  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------------- Mobile nav ---------------- */
  const burgerBtn = document.getElementById('burgerBtn');
  const mobileNav = document.getElementById('mobileNav');
  const mobileNavClose = document.getElementById('mobileNavClose');
  burgerBtn?.addEventListener('click', () => {
    mobileNav.classList.add('open');
    burgerBtn.setAttribute('aria-expanded', 'true');
  });
  mobileNavClose?.addEventListener('click', closeMobileNav);
  document.querySelectorAll('[data-close]').forEach(a => a.addEventListener('click', closeMobileNav));
  function closeMobileNav() {
    mobileNav.classList.remove('open');
    burgerBtn.setAttribute('aria-expanded', 'false');
  }

  /* ---------------- Hero mini-card → swap main image ---------------- */
  const heroMainImg = document.getElementById('heroMainImg');
  document.querySelectorAll('.hero-mini').forEach(card => {
    card.addEventListener('click', () => {
      const src = card.dataset.src;
      const alt = card.dataset.alt;
      document.querySelectorAll('.hero-mini').forEach(c => c.classList.remove('active'));
      card.classList.add('active');
      if (window.gsap) {
        gsap.to(heroMainImg, { opacity: 0, duration: .2, onComplete: () => {
          heroMainImg.src = src; heroMainImg.alt = alt;
          gsap.to(heroMainImg, { opacity: 1, duration: .35 });
        }});
      } else {
        heroMainImg.src = src; heroMainImg.alt = alt;
      }
    });
  });

  /* ---------------- FAQ accordion ---------------- */
  document.querySelectorAll('.faq-q').forEach(btn => {
    btn.addEventListener('click', () => {
      const item = btn.closest('.faq-item');
      const body = item.querySelector('.faq-a');
      const icon = btn.querySelector('.faq-icon');
      const isOpen = item.classList.contains('open');

      document.querySelectorAll('.faq-item.open').forEach(openItem => {
        if (openItem !== item) {
          openItem.classList.remove('open');
          const ob = openItem.querySelector('.faq-a');
          const oi = openItem.querySelector('.faq-icon');
          openItem.querySelector('.faq-q').setAttribute('aria-expanded', 'false');
          if (window.gsap) {
            gsap.to(ob, { maxHeight: 0, duration: .3, ease: 'power2.inOut' });
            gsap.to(oi, { rotate: 0, duration: .25 });
          } else { ob.style.maxHeight = '0'; }
        }
      });

      if (isOpen) {
        item.classList.remove('open');
        btn.setAttribute('aria-expanded', 'false');
        if (window.gsap) {
          gsap.to(body, { maxHeight: 0, duration: .3, ease: 'power2.inOut' });
          gsap.to(icon, { rotate: 0, duration: .25 });
        } else { body.style.maxHeight = '0'; }
      } else {
        item.classList.add('open');
        btn.setAttribute('aria-expanded', 'true');
        const h = body.scrollHeight;
        if (window.gsap) {
          gsap.to(body, { maxHeight: h, duration: .35, ease: 'power2.out' });
          gsap.to(icon, { rotate: 45, duration: .25 });
        } else { body.style.maxHeight = h + 'px'; }
      }
    });
  });

  /* ---------------- Phone mask ---------------- */
  document.querySelectorAll('input[name="phone"]').forEach(input => {
    input.addEventListener('input', () => {
      let v = input.value.replace(/\D/g, '');
      if (v.startsWith('998')) v = v.slice(3);
      if (v.length > 9) v = v.slice(0, 9);
      let r = '+998';
      if (v.length > 0) r += ' ' + v.slice(0, 2);
      if (v.length > 2) r += ' ' + v.slice(2, 5);
      if (v.length > 5) r += '-' + v.slice(5, 7);
      if (v.length > 7) r += '-' + v.slice(7, 9);
      input.value = r;
    });
  });

  /* ---------------- Form validation & submit ---------------- */
  function validPhone(v) { return v.replace(/\D/g, '').length === 12; }

  document.querySelectorAll('.lead-form').forEach(form => {
    form.addEventListener('submit', e => {
      e.preventDefault();
      const phoneInput = form.querySelector('input[name="phone"]');
      const errEl = form.querySelector('.f-err');
      phoneInput.classList.remove('err');
      errEl?.classList.remove('show');

      if (!validPhone(phoneInput.value)) {
        phoneInput.classList.add('err');
        errEl?.classList.add('show');
        phoneInput.focus();
        return;
      }

      const data = {
        source: form.dataset.id,
        name: form.querySelector('[name="name"]')?.value || '',
        phone: phoneInput.value,
        area: form.querySelector('[name="area"]')?.value || '',
        repair_type: form.querySelector('[name="repair_type"]')?.value || '',
      };
      console.log('Lead:', data);
      // TODO: интеграция с Telegram-ботом / бэкендом

      form.querySelector('.ff').style.display = 'none';
      form.querySelector('.f-ok').classList.add('show');
    });
  });

  /* ---------------- GSAP / ScrollTrigger ---------------- */
  if (window.gsap && window.ScrollTrigger && !reduced) {
    gsap.registerPlugin(ScrollTrigger);

    // Simple fade-up reveal for standalone elements
    gsap.utils.toArray('.gsap-init').forEach(el => {
      gsap.fromTo(el, { opacity: 0, y: 28 }, {
        opacity: 1, y: 0, duration: .7, ease: 'power2.out',
        scrollTrigger: { trigger: el, start: 'top 88%', once: true }
      });
    });

    // Cascade reveal: group cards by their immediate container, stagger within each
    const containers = new Set();
    document.querySelectorAll('.gsap-stagger').forEach(el => containers.add(el.parentElement));
    containers.forEach(container => {
      const items = container.querySelectorAll(':scope > .gsap-stagger');
      if (!items.length) return;
      gsap.fromTo(items, { opacity: 0, y: 24 }, {
        opacity: 1, y: 0, duration: .6, ease: 'power2.out', stagger: 0.08,
        scrollTrigger: { trigger: container, start: 'top 85%', once: true }
      });
    });

    // Hero entrance (no scroll trigger needed, plays on load)
    gsap.fromTo('.hero-title', { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: .7, ease: 'power2.out', delay: .1 });
    gsap.fromTo('.hero-sub', { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: .6, ease: 'power2.out', delay: .22 });
    gsap.fromTo('.hero-actions', { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: .6, ease: 'power2.out', delay: .32 });
    gsap.fromTo('.hero-facts', { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: .6, ease: 'power2.out', delay: .42 });
    gsap.fromTo('.hero-right', { opacity: 0, scale: .98 }, { opacity: 1, scale: 1, duration: .8, ease: 'power2.out', delay: .15 });

  } else {
    // No GSAP / reduced motion → show everything immediately
    document.querySelectorAll('.gsap-init, .gsap-stagger').forEach(el => { el.style.opacity = '1'; });
  }

  /* ---------------- Lightbox ---------------- */
  const lb = document.getElementById('lightbox');
  const lbImg = document.getElementById('lbImg');
  const lbClose = document.getElementById('lbClose');
  const lbPrev = document.getElementById('lbPrev');
  const lbNext = document.getElementById('lbNext');

  const pfItems = Array.from(document.querySelectorAll('#portfolio .pf-item'));
  let lbIndex = 0;

  function lbOpen(index) {
    lbIndex = index;
    const img = pfItems[index].querySelector('img');
    lbImg.src = img.src;
    lbImg.alt = img.alt;
    lb.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function lbClose2() {
    lb.classList.remove('open');
    document.body.style.overflow = '';
  }

  function lbGo(dir) {
    lbIndex = (lbIndex + dir + pfItems.length) % pfItems.length;
    lbImg.style.opacity = '0';
    setTimeout(() => {
      const img = pfItems[lbIndex].querySelector('img');
      lbImg.src = img.src;
      lbImg.alt = img.alt;
      lbImg.style.opacity = '1';
    }, 150);
  }

  pfItems.forEach((item, i) => item.addEventListener('click', () => lbOpen(i)));
  lbClose.addEventListener('click', lbClose2);
  lb.addEventListener('click', e => { if (e.target === lb) lbClose2(); });
  lbPrev.addEventListener('click', e => { e.stopPropagation(); lbGo(-1); });
  lbNext.addEventListener('click', e => { e.stopPropagation(); lbGo(1); });
  document.addEventListener('keydown', e => {
    if (!lb.classList.contains('open')) return;
    if (e.key === 'Escape') lbClose2();
    if (e.key === 'ArrowLeft') lbGo(-1);
    if (e.key === 'ArrowRight') lbGo(1);
  });
});
