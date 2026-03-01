/* ========================================
   KINGZ OF TWINZ - Main JavaScript
   Roc Nation Inspired Interactions
======================================== */

document.addEventListener('DOMContentLoaded', () => {
    initNavigation();
    initHeaderScroll();
    initSmoothScroll();
    initScrollReveal();
    initCounterAnimation();
    initRosterFilter();
    initNewsCarousel();
    initContactForm();
    initHeroAnimation();
    initAboutImageToggle();
    initArtistModals();
    initTalentPeek();
    initBookingModal();
});

/* ========================================
   Navigation
======================================== */
function initNavigation() {
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');
    const navLinks = document.querySelectorAll('.nav__link');
    const sections = Array.from(document.querySelectorAll('section[id]')).filter(section =>
        document.querySelector(`.nav__link[href="#${section.id}"]`)
    );

    navToggle?.setAttribute('aria-expanded', 'false');

    navToggle?.addEventListener('click', () => {
        navToggle.classList.toggle('active');
        navMenu.classList.toggle('active');
        const isOpen = navMenu.classList.contains('active');
        navToggle.setAttribute('aria-expanded', String(isOpen));
        navToggle.setAttribute('aria-label', isOpen ? 'Close menu' : 'Open menu');
        document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navToggle?.classList.remove('active');
            navMenu?.classList.remove('active');
            navToggle?.setAttribute('aria-expanded', 'false');
            navToggle?.setAttribute('aria-label', 'Open menu');
            document.body.style.overflow = '';
        });
    });

    window.addEventListener('resize', () => {
        if (window.innerWidth > 768) {
            navToggle?.classList.remove('active');
            navMenu?.classList.remove('active');
            navToggle?.setAttribute('aria-expanded', 'false');
            navToggle?.setAttribute('aria-label', 'Open menu');
            document.body.style.overflow = '';
        }
    });

    window.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && navMenu?.classList.contains('active')) {
            navToggle?.classList.remove('active');
            navMenu?.classList.remove('active');
            navToggle?.setAttribute('aria-expanded', 'false');
            navToggle?.setAttribute('aria-label', 'Open menu');
            document.body.style.overflow = '';
        }
    });

    function setActiveLink(sectionId) {
        const navLink = document.querySelector(`.nav__link[href="#${sectionId}"]`);
        navLinks.forEach(link => link.classList.remove('active'));
        navLink?.classList.add('active');
    }

    // Update active link on scroll
    function updateActiveLink() {
        if (!sections.length) return;

        const headerOffset = 160;
        let currentSection = sections[0];

        sections.forEach(section => {
            const rect = section.getBoundingClientRect();
            if (rect.top <= headerOffset) {
                currentSection = section;
            }
        });

        setActiveLink(currentSection.getAttribute('id'));
    }

    if ('IntersectionObserver' in window) {
        const sectionVisibility = new Map();
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                sectionVisibility.set(entry.target, entry.isIntersecting ? entry.intersectionRatio : 0);
            });

            let bestSection = null;
            let bestRatio = 0;
            sectionVisibility.forEach((ratio, section) => {
                if (ratio > bestRatio) {
                    bestRatio = ratio;
                    bestSection = section;
                }
            });

            if (bestSection) {
                setActiveLink(bestSection.getAttribute('id'));
            }
        }, {
            rootMargin: '-35% 0px -45% 0px',
            threshold: [0, 0.15, 0.3, 0.5, 0.7]
        });

        sections.forEach(section => {
            sectionVisibility.set(section, 0);
            observer.observe(section);
        });
    } else {
        window.addEventListener('scroll', updateActiveLink, { passive: true });
        window.addEventListener('resize', updateActiveLink);
        updateActiveLink();
    }
}

/* ========================================
   Header Scroll Effect
======================================== */
function initHeaderScroll() {
    const header = document.getElementById('header');

    function handleScroll() {
        if (window.scrollY > 50) {
            header?.classList.add('scrolled');
        } else {
            header?.classList.remove('scrolled');
        }
    }

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
}

/* ========================================
   Smooth Scroll
======================================== */
function initSmoothScroll() {
    const links = document.querySelectorAll('a[href^="#"]');

    links.forEach(link => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');
            if (href === '#') return;

            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                const headerOffset = 100;
                const elementPosition = target.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.scrollY - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

/* ========================================
   Scroll Reveal Animation - DRAMATIC
======================================== */
function initScrollReveal() {
    // Section overlap animations
    const sections = document.querySelectorAll('.section');
    const sectionStacks = document.querySelectorAll('.section-stack');
    const useGsap = typeof window.gsap !== 'undefined';
    sections.forEach((section, index) => {
        if (index > 0) { // Skip hero
            section.classList.add('section-animate');
        }
    });

    // Individual element animations with dramatic effects
    const slideLeftElements = document.querySelectorAll('.about__content, .contact__info');
    const slideRightElements = document.querySelectorAll('.about__visual, .contact__form-wrapper');
    const scaleElements = document.querySelectorAll('.tour-card, .cta__content');
    const rotateElements = useGsap ? [] : document.querySelectorAll('.section__header');

    slideLeftElements.forEach(el => el.classList.add('slide-in-left'));
    slideRightElements.forEach(el => el.classList.add('slide-in-right'));
    scaleElements.forEach(el => el.classList.add('scale-in'));
    rotateElements.forEach(el => el.classList.add('rotate-in'));

    // Stagger items with more dramatic entrance
    const talentCards = document.querySelectorAll('.talent-card');
    const serviceItems = document.querySelectorAll('.service-item');
    const newsCards = document.querySelectorAll('.news-card');
    const filterBtns = document.querySelectorAll('.filter-btn');
    const statItems = document.querySelectorAll('.stat');

    talentCards.forEach(el => el.classList.add('stagger-item'));
    serviceItems.forEach(el => el.classList.add('stagger-item'));
    newsCards.forEach(el => el.classList.add('stagger-item'));
    filterBtns.forEach(el => el.classList.add('stagger-item'));
    statItems.forEach(el => el.classList.add('stagger-item'));

    // Intersection Observer for all animated elements - dramatic timing
    const animatedElements = document.querySelectorAll(
        '.section-animate, .slide-in-left, .slide-in-right, .scale-in, .rotate-in, .clip-reveal, .bounce-in'
    );

    if (!('IntersectionObserver' in window)) {
        sections.forEach(section => section.classList.add('in-view'));
        sectionStacks.forEach(stack => stack.classList.add('in-view'));
        animatedElements.forEach(el => el.classList.add('in-view'));
        return;
    }

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Add slight delay for dramatic effect
                requestAnimationFrame(() => {
                    entry.target.classList.add('in-view');
                });
            }
        });
    }, {
        threshold: 0.08,
        rootMargin: '0px 0px -80px 0px'
    });

    animatedElements.forEach(el => observer.observe(el));

    // Separate observer for sections to trigger child animations with drama
    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Dramatic section entrance
                requestAnimationFrame(() => {
                    entry.target.classList.add('in-view');
                });

                // Trigger stagger animations for children with dramatic timing
                const staggerItems = entry.target.querySelectorAll('.stagger-item');
                staggerItems.forEach((item, i) => {
                    setTimeout(() => {
                        item.classList.add('in-view');
                    }, 150 + (i * 120)); // Longer delays for drama
                });
            }
        });
    }, {
        threshold: 0.05,
        rootMargin: '0px 0px -30px 0px'
    });

    sections.forEach(section => sectionObserver.observe(section));
    sectionStacks.forEach(stack => sectionObserver.observe(stack));

}

