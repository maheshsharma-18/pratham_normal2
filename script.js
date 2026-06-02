/* ================================================
   script.js — Pratham Sadavarti Portfolio
   ================================================ */

/* -----------------------------------------------
   1. LOADER
----------------------------------------------- */
(function initLoader() {
    const loaderWrapper = document.getElementById('loaderWrapper');
    const loaderBar     = document.getElementById('loaderBar');
    const loaderPercent = document.getElementById('loaderPercent');

    if (!loaderWrapper) return;

    let progress = 0;
    const interval = setInterval(() => {
        progress += Math.random() * 12 + 3;
        if (progress >= 100) {
            progress = 100;
            clearInterval(interval);
            setTimeout(() => {
                loaderWrapper.classList.add('hidden');
                document.body.style.overflow = '';
                initAnimations();
            }, 400);
        }
        loaderBar.style.width     = progress + '%';
        loaderPercent.textContent = Math.floor(progress) + '%';
    }, 80);

    document.body.style.overflow = 'hidden';
})();

/* -----------------------------------------------
   2. CUSTOM CURSOR
----------------------------------------------- */
(function initCursor() {
    const cursor    = document.getElementById('customCursor');
    const cursorDot = document.getElementById('customCursorDot');
    if (!cursor || !cursorDot) return;

    let mouseX = 0, mouseY = 0;
    let dotX   = 0, dotY   = 0;

    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;

        cursorDot.style.left = mouseX + 'px';
        cursorDot.style.top  = mouseY + 'px';
    });

    // Smooth cursor follow
    function animateCursor() {
        dotX += (mouseX - dotX) * 0.12;
        dotY += (mouseY - dotY) * 0.12;

        cursor.style.left = dotX + 'px';
        cursor.style.top  = dotY + 'px';

        requestAnimationFrame(animateCursor);
    }
    animateCursor();

    // Hovering effect on interactive elements
    const hoverTargets = document.querySelectorAll(
        'a, button, .gallery-item, .reel-card, .expertise-icon, .hobby-icon, .footer-tag, .nav-link'
    );

    hoverTargets.forEach(el => {
        el.addEventListener('mouseenter', () => cursor.classList.add('hovering'));
        el.addEventListener('mouseleave', () => cursor.classList.remove('hovering'));
    });

    // Hide cursor when leaving window
    document.addEventListener('mouseleave', () => {
        cursor.style.opacity    = '0';
        cursorDot.style.opacity = '0';
    });
    document.addEventListener('mouseenter', () => {
        cursor.style.opacity    = '1';
        cursorDot.style.opacity = '1';
    });
})();

/* -----------------------------------------------
   3. NAVBAR — scroll + hamburger
----------------------------------------------- */
(function initNavbar() {
    const navbar     = document.getElementById('navbar');
    const hamburger  = document.getElementById('hamburger');
    const mobileMenu = document.getElementById('mobileMenu');
    const mobLinks   = document.querySelectorAll('.mob-link');
    const navLinks   = document.querySelectorAll('.nav-link');

    // Scroll effect
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // Hamburger toggle
    if (hamburger && mobileMenu) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('open');
            mobileMenu.classList.toggle('open');
        });

        // Close on link click
        mobLinks.forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('open');
                mobileMenu.classList.remove('open');
            });
        });
    }

    // Active nav link on scroll
    const sections = document.querySelectorAll('section[id], footer[id]');

    function updateActiveNav() {
        let currentSection = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 100;
            if (window.scrollY >= sectionTop) {
                currentSection = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === '#' + currentSection) {
                link.classList.add('active');
            }
        });
    }

    window.addEventListener('scroll', updateActiveNav);
    updateActiveNav();
})();

