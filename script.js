/* Портфолио Анны: появление секций, счётчики, tilt карточек, модалка кейсов. Vanilla JS, без зависимостей. */
(function () {
  'use strict';

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  var finePointer = window.matchMedia('(hover: hover) and (pointer: fine)');

  /* ---------- Год в футере ---------- */
  var yearEl = document.querySelector('[data-year]');
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  /* ---------- Шапка: граница после прокрутки ---------- */
  var header = document.querySelector('[data-header]');
  if (header) {
    var onScroll = function () {
      header.classList.toggle('is-scrolled', window.scrollY > 8);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  /* ---------- Задержки для каскадного появления ---------- */
  document.querySelectorAll('[data-stagger]').forEach(function (list) {
    Array.prototype.forEach.call(list.children, function (child, i) {
      child.style.setProperty('--i', String(i % 6));
    });
  });

  /* ---------- Счётчики ---------- */
  var formatter = new Intl.NumberFormat('ru-RU');

  function renderCount(el, value) {
    el.textContent = (el.dataset.prefix || '') + formatter.format(value) + (el.dataset.suffix || '');
  }

  function animateCount(el) {
    var target = parseInt(el.dataset.count, 10);
    if (isNaN(target) || el.dataset.counted) return;
    el.dataset.counted = 'true';
    if (reduceMotion.matches) {
      renderCount(el, target);
      return;
    }
    var duration = 1400;
    var start = null;
    renderCount(el, 0);
    function step(ts) {
      if (start === null) start = ts;
      var t = Math.min((ts - start) / duration, 1);
      var eased = 1 - Math.pow(1 - t, 3);
      renderCount(el, Math.round(target * eased));
      if (t < 1) window.requestAnimationFrame(step);
    }
    window.requestAnimationFrame(step);
  }

  /* ---------- Появление при скролле ---------- */
  var revealEls = document.querySelectorAll('.reveal');

  function showAll() {
    revealEls.forEach(function (el) { el.classList.add('is-visible'); });
    document.querySelectorAll('[data-count]').forEach(function (el) {
      renderCount(el, parseInt(el.dataset.count, 10));
    });
  }

  if (!('IntersectionObserver' in window)) {
    showAll();
  } else {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var el = entry.target;
        el.classList.add('is-visible');
        el.querySelectorAll('[data-count]').forEach(animateCount);
        observer.unobserve(el);
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -8% 0px' });

    revealEls.forEach(function (el) { observer.observe(el); });
  }

  /* ---------- Tilt + лёгкий параллакс картинки ---------- */
  function initTilt() {
    document.querySelectorAll('[data-tilt]').forEach(function (card) {
      var frame = null;
      card.addEventListener('pointermove', function (e) {
        if (reduceMotion.matches || !finePointer.matches) return;
        var rect = card.getBoundingClientRect();
        var x = (e.clientX - rect.left) / rect.width - 0.5;
        var y = (e.clientY - rect.top) / rect.height - 0.5;
        if (frame) window.cancelAnimationFrame(frame);
        frame = window.requestAnimationFrame(function () {
          card.classList.add('is-tilting');
          card.style.setProperty('--rx', (-y * 5).toFixed(2) + 'deg');
          card.style.setProperty('--ry', (x * 6).toFixed(2) + 'deg');
          card.style.setProperty('--px', (-x * 10).toFixed(1) + 'px');
          card.style.setProperty('--py', (-y * 10).toFixed(1) + 'px');
        });
      });
      card.addEventListener('pointerleave', function () {
        if (frame) window.cancelAnimationFrame(frame);
        card.classList.remove('is-tilting');
        ['--rx', '--ry', '--px', '--py'].forEach(function (prop) {
          card.style.removeProperty(prop);
        });
      });
    });
  }
  initTilt();

  /* ---------- Модалка кейса ---------- */
  var modal = document.getElementById('case-modal');
  if (!modal || typeof modal.showModal !== 'function') return;

  var modalType = modal.querySelector('[data-modal-type]');
  var modalTitle = modal.querySelector('[data-modal-title]');
  var modalMeta = modal.querySelector('[data-modal-meta]');
  var modalContent = modal.querySelector('[data-modal-content]');
  var lastTrigger = null;

  function openCase(button) {
    var card = button.closest('.case');
    if (!card) return;
    lastTrigger = button;

    modalType.textContent = card.querySelector('.case-type').textContent;
    modalTitle.textContent = button.textContent;

    modalMeta.replaceChildren(card.querySelector('.case-meta').cloneNode(true));

    var fragment = document.createDocumentFragment();
    var tpl = card.querySelector('template.case-details');
    if (tpl) fragment.appendChild(tpl.content.cloneNode(true));

    // Если своей галереи нет — показываем обложку карточки (или её плейсхолдер)
    var gallery = fragment.querySelector('.modal-gallery');
    if (!gallery || !gallery.querySelector('img')) {
      if (gallery) gallery.remove();
      fragment.appendChild(card.querySelector('.case-media').cloneNode(true));
    }

    modalContent.replaceChildren(fragment);
    modal.showModal();
    modal.scrollTop = 0;
    var closeBtn = modal.querySelector('[data-close]');
    if (closeBtn) closeBtn.focus();
  }

  function closeModal() {
    if (modal.open) modal.close();
  }

  document.querySelectorAll('.case-open').forEach(function (button) {
    button.addEventListener('click', function () { openCase(button); });
  });

  modal.addEventListener('click', function (e) {
    if (e.target === modal || e.target.closest('[data-close]')) closeModal();
  });

  modal.addEventListener('close', function () {
    modalContent.replaceChildren();
    if (lastTrigger) lastTrigger.focus();
  });

  // Удержание фокуса внутри модалки (Esc закрывает нативно через событие cancel)
  modal.addEventListener('keydown', function (e) {
    if (e.key !== 'Tab') return;
    var focusable = Array.prototype.filter.call(
      modal.querySelectorAll('a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'),
      function (el) { return el.offsetParent !== null || el === document.activeElement; }
    );
    if (!focusable.length) return;
    var first = focusable[0];
    var last = focusable[focusable.length - 1];
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  });
})();