/* ========================================
   Counter Animation
======================================== */
function initCounterAnimation() {
    const counters = document.querySelectorAll('.stat__number[data-count]');
    let animated = false;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !animated) {
                animated = true;
                animateCounters();
            }
        });
    }, { threshold: 0.5 });

    const statsSection = document.querySelector('.about__stats');
    if (statsSection) observer.observe(statsSection);

    function animateCounters() {
        counters.forEach(counter => {
            const target = parseInt(counter.getAttribute('data-count'), 10);
            const duration = 2000;
            const startTime = performance.now();

            function update(currentTime) {
                const elapsed = currentTime - startTime;
                const progress = Math.min(elapsed / duration, 1);
                const easeOut = 1 - Math.pow(1 - progress, 3);
                const current = Math.floor(easeOut * target);

                counter.textContent = current;

                if (progress < 1) {
                    requestAnimationFrame(update);
                } else {
                    counter.textContent = target;
                }
            }

            requestAnimationFrame(update);
        });
    }
}

/* ========================================
   Roster Filter
======================================== */
function initRosterFilter() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    const talentCards = document.querySelectorAll('.talent-card');

    const applyFilter = (filter) => {
        talentCards.forEach(card => {
            const category = card.dataset.category || '';
            const categories = category.split(/\s+/).filter(Boolean);

            if (categories.includes(filter)) {
                card.style.display = '';
                setTimeout(() => {
                    card.style.opacity = '1';
                    card.style.transform = 'translateY(0)';
                }, 50);
            } else {
                card.style.opacity = '0';
                card.style.transform = 'translateY(20px)';
                setTimeout(() => {
                    card.style.display = 'none';
                }, 400);
            }
        });
    };

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const filter = btn.dataset.filter;

            // Update active button
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            applyFilter(filter);
        });
    });

    // Initialize card styles
    talentCards.forEach(card => {
        card.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
    });

    // Apply initial active filter on load
    const activeBtn = document.querySelector('.filter-btn.active');
    if (activeBtn?.dataset.filter) {
        applyFilter(activeBtn.dataset.filter);
    }
}

/* ========================================
   News Carousel
======================================== */
function initNewsCarousel() {
    const carousel = document.getElementById('newsCarousel');
    const track = carousel?.querySelector('.news__track');
    const prevBtn = document.querySelector('.news__nav-btn--prev');
    const nextBtn = document.querySelector('.news__nav-btn--next');

    if (!carousel || !track) return;

    let currentIndex = 0;
    const cards = track.querySelectorAll('.news-card');
    const cardCount = cards.length;

    function getVisibleCards() {
        const width = window.innerWidth;
        if (width < 768) return 1;
        if (width < 1024) return 2;
        return 3;
    }

    function updateCarousel() {
        const visibleCards = getVisibleCards();
        const maxIndex = Math.max(0, cardCount - visibleCards);
        currentIndex = Math.min(currentIndex, maxIndex);

        const cardWidth = cards[0]?.offsetWidth || 300;
        const gap = 24; // var(--spacing-lg)
        const offset = currentIndex * (cardWidth + gap);

        track.style.transform = `translateX(-${offset}px)`;

        // Update button states
        prevBtn?.classList.toggle('disabled', currentIndex === 0);
        nextBtn?.classList.toggle('disabled', currentIndex >= maxIndex);
    }

    prevBtn?.addEventListener('click', () => {
        if (currentIndex > 0) {
            currentIndex--;
            updateCarousel();
        }
    });

    nextBtn?.addEventListener('click', () => {
        const visibleCards = getVisibleCards();
        const maxIndex = cardCount - visibleCards;
        if (currentIndex < maxIndex) {
            currentIndex++;
            updateCarousel();
        }
    });

    // Recalculate on resize
    window.addEventListener('resize', debounce(updateCarousel, 200));

    // Touch/swipe support
    let touchStartX = 0;
    let touchEndX = 0;

    carousel.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    carousel.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    }, { passive: true });

    function handleSwipe() {
        const swipeThreshold = 50;
        const diff = touchStartX - touchEndX;

        if (diff > swipeThreshold) {
            // Swipe left - next
            nextBtn?.click();
        } else if (diff < -swipeThreshold) {
            // Swipe right - prev
            prevBtn?.click();
        }
    }
}

