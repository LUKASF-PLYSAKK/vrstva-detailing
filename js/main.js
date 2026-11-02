/* VRSTVA detailing — main.js (bez závislostí) */
(() => {
  'use strict';

  document.documentElement.classList.add('js');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Header: stav při scrollu + mobilní menu ---------- */
  const header = document.querySelector('.header');
  const toggle = document.querySelector('.nav-toggle');
  const nav = document.getElementById('nav');
  const mobilebar = document.querySelector('.mobilebar');

  const onScroll = () => {
    const y = window.scrollY;
    header.classList.toggle('is-scrolled', y > 24);
    if (mobilebar) mobilebar.classList.toggle('is-visible', y > window.innerHeight * 0.6);
  };
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  const setMenu = (open) => {
    header.classList.toggle('is-open', open);
    toggle.setAttribute('aria-expanded', String(open));
    document.body.style.overflow = open ? 'hidden' : '';
  };
  toggle.addEventListener('click', () => setMenu(toggle.getAttribute('aria-expanded') !== 'true'));
  nav.addEventListener('click', (e) => { if (e.target.closest('a')) setMenu(false); });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && header.classList.contains('is-open')) { setMenu(false); toggle.focus(); }
  });
  window.matchMedia('(min-width: 1021px)').addEventListener('change', (e) => { if (e.matches) setMenu(false); });

  /* ---------- Before / After slidery ----------
     Myš i dotyk: Pointer Events na celé ploše + setPointerCapture.
     touch-action: pan-y (CSS) nechává svislý scroll stránce, vodorovný tah jde slideru.
     Klávesnice a čtečky: nativní <input type="range"> uvnitř. */
  const clamp = (v, min, max) => Math.min(max, Math.max(min, v));

  document.querySelectorAll('[data-ba]').forEach((ba) => {
    const range = ba.querySelector('.ba__range');
    let pos = Number(range.value);
    let rect = null;
    let raf = 0;
    let dragging = false;
    let pointerId = null;
    let pendingX = null;

    const render = () => {
      raf = 0;
      ba.style.setProperty('--pos', pos + '%');
      ba.classList.toggle('hide-before', pos < 12);
      ba.classList.toggle('hide-after', pos > 88);
    };
    const setPos = (value, syncInput = true) => {
      pos = clamp(value, 0, 100);
      if (syncInput) range.value = String(pos);
      range.setAttribute('aria-valuetext', Math.round(pos) + ' % fotky před');
      if (!raf) raf = requestAnimationFrame(render);
    };
    const fromClientX = (x) => {
      if (!rect) rect = ba.getBoundingClientRect();
      return ((x - rect.left) / rect.width) * 100;
    };

    ba.addEventListener('pointerdown', (e) => {
      if (e.pointerType === 'mouse' && e.button !== 0) return;
      dragging = true;
      pointerId = e.pointerId;
      rect = ba.getBoundingClientRect();
      ba.classList.add('is-dragging');
      try { ba.setPointerCapture(e.pointerId); } catch (_) { /* noop */ }
      if (e.pointerType === 'mouse') {
        setPos(fromClientX(e.clientX));
        e.preventDefault(); // zabrání výběru textu
      } else {
        // Dotyk: neskákat hned – mohlo jít o začátek svislého scrollu.
        pendingX = e.clientX;
      }
    });

    ba.addEventListener('pointermove', (e) => {
      if (!dragging || e.pointerId !== pointerId) return;
      pendingX = null;
      setPos(fromClientX(e.clientX));
    });

    const end = (e) => {
      if (!dragging || (e && e.pointerId !== pointerId)) return;
      // Ťuknutí bez pohybu (pointerup) posune úchyt na místo dotyku; pointercancel = scroll, nic neměnit.
      if (e && e.type === 'pointerup' && pendingX !== null) setPos(fromClientX(pendingX));
      pendingX = null;
      dragging = false;
      pointerId = null;
      rect = null;
      ba.classList.remove('is-dragging');
    };
    ba.addEventListener('pointerup', end);
    ba.addEventListener('pointercancel', end);
    ba.addEventListener('lostpointercapture', end);

    // Fallback pro starší iOS Safari bez Pointer Events
    if (!('PointerEvent' in window)) {
      ba.addEventListener('touchstart', (e) => { rect = ba.getBoundingClientRect(); setPos(fromClientX(e.touches[0].clientX)); }, { passive: true });
      ba.addEventListener('touchmove', (e) => { setPos(fromClientX(e.touches[0].clientX)); }, { passive: true });
      ba.addEventListener('mousedown', (e) => {
        rect = ba.getBoundingClientRect(); setPos(fromClientX(e.clientX));
        const move = (ev) => setPos(fromClientX(ev.clientX));
        const up = () => { window.removeEventListener('mousemove', move); window.removeEventListener('mouseup', up); };
        window.addEventListener('mousemove', move);
        window.addEventListener('mouseup', up);
      });
    }

    // Klávesnice / čtečka (šipky, Home, End, PageUp/Down — nativně z range)
    range.addEventListener('input', () => setPos(Number(range.value), false));

    window.addEventListener('resize', () => { rect = null; }, { passive: true });

    // Jemná nápověda při prvním zobrazení: krátký posun úchytu tam a zpět
    if (!reduceMotion && 'IntersectionObserver' in window) {
      const io = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          io.disconnect();
          let start = null;
          const dur = 1400;
          const step = (t) => {
            if (dragging) return;                       // uživatel převzal kontrolu
            if (start === null) start = t;
            const p = Math.min(1, (t - start) / dur);
            const offset = Math.sin(p * Math.PI) * 14;  // 50 → 36 → 50
            setPos(50 - offset);
            if (p < 1) requestAnimationFrame(step);
          };
          setTimeout(() => requestAnimationFrame(step), 350);
        });
      }, { threshold: 0.6 });
      io.observe(ba);
    }

    setPos(pos);
  });

  /* ---------- Ceník: přepínač velikosti vozu ---------- */
  const prices = document.querySelectorAll('[data-price]');
  document.querySelectorAll('input[name="size"]').forEach((radio) => {
    radio.addEventListener('change', () => {
      if (!radio.checked) return;
      const key = radio.value;
      prices.forEach((el) => {
        const next = el.dataset[key];
        if (!next || el.textContent === next) return;
        if (reduceMotion) { el.textContent = next; return; }
        el.classList.add('is-changing');
        setTimeout(() => { el.textContent = next; el.classList.remove('is-changing'); }, 180);
      });
    });
  });

  // Tlačítka "Poptat …" předvyplní službu ve formuláři
  document.querySelectorAll('[data-service]').forEach((link) => {
    link.addEventListener('click', () => {
      const input = document.querySelector(`input[name="service"][value="${link.dataset.service}"]`);
      if (input) { input.checked = true; input.dispatchEvent(new Event('change', { bubbles: true })); }
    });
  });

  /* ---------- Formulář ---------- */
  const form = document.getElementById('poptavka');
  if (form) {
    const MAX_FILES = 5;
    const MAX_SIZE = 10 * 1024 * 1024;
    const fileInput = document.getElementById('f-photos');
    const preview = document.getElementById('f-photos-preview');
    const photosErr = document.getElementById('f-photos-err');
    const uploadZone = form.querySelector('.upload');
    const status = document.getElementById('form-status');
    let files = [];

    const messages = {
      name: 'Vyplňte prosím jméno.',
      phone: 'Zadejte telefon, ať vám můžeme zavolat (např. 731 482 906).',
      car: 'Napište model auta – podle něj odhadneme cenu.',
      service: 'Vyberte, o co máte zájem. Klidně „Nevím, poraďte“.'
    };

    const showError = (field, msg) => {
      const wrap = field.closest('.field');
      const err = wrap.querySelector('.field__err');
      wrap.classList.toggle('is-invalid', Boolean(msg));
      if (err) err.textContent = msg || '';
      if (field.tagName === 'INPUT' && field.type !== 'radio') field.setAttribute('aria-invalid', msg ? 'true' : 'false');
    };

    const validateField = (field) => {
      if (field.type === 'radio') {
        const ok = form.querySelector(`input[name="${field.name}"]:checked`);
        showError(field, ok ? '' : messages[field.name]);
        return Boolean(ok);
      }
      const ok = field.checkValidity();
      showError(field, ok ? '' : messages[field.name]);
      return ok;
    };

    const textFields = form.querySelectorAll('#f-name, #f-phone, #f-car');
    textFields.forEach((f) => {
      f.addEventListener('blur', () => { if (f.value.trim() !== '') validateField(f); });
      f.addEventListener('input', () => { if (f.closest('.field').classList.contains('is-invalid')) showError(f, ''); });
    });
    form.querySelectorAll('input[name="service"]').forEach((r) => r.addEventListener('change', () => validateField(r)));

    // Fotky: náhledy, limit počtu a velikosti, odebrání
    const syncInputFiles = () => {
      try {
        const dt = new DataTransfer();
        files.forEach((f) => dt.items.add(f));
        fileInput.files = dt.files;
      } catch (_) { /* starší prohlížeče: odešle se původní výběr */ }
    };
    const renderPreview = () => {
      preview.querySelectorAll('img').forEach((img) => URL.revokeObjectURL(img.src));
      preview.innerHTML = '';
      files.forEach((file, i) => {
        const li = document.createElement('li');
        const img = document.createElement('img');
        img.src = URL.createObjectURL(file);
        img.alt = file.name;
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'upload__remove';
        btn.setAttribute('aria-label', `Odebrat ${file.name}`);
        btn.textContent = '×';
        btn.addEventListener('click', () => { files.splice(i, 1); syncInputFiles(); renderPreview(); });
        li.append(img, btn);
        preview.append(li);
      });
    };
    const addFiles = (list) => {
      const msgs = [];
      Array.from(list).forEach((file) => {
        if (!file.type.startsWith('image/')) { msgs.push(`${file.name}: není obrázek.`); return; }
        if (file.size > MAX_SIZE) { msgs.push(`${file.name}: větší než 10 MB.`); return; }
        if (files.length >= MAX_FILES) { msgs.push(`Maximálně ${MAX_FILES} fotek.`); return; }
        files.push(file);
      });
      photosErr.textContent = [...new Set(msgs)].join(' ');
      syncInputFiles();
      renderPreview();
    };
    fileInput.addEventListener('change', () => addFiles(fileInput.files));

    ['dragenter', 'dragover'].forEach((t) => uploadZone.addEventListener(t, (e) => { e.preventDefault(); uploadZone.classList.add('is-drag'); }));
    ['dragleave', 'drop'].forEach((t) => uploadZone.addEventListener(t, (e) => { e.preventDefault(); uploadZone.classList.remove('is-drag'); }));
    uploadZone.addEventListener('drop', (e) => { if (e.dataTransfer?.files) addFiles(e.dataTransfer.files); });

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      status.className = 'form__status';
      status.textContent = '';

      let firstInvalid = null;
      textFields.forEach((f) => { if (!validateField(f) && !firstInvalid) firstInvalid = f; });
      const serviceFirst = form.querySelector('input[name="service"]');
      if (!validateField(serviceFirst) && !firstInvalid) firstInvalid = serviceFirst;
      if (firstInvalid) { firstInvalid.focus(); return; }

      if (form.website.value) return; // honeypot

      const btn = form.querySelector('.form__submit');
      const label = btn.textContent;
      btn.disabled = true;
      btn.textContent = 'Odesílám…';

      const data = new FormData(form);
      data.delete('photos');
      files.forEach((f) => data.append('photos', f));

      try {
        // TODO: napojit na backend / formulářovou službu, např.:
        // await fetch('/api/poptavka', { method: 'POST', body: data });
        await new Promise((r) => setTimeout(r, 700));
        status.classList.add('is-ok');
        status.textContent = `Díky, ${data.get('name').split(' ')[0]}. Poptávku máme a ozveme se do 24 hodin v pracovní dny. Spěchá to? Volejte +420 731 482 906.`;
        form.reset();
        files = [];
        renderPreview();
      } catch (err) {
        status.classList.add('is-err');
        status.textContent = 'Odeslání se nepovedlo. Zkuste to prosím znovu, nebo nám zavolejte.';
      } finally {
        btn.disabled = false;
        btn.textContent = label;
      }
    });
  }

  /* ---------- Střídmé odhalování sekcí ---------- */
  if (!reduceMotion && 'IntersectionObserver' in window) {
    const targets = document.querySelectorAll('.section-head, .case, .tile, .price, .step, .facts, .form, .contact__info');
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) { entry.target.classList.add('is-in'); io.unobserve(entry.target); }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    targets.forEach((el) => { el.classList.add('reveal'); io.observe(el); });
  }

  const year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();
})();
