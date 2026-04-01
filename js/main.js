/* ═══════════════════════════════════════
   Brume-style Blog — Core JS
   ═══════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initMobileMenu();
  initSearch();
  initScrollEffects();
  initFadeIn();
});

/* ── Theme Toggle ── */
function initTheme() {
  const toggle = document.querySelector('.theme-toggle');
  const saved = localStorage.getItem('theme');
  
  if (saved) {
    document.documentElement.setAttribute('data-theme', saved);
  } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
    document.documentElement.setAttribute('data-theme', 'dark');
  }
  
  updateThemeIcon();
  
  if (toggle) {
    toggle.addEventListener('click', () => {
      const current = document.documentElement.getAttribute('data-theme');
      const next = current === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', next);
      localStorage.setItem('theme', next);
      updateThemeIcon();
    });
  }
}

function updateThemeIcon() {
  const toggle = document.querySelector('.theme-toggle');
  if (!toggle) return;
  const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
  toggle.innerHTML = isDark
    ? '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>'
    : '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>';
}

/* ── Mobile Menu ── */
function initMobileMenu() {
  const btn = document.querySelector('.mobile-menu-btn');
  const links = document.querySelector('.navbar-links');
  
  if (!btn || !links) return;
  
  btn.addEventListener('click', () => {
    links.classList.toggle('mobile-open');
  });
  
  // Close on link click
  links.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      links.classList.remove('mobile-open');
    });
  });
}

/* ── Search ── */
function initSearch() {
  const btn = document.querySelector('.search-btn');
  const overlay = document.querySelector('.search-overlay');
  const input = document.querySelector('.search-input');
  const results = document.querySelector('.search-results');
  
  if (!btn || !overlay) return;
  
  const posts = window.searchData || [];
  
  btn.addEventListener('click', () => {
    overlay.classList.add('active');
    if (input) input.focus();
  });
  
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) {
      overlay.classList.remove('active');
      if (input) input.value = '';
      if (results) results.innerHTML = '';
    }
  });
  
  // Keyboard shortcut
  document.addEventListener('keydown', (e) => {
    if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
      e.preventDefault();
      btn.click();
    }
    if (e.key === 'Escape') {
      overlay.classList.remove('active');
      if (input) input.value = '';
      if (results) results.innerHTML = '';
    }
  });
  
  if (input && results) {
    input.addEventListener('input', () => {
      const query = input.value.trim().toLowerCase();
      if (!query) {
        results.innerHTML = '';
        return;
      }
      
      const matched = posts.filter(p => 
        p.title.toLowerCase().includes(query) || 
        p.excerpt.toLowerCase().includes(query) ||
        (p.tags && p.tags.some(t => t.toLowerCase().includes(query)))
      );
      
      if (matched.length === 0) {
        results.innerHTML = '<div class="search-empty">没有找到相关文章</div>';
        return;
      }
      
      results.innerHTML = matched.map(p => {
        const highlighted = highlightMatch(p.excerpt, query);
        return `<a href="${p.url}" class="search-result-item">
          <div class="search-result-title">${p.title}</div>
          <div class="search-result-excerpt">${highlighted}</div>
        </a>`;
      }).join('');
    });
  }
}

function highlightMatch(text, query) {
  if (!query) return text;
  const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
  return text.replace(regex, '<mark>$1</mark>');
}

/* ── Scroll Effects ── */
function initScrollEffects() {
  const backToTop = document.querySelector('.back-to-top');
  if (!backToTop) return;
  
  window.addEventListener('scroll', () => {
    if (window.scrollY > 300) {
      backToTop.classList.add('visible');
    } else {
      backToTop.classList.remove('visible');
    }
  });
  
  backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

/* ── Fade-in on Scroll ── */
function initFadeIn() {
  const elements = document.querySelectorAll('.fade-in');
  if (!elements.length) return;
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
  
  elements.forEach((el, i) => {
    el.style.transitionDelay = `${i * 60}ms`;
    observer.observe(el);
  });
}
