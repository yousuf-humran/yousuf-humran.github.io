// runs before the page paints so the theme doesn't flash. dark is the default.
let theme = 'dark';

try {
  if (localStorage.getItem('theme') === 'light') theme = 'light';
} catch (e) {}

document.documentElement.dataset.theme = theme;
