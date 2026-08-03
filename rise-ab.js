/**
 * Rise A/B Testing + Live Content System
 *
 * Include this script on any page that should pull live content from Supabase
 * and participate in A/B tests.
 *
 * Usage: Add data-block="<block_key>" to any element whose text should be
 *        replaced by the matching page_block's content.
 *
 *   <h2 data-block="hero_title" data-field="title">Fallback title</h2>
 *   <p  data-block="hero_title" data-field="subtitle">Fallback subtitle</p>
 *
 * The script detects the current page from RISE_AB_PAGE (set before this script)
 * or from the URL path.
 */
(function() {
  'use strict';

  // ── Config ────────────────────────────────────────
  var SUPABASE_URL = 'https://rnegaikmtgcjyyykqocp.supabase.co';
  var SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJuZWdhaWttdGdjanl5eWtxb2NwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc0NDE2MTMsImV4cCI6MjA5MzAxNzYxM30.n0n9IZH9_T6nhfgXhKUpvv3oU0RtkHwPL46blAFL0Uw';

  // Detect page name from global or URL
  var PAGE = window.RISE_AB_PAGE || detectPage();
  function detectPage() {
    var p = location.pathname.replace(/\/$/, '');
    if (p === '' || p === '/homepageexample') return 'homepage';
    if (p.indexOf('community') !== -1) return 'community';
    if (p.indexOf('course') !== -1) return 'course';
    return p.split('/').pop() || 'homepage';
  }

  // ── Device detection (mobile-first) ───────────────
  var isMobile = /Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent) || window.innerWidth < 768;
  var deviceType = isMobile ? 'mobile' : 'desktop';

  // ── Visitor ID (persistent per browser) ───────────
  var visitorId = (function() {
    try {
      var id = localStorage.getItem('rise_visitor');
      if (!id) {
        id = 'v_' + Math.random().toString(36).substr(2, 12) + Date.now().toString(36);
        localStorage.setItem('rise_visitor', id);
      }
      return id;
    } catch (e) {
      return 'v_anon_' + Math.random().toString(36).substr(2, 8);
    }
  })();

  // ── A/B variant assignment (sticky per visitor) ───
  var variant = (function() {
    try {
      var v = localStorage.getItem('rise_ab_variant');
      if (!v) {
        v = Math.random() < 0.5 ? 'a' : 'b';
        localStorage.setItem('rise_ab_variant', v);
      }
      return v;
    } catch (e) {
      return Math.random() < 0.5 ? 'a' : 'b';
    }
  })();

  // ── Supabase helper ───────────────────────────────
  function supaFetch(path, opts) {
    opts = opts || {};
    var headers = {
      'apikey': SUPABASE_KEY,
      'Authorization': 'Bearer ' + SUPABASE_KEY,
      'Content-Type': 'application/json'
    };
    if (opts.prefer) headers['Prefer'] = opts.prefer;
    return fetch(SUPABASE_URL + '/rest/v1/' + path, {
      method: opts.method || 'GET',
      headers: headers,
      body: opts.body ? JSON.stringify(opts.body) : undefined
    }).then(function(r) { return r.json(); });
  }

  // ── Track event (fire-and-forget) ─────────────────
  var trackedEvents = {};
  function trackEvent(blockKey, eventType) {
    var key = blockKey + ':' + eventType;
    if (trackedEvents[key]) return; // dedupe within session
    trackedEvents[key] = true;

    var payload = {
      visitor_id: visitorId,
      page: PAGE,
      variant: variant,
      block_key: blockKey,
      event_type: eventType,
      device_type: deviceType
    };

    try {
      navigator.sendBeacon(
        SUPABASE_URL + '/rest/v1/ab_events?apikey=' + SUPABASE_KEY,
        new Blob([JSON.stringify(payload)], { type: 'application/json' })
      );
    } catch (e) {
      // Fallback to fetch
      supaFetch('ab_events', { method: 'POST', body: payload, prefer: 'return=minimal' }).catch(function() {});
    }
  }

  // ── Fetch blocks and apply content ────────────────
  supaFetch('page_blocks?page=eq.' + PAGE + '&visible=eq.true&select=block_key,content,content_b,ab_active&order=sort_order.asc')
    .then(function(blocks) {
      if (!Array.isArray(blocks) || blocks.length === 0) return;

      blocks.forEach(function(block) {
        // Determine which content to show
        var useB = block.ab_active && variant === 'b' && block.content_b;
        var content = useB ? block.content_b : block.content;
        if (!content) return;

        // Find all elements with this block_key
        var els = document.querySelectorAll('[data-block="' + block.block_key + '"]');
        els.forEach(function(el) {
          var field = el.getAttribute('data-field');
          if (field && content[field] !== undefined && content[field] !== null) {
            // Check if element contains HTML children we should preserve
            if (el.getAttribute('data-html') === 'true') {
              el.innerHTML = content[field];
            } else {
              el.textContent = content[field];
            }
          }
        });
      });

      // ── Scroll tracking with IntersectionObserver ──
      if ('IntersectionObserver' in window) {
        var blockEls = document.querySelectorAll('[data-block]');
        var seenBlocks = {};

        // Collect unique block keys that are on the page
        var blockKeys = {};
        blockEls.forEach(function(el) {
          var bk = el.getAttribute('data-block');
          if (!blockKeys[bk]) blockKeys[bk] = el;
        });

        // Track impressions: element enters viewport (50% visible)
        var impressionObserver = new IntersectionObserver(function(entries) {
          entries.forEach(function(entry) {
            if (entry.isIntersecting) {
              var bk = entry.target.getAttribute('data-block');
              if (!seenBlocks['imp:' + bk]) {
                seenBlocks['imp:' + bk] = true;
                trackEvent(bk, 'impression');
              }
            }
          });
        }, { threshold: 0.5 });

        // Track scroll-past: element has been fully scrolled past
        var scrollPastObserver = new IntersectionObserver(function(entries) {
          entries.forEach(function(entry) {
            if (entry.isIntersecting) {
              var bk = entry.target.getAttribute('data-block');
              if (seenBlocks['imp:' + bk] && !seenBlocks['sp:' + bk]) {
                seenBlocks['sp:' + bk] = true;
                trackEvent(bk, 'scroll_past');
              }
            }
          });
        }, { threshold: 1.0 });

        // Observe first element of each block
        Object.keys(blockKeys).forEach(function(bk) {
          impressionObserver.observe(blockKeys[bk]);
          scrollPastObserver.observe(blockKeys[bk]);
        });
      }
    })
    .catch(function(err) {
      console.warn('Rise A/B: could not load blocks', err);
    });

  // Expose for debugging
  window.__riseAB = { page: PAGE, variant: variant, visitor: visitorId, device: deviceType };

})();