/* ========================================
   Contact Form
======================================== */
function initContactForm() {
    const form = document.getElementById('contactForm');
    const dateInput = form?.querySelector('input[type="date"]');
    const dateTrigger = form?.querySelector('.date-trigger');

    function openDatePicker() {
        if (!dateInput) return;
        if (typeof dateInput.showPicker === 'function') {
            dateInput.showPicker();
            return;
        }
        dateInput.focus();
    }

    dateTrigger?.addEventListener('click', openDatePicker);

    form?.addEventListener('submit', (e) => {
        e.preventDefault();

        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());

        if (!validateForm(data)) return;

        const submitBtn = form.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;

        submitBtn.textContent = 'Sending...';
        submitBtn.disabled = true;
        submitBtn.style.opacity = '0.7';

        // Simulate API call
        setTimeout(() => {
            submitBtn.textContent = 'Message Sent!';
            submitBtn.style.background = '#22c55e';
            submitBtn.style.borderColor = '#22c55e';

            form.reset();

            setTimeout(() => {
                submitBtn.textContent = originalText;
                submitBtn.style.background = '';
                submitBtn.style.borderColor = '';
                submitBtn.style.opacity = '';
                submitBtn.disabled = false;
            }, 3000);
        }, 1500);
    });
}

function validateForm(data) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!data.name || data.name.trim().length < 2) {
        showNotification('Please enter a valid name', 'error');
        return false;
    }

    if (!emailRegex.test(data.email)) {
        showNotification('Please enter a valid email address', 'error');
        return false;
    }

    if (!data.message || data.message.trim().length < 10) {
        showNotification('Please enter a message (at least 10 characters)', 'error');
        return false;
    }

    return true;
}