/* -----------------------------------------------
   4. PARTICLES CANVAS (Hero background)
----------------------------------------------- */
(function initParticles() {
    const canvas = document.getElementById('particlesCanvas');
    if (!canvas) return;

    const ctx    = canvas.getContext('2d');
    let particles = [];
    let animFrame;

    function resize() {
        canvas.width  = canvas.offsetWidth;
        canvas.height = canvas.offsetHeight;
    }

    window.addEventListener('resize', () => {
        resize();
        createParticles();
    });
    resize();

    function createParticles() {
        particles = [];
        const count = Math.floor((canvas.width * canvas.height) / 18000);
        for (let i = 0; i < count; i++) {
            particles.push({
                x:   Math.random() * canvas.width,
                y:   Math.random() * canvas.height,
                r:   Math.random() * 1.5 + 0.3,
                vx:  (Math.random() - 0.5) * 0.3,
                vy:  (Math.random() - 0.5) * 0.3,
                alpha: Math.random() * 0.5 + 0.1,
            });
        }
    }
    createParticles();

    function drawParticles() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particles.forEach(p => {
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(220, 226, 0, ${p.alpha})`;
            ctx.fill();

            p.x += p.vx;
            p.y += p.vy;

            if (p.x < 0) p.x = canvas.width;
            if (p.x > canvas.width) p.x = 0;
            if (p.y < 0) p.y = canvas.height;
            if (p.y > canvas.height) p.y = 0;
        });

        animFrame = requestAnimationFrame(drawParticles);
    }
    drawParticles();
})();

/* -----------------------------------------------
   5. SCROLL REVEAL (Intersection Observer)
----------------------------------------------- */
function initAnimations() {
    const revealEls = document.querySelectorAll('.reveal-on-scroll');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, i) => {
            if (entry.isIntersecting) {
                // Stagger delay for grid children
                const delay = entry.target.dataset.delay || 0;
                setTimeout(() => {
                    entry.target.classList.add('revealed');
                }, delay);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

    revealEls.forEach((el, i) => {
        // Auto-stagger siblings in grid
        const parent  = el.parentElement;
        const siblings = parent.querySelectorAll('.reveal-on-scroll');
        const index    = Array.from(siblings).indexOf(el);
        el.dataset.delay = index * 80;
        observer.observe(el);
    });
}

/* -----------------------------------------------
   6. SKILL BAR ANIMATION
----------------------------------------------- */
(function initSkillBars() {
    const skillBars = document.querySelectorAll('.skill-bar-fill');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const bar       = entry.target;
                const targetWidth = bar.dataset.width || 0;
                setTimeout(() => {
                    bar.style.width = targetWidth + '%';
                }, 200);
                observer.unobserve(bar);
            }
        });
    }, { threshold: 0.3 });

    skillBars.forEach(bar => {
        bar.style.width = '0%';
        observer.observe(bar);
    });
})();

/* -----------------------------------------------
   7. COUNTER ANIMATION (stats if added later)
----------------------------------------------- */
function animateCounter(el, target, duration = 1500) {
    let start = 0;
    const step = target / (duration / 16);
    const timer = setInterval(() => {
        start += step;
        if (start >= target) {
            start = target;
            clearInterval(timer);
        }
        el.textContent = Math.floor(start);
    }, 16);
}

/* -----------------------------------------------
   8. LIGHTBOX for Gallery Images
----------------------------------------------- */
(function initLightbox() {
    const overlay  = document.getElementById('lightboxOverlay');
    const imgEl    = document.getElementById('lightboxImg');
    const closeBtn = document.getElementById('lightboxClose');
    const prevBtn  = document.getElementById('lightboxPrev');
    const nextBtn  = document.getElementById('lightboxNext');
    const counter  = document.getElementById('lightboxCounter');

    if (!overlay) return;

    let galleryImages = [];
    let currentIndex  = 0;

    // Collect all real gallery images (not placeholders)
    function collectImages() {
        galleryImages = [];
        document.querySelectorAll('.gallery-item img').forEach(img => {
            galleryImages.push({ src: img.src, alt: img.alt || 'Design' });
        });
    }

    // Open lightbox
    function openLightbox(index) {
        collectImages();
        if (galleryImages.length === 0) return;
        currentIndex = index;
        showImage(currentIndex);
        overlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeLightbox() {
        overlay.classList.remove('active');
        document.body.style.overflow = '';
        imgEl.src = '';
    }

    function showImage(index) {
        if (index < 0) index = galleryImages.length - 1;
        if (index >= galleryImages.length) index = 0;
        currentIndex = index;

        imgEl.style.opacity = '0';
        imgEl.src = galleryImages[currentIndex].src;
        imgEl.alt = galleryImages[currentIndex].alt;
        imgEl.onload = () => { imgEl.style.opacity = '1'; };
        counter.textContent = (currentIndex + 1) + ' / ' + galleryImages.length;
    }

    // Attach click to gallery items
    document.addEventListener('click', (e) => {
        const item = e.target.closest('.gallery-item');
        if (!item) return;
        const img = item.querySelector('img');
        if (!img) return;

        collectImages();
        const index = galleryImages.findIndex(g => g.src === img.src);
        openLightbox(index >= 0 ? index : 0);
    });

    closeBtn.addEventListener('click', closeLightbox);
    prevBtn.addEventListener('click',  () => showImage(currentIndex - 1));
    nextBtn.addEventListener('click',  () => showImage(currentIndex + 1));

    // Click outside image
    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) closeLightbox();
    });

    // Keyboard
    document.addEventListener('keydown', (e) => {
        if (!overlay.classList.contains('active')) return;
        if (e.key === 'ArrowLeft')  showImage(currentIndex - 1);
        if (e.key === 'ArrowRight') showImage(currentIndex + 1);
        if (e.key === 'Escape')     closeLightbox();
    });

    // Transition for image
    imgEl.style.transition = 'opacity 0.25s ease';
})();

/* -----------------------------------------------
   9. BACK TO TOP BUTTON
----------------------------------------------- */
(function initBackToTop() {
    const btn = document.getElementById('backToTop');
    if (!btn) return;

    window.addEventListener('scroll', () => {
        if (window.scrollY > 500) {
            btn.classList.add('visible');
        } else {
            btn.classList.remove('visible');
        }
    });

    btn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
})();

/* -----------------------------------------------
   10. SCROLL INDICATOR — hide on scroll
----------------------------------------------- */
(function initScrollIndicator() {
    const indicator = document.getElementById('scrollIndicator');
    if (!indicator) return;

    window.addEventListener('scroll', () => {
        if (window.scrollY > 100) {
            indicator.style.opacity = '0';
        } else {
            indicator.style.opacity = '1';
        }
    }, { passive: true });
})();

/* -----------------------------------------------
   11. SMOOTH HOVER TILT on cards
----------------------------------------------- */
(function initTiltEffect() {
    const cards = document.querySelectorAll('.reel-card, .work-exp-card, .expertise-card');

    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect   = card.getBoundingClientRect();
            const x      = e.clientX - rect.left;
            const y      = e.clientY - rect.top;
            const centerX = rect.width  / 2;
            const centerY = rect.height / 2;
            const rotateX = ((y - centerY) / centerY) * -4;
            const rotateY = ((x - centerX) / centerX) *  4;

            card.style.transform = `perspective(600px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = '';
        });
    });
})();

