/**
 * OmniConvert - Theme Switcher (Dark / Light Mode)
 */
(function() {
  const THEME_KEY = 'omniconvert_theme';
  
  function getPreferredTheme() {
    const saved = localStorage.getItem(THEME_KEY);
    if (saved) return saved;
    return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
  }

  function setTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem(THEME_KEY, theme);
    updateThemeIcons(theme);
  }

  function updateThemeIcons(theme) {
    const toggleBtns = document.querySelectorAll('.theme-toggle');
    toggleBtns.forEach(btn => {
      if (theme === 'light') {
        btn.innerHTML = `<i data-lucide="moon"></i>`;
        btn.setAttribute('title', 'Switch to Dark Mode');
      } else {
        btn.innerHTML = `<i data-lucide="sun"></i>`;
        btn.setAttribute('title', 'Switch to Light Mode');
      }
    });
    if (window.lucide) {
      window.lucide.createIcons();
    }
  }

  // Initialize
  const currentTheme = getPreferredTheme();
  setTheme(currentTheme);

  window.toggleTheme = function() {
    const active = document.documentElement.getAttribute('data-theme') || 'dark';
    const next = active === 'dark' ? 'light' : 'dark';
    setTheme(next);
  };

  document.addEventListener('DOMContentLoaded', () => {
    updateThemeIcons(document.documentElement.getAttribute('data-theme') || 'dark');
  });
})();
