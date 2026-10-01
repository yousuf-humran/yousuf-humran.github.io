const root = document.documentElement;

// theme toggle (the starting theme is set in theme.js)
function initTheme() {
  const toggle = document.getElementById('theme-toggle');
  const themeColor = document.querySelector('meta[name="theme-color"]');

  function update() {
    const dark = root.dataset.theme === 'dark';
    toggle.setAttribute('aria-label', dark ? 'Switch to light theme' : 'Switch to dark theme');
    themeColor.setAttribute('content', dark ? '#000000' : '#F5F5F7');
  }

  toggle.addEventListener('click', () => {
    const next = root.dataset.theme === 'dark' ? 'light' : 'dark';
    root.dataset.theme = next;
    try {
      localStorage.setItem('theme', next);
    } catch (e) {}
    update();
  });

  update();
}

// mobile menu
function initMenu() {
  const button = document.getElementById('menu-toggle');
  const panel = document.getElementById('nav-panel');

  function setOpen(open) {
    panel.classList.toggle('open', open);
    button.setAttribute('aria-expanded', String(open));
    button.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
  }

  button.addEventListener('click', () => {
    setOpen(!panel.classList.contains('open'));
  });

  // close when a link is clicked
  panel.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => setOpen(false));
  });

  // close on Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && panel.classList.contains('open')) {
      setOpen(false);
      button.focus();
    }
  });

  // close when clicking outside
  document.addEventListener('click', (e) => {
    if (panel.contains(e.target) || button.contains(e.target)) return;
    setOpen(false);
  });
}

// highlight the nav link of the section you're currently on
function initActiveLink() {
  const sections = document.querySelectorAll('main section');
  const links = document.querySelectorAll('.nav-links a, .nav-panel a');

  function setActive(id) {
    links.forEach((link) => {
      if (link.getAttribute('href') === '#' + id) {
        link.setAttribute('aria-current', 'true');
      } else {
        link.removeAttribute('aria-current');
      }
    });
  }

  function check() {
    // the contact section is short, so just treat the bottom of the page as "contact"
    if (window.innerHeight + window.scrollY >= root.scrollHeight - 2) {
      setActive('contact');
      return;
    }

    let current = sections[0].id;
    sections.forEach((section) => {
      if (section.getBoundingClientRect().top <= window.innerHeight * 0.4) {
        current = section.id;
      }
    });
    setActive(current);
  }

  window.addEventListener('scroll', check, { passive: true });
  window.addEventListener('resize', check);
  check();
}

// fade things in as you scroll
function initReveal() {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!('IntersectionObserver' in window) || reduceMotion) return;

  const items = document.querySelectorAll('.section-label, .stack, .project, .contact, #about > *');
  items.forEach((el) => el.classList.add('reveal'));
  root.classList.add('js-reveal');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in');
        observer.unobserve(entry.target);
      }
    });
  }, { rootMargin: '0px 0px -8% 0px', threshold: 0.05 });

  items.forEach((el) => observer.observe(el));
}

// "more about me" toggle
function initAbout() {
  const button = document.getElementById('about-toggle');
  const text = document.getElementById('about-text');

  button.addEventListener('click', () => {
    const open = text.classList.toggle('open');
    button.setAttribute('aria-expanded', String(open));
    button.textContent = open ? 'Show less' : 'More about me';
  });
}

// copy email button
function initContact() {
  const button = document.getElementById('copy-email-btn');
  const status = document.getElementById('copy-status');
  const email = button.dataset.email;
  const defaultText = status.textContent;
  let timer;

  button.addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(email);
      status.textContent = 'Copied ' + email;
    } catch (e) {
      status.textContent = 'Could not copy, my email is ' + email;
    }

    clearTimeout(timer);
    timer = setTimeout(() => { status.textContent = defaultText; }, 3000);
  });
}

initTheme();
initMenu();
initActiveLink();
initReveal();
initAbout();
initContact();
