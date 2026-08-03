/**
 * RISE Dashboard — Application Logic
 * Sales-focused overview with hardcoded offer blocks, objection system.
 */

(function () {
  'use strict';

  var C = RISE_CONFIG;
  var activeFilter = 'all';

  // ── Initialize ──────────────────────────────────────
  document.addEventListener('DOMContentLoaded', init);

  function init() {
    // Footer
    var footerEl = document.getElementById('footer-text');
    if (footerEl) footerEl.textContent = C.footerText;

    // Apply accent color
    document.documentElement.style.setProperty('--accent', C.accentColor);

    // Render objection system
    renderObjectionFilters();
    renderObjectionCards();

    // Wire up hardcoded offer block buttons
    wireOfferButtons();
  }


  // ── Offer Block Button Wiring ───────────────────────

  function wireOfferButtons() {
    // Community Payment button
    var communityPayBtn = document.getElementById('cta-community-pay');
    if (communityPayBtn) {
      communityPayBtn.addEventListener('click', function () {
        var url = C.communityPaymentUrl;
        if (url && url.trim() !== '') {
          window.open(url, '_blank');
        } else {
          showToast('Payment link not set yet.');
        }
      });
    }

    // Course Payment button
    var coursePayBtn = document.getElementById('cta-course-pay');
    if (coursePayBtn) {
      coursePayBtn.addEventListener('click', function () {
        var url = C.coursePaymentUrl;
        if (url && url.trim() !== '') {
          window.open(url, '_blank');
        } else {
          showToast('Payment link not set yet.');
        }
      });
    }

    // Copy Course Link button
    var copyLinkBtn = document.getElementById('copy-course-link');
    if (copyLinkBtn) {
      copyLinkBtn.addEventListener('click', function () {
        var url = C.coursePaymentUrl;
        if (!url || url.trim() === '') {
          showToast('Course link not configured.');
          return;
        }
        var btn = this;
        navigator.clipboard.writeText(url).then(function () {
          btn.textContent = 'Copied!';
          showToast('Course link copied to clipboard.');
          setTimeout(function () { btn.textContent = 'Copy Course Link'; }, 2000);
        }).catch(function () {
          var tmp = document.createElement('textarea');
          tmp.value = url;
          document.body.appendChild(tmp);
          tmp.select();
          document.execCommand('copy');
          document.body.removeChild(tmp);
          btn.textContent = 'Copied!';
          showToast('Course link copied to clipboard.');
          setTimeout(function () { btn.textContent = 'Copy Course Link'; }, 2000);
        });
      });
    }
  }


  // ── Objection System ────────────────────────────────

  function renderObjectionFilters() {
    var container = document.getElementById('obj-filters');
    if (!container || !C.objectionCategories) return;

    // All button
    var allBtn = document.createElement('button');
    allBtn.className = 'obj-filter-btn active';
    allBtn.textContent = 'All';
    allBtn.setAttribute('data-cat', 'all');
    allBtn.addEventListener('click', function () { setFilter('all'); });
    container.appendChild(allBtn);

    C.objectionCategories.forEach(function (cat) {
      var btn = document.createElement('button');
      btn.className = 'obj-filter-btn';
      btn.textContent = cat.name;
      btn.setAttribute('data-cat', cat.id);
      btn.addEventListener('click', function () { setFilter(cat.id); });
      container.appendChild(btn);
    });
  }

  function setFilter(catId) {
    activeFilter = catId;

    // Update active state on filter buttons
    var btns = document.querySelectorAll('.obj-filter-btn');
    for (var i = 0; i < btns.length; i++) {
      btns[i].classList.toggle('active', btns[i].getAttribute('data-cat') === catId);
    }

    // Re-render cards
    renderObjectionCards();
  }

  function renderObjectionCards() {
    var container = document.getElementById('obj-cards');
    if (!container || !C.objections) return;
    container.innerHTML = '';

    var filtered = C.objections;
    if (activeFilter !== 'all') {
      filtered = C.objections.filter(function (obj) {
        return obj.categoryId === activeFilter;
      });
    }

    filtered.forEach(function (obj) {
      var card = document.createElement('div');
      card.className = 'obj-card';

      // Header with question + tags
      var header = document.createElement('div');
      header.className = 'obj-card-header';

      var question = document.createElement('div');
      question.className = 'obj-question';
      question.textContent = '\u201c' + obj.objection + '\u201d';
      header.appendChild(question);

      var tags = document.createElement('div');
      tags.className = 'obj-tags';

      var productTag = document.createElement('span');
      productTag.className = 'obj-tag ' + obj.product;
      productTag.textContent = obj.product === 'community' ? 'Community' : 'Course';
      tags.appendChild(productTag);

      // Find category name
      var catName = obj.categoryId;
      if (C.objectionCategories) {
        C.objectionCategories.forEach(function (c) {
          if (c.id === obj.categoryId) catName = c.name;
        });
      }
      var catTag = document.createElement('span');
      catTag.className = 'obj-tag';
      catTag.textContent = catName;
      tags.appendChild(catTag);

      header.appendChild(tags);
      card.appendChild(header);

      // Response
      var response = document.createElement('div');
      response.className = 'obj-response';
      response.textContent = obj.response;
      card.appendChild(response);

      // Copy button
      var copyBtn = document.createElement('button');
      copyBtn.className = 'obj-copy-btn';
      copyBtn.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/></svg>Copy Response';
      copyBtn.addEventListener('click', function () {
        var thisBtn = this;
        var text = obj.response;
        navigator.clipboard.writeText(text).then(function () {
          thisBtn.classList.add('copied');
          thisBtn.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><polyline points="20 6 9 17 4 12"/></svg>Copied';
          setTimeout(function () {
            thisBtn.classList.remove('copied');
            thisBtn.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/></svg>Copy Response';
          }, 2000);
        }).catch(function () {
          var tmp = document.createElement('textarea');
          tmp.value = text;
          document.body.appendChild(tmp);
          tmp.select();
          document.execCommand('copy');
          document.body.removeChild(tmp);
          thisBtn.classList.add('copied');
          thisBtn.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><polyline points="20 6 9 17 4 12"/></svg>Copied';
          setTimeout(function () {
            thisBtn.classList.remove('copied');
            thisBtn.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/></svg>Copy Response';
          }, 2000);
        });
      });
      card.appendChild(copyBtn);

      container.appendChild(card);
    });
  }


  // ── Toast ───────────────────────────────────────────

  function showToast(message) {
    var toast = document.getElementById('toast');
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add('visible');
    clearTimeout(toast._timeout);
    toast._timeout = setTimeout(function () {
      toast.classList.remove('visible');
    }, 3000);
  }

})();