/* -----------------------------------------------
   12. TYPING EFFECT on hero (optional label)
----------------------------------------------- */
(function initTypingEffect() {
    const el = document.querySelector('.hero-degree');
    if (!el) return;

    const text     = el.textContent.trim();
    const words    = ['Video Editor & Creative Designer', 'Motion Graphics Artist', 'Visual Storyteller'];
    let wordIndex  = 0;
    let charIndex  = 0;
    let isDeleting = false;

    function type() {
        const currentWord = words[wordIndex];

        if (!isDeleting) {
            el.textContent = currentWord.slice(0, charIndex + 1);
            charIndex++;
            if (charIndex === currentWord.length) {
                isDeleting = true;
                setTimeout(type, 2000);
                return;
            }
        } else {
            el.textContent = currentWord.slice(0, charIndex - 1);
            charIndex--;
            if (charIndex === 0) {
                isDeleting = false;
                wordIndex  = (wordIndex + 1) % words.length;
            }
        }

        const speed = isDeleting ? 50 : 90;
        setTimeout(type, speed);
    }

    // Start after page loads
    setTimeout(type, 2500);
})();

/* -----------------------------------------------
   13. LAZY LOAD images (performance)
----------------------------------------------- */
(function initLazyLoad() {
    const images = document.querySelectorAll('img[data-src]');
    if (!images.length) return;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img    = entry.target;
                img.src      = img.dataset.src;
                img.removeAttribute('data-src');
                observer.unobserve(img);
            }
        });
    }, { rootMargin: '200px' });

    images.forEach(img => observer.observe(img));
})();

/* -----------------------------------------------
   14. SECTION TRANSITIONS (sharp color change)
----------------------------------------------- */
(function initSectionTransitions() {
    const sections = document.querySelectorAll('section');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
            }
        });
    }, { threshold: 0.05 });

    sections.forEach(s => observer.observe(s));
})();

/* -----------------------------------------------
   15. INIT on DOM ready
----------------------------------------------- */
document.addEventListener('DOMContentLoaded', () => {
    // Init scroll reveal immediately (also called after loader)
    initAnimations();

    // Log ready
    console.log('%c Pratham Sadavarti Portfolio Loaded ✅', 
        'color: #DCE200; background: #111; padding: 6px 12px; font-weight: bold; border-radius: 4px;');
});
