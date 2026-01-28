document.addEventListener('DOMContentLoaded', () => {
    // Initialize Icons
    lucide.createIcons();

    // Inject Professional UI Styles
    const style = document.createElement('style');
    style.innerHTML = `
        @keyframes textGradient {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
        }
        @keyframes blinkCursor { 50% { opacity: 0; } }
        
        .typewriter-gradient {
            /* Changed Green (#C5FF41) to Electric Blue (#00A3FF) */
            background: linear-gradient(90deg, #fdfdfdff, #00A3FF, #f8f8f8ff, #00A3FF);
            background-size: 300% 300%;
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            animation: textGradient 8s ease infinite;
            display: inline-block;
        }
        .custom-cursor {
            display: inline-block;
            width: 2px;
            height: 1em;
            vertical-align: middle;
            margin-left: 5px;
            background: white;
            animation: blinkCursor 0.8s step-end infinite;
        }
        
        .section-reveal {
            opacity: 0;
            transform: translateY(40px);
            transition: all 1s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .section-reveal.visible {
            opacity: 1;
            transform: translateY(0);
        }

        .nav-links a {
            transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }

        .nav-links li {
            position: relative;
            display: flex;
            justify-content: center;
        }

        .nav-tooltip {
            position: absolute;
            top: 140%;
            background: #1e1e1e;
            color: #ffffff;
            padding: 6px 14px;
            border-radius: 10px;
            font-size: 13px;
            font-weight: 500;
            white-space: nowrap;
            opacity: 0;
            visibility: hidden;
            transform: translateY(-8px);
            transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
            pointer-events: none;
            box-shadow: 0 4px 12px rgba(0,0,0,0.5);
            border: 1px solid rgba(255,255,255,0.1);
            z-index: 1001;
        }

        .nav-links li:hover .nav-tooltip {
            opacity: 1;
            visibility: visible;
            transform: translateY(0);
        }
    `;
    document.head.appendChild(style);

    // Create Tooltip Elements
    const navItems = document.querySelectorAll('.nav-links li');
    navItems.forEach(item => {
        const link = item.querySelector('a');
        const labelText = link.getAttribute('aria-label');
        const tooltip = document.createElement('div');
        tooltip.className = 'nav-tooltip';
        tooltip.textContent = labelText;
        item.appendChild(tooltip);
    });

    // --- Synchronized Typewriter Animation Logic with Gradient ---
    const line1Element = document.querySelector('.type-line-1');
    const line2Element = document.querySelector('.type-line-2');
    
    // Apply gradient classes immediately
    line2Element.classList.add('typewriter-gradient');

    const cursor = document.createElement('span');
    cursor.className = 'custom-cursor';
    line2Element.after(cursor);
    
    const phrases = [
        { line1: "SOFTWARE", line2: "ENGINEER" },
        { line1: "WEB",      line2: "DEVELOPER" }
    ];

    let phraseIndex = 0;
    let charIndex = 0;
    let isDeleting = false;

    function type() {
        const currentPhrase = phrases[phraseIndex];
        
        // Use textContent so the text stays inside the gradient-styled span
        const text1 = isDeleting ? currentPhrase.line1.substring(0, charIndex - 1) : currentPhrase.line1.substring(0, charIndex + 1);
        const text2 = isDeleting ? currentPhrase.line2.substring(0, charIndex - 1) : currentPhrase.line2.substring(0, charIndex + 1);

        line1Element.textContent = text1 === "" ? "\u200B" : text1;
        line2Element.textContent = text2 === "" ? "\u200B" : text2;

        const maxLen = Math.max(currentPhrase.line1.length, currentPhrase.line2.length);
        
        if (!isDeleting) {
            charIndex++;
        } else {
            charIndex--;
        }

        let speed = isDeleting ? 50 : 150;

        if (!isDeleting && charIndex >= maxLen) {
            isDeleting = true;
            speed = 4000; 
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            phraseIndex = (phraseIndex + 1) % phrases.length;
            speed = 500;
        }
        setTimeout(type, speed);
    }
    type();

    // Stats Counter Logic
    const stats = document.querySelectorAll('.stat h2');
    const startCounter = (el) => {
        if (el.dataset.started) return;
        el.dataset.started = true;
        const target = parseInt(el.innerText);
        let count = 0;
        const update = () => {
            const increment = target / 40;
            if (count < target) {
                count += increment;
                el.innerText = Math.ceil(count) + (el.innerText.includes('+') ? '+' : '');
                setTimeout(update, 30);
            } else {
                el.innerText = target + (el.innerText.includes('+') ? '+' : '');
            }
        };
        update();
    };

    // Scroll Reveal & Nav Logic
    const sections = document.querySelectorAll('section');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                if (entry.target.classList.contains('stats')) {
                    stats.forEach(s => startCounter(s));
                }
            }
        });
    }, { threshold: 0.1 });

    sections.forEach(sec => {
        sec.classList.add('section-reveal');
        observer.observe(sec);
    });

    window.addEventListener('scroll', () => {
        let current = '';
        sections.forEach(section => {
            if (window.pageYOffset >= (section.offsetTop - 300)) {
                current = section.getAttribute('id') || section.getAttribute('class').split(' ')[0];
            }
        });

        const navLinks = document.querySelectorAll('.nav-links a');
        navLinks.forEach(link => {
            const label = link.getAttribute('aria-label').toLowerCase();
            const isActive = (current === 'hero' && label === 'home') ||
                             (current === 'projects' && label === 'work') ||
                             (current === 'experience' && label === 'portfolio') ||
                             (current === 'tools' && label === 'tools') ||
                             (current === 'contact' && label === 'contact');
            
            link.style.opacity = isActive ? "1" : "0.55";
            /* Changed Active Nav Link color from Green to Electric Blue */
            link.style.color = isActive ? "#00A3FF" : "#ffffff";
            link.style.transform = isActive ? "scale(1.2)" : "scale(1)";
        });
    });
});
console.log(
  `%c Powered by %c YOUSUF HUMRAN %c 🛠️ %c\n%c Main Developer | Software Engineer \n%c https://github.com/yousuf-humran `,
  "background: #1e1e1e; color: #737272; padding: 5px 0; border-radius: 5px 0 0 5px; font-family: sans-serif;",
  "background: #00A3FF; color: #ffffff; font-weight: bold; padding: 5px 10px; font-family: sans-serif;",
  "background: #1e1e1e; padding: 5px 5px; border-radius: 0 5px 5px 0;",
  "background: transparent; padding: 5px 0;",
  "color: #00A3FF; font-family: monospace; font-size: 12px; font-weight: bold; margin-top: 5px; display: block;",
  "color: #ffffff; font-family: monospace; font-size: 11px; text-decoration: underline;"
);