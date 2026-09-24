// Auto-inject site nav + dark mode toggle.
// Prev/Next nav and site footer live as static HTML in each lesson (managed by add_footer_nav.py).
(function () {
  'use strict';

  // --- Theme ---
  const saved = localStorage.getItem('kapampangan-theme');
  if (saved) document.documentElement.setAttribute('data-theme', saved);
  else if (window.matchMedia('(prefers-color-scheme: dark)').matches)
    document.documentElement.setAttribute('data-theme', 'dark');

  function toggleTheme() {
    const current = document.documentElement.getAttribute('data-theme');
    const next = current === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem('kapampangan-theme', next);
  }

  // --- Build nav ---
  const nav = document.createElement('nav');
  nav.className = 'site-nav';
  nav.setAttribute('aria-label', 'Site navigation');

  const links = document.createElement('div');
  links.className = 'nav-links';
  links.innerHTML = `
    <a href="/intermediate/index.html" class="nav-brand">Kapampangan B1–B2</a>
    <span class="nav-sep">·</span>
    <a href="/intermediate/readings.html">Readings</a>
    <span class="nav-sep">·</span>
    <a href="/intermediate/glossary.html">Glossary</a>
    <span class="nav-sep">·</span>
    <a href="/intermediate/cheatsheet.html">Cheat Sheet</a>
    <span class="nav-sep">·</span>
    <a href="/intermediate/cando.html">Can-Do</a>
    <span class="nav-sep">·</span>
    <a href="/index.html">← Beginner (A1–A2)</a>
    <span class="nav-sep">·</span>
    <a href="https://rays-home.netlify.app/">Ray's House of Fun</a>
    <span class="nav-sep">·</span>
    <a href="https://rays-home.netlify.app/contact">Contact</a>
  `;

  const toggle = document.createElement('button');
  toggle.className = 'theme-toggle';
  toggle.setAttribute('aria-label', 'Toggle dark mode');
  toggle.setAttribute('title', 'Toggle dark mode');
  toggle.addEventListener('click', toggleTheme);

  nav.appendChild(links);
  nav.appendChild(toggle);
  document.body.prepend(nav);
})();
