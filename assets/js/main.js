/* ==========================================================================
   main.js — minimal interactivity
   ========================================================================== */

(function () {
  'use strict';

  // ── Mobile nav toggle ──────────────────────────────────────────────────────
  var toggle   = document.querySelector('.nav-toggle');
  var navLinks = document.getElementById('nav-links');

  if (toggle && navLinks) {
    toggle.addEventListener('click', function () {
      var isOpen = navLinks.classList.toggle('open');
      toggle.setAttribute('aria-expanded', String(isOpen));
    });

    // Close nav when a link is clicked (mobile UX)
    navLinks.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        navLinks.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // ── Blog post-type filter ──────────────────────────────────────────────────
  var filterBtns = document.querySelectorAll('.filter-btn');
  var postItems  = document.querySelectorAll('#post-list .post-list__item');

  if (filterBtns.length && postItems.length) {
    filterBtns.forEach(function (btn) {
      btn.addEventListener('click', function () {
        var filter = btn.getAttribute('data-filter');

        filterBtns.forEach(function (b) { b.classList.remove('active'); });
        btn.classList.add('active');

        postItems.forEach(function (item) {
          if (filter === 'all' || item.getAttribute('data-type') === filter) {
            item.style.display = '';
          } else {
            item.style.display = 'none';
          }
        });
      });
    });
  }

})();