function showNotification(message, type = 'info') {
    const existing = document.querySelector('.notification');
    existing?.remove();

    const notification = document.createElement('div');
    notification.className = `notification notification--${type}`;
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        bottom: 30px;
        right: 30px;
        padding: 1rem 1.5rem;
        background: ${type === 'error' ? '#ef4444' : '#22c55e'};
        color: white;
        font-size: 0.875rem;
        font-weight: 500;
        z-index: 1000;
        animation: slideIn 0.4s cubic-bezier(0.4, 0, 0.2, 1);
    `;

    if (!document.getElementById('notification-styles')) {
        const style = document.createElement('style');
        style.id = 'notification-styles';
        style.textContent = `
            @keyframes slideIn {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
            @keyframes slideOut {
                from { transform: translateX(0); opacity: 1; }
                to { transform: translateX(100%); opacity: 0; }
            }
        `;
        document.head.appendChild(style);
    }

    document.body.appendChild(notification);

    setTimeout(() => {
        notification.style.animation = 'slideOut 0.4s cubic-bezier(0.4, 0, 0.2, 1) forwards';
        setTimeout(() => notification.remove(), 400);
    }, 4000);
}

/* ========================================
   Hero Slideshow
======================================== */
function initHeroAnimation() {
    const slides = document.querySelectorAll('.hero__slide');
    const contents = document.querySelectorAll('.hero__slides-content .hero__content');
    const navBtns = document.querySelectorAll('.hero__nav-btn');

    let currentSlide = 0;
    const totalSlides = slides.length;
    const autoPlayInterval = 10000; // 10 seconds per slide
    let autoPlayTimer;

    function goToSlide(index) {
        // Remove active from all
        slides.forEach(s => s.classList.remove('active'));
        contents.forEach(c => c.classList.remove('active'));
        navBtns.forEach(b => b.classList.remove('active'));

        // Add active to current
        slides[index]?.classList.add('active');
        contents[index]?.classList.add('active');
        navBtns[index]?.classList.add('active');

        currentSlide = index;
    }

    function nextSlide() {
        const next = (currentSlide + 1) % totalSlides;
        goToSlide(next);
    }

    function startAutoPlay() {
        autoPlayTimer = setInterval(nextSlide, autoPlayInterval);
    }

    function stopAutoPlay() {
        clearInterval(autoPlayTimer);
    }

    // Nav button clicks
    navBtns.forEach((btn, index) => {
        btn.addEventListener('click', () => {
            stopAutoPlay();
            goToSlide(index);
            startAutoPlay();
        });
    });

    // Pause on hover
    const hero = document.querySelector('.hero');
    hero?.addEventListener('mouseenter', stopAutoPlay);
    hero?.addEventListener('mouseleave', startAutoPlay);

    // Start autoplay
    startAutoPlay();

    // Initial animation for first slide
    setTimeout(() => {
        const firstContent = contents[0];
        if (firstContent) {
            firstContent.classList.add('active');
        }
    }, 100);
}

/* ========================================
   GSAP Scroll Animations
======================================== */
/* ========================================
   About Image Toggle (Mobile)
======================================== */
function initAboutImageToggle() {
    const images = document.querySelectorAll('.about__image-grid .about__img');
    if (!images.length) return;

    function clearExpanded() {
        images.forEach(img => img.classList.remove('about__img--expanded'));
    }

    images.forEach(img => {
        img.addEventListener('click', () => {
            if (window.innerWidth > 768) return;
            const isExpanded = img.classList.contains('about__img--expanded');
            clearExpanded();
            if (!isExpanded) {
                img.classList.add('about__img--expanded');
            }
        });
    });

    window.addEventListener('resize', () => {
        if (window.innerWidth > 768) {
            clearExpanded();
        }
    });
}

function getFocusableElements(container) {
    return Array.from(container.querySelectorAll(
        'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex=\"-1\"])'
    ));
}

function trapFocus(modal, event) {
    if (event.key !== 'Tab') return;
    const focusable = getFocusableElements(modal).filter(el => !el.hasAttribute('disabled'));
    if (!focusable.length) return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    const isShift = event.shiftKey;

    if (isShift && document.activeElement === first) {
        event.preventDefault();
        last.focus();
    } else if (!isShift && document.activeElement === last) {
        event.preventDefault();
        first.focus();
    }
}

/* ========================================
   Artist Modals
======================================== */
function initArtistModals() {
    const modal = document.getElementById('artistModal');
    if (!modal) return;

    const modalContent = modal.querySelector('.artist-modal__content');
    const modalImage = document.getElementById('artistModalImage');
    const modalVideoWrap = document.getElementById('artistModalVideoWrap');
    const modalVideo = document.getElementById('artistModalVideo');
    const modalVideoFallback = document.getElementById('artistModalVideoFallback');
    const modalVideoLink = document.getElementById('artistModalVideoLink');
    const modalTitle = document.getElementById('artistModalTitle');
    const modalSubtitle = document.getElementById('artistModalSubtitle');
    const modalGenre = document.getElementById('artistModalGenre');
    const modalDetails = document.getElementById('artistModalDetails');
    const closeButtons = modal.querySelectorAll('[data-modal-close]');
    const dialog = modal.querySelector('.artist-modal__dialog');
    let lastFocusedElement = null;

    const artistVideos = {
        'spice': 'https://youtu.be/MK9-cP8Cm8U?si=pDIXIMKzUBUYbpMB',
        'beenie-man': 'https://youtu.be/hysgYjFS_ow?si=CaTvyggBwu5JN8aT',
        'elephant-man': 'https://youtu.be/n4BYfro_LxI?si=9Pkxhc2Zn3yLMJRi',
        'konshens': 'https://youtu.be/7JqVOO99wl4?si=wE7KoHoftE7ZnfHo',
        'christopher-martin': 'https://youtu.be/lYXWAjmcK9I?si=LbFQydNxPkux75LV',
        'gyptian': 'https://www.youtube.com/live/GsNIemSlGMI?si=4m_Rz4z5-t6mcPzz',
        'tony-matterhorn': 'https://youtu.be/8ZjGhBC0uJ8?si=tWRjD1tpUjdAWcdi',
        'jahmiel': 'https://youtu.be/SlS2lUthSIk?si=bFxl1V-hbInpX89r',
        'jahvillani': 'https://youtu.be/eHXyJaoIWv4?si=Hw_K7NzFFcEvsycA',
        'pablo-yg': 'https://youtu.be/oc-0UzKMVDc?si=tmngfh-hHJ7tqNFe',
        'shane-o': 'https://youtu.be/WFZmVylemPs?si=k-lV_YCx0v43yeu6',
        'jah-vinci': 'https://youtu.be/qMpMxS0XSR4?si=SXp8pu99eQ8q4yQ5',
        'vanessa-bling': 'https://youtu.be/gkWlsfEZ24Q?si=VdulYaLGTTD1OL6O',
        'aidonia': 'https://youtu.be/xUO1VeqQd48?si=0KWEGo9FapAPWHyN',
        'govana': 'https://youtu.be/lUJCmX_X7NQ?si=yqj7b5j_iXFRrA6P',
        'dyani': 'https://youtu.be/hPfgHdfDZYk?si=0dCxVcykyVmNcvJB',
        'stylo-g': 'https://youtu.be/2Y-yqhfT118?si=TBlPzxhnmP-jnzqm'
    };

    function getYouTubeEmbedUrl(rawUrl) {
        if (!rawUrl) return '';

        try {
            const parsed = new URL(rawUrl);
            let videoId = '';

            if (parsed.hostname.includes('youtu.be')) {
                videoId = parsed.pathname.replace('/', '');
            } else if (parsed.pathname.startsWith('/live/')) {
                videoId = parsed.pathname.split('/')[2] || '';
            } else {
                videoId = parsed.searchParams.get('v') || '';
            }

            return videoId ? `https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1` : '';
        } catch {
            return '';
        }
    }

    if (modalVideo) {
        modalVideo.addEventListener('error', () => {
            if (modalVideoFallback) modalVideoFallback.hidden = false;
        });
    }

    const artistData = {
        'spice': {
            name: 'Spice',
            subtitle: 'Grace Latoya Hamilton',
            dob: 'Born 6 Aug 1982 in Spanish Town, Jamaica (43 years old as of Feb 12 2026).',
            genres: 'Dancehall, reggae, reggae-fusion.',
            description: 'Known as the Queen of Dancehall. Broke through after Sting 2000, gained international attention with the 2009 single "Romping Shop." Her mixtape Captured debuted at #1 on the Billboard Reggae Albums chart and her album 10 reached #6 and later earned a Grammy nomination.',
            metrics: 'Single "Go Down Deh" (feat. Shaggy and Sean Paul) went Platinum in Canada in Feb 2024. Captured topped Billboard Reggae Albums. 10 debuted at #6 on the same chart.'
        },
        'christopher-martin': {
            name: 'Christopher Martin',
            subtitle: 'Christopher Oteng Martin',
            dob: 'Born 14 Feb 1987 in Back Pasture, St Catherine, Jamaica (38 years old as of Feb 12 2026).',
            genres: 'Reggae, dancehall, reggae-fusion.',
            description: 'Won Digicel Rising Stars in 2005 and is known for romantic hits like "Cheaters Prayer" and "I\'m a Big Deal."',
            metrics: 'Album And Then (2019) debuted at #1 on Billboard Reggae Albums. EP Steppin Razor peaked at #15 and Big Deal (2017) reached #3.'
        },
        'jahmiel': {
            name: 'Jahmiel',
            subtitle: 'Jamiel Foster',
            dob: 'Born 30 Aug 1992 in Portmore, Jamaica (33 years old).',
            genres: 'Roots-influenced dancehall and reggae.',
            description: 'Began singing at age four. His inspirational lyrics and melodic delivery gained attention with the 2015 single "Gain the World."',
            metrics: '"Gain the World" has amassed over seven million views on YouTube.'
        },
        'jahvillani': {
            name: 'Jahvillani',
            subtitle: 'Dujon Mario Edwards',
            dob: 'Born 8 Sept 1994 in Ocho Rios, Jamaica (31 years old).',
            genres: 'Dancehall and reggae.',
            description: 'Known for gritty street anthems and the Wileside clique. Broke through with "Wileside Government" and "Clarks Pon Foot." Debut EP Dirt to Bentley released in 2021.',
            metrics: '"Wileside Government" has more than five million views on YouTube and dominated local charts.'
        },
        'pablo-yg': {
            name: 'Pablo YG',
            subtitle: 'Romeo Hines',
            dob: 'Born 24 Feb 2004 in Shaw Park, St Ann (21 years old as of Feb 12 2026).',
            genres: 'Dancehall and trap-dancehall.',
            description: 'Released his first single "Ready" in 2020 and broke out with the 2023 Bad Juvi Mixtape featuring "Rich N Richer."',
            metrics: 'YouTube channel surpassed 40 million views. "Rich N Richer" and Sting 2022 performances earned two IRAWMA awards. Featured in Supreme/Clarks campaign.'
        },
        'shane-o': {
            name: 'Shane O',
            subtitle: 'Roshain McDonald',
            dob: 'Born 1987 in Kingston, Jamaica (about 39 years old as of Feb 2026).',
            genres: 'Dancehall.',
            description: 'Recorded his first song at age 11. Broke through with "Lightning Flash" and returned with motivational tracks like "A Mill Fi Share" and "Relentless."',
            metrics: 'Comeback singles such as "Relentless" and "Star In The Sky" have hundreds of thousands of YouTube views.'
        },
        'konshens': {
            name: 'Konshens',
            subtitle: 'Garfield Delano Spence',
            dob: 'Born 11 Jan 1985 in Kingston, Jamaica (41 years old).',
            genres: 'Dancehall, reggae, reggae-fusion.',
            description: 'Rose to prominence with "Winner" and "Bruk Off Yuh Back." Known for versatile delivery and international collaborations.',
            metrics: '"Bruk Off Yuh Back" video has over 160 million views and was certified Silver in the UK in 2023.'
        },
        'jah-vinci': {
            name: 'Jah Vinci',
            subtitle: 'Kirk Rhoden (also credited as Andre Rhoden)',
            dob: 'Born 9 Feb 1988 (38 years old as of Feb 12 2026).',
            genres: 'Dancehall and reggae.',
            description: 'Former Portmore Empire member known for "Weh Dem a Guh Do." Later formed the Out Clear movement.',
            metrics: 'Single "Scream" topped charts for three weeks in late 2024 and reached 1.8 million views in two weeks. "Virgin" has over 30 million views.'
        },
        'vanessa-bling': {
            name: 'Vanessa Bling',
            subtitle: 'Vawnessa Saddler',
            dob: 'Born 19 Feb 1991 in Unity District, St Andrew, Jamaica (34 years old as of Feb 12 2026).',
            genres: 'Dancehall and reggae.',
            description: 'Introduced as Gaza Slim by Vybz Kartel, later re-emerged under her own name with songs like "Future Guaranteed" and the project Still Standing.',
            metrics: 'EP Still Standing debuted at #9 on Billboard Reggae Albums. Collaboration "Push Button Start" has over 1.5 million YouTube views.'
        },
        'tony-matterhorn': {
            name: 'Tony Matterhorn',
            subtitle: 'Dufton Taylor',
            dob: 'Born 9 March 1972 in Kingston, Jamaica (53 years old).',
            genres: 'Dancehall and sound-system selecting.',
            description: 'Legendary selector who won the Dancehall World Cup sound clash in 2000 and went global with "Dutty Wine."',
            metrics: '"Dutty Wine" spent 11 weeks atop BBC 1Xtra Dancehall and peaked at #35 on Billboard R&B/Hip-Hop Singles.'
        },
        'elephant-man': {
            name: 'Elephant Man',
            subtitle: "O'Neil Norman Bryan",
            dob: 'Born 11 Sept 1975 in Seaview Gardens, Kingston (50 years old).',
            genres: 'Dancehall and reggae-fusion.',
            description: 'Energy God known for explosive performances and hits like "Pon De River, Pon De Bank" and "Jook Gal."',
            metrics: 'Two Billboard Hot 100 hits ("Pon De River, Pon De Bank" #86, "Jook Gal" #57). UK peak #29 for "Pon De River."'
        },
        'gyptian': {
            name: 'Gyptian',
            subtitle: 'Windel Beneto Edwards',
            dob: 'Born 25 Oct 1983 in Kingston, Jamaica (42 years old).',
            genres: 'Reggae, roots reggae, lovers rock, dancehall.',
            description: 'Won the 2004 Star Search competition and gained attention with "Serious Times." Known for smooth vocals and lovers rock influence.',
            metrics: '"Hold Yuh" peaked at #91 on Billboard Hot 100 and topped Reggae Digital Songs for nine weeks. Album Hold You reached #2 on Billboard Reggae Albums.'
        },
        'beenie-man': {
            name: 'Beenie Man',
            subtitle: 'Anthony Moses Davis',
            dob: 'Born 22 Aug 1973 in Waterhouse, Kingston, Jamaica (52 years old).',
            genres: 'Dancehall and reggae.',
            description: 'Known as the King of Dancehall. Broke through in the 1990s with "Who Am I (Sim Simma)" and remains a global ambassador for Jamaican music.',
            metrics: 'Grammy winner for Art and Life (2001). Multiple UK chart hits including "Who Am I" (#10) and "Dude" (#7).'
        },
        'aidonia': {
            name: 'Aidonia',
            subtitle: 'Sheldon Lawrence',
            dob: 'Born 6 April 1981 in Jamaica (about 44 years old).',
            genres: 'Dancehall.',
            description: 'Veteran dancehall artist and producer known for aggressive lyrical style and military-themed branding. Active since the early 2000s and founder of 4th Genna Music.',
            metrics: 'Spotify monthly listeners: about 600K-800K. Multiple hits with 10M-50M+ YouTube views and over 20 years active in dancehall.'
        },
        'govana': {
            name: 'Govana',
            subtitle: 'Romeich Major',
            dob: 'Born 11 March 1995 in Jamaica (about 30 years old).',
            genres: 'Dancehall and Afro-Dancehall.',
            description: 'New-gen dancehall leader recognized for gritty storytelling, melodic delivery, and socially conscious lyrics. Broke out mid-2010s and became one of Jamaica’s most streamed artists.',
            metrics: 'Spotify monthly listeners: about 1.2M-1.6M. Multiple songs with 30M-100M+ YouTube views and albums charted on Billboard Reggae.'
        },
        'dyani': {
            name: "D'yani",
            subtitle: 'Andre Chavanie McCormack',
            dob: 'Born May 24, 1994 in Jamaica.',
            genres: 'Reggae and dancehall.',
            description: "Jamaican singer-songwriter blending reggae and dancehall with soulful melodies and expressive lyrics. Performed at Sting and Reggae Sumfest with steady streaming growth.",
            metrics: 'Spotify monthly listeners around 334K with an active YouTube channel featuring music videos and EP releases.'
        },
        'stylo-g': {
            name: 'Stylo G',
            subtitle: 'Jason Andre McDermott',
            dob: 'Born 16 July 1985 (about 40 years old).',
            genres: 'Dancehall, reggae fusion, grime, hip-hop influences.',
            description: 'British-Jamaican artist known for blending dancehall and UK grime. Broke internationally with "Soundbwoy" and collaborations like "Come Over" with Clean Bandit.',
            metrics: '"Soundbwoy" peaked at #18 on the UK Singles Chart with millions of streams across Spotify and YouTube.'
        },
        'tok': {
            name: 'T.O.K.',
            subtitle: 'Craigy T, Flexx, Alex, and Bay-C',
            dob: 'Origin: Kingston, Jamaica.',
            genres: 'Dancehall, reggae, reggae fusion.',
            description: 'Legendary Jamaican vocal group known for global dancehall hits, strong harmonies, and energetic performances.',
            metrics: 'Known for "Chi Chi Man," "Footprints," and "Galang Gal" with extensive international touring.'
        },
        'vershon': {
            name: 'Vershon',
            subtitle: 'Kemar Vershawn Brown',
            dob: 'Origin: Kingston, Jamaica.',
            genres: 'Dancehall.',
            description: 'Melodic dancehall artist known for relatable storytelling, emotional delivery, and balancing street and romantic themes.',
            metrics: 'Notable songs include "Inna Real Life," "Linky," and "One More Day."'
        },
        'teebone': {
            name: 'Teebone',
            subtitle: 'Teebone',
            dob: 'Origin: Jamaica.',
            genres: 'Dancehall.',
            description: 'Emerging dancehall act known for high-energy delivery, street-inspired lyrics, and modern youth-focused sound.',
            metrics: 'Growing presence across live performances and digital platforms.'
        },
        'bunji-garlin': {
            name: 'Bunji Garlin',
            subtitle: 'Ian Antonio Alvarez',
            dob: 'Origin: Trinidad and Tobago.',
            genres: 'Soca, ragga soca.',
            description: 'Influential soca artist known as the Viking of Soca, recognized for strong lyricism, stage dominance, and Caribbean fusion.',
            metrics: 'Internationally known for "Differentology" and multiple Soca Monarch titles.'
        },
        'patrice-roberts': {
            name: 'Patrice Roberts',
            subtitle: 'Patrice Roberts',
            dob: 'Origin: Trinidad and Tobago.',
            genres: 'Soca.',
            description: 'Leading female soca performer known for vibrant carnival records, energetic stage shows, and international touring.',
            metrics: 'Built a strong solo career after early prominence performing alongside Machel Montano.'
        },
        'sizzla': {
            name: 'Sizzla',
            subtitle: 'Miguel Orlando Collins',
            dob: 'Origin: St. Mary, Jamaica.',
            genres: 'Reggae, roots reggae, dancehall.',
            description: 'Prolific reggae icon known for conscious lyrics, Rastafarian themes, and a decades-spanning catalog.',
            metrics: 'Known for "Solid As A Rock" and "Thank You Mama" with over 70 album releases.'
        },
        'fantan-mojah': {
            name: 'Fantan Mojah',
            subtitle: 'Owen Moncrieffe',
            dob: 'Origin: St. Elizabeth, Jamaica.',
            genres: 'Roots reggae.',
            description: 'Respected roots reggae artist known for uplifting messages, cultural awareness, and spiritual themes.',
            metrics: 'Recognized internationally for anthem "Hail The King."'
        },
        'jesse-royal': {
            name: 'Jesse Royal',
            subtitle: 'Jesse David Royal',
            dob: 'Origin: Kingston, Jamaica.',
            genres: 'Reggae, roots reggae.',
            description: 'Modern reggae voice known for conscious lyrics, cultural themes, and strong live performances.',
            metrics: 'Recognized globally through roots-reggae touring and internationally streamed releases.'
        },
        'keznamdi': {
            name: 'Keznamdi',
            subtitle: 'Keznamdi McGregor',
            dob: 'Origin: Kingston, Jamaica.',
            genres: 'Reggae.',
            description: 'Reggae artist known for uplifting songwriting, modern production, and a message-driven sound.',
            metrics: 'International reggae performer with growing catalog and consistent global audience reach.'
        },
        'towerband': {
            name: 'Tower Band',
            subtitle: 'Tower Band Jamaica',
            dob: 'Origin: Jamaica.',
            genres: 'Reggae, dancehall, live band performance.',
            description: 'Tower Band is a Jamaican live band known for high-energy sets, strong stage musicianship, and versatile performance across reggae, dancehall, and party circuits.',
            metrics: 'Performs as a full live band for concerts, festivals, private events, and branded entertainment experiences.'
        },
        'jeusi-mc': {
            name: 'Jeusi MC',
            subtitle: 'Shabani Hemedi Kambwili',
            dob: 'Origin: Dar es Salaam, Tanzania.',
            genres: 'Singeli.',
            description: 'Leading Singeli performer known for rapid-fire delivery, explosive live energy, and pushing Tanzanian Singeli to wider audiences.',
            metrics: 'Popular tracks include Ubanda, Hauna Kazi, Cyborg, and Miharamia.'
        },
        'kkrytical': {
            name: 'Kkrytical',
            subtitle: 'Kkrytical',
            dob: 'Origin: Jamaica.',
            genres: 'Dancehall.',
            description: 'Kkrytical is an emerging Jamaican dancehall talent with a modern, direct sound and performance style aimed at new-generation audiences.',
            metrics: 'Available for artist bookings, collaborations, and event performance opportunities.'
        },
        'pesi-graphics': {
            name: 'PESI Graphics',
            subtitle: 'Peter Urio',
            dob: 'Origin: Tanzania.',
            genres: 'Graphic design, digital art, content creation, branding, visual arts.',
            description: 'PESI Graphics is a Tanzania-based creative design brand led by Peter Urio. The team delivers bold visuals, modern branding, and impactful digital content for artists, entrepreneurs, and businesses locally and internationally.',
            metrics: 'Instagram (brand): 9,385+ followers and 798 posts. Instagram (personal): 1,623+ followers. Collaborations accepted; serious enquiries only.'
        },
        '876-interactive': {
            name: '876 Interactive',
            subtitle: 'Ruel Mark-Anthony McNeil',
            dob: 'Origin: Jamaica.',
            genres: 'Web development, AI automation, software solutions, digital innovation.',
            description: '876 Interactive is a Jamaica-based web development and AI automation studio delivering modern, scalable applications and intelligent workflows that streamline operations and help businesses scale.',
            metrics: 'Core services include custom web apps, AI automation, dashboards/admin panels, API integration, and secure, scalable system design.'
        },
        'carlos-a-team': {
            name: 'Carlos A Team',
            subtitle: 'Carlos A Team',
            dob: 'Base: Jamaica.',
            genres: 'Media, events, promotions, creative direction, entertainment.',
            description: 'Jamaica-based creative media and event brand focused on high-energy experiences, visual storytelling, and promotional campaigns within entertainment and nightlife culture.',
            metrics: 'Affiliations: @ateammedia, @zerodegreezparty, @aftermathja. Business inquiries via @thebookofsamms. Brand philosophy: Today, not tomorrow.'
        },
        'team-dynamix': {
            name: 'Team Dynamix',
            subtitle: 'DJ Squeeze and DJ Shooty',
            dob: 'Origin: Jamaica.',
            genres: 'Dancehall, reggae, afrobeats, soca, hip-hop, club hits.',
            description: 'High-energy Jamaican DJ duo known for seamless transitions, crowd control, and genre-blending sets built for clubs, stage shows, and major events.',
            metrics: 'Event-ready for club nights, private events, brand activations, concerts, festivals, weddings, and corporate functions.'
        }
    };

    function buildDetailList(data) {
        const details = [
            ['DOB / Age', data.dob],
            ['Genres', data.genres],
            ['Description', data.description],
            ['Notable metrics', data.metrics]
        ];

        modalDetails.innerHTML = details.map(([label, value]) => (
            `<li><strong>${label}:</strong> ${value}</li>`
        )).join('');
    }

    function openModal(card) {
        const key = card.dataset.artist;
        const data = artistData[key];
        if (!data) return;

        const img = card.querySelector('img');
        modalImage.src = img?.getAttribute('src') || '';
        modalImage.alt = img?.getAttribute('alt') || data.name;
        modalTitle.textContent = data.name;
        modalSubtitle.textContent = `Government name: ${data.subtitle}`;
        modalGenre.textContent = data.genres;
        buildDetailList(data);

        const sourceUrl = artistVideos[key];
        const embedUrl = getYouTubeEmbedUrl(sourceUrl);
        if (embedUrl && modalVideo && modalVideoWrap) {
            modalVideo.src = embedUrl;
            modalVideoWrap.hidden = false;
            modalContent?.classList.add('has-video');
            if (modalVideoFallback) modalVideoFallback.hidden = true;
            if (modalVideoLink) modalVideoLink.href = sourceUrl;
        } else if (modalVideo && modalVideoWrap) {
            modalVideo.src = '';
            modalVideoWrap.hidden = true;
            modalContent?.classList.remove('has-video');
            if (modalVideoFallback) modalVideoFallback.hidden = true;
            if (modalVideoLink) modalVideoLink.href = '#';
        }

        lastFocusedElement = document.activeElement;
        modal.classList.add('is-open');
        modal.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
        dialog?.focus();
    }

    function closeModal() {
        modal.classList.remove('is-open');
        modal.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
        if (modalVideo && modalVideoWrap) {
            modalVideo.src = '';
            modalVideoWrap.hidden = true;
            modalContent?.classList.remove('has-video');
            if (modalVideoFallback) modalVideoFallback.hidden = true;
            if (modalVideoLink) modalVideoLink.href = '#';
        }
        if (lastFocusedElement && typeof lastFocusedElement.focus === 'function') {
            lastFocusedElement.focus();
        }
    }

    document.querySelectorAll('.talent-card[data-artist]').forEach(card => {
        card.addEventListener('click', (event) => {
            if (event.target.closest('a')) return;
            openModal(card);
        });
    });

    closeButtons.forEach(btn => btn.addEventListener('click', closeModal));

    window.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && modal.classList.contains('is-open')) {
            closeModal();
        }
    });

    modal.addEventListener('keydown', (event) => {
        if (modal.classList.contains('is-open')) {
            trapFocus(modal, event);
        }
    });
}

/* ========================================
   Talent Peek on Scroll (Mobile)
======================================== */
function initTalentPeek() {
    const cards = document.querySelectorAll('.talent-card');
    if (!cards.length) return;
    if (!('IntersectionObserver' in window)) return;

    let observer;
    const hideTimers = new Map();

    function setupObserver() {
        if (observer) observer.disconnect();
        hideTimers.forEach(timer => clearTimeout(timer));
        hideTimers.clear();

        if (window.innerWidth > 768) {
            cards.forEach(card => card.classList.remove('is-peek'));
            return;
        }

        observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                const card = entry.target;
                if (entry.isIntersecting) {
                    card.classList.add('is-peek');
                    if (hideTimers.has(card)) {
                        clearTimeout(hideTimers.get(card));
                    }
                    const timer = setTimeout(() => {
                        card.classList.remove('is-peek');
                        hideTimers.delete(card);
                    }, 1200);
                    hideTimers.set(card, timer);
                } else {
                    if (hideTimers.has(card)) {
                        clearTimeout(hideTimers.get(card));
                        hideTimers.delete(card);
                    }
                    card.classList.remove('is-peek');
                }
            });
        }, {
            threshold: 0.6
        });

        cards.forEach(card => observer.observe(card));
    }

    setupObserver();
    window.addEventListener('resize', setupObserver);
}

/* ========================================
   Booking Image Modal
======================================== */
function initBookingModal() {
    const modal = document.getElementById('bookingModal');
    const modalImage = document.getElementById('bookingModalImage');
    if (!modal || !modalImage) return;

    const closeButtons = modal.querySelectorAll('[data-booking-close]');
    const dialog = modal.querySelector('.booking-modal__dialog');
    let lastFocusedElement = null;
    let clearTimer = null;
    let clearHandler = null;

    function openModal(src, alt) {
        if (clearTimer) {
            clearTimeout(clearTimer);
            clearTimer = null;
        }
        if (clearHandler) {
            modal.removeEventListener('transitionend', clearHandler);
            clearHandler = null;
        }
        modalImage.src = src;
        modalImage.alt = alt || 'Booking highlight';
        lastFocusedElement = document.activeElement;
        modal.classList.add('is-open');
        modal.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
        dialog?.focus();
    }

    function closeModal() {
        modal.classList.remove('is-open');
        modal.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
        if (clearHandler) {
            modal.removeEventListener('transitionend', clearHandler);
            clearHandler = null;
        }
        clearHandler = (event) => {
            if (event.propertyName !== 'opacity') return;
            modal.removeEventListener('transitionend', clearHandler);
            clearHandler = null;
            if (modal.getAttribute('aria-hidden') === 'true') {
                modalImage.removeAttribute('src');
                modalImage.alt = '';
            }
        };
        modal.addEventListener('transitionend', clearHandler);
        clearTimer = setTimeout(() => {
            if (clearHandler) {
                modal.removeEventListener('transitionend', clearHandler);
                clearHandler = null;
            }
            if (modal.getAttribute('aria-hidden') === 'true') {
                modalImage.removeAttribute('src');
                modalImage.alt = '';
            }
            clearTimer = null;
        }, 500);
        if (lastFocusedElement && typeof lastFocusedElement.focus === 'function') {
            lastFocusedElement.focus();
        }
    }

    document.querySelectorAll('.bookings__item').forEach(item => {
        const openFromItem = () => {
            const img = item.querySelector('img');
            if (img) {
                openModal(img.src, img.alt);
            }
        };

        let touchStartX = 0;
        let touchStartY = 0;

        item.addEventListener('click', openFromItem);

        item.addEventListener('touchstart', (event) => {
            const touch = event.changedTouches[0];
            touchStartX = touch.clientX;
            touchStartY = touch.clientY;
        }, { passive: true });

        item.addEventListener('touchend', (event) => {
            const touch = event.changedTouches[0];
            const deltaX = Math.abs(touch.clientX - touchStartX);
            const deltaY = Math.abs(touch.clientY - touchStartY);
            if (deltaX < 10 && deltaY < 10) {
                openFromItem();
            }
        });
    });

    closeButtons.forEach(btn => btn.addEventListener('click', closeModal));

    window.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && modal.classList.contains('is-open')) {
            closeModal();
        }
    });

    modal.addEventListener('keydown', (event) => {
        if (modal.classList.contains('is-open')) {
            trapFocus(modal, event);
        }
    });
}

/* ========================================
   Parallax Effect (Optional)
======================================== */
function initParallax() {
    const hero = document.querySelector('.hero');
    if (!hero || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    window.addEventListener('scroll', () => {
        const scrolled = window.scrollY;
        const heroHeight = hero.offsetHeight;

        if (scrolled <= heroHeight) {
            const bg = hero.querySelector('.hero__animated-bg');
            if (bg) {
                bg.style.transform = `translateY(${scrolled * 0.3}px)`;
            }
        }
    }, { passive: true });
}

// Uncomment to enable parallax
// initParallax();

/* ========================================
   Utility Functions
======================================== */
function debounce(func, wait) {
    let timeout;
    return function(...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(this, args), wait);
    };
}

function throttle(func, limit) {
    let inThrottle;
    return function(...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

/* ========================================
   Lazy Loading Images (Performance)
======================================== */
function initLazyLoad() {
    const images = document.querySelectorAll('img[data-src]');

    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
                imageObserver.unobserve(img);
            }
        });
    }, {
        rootMargin: '50px 0px'
    });

    images.forEach(img => imageObserver.observe(img));
}

// Initialize lazy loading if images have data-src
document.addEventListener('DOMContentLoaded', initLazyLoad);
