/* ============================================
   WEDDING INVITATION - BRUTALIST LUXURY
   JavaScript Effects & Interactions
   ============================================ */

// Wait for DOM to be ready
document.addEventListener('DOMContentLoaded', () => {
    // Initialize all modules
    Loader.init();
    SmoothScroll.init();
    CustomCursor.init();
    MagneticButtons.init();
    Navigation.init();
    Animations.init();
    Parallax.init();
    Forms.init();

    // Hero video: slow playback, replay 3 times per loop cycle
    const heroVideo = document.getElementById('heroVideo');
    if (heroVideo) {
        heroVideo.playbackRate = 0.5;
        heroVideo.removeAttribute('loop');
        let playCount = 0;
        heroVideo.addEventListener('ended', () => {
            playCount++;
            if (playCount < 3) {
                heroVideo.currentTime = 0;
                heroVideo.play();
            } else {
                playCount = 0;
                heroVideo.currentTime = 0;
                heroVideo.play();
            }
        });
    }

    // Music toggle
    MusicPlayer.init();
});

/* ============================================
   LOADER MODULE
   ============================================ */
const Loader = {
    init() {
        const loader = document.querySelector('.loader');
        const body = document.body;

        body.classList.add('loading');

        // Simulate loading time for assets
        window.addEventListener('load', () => {
            setTimeout(() => {
                loader.classList.add('hidden');
                body.classList.remove('loading');

                // Trigger hero animations after loader hides
                setTimeout(() => {
                    this.animateHero();
                }, 300);
            }, 2500);
        });
    },

    animateHero() {
        const heroSection = document.querySelector('.hero-section');
        heroSection.classList.add('loaded');

        // Animate date letters
        const dateLetters = document.querySelectorAll('.hero-date .letter');
        dateLetters.forEach((letter, index) => {
            setTimeout(() => {
                letter.style.opacity = '1';
                letter.style.transform = 'translateY(0)';
            }, 100 + (index * 50));
        });

        // Animate title words
        const titleWords = document.querySelectorAll('.hero-title .word');
        titleWords.forEach((word, index) => {
            setTimeout(() => {
                word.style.transform = 'translateY(0)';
                word.style.opacity = '1';
                word.style.transition = 'all 1s cubic-bezier(0.19, 1, 0.22, 1)';
            }, 600 + (index * 200));
        });

        // Animate subtitle
        const subtitle = document.querySelector('.hero-subtitle');
        setTimeout(() => {
            subtitle.style.opacity = '1';
            subtitle.style.transform = 'translateY(0)';
            subtitle.style.transition = 'all 1s cubic-bezier(0.19, 1, 0.22, 1)';
        }, 1400);
    }
};

/* ============================================
   SMOOTH SCROLL MODULE
   ============================================ */
const SmoothScroll = {
    wrapper: null,
    content: null,
    scrollY: 0,
    targetY: 0,
    currentY: 0,
    ease: 0.075,
    isTouch: false,

    init() {
        this.wrapper = document.querySelector('.smooth-scroll-wrapper');
        this.content = document.querySelector('.smooth-scroll-content');

        // Check for touch device
        this.isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

        if (this.isTouch) {
            document.body.classList.add('no-smooth-scroll');
            return;
        }

        // Set body height to enable scrolling
        this.setBodyHeight();

        // Bind events
        window.addEventListener('resize', () => this.setBodyHeight());
        window.addEventListener('scroll', () => this.onScroll());

        // Start animation loop
        this.animate();
    },

    setBodyHeight() {
        document.body.style.height = `${this.content.getBoundingClientRect().height}px`;
    },

    onScroll() {
        this.targetY = window.scrollY;
    },

    lerp(start, end, factor) {
        return start + (end - start) * factor;
    },

    animate() {
        this.currentY = this.lerp(this.currentY, this.targetY, this.ease);

        // Round to avoid sub-pixel rendering
        this.currentY = Math.round(this.currentY * 100) / 100;

        this.content.style.transform = `translateY(${-this.currentY}px)`;

        // Update scroll-based animations
        Parallax.update(this.currentY);

        requestAnimationFrame(() => this.animate());
    },

    getScrollY() {
        return this.isTouch ? window.scrollY : this.currentY;
    }
};

/* ============================================
   CUSTOM CURSOR MODULE
   ============================================ */
const CustomCursor = {
    dot: null,
    circle: null,
    mouseX: 0,
    mouseY: 0,
    dotX: 0,
    dotY: 0,
    circleX: 0,
    circleY: 0,
    isTouch: false,

    init() {
        this.isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
        if (this.isTouch) return;

        this.dot = document.querySelector('.cursor-dot');
        this.circle = document.querySelector('.cursor-circle');

        document.addEventListener('mousemove', (e) => this.onMouseMove(e));

        // Add hover class to interactive elements
        const interactiveElements = document.querySelectorAll('a, button, .nav-btn, .gallery-item, .btn-primary, .btn-submit, input, select, textarea');
        interactiveElements.forEach(el => {
            el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
            el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
        });

        this.animate();
    },

    onMouseMove(e) {
        this.mouseX = e.clientX;
        this.mouseY = e.clientY;
    },

    lerp(start, end, factor) {
        return start + (end - start) * factor;
    },

    animate() {
        // Dot follows cursor closely
        this.dotX = this.lerp(this.dotX, this.mouseX, 0.5);
        this.dotY = this.lerp(this.dotY, this.mouseY, 0.5);

        // Circle follows with more lag
        this.circleX = this.lerp(this.circleX, this.mouseX, 0.15);
        this.circleY = this.lerp(this.circleY, this.mouseY, 0.15);

        this.dot.style.left = `${this.dotX}px`;
        this.dot.style.top = `${this.dotY}px`;

        this.circle.style.left = `${this.circleX}px`;
        this.circle.style.top = `${this.circleY}px`;

        requestAnimationFrame(() => this.animate());
    }
};

/* ============================================
   MAGNETIC BUTTONS MODULE
   ============================================ */
const MagneticButtons = {
    init() {
        const magneticElements = document.querySelectorAll('.magnetic');

        magneticElements.forEach(el => {
            const strength = parseFloat(el.dataset.strength) || 25;

            el.addEventListener('mousemove', (e) => this.onMouseMove(e, el, strength));
            el.addEventListener('mouseleave', () => this.onMouseLeave(el));
        });
    },

    onMouseMove(e, el, strength) {
        const rect = el.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        const deltaX = (e.clientX - centerX) / rect.width * strength;
        const deltaY = (e.clientY - centerY) / rect.height * strength;

        el.style.transform = `translate(${deltaX}px, ${deltaY}px)`;
    },

    onMouseLeave(el) {
        el.style.transform = 'translate(0, 0)';
        el.style.transition = 'transform 0.4s cubic-bezier(0.23, 1, 0.32, 1)';

        setTimeout(() => {
            el.style.transition = '';
        }, 400);
    }
};

/* ============================================
   NAVIGATION MODULE
   ============================================ */
const Navigation = {
    menuBtn: null,
    overlay: null,
    isOpen: false,

    init() {
        this.menuBtn = document.querySelector('.nav-btn:not(.rsvp-trigger)');
        this.overlay = document.querySelector('.nav-overlay');
        const navLinks = document.querySelectorAll('.nav-link');
        const rsvpBtn = document.querySelector('.rsvp-trigger');

        this.menuBtn.addEventListener('click', () => this.toggle());

        navLinks.forEach((link, index) => {
            link.style.transitionDelay = `${0.1 + index * 0.05}s`;
            link.addEventListener('click', (e) => this.onNavClick(e, link));
        });

        rsvpBtn.addEventListener('click', () => this.scrollTo('#rsvp'));

        // Close on escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isOpen) {
                this.close();
            }
        });
    },

    toggle() {
        this.isOpen ? this.close() : this.open();
    },

    open() {
        this.isOpen = true;
        this.overlay.classList.add('active');
        this.menuBtn.querySelector('span').textContent = 'Mbyll';
    },

    close() {
        this.isOpen = false;
        this.overlay.classList.remove('active');
        this.menuBtn.querySelector('span').textContent = 'Menu';
    },

    onNavClick(e, link) {
        e.preventDefault();
        const target = link.getAttribute('href');
        this.close();

        setTimeout(() => {
            this.scrollTo(target);
        }, 500);
    },

    scrollTo(target) {
        const element = document.querySelector(target);
        if (!element) return;

        const offset = element.getBoundingClientRect().top + window.scrollY;

        window.scrollTo({
            top: offset,
            behavior: 'smooth'
        });
    }
};

/* ============================================
   ANIMATIONS MODULE (Intersection Observer)
   ============================================ */
const Animations = {
    init() {
        this.initFadeUp();
        this.initSplitWords();
        this.initTrackingAnimation();
    },

    initFadeUp() {
        const fadeElements = document.querySelectorAll('.fade-up');

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const delay = entry.target.dataset.delay || 0;
                    setTimeout(() => {
                        entry.target.classList.add('visible');
                    }, delay);
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });

        fadeElements.forEach(el => observer.observe(el));
    },

    initSplitWords() {
        const splitElements = document.querySelectorAll('.large-title.split-words');

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');

                    const words = entry.target.querySelectorAll('.word');
                    words.forEach((word, index) => {
                        word.style.transitionDelay = `${index * 0.08}s`;
                    });

                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.3
        });

        splitElements.forEach(el => observer.observe(el));
    },

    initTrackingAnimation() {
        const trackingElements = document.querySelectorAll('.tracking-animation');

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    setTimeout(() => {
                        entry.target.classList.add('tight');
                    }, 500);
                } else {
                    entry.target.classList.remove('tight');
                }
            });
        }, {
            threshold: 0.5
        });

        trackingElements.forEach(el => observer.observe(el));
    }
};

/* ============================================
   PARALLAX MODULE
   ============================================ */
const Parallax = {
    images: [],

    init() {
        const parallaxImages = document.querySelectorAll('.parallax-image img');

        parallaxImages.forEach(img => {
            this.images.push({
                element: img,
                speed: parseFloat(img.dataset.speed) || 0.5
            });
        });

        // Initialize vertical marquees speed based on scroll
        this.initMarqueeSpeed();
    },

    update(scrollY) {
        this.images.forEach(({element, speed}) => {
            const rect = element.parentElement.getBoundingClientRect();
            const viewportHeight = window.innerHeight;

            // Only animate when in view
            if (rect.bottom > 0 && rect.top < viewportHeight) {
                const yPos = (rect.top - viewportHeight) * speed;
                element.style.transform = `translateY(${yPos}px) scale(1.1)`;
            }
        });

        // Update marquee speed based on scroll velocity
        this.updateMarqueeSpeed(scrollY);
    },

    initMarqueeSpeed() {
        this.lastScrollY = 0;
        this.marqueeLeft = document.querySelector('.vertical-marquee.left .marquee-content');
        this.marqueeRight = document.querySelector('.vertical-marquee.right .marquee-content');
    },

    updateMarqueeSpeed(currentScrollY) {
        if (!this.marqueeLeft || !this.marqueeRight) return;

        const velocity = Math.abs(currentScrollY - this.lastScrollY);
        const speedMultiplier = Math.min(1 + velocity * 0.01, 3);

        this.marqueeLeft.style.animationDuration = `${20 / speedMultiplier}s`;
        this.marqueeRight.style.animationDuration = `${20 / speedMultiplier}s`;

        this.lastScrollY = currentScrollY;
    }
};

/* ============================================
   FORMS MODULE
   ============================================ */
const Forms = {
    init() {
        const form = document.getElementById('rsvpForm');
        if (!form) return;

        form.addEventListener('submit', (e) => this.onSubmit(e, form));

        // Float labels when autofilled
        const inputs = form.querySelectorAll('input, select, textarea');
        inputs.forEach(input => {
            input.addEventListener('input', () => this.checkInput(input));
            input.addEventListener('blur', () => this.checkInput(input));

            // Check on load for autofilled values
            setTimeout(() => this.checkInput(input), 100);
        });
    },

    checkInput(input) {
        if (input.value) {
            input.classList.add('has-value');
        } else {
            input.classList.remove('has-value');
        }
    },

    onSubmit(e, form) {
        e.preventDefault();

        const formData = new FormData(form);
        const data = Object.fromEntries(formData);

        // Show success message (in real app, send to server)
        const btn = form.querySelector('.btn-submit');
        const originalText = btn.querySelector('.btn-text').textContent;

        btn.querySelector('.btn-text').textContent = 'Duke dërguar...';
        btn.disabled = true;

        // Simulate API call
        setTimeout(() => {
            btn.querySelector('.btn-text').textContent = 'Faleminderit!';
            btn.style.background = '#2ecc71';

            // Reset form after delay
            setTimeout(() => {
                form.reset();
                btn.querySelector('.btn-text').textContent = originalText;
                btn.disabled = false;
                btn.style.background = '';
            }, 3000);
        }, 1500);

        console.log('Form submitted:', data);
    }
};

/* ============================================
   GALLERY LIGHTBOX (Optional Enhancement)
   ============================================ */
const Gallery = {
    init() {
        const galleryItems = document.querySelectorAll('.gallery-item');

        galleryItems.forEach(item => {
            item.addEventListener('click', () => {
                const img = item.querySelector('img');
                // Could implement lightbox here
                console.log('Gallery item clicked:', img.src);
            });
        });
    }
};

// Initialize gallery
Gallery.init();

/* ============================================
   REVEAL ON SCROLL - STAGGERED ANIMATIONS
   ============================================ */
const RevealOnScroll = {
    init() {
        // Timeline items stagger
        const timelineItems = document.querySelectorAll('.timeline-item');
        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry, index) => {
                if (entry.isIntersecting) {
                    setTimeout(() => {
                        entry.target.classList.add('visible');
                    }, index * 100);
                }
            });
        }, {
            threshold: 0.2
        });

        timelineItems.forEach(item => observer.observe(item));

        // Gallery items stagger
        const galleryItems = document.querySelectorAll('.gallery-item');
        const galleryObserver = new IntersectionObserver((entries) => {
            entries.forEach((entry, index) => {
                if (entry.isIntersecting) {
                    setTimeout(() => {
                        entry.target.style.opacity = '1';
                        entry.target.style.transform = 'translateY(0)';
                    }, index * 100);
                    galleryObserver.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1
        });

        galleryItems.forEach(item => {
            item.style.opacity = '0';
            item.style.transform = 'translateY(30px)';
            item.style.transition = 'all 0.8s cubic-bezier(0.19, 1, 0.22, 1)';
            galleryObserver.observe(item);
        });
    }
};

RevealOnScroll.init();

/* ============================================
   MUSIC PLAYER MODULE
   ============================================ */
const MusicPlayer = {
    audio: null,
    btn: null,
    isPlaying: false,

    init() {
        this.audio = document.getElementById('bgMusic');
        this.btn = document.getElementById('musicToggle');
        if (!this.audio || !this.btn) return;

        this.audio.volume = 0.4;

        this.btn.addEventListener('click', () => this.toggle());

        // Try to autoplay on first user interaction
        const startOnInteraction = () => {
            if (!this.isPlaying) {
                this.play();
            }
            document.removeEventListener('click', startOnInteraction);
            document.removeEventListener('scroll', startOnInteraction);
            document.removeEventListener('touchstart', startOnInteraction);
        };

        document.addEventListener('click', startOnInteraction);
        document.addEventListener('scroll', startOnInteraction);
        document.addEventListener('touchstart', startOnInteraction);
    },

    toggle() {
        this.isPlaying ? this.pause() : this.play();
    },

    play() {
        const playPromise = this.audio.play();
        if (playPromise !== undefined) {
            playPromise.then(() => {
                this.isPlaying = true;
                this.btn.classList.add('playing');
            }).catch(() => {
                // Autoplay blocked, user needs to click
            });
        }
    },

    pause() {
        this.audio.pause();
        this.isPlaying = false;
        this.btn.classList.remove('playing');
    }
};
