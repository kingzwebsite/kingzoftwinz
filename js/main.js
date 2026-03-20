/* ========================================
   KINGZ OF TWINZ - Main JavaScript
   Roc Nation Inspired Interactions
======================================== */

document.addEventListener('DOMContentLoaded', () => {
    initSupabaseClient();
    initDynamicArtists();
    initDynamicLiveMoments();
    initDynamicHeroSlides();
    initDynamicNews();
    initDynamicTourSections();
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
    initFullRosterModal();
    initTalentPeek();
    initBookingModal();
    initAdminPanel();
});

const MODAL_FLOW_DELAY = 220;
let fullRosterReturnState = null;
let supabaseClient = null;
const SUPABASE_URL = 'https://cjckgkllmxmcsaayvyfx.supabase.co';
const SUPABASE_PUBLISHABLE_KEY = 'sb_publishable_UeLH9uRBOH3gANAECBO0mA_Sa5rOvFO';
const ADMIN_ALLOWLIST = ['mcneilruel@gmail.com', 'kingzoftwinz.ent@gmail.com'];
const MANAGED_ARTISTS_MISSING_FLAG = 'kot_managed_artists_missing';
const MANAGED_POSTERS_MISSING_FLAG = 'kot_managed_posters_missing';
const MANAGED_HERO_MISSING_FLAG = 'kot_managed_hero_missing';
const MANAGED_NEWS_MISSING_FLAG = 'kot_managed_news_missing';
const MANAGED_TOUR_SECTIONS_MISSING_FLAG = 'kot_managed_tour_sections_missing';
let managedTourSectionsCache = [];

function initSupabaseClient() {
    if (!window.supabase || typeof window.supabase.createClient !== 'function') {
        console.warn('Supabase SDK not loaded.');
        return;
    }
    supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);
}

function escapeHtml(value) {
    return String(value || '')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}

function normalizeArtistKey(value) {
    return String(value || '')
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
}

function buildSocialIcon(type) {
    const icons = {
        instagram: '<svg viewBox="0 0 24 24" fill="currentColor"><rect x="2" y="2" width="20" height="20" rx="5" ry="5" fill="none" stroke="currentColor" stroke-width="2"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" fill="none" stroke="currentColor" stroke-width="2"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5" stroke="currentColor" stroke-width="2"/></svg>',
        twitter: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"/></svg>',
        spotify: '<svg viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" stroke-width="2"/><path d="M8 15s1.5-1 4-1 4 1 4 1M7 12s2-1.5 5-1.5 5 1.5 5 1.5M6 9s2.5-2 6-2 6 2 6 2" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>',
        youtube: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z"/><polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02" fill="#000"/></svg>'
    };
    return icons[type] || icons.instagram;
}

function createTalentCardElement(artist) {
    const article = document.createElement('article');
    article.className = 'talent-card';
    article.dataset.category = (artist.category || '').trim().toLowerCase();
    article.dataset.artist = normalizeArtistKey(artist.artist_key || artist.name);
    article.dataset.subtitle = artist.subtitle || '';
    article.dataset.dob = artist.dob || '';
    article.dataset.genres = artist.genres || '';
    article.dataset.description = artist.description || '';
    article.dataset.metrics = artist.metrics || '';
    article.dataset.youtube = artist.youtube_url || '';
    if (artist.id) article.dataset.managedId = String(artist.id);
    article.dataset.source = artist.id ? 'managed' : 'static';

    const socials = [
        { key: 'instagram', url: artist.instagram_url },
        { key: 'twitter', url: artist.twitter_url },
        { key: 'spotify', url: artist.spotify_url },
        { key: 'youtube', url: artist.youtube_url }
    ].filter(item => item.url);

    const socialMarkup = socials.length
        ? socials.map(item => `<a href="${escapeHtml(item.url)}" aria-label="${item.key}" target="_blank" rel="noopener">${buildSocialIcon(item.key)}</a>`).join('')
        : '<a href="#" aria-label="Instagram">' + buildSocialIcon('instagram') + '</a>';

    article.innerHTML = `
        <div class="talent-card__image">
            <img src="${escapeHtml(artist.image_url)}" alt="${escapeHtml(artist.name)}" loading="lazy">
            <div class="talent-card__overlay">
                <div class="talent-card__socials">${socialMarkup}</div>
            </div>
        </div>
        <div class="talent-card__info">
            <h3 class="talent-card__name">${escapeHtml(artist.name)}</h3>
            <p class="talent-card__role">${escapeHtml(artist.role)}</p>
        </div>
    `;

    return article;
}

function extractSocialLinksFromCard(card) {
    const links = Array.from(card.querySelectorAll('.talent-card__socials a'));
    const read = (keyword) => {
        const found = links.find((link) => (link.getAttribute('aria-label') || '').toLowerCase().includes(keyword));
        const href = found?.getAttribute('href') || '';
        return href && href !== '#' ? href : '';
    };
    return {
        instagram_url: read('instagram'),
        twitter_url: read('twitter'),
        spotify_url: read('spotify'),
        youtube_url: read('youtube')
    };
}

function updateTalentCardElement(card, artist) {
    if (!card) return;
    const socialLinks = [
        { key: 'instagram', url: artist.instagram_url },
        { key: 'twitter', url: artist.twitter_url },
        { key: 'spotify', url: artist.spotify_url },
        { key: 'youtube', url: artist.youtube_url }
    ].filter(item => item.url);
    const socialMarkup = socialLinks.length
        ? socialLinks.map(item => `<a href="${escapeHtml(item.url)}" aria-label="${item.key}" target="_blank" rel="noopener">${buildSocialIcon(item.key)}</a>`).join('')
        : '<a href="#" aria-label="Instagram">' + buildSocialIcon('instagram') + '</a>';

    const image = card.querySelector('.talent-card__image img');
    if (image) {
        image.src = artist.image_url || image.src;
        image.alt = artist.name || image.alt;
    }

    const socialsWrap = card.querySelector('.talent-card__socials');
    if (socialsWrap) socialsWrap.innerHTML = socialMarkup;

    const nameEl = card.querySelector('.talent-card__name');
    const roleEl = card.querySelector('.talent-card__role');
    if (nameEl) nameEl.textContent = artist.name || nameEl.textContent;
    if (roleEl) roleEl.textContent = artist.role || roleEl.textContent;

    card.dataset.category = (artist.category || card.dataset.category || '').trim().toLowerCase();
    card.dataset.subtitle = artist.subtitle || '';
    card.dataset.dob = artist.dob || '';
    card.dataset.genres = artist.genres || '';
    card.dataset.description = artist.description || '';
    card.dataset.metrics = artist.metrics || '';
    card.dataset.youtube = artist.youtube_url || '';
    if (artist.id) {
        card.dataset.managedId = String(artist.id);
        card.dataset.source = 'managed';
    } else if (!card.dataset.managedId) {
        card.dataset.source = 'static';
    }
}

function addArtistCardToRoster(artist) {
    const grid = document.querySelector('.roster__grid');
    if (!grid) return false;
    const artistKey = normalizeArtistKey(artist.artist_key || artist.name);
    if (!artistKey) return false;
    if (grid.querySelector(`.talent-card[data-artist="${artistKey}"]`)) return false;

    const card = createTalentCardElement({ ...artist, artist_key: artistKey });
    grid.appendChild(card);
    if (typeof window.applyActiveRosterFilter === 'function') {
        window.applyActiveRosterFilter();
    }
    window.dispatchEvent(new CustomEvent('roster-updated'));
    return true;
}

function createLiveMomentItemElement(poster) {
    const item = document.createElement('div');
    item.className = 'bookings__item';
    if (poster.id) item.dataset.managedPosterId = String(poster.id);
    item.dataset.source = poster.id ? 'managed' : 'static';

    const img = document.createElement('img');
    img.src = poster.image_url || '';
    img.alt = poster.alt_text || 'Booking highlight';
    img.loading = 'lazy';
    img.setAttribute('data-booking', '');
    item.appendChild(img);
    return item;
}

function addPosterToLiveMomentsGrid(poster) {
    const grid = document.getElementById('liveMomentsGrid');
    if (!grid || !poster?.image_url) return false;
    if (poster.id && grid.querySelector(`.bookings__item[data-managed-poster-id="${poster.id}"]`)) return false;
    const item = createLiveMomentItemElement(poster);
    grid.appendChild(item);
    window.dispatchEvent(new CustomEvent('live-moments-updated'));
    return true;
}

async function initDynamicArtists() {
    if (!supabaseClient) return;
    if (window.localStorage?.getItem(MANAGED_ARTISTS_MISSING_FLAG) === '1') return;

    const { data, error } = await supabaseClient
        .from('managed_artists')
        .select('*')
        .order('created_at', { ascending: true });

    if (error) {
        const code = String(error.code || '');
        if (code === 'PGRST205' || code === '42P01') {
            window.localStorage?.setItem(MANAGED_ARTISTS_MISSING_FLAG, '1');
        } else {
            console.warn('managed_artists load failed:', error.message);
        }
        return;
    }

    window.localStorage?.removeItem(MANAGED_ARTISTS_MISSING_FLAG);
    (data || []).forEach(artist => addArtistCardToRoster(artist));
    window.dispatchEvent(new CustomEvent('roster-updated'));
}

async function initDynamicLiveMoments() {
    if (!supabaseClient) return;
    if (window.localStorage?.getItem(MANAGED_POSTERS_MISSING_FLAG) === '1') return;

    const { data, error } = await supabaseClient
        .from('managed_posters')
        .select('*')
        .order('created_at', { ascending: true });

    if (error) {
        const code = String(error.code || '');
        if (code === 'PGRST205' || code === '42P01') {
            window.localStorage?.setItem(MANAGED_POSTERS_MISSING_FLAG, '1');
        } else {
            console.warn('managed_posters load failed:', error.message);
        }
        return;
    }

    window.localStorage?.removeItem(MANAGED_POSTERS_MISSING_FLAG);
    (data || []).forEach((poster) => addPosterToLiveMomentsGrid(poster));
}

function getHeroStructure() {
    return {
        slideshow: document.querySelector('.hero__slideshow'),
        contentWrap: document.querySelector('.hero__slides-content'),
        navWrap: document.querySelector('.hero__nav')
    };
}

function syncHeroSlideIndices() {
    const slides = Array.from(document.querySelectorAll('.hero__slideshow .hero__slide'));
    const contents = Array.from(document.querySelectorAll('.hero__slides-content .hero__content'));
    const navBtns = Array.from(document.querySelectorAll('.hero__nav .hero__nav-btn'));
    const count = Math.min(slides.length, contents.length);

    slides.forEach((slide, index) => {
        slide.dataset.slide = String(index);
        slide.classList.toggle('active', index === 0);
    });
    contents.forEach((content, index) => {
        content.dataset.slide = String(index);
        content.classList.toggle('active', index === 0);
    });
    navBtns.forEach((btn, index) => {
        btn.dataset.slide = String(index);
        btn.classList.toggle('active', index === 0);
        btn.hidden = index >= count;
    });
}

function ensureStaticHeroSlideKeys() {
    const slides = Array.from(document.querySelectorAll('.hero__slideshow .hero__slide'));
    const contents = Array.from(document.querySelectorAll('.hero__slides-content .hero__content'));
    const navBtns = Array.from(document.querySelectorAll('.hero__nav .hero__nav-btn'));
    const count = Math.min(slides.length, contents.length);

    for (let i = 0; i < count; i += 1) {
        const key = slides[i].dataset.slideKey || contents[i].dataset.slideKey || `static-${i}`;
        slides[i].dataset.slideKey = key;
        contents[i].dataset.slideKey = key;
        navBtns[i] && (navBtns[i].dataset.slideKey = key);
        if (!slides[i].dataset.source) slides[i].dataset.source = 'static';
    }
    syncHeroSlideIndices();
}

function createHeroSlideElement(data, key) {
    const slide = document.createElement('div');
    slide.className = 'hero__slide';
    slide.dataset.slideKey = key;
    slide.dataset.source = data.id ? 'managed' : 'static';
    if (data.id) slide.dataset.managedHeroId = String(data.id);
    slide.innerHTML = `
        <div class="hero__slide-bg">
            <img src="${escapeHtml(data.image_url)}" alt="${escapeHtml(data.alt_text || 'Hero slide')}" loading="lazy" sizes="100vw">
        </div>
    `;
    return slide;
}

function createHeroContentElement(data, key) {
    const content = document.createElement('div');
    content.className = 'hero__content';
    content.dataset.slideKey = key;
    const title1 = String(data.title_line1 || '').trim();
    const title2 = String(data.title_line2 || '').trim();
    const tagline = String(data.tagline || '').trim();
    const primaryLabel = String(data.primary_label || 'View Tour').trim();
    const primaryHref = String(data.primary_href || '#tours').trim();
    const secondaryLabel = String(data.secondary_label || 'Book Now').trim();
    const secondaryHref = String(data.secondary_href || '#contact').trim();

    const titleMarkup = (title1 || title2) ? `
        <h1 class="hero__title">
            <span class="title-reveal">${escapeHtml(title1 || 'HERO')}</span>
            <span class="title-reveal delay">${escapeHtml(title2 || 'SLIDE')}</span>
        </h1>
    ` : '';

    content.innerHTML = `
        <div class="hero__text">
            ${titleMarkup}
            <p class="hero__tagline">${escapeHtml(tagline || 'ENTERTAINMENT • EVENTS • PRODUCTIONS')}</p>
        </div>
        <div class="hero__cta">
            <a href="${escapeHtml(primaryHref)}" class="btn btn--primary">${escapeHtml(primaryLabel)}</a>
            <a href="${escapeHtml(secondaryHref)}" class="btn btn--outline">${escapeHtml(secondaryLabel)}</a>
        </div>
    `;
    return content;
}

function createHeroNavButton(key) {
    const btn = document.createElement('button');
    btn.className = 'hero__nav-btn';
    btn.dataset.slideKey = key;
    return btn;
}

function getHeroSlideSnapshotByKey(key) {
    const slide = document.querySelector(`.hero__slideshow .hero__slide[data-slide-key="${key}"]`);
    const content = document.querySelector(`.hero__slides-content .hero__content[data-slide-key="${key}"]`);
    if (!slide || !content) return null;
    const img = slide.querySelector('img');
    const titleParts = Array.from(content.querySelectorAll('.hero__title .title-reveal')).map(el => el.textContent?.trim() || '');
    const buttons = content.querySelectorAll('.hero__cta a');
    return {
        key,
        managedId: slide.dataset.managedHeroId || '',
        source: slide.dataset.source || (slide.dataset.managedHeroId ? 'managed' : 'static'),
        image_url: img?.getAttribute('src') || '',
        alt_text: img?.getAttribute('alt') || 'Hero slide',
        title_line1: titleParts[0] || '',
        title_line2: titleParts[1] || '',
        tagline: content.querySelector('.hero__tagline')?.textContent?.trim() || '',
        primary_label: buttons[0]?.textContent?.trim() || 'View Tour',
        primary_href: buttons[0]?.getAttribute('href') || '#tours',
        secondary_label: buttons[1]?.textContent?.trim() || 'Book Now',
        secondary_href: buttons[1]?.getAttribute('href') || '#contact'
    };
}

function addHeroSlideToDom(data) {
    const { slideshow, contentWrap, navWrap } = getHeroStructure();
    if (!slideshow || !contentWrap || !navWrap || !data?.image_url) return false;
    const key = data.id ? `managed-${data.id}` : normalizeArtistKey(data.image_url).slice(0, 32);
    if (document.querySelector(`.hero__slideshow .hero__slide[data-slide-key="${key}"]`)) return false;
    slideshow.appendChild(createHeroSlideElement(data, key));
    contentWrap.appendChild(createHeroContentElement(data, key));
    navWrap.appendChild(createHeroNavButton(key));
    syncHeroSlideIndices();
    window.dispatchEvent(new CustomEvent('hero-slides-updated'));
    return true;
}

function updateHeroSlideByKey(key, data) {
    const slide = document.querySelector(`.hero__slideshow .hero__slide[data-slide-key="${key}"]`);
    const content = document.querySelector(`.hero__slides-content .hero__content[data-slide-key="${key}"]`);
    if (!slide || !content) return false;
    const nextSlide = createHeroSlideElement(data, key);
    const nextContent = createHeroContentElement(data, key);
    slide.replaceWith(nextSlide);
    content.replaceWith(nextContent);
    syncHeroSlideIndices();
    window.dispatchEvent(new CustomEvent('hero-slides-updated'));
    return true;
}

function removeHeroSlideByKey(key) {
    const slide = document.querySelector(`.hero__slideshow .hero__slide[data-slide-key="${key}"]`);
    const content = document.querySelector(`.hero__slides-content .hero__content[data-slide-key="${key}"]`);
    const nav = document.querySelector(`.hero__nav .hero__nav-btn[data-slide-key="${key}"]`);
    slide?.remove();
    content?.remove();
    nav?.remove();
    syncHeroSlideIndices();
    window.dispatchEvent(new CustomEvent('hero-slides-updated'));
}

async function initDynamicHeroSlides() {
    ensureStaticHeroSlideKeys();
    if (!supabaseClient) return;
    if (window.localStorage?.getItem(MANAGED_HERO_MISSING_FLAG) === '1') return;

    const { data, error } = await supabaseClient
        .from('managed_hero_slides')
        .select('*')
        .order('created_at', { ascending: true });

    if (error) {
        const code = String(error.code || '');
        if (code === 'PGRST205' || code === '42P01') {
            window.localStorage?.setItem(MANAGED_HERO_MISSING_FLAG, '1');
        } else {
            console.warn('managed_hero_slides load failed:', error.message);
        }
        return;
    }

    window.localStorage?.removeItem(MANAGED_HERO_MISSING_FLAG);
    (data || []).forEach((slide) => addHeroSlideToDom(slide));
}

function ensureStaticNewsKeys() {
    const cards = Array.from(document.querySelectorAll('#newsCarousel .news__track .news-card'));
    cards.forEach((card, index) => {
        if (!card.dataset.newsKey) card.dataset.newsKey = `static-news-${index}`;
        if (!card.dataset.source) card.dataset.source = 'static';
    });
}

function createNewsCardElement(data, key) {
    const card = document.createElement('article');
    card.className = 'news-card';
    card.dataset.newsKey = key;
    card.dataset.source = data.id ? 'managed' : 'static';
    if (data.id) card.dataset.managedNewsId = String(data.id);

    const imageUrl = data.image_url || '';
    const altText = data.alt_text || 'News image';
    const date = data.date_label || '2026';
    const title = data.title || 'Update';
    const excerpt = data.excerpt || '';
    const linkLabel = data.link_label || 'Read More';
    const linkHref = data.link_href || '#contact';

    card.innerHTML = `
        <div class="news-card__image">
            ${imageUrl ? `<img src="${escapeHtml(imageUrl)}" alt="${escapeHtml(altText)}" loading="lazy">` : '<div class="image-placeholder"><span>News</span></div>'}
        </div>
        <div class="news-card__content">
            <span class="news-card__date">${escapeHtml(date)}</span>
            <h3 class="news-card__title">${escapeHtml(title)}</h3>
            <p class="news-card__excerpt">${escapeHtml(excerpt)}</p>
            <a href="${escapeHtml(linkHref)}" class="news-card__link">${escapeHtml(linkLabel)}</a>
        </div>
    `;
    return card;
}

function addNewsCardToTrack(data) {
    const track = document.querySelector('#newsCarousel .news__track');
    if (!track) return false;
    const key = data.id ? `managed-news-${data.id}` : normalizeArtistKey(data.title || Date.now()).slice(0, 32);
    if (track.querySelector(`.news-card[data-news-key="${key}"]`)) return false;
    track.appendChild(createNewsCardElement(data, key));
    window.dispatchEvent(new CustomEvent('news-updated'));
    return true;
}

function getNewsSnapshotByKey(key) {
    const card = document.querySelector(`#newsCarousel .news__track .news-card[data-news-key="${key}"]`);
    if (!card) return null;
    const img = card.querySelector('.news-card__image img');
    const link = card.querySelector('.news-card__link');
    return {
        key,
        managedId: card.dataset.managedNewsId || '',
        source: card.dataset.source || (card.dataset.managedNewsId ? 'managed' : 'static'),
        image_url: img?.getAttribute('src') || '',
        alt_text: img?.getAttribute('alt') || 'News image',
        date_label: card.querySelector('.news-card__date')?.textContent?.trim() || '',
        title: card.querySelector('.news-card__title')?.textContent?.trim() || '',
        excerpt: card.querySelector('.news-card__excerpt')?.textContent?.trim() || '',
        link_label: link?.textContent?.trim() || 'Read More',
        link_href: link?.getAttribute('href') || '#contact'
    };
}

function updateNewsCardByKey(key, data) {
    const card = document.querySelector(`#newsCarousel .news__track .news-card[data-news-key="${key}"]`);
    if (!card) return false;
    const next = createNewsCardElement(data, key);
    card.replaceWith(next);
    window.dispatchEvent(new CustomEvent('news-updated'));
    return true;
}

function removeNewsCardByKey(key) {
    const card = document.querySelector(`#newsCarousel .news__track .news-card[data-news-key="${key}"]`);
    card?.remove();
    window.dispatchEvent(new CustomEvent('news-updated'));
}

async function initDynamicNews() {
    ensureStaticNewsKeys();
    if (!supabaseClient) return;
    if (window.localStorage?.getItem(MANAGED_NEWS_MISSING_FLAG) === '1') return;

    const { data, error } = await supabaseClient
        .from('managed_news')
        .select('*')
        .order('created_at', { ascending: true });

    if (error) {
        const code = String(error.code || '');
        if (code === 'PGRST205' || code === '42P01') {
            window.localStorage?.setItem(MANAGED_NEWS_MISSING_FLAG, '1');
        } else {
            console.warn('managed_news load failed:', error.message);
        }
        return;
    }

    window.localStorage?.removeItem(MANAGED_NEWS_MISSING_FLAG);
    (data || []).forEach((news) => addNewsCardToTrack(news));
}

function getToursSectionSnapshotFromDom() {
    const tagEl = document.getElementById('toursSectionTag');
    const titleEl = document.getElementById('toursSectionTitle');
    return {
        id: null,
        section_tag: tagEl?.textContent?.trim() || 'Upcoming',
        section_title: titleEl?.textContent?.trim() || 'Africa Tours 2026',
        is_active: true,
        created_at: null
    };
}

function applyTourSectionToDom(sectionData) {
    const tagEl = document.getElementById('toursSectionTag');
    const titleEl = document.getElementById('toursSectionTitle');
    if (!tagEl || !titleEl) return;
    const nextTag = String(sectionData?.section_tag || '').trim() || 'Upcoming';
    const nextTitle = String(sectionData?.section_title || '').trim() || 'Africa Tours 2026';
    tagEl.textContent = nextTag;
    titleEl.textContent = nextTitle;
}

function pickActiveTourSection(rows) {
    if (!Array.isArray(rows) || !rows.length) return null;
    return rows.find((row) => row?.is_active) || rows[0] || null;
}

function setManagedTourSectionsCache(rows) {
    managedTourSectionsCache = Array.isArray(rows) ? rows.slice() : [];
    window.dispatchEvent(new CustomEvent('tour-sections-updated'));
}

async function initDynamicTourSections() {
    if (!supabaseClient) {
        setManagedTourSectionsCache([]);
        return;
    }
    if (window.localStorage?.getItem(MANAGED_TOUR_SECTIONS_MISSING_FLAG) === '1') {
        setManagedTourSectionsCache([]);
        return;
    }

    const { data, error } = await supabaseClient
        .from('managed_tour_sections')
        .select('*')
        .order('created_at', { ascending: false });

    if (error) {
        const code = String(error.code || '');
        if (code === 'PGRST205' || code === '42P01') {
            window.localStorage?.setItem(MANAGED_TOUR_SECTIONS_MISSING_FLAG, '1');
            setManagedTourSectionsCache([]);
        } else {
            console.warn('managed_tour_sections load failed:', error.message);
        }
        return;
    }

    window.localStorage?.removeItem(MANAGED_TOUR_SECTIONS_MISSING_FLAG);
    const rows = data || [];
    setManagedTourSectionsCache(rows);
    const active = pickActiveTourSection(rows);
    if (active) {
        applyTourSectionToDom(active);
    }
}

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

    const applyFilter = (filter) => {
        const talentCards = document.querySelectorAll('.talent-card');
        talentCards.forEach(card => {
            if (!card.dataset.filterReady) {
                card.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
                card.dataset.filterReady = 'true';
            }
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

    // Apply initial active filter on load
    const applyActiveFilter = () => {
        const activeBtn = document.querySelector('.filter-btn.active');
        if (activeBtn?.dataset.filter) {
            applyFilter(activeBtn.dataset.filter);
        }
    };

    window.applyActiveRosterFilter = applyActiveFilter;
    applyActiveFilter();
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

    function getVisibleCards() {
        const width = window.innerWidth;
        if (width < 768) return 1;
        if (width < 1024) return 2;
        return 3;
    }

    function updateCarousel() {
        const cards = track.querySelectorAll('.news-card');
        const cardCount = cards.length;
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
        const cards = track.querySelectorAll('.news-card');
        const cardCount = cards.length;
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

    updateCarousel();
    window.addEventListener('news-updated', () => {
        currentIndex = 0;
        updateCarousel();
    });
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

    form?.addEventListener('submit', async (e) => {
        e.preventDefault();

        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());

        if (!validateForm(data)) return;

        const submitBtn = form.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;

        submitBtn.textContent = 'Sending...';
        submitBtn.disabled = true;
        submitBtn.style.opacity = '0.7';

        try {
            await saveBookingRequest(data);
            submitBtn.textContent = 'Message Sent!';
            submitBtn.style.background = '#22c55e';
            submitBtn.style.borderColor = '#22c55e';
            showNotification('Your request was submitted successfully.', 'success');

            form.reset();

            setTimeout(() => {
                submitBtn.textContent = originalText;
                submitBtn.style.background = '';
                submitBtn.style.borderColor = '';
                submitBtn.style.opacity = '';
                submitBtn.disabled = false;
            }, 3000);
        } catch (error) {
            console.error('Booking submit failed:', error);
            showNotification(error.message || 'Could not submit request. Please try again.', 'error');
            submitBtn.textContent = originalText;
            submitBtn.style.background = '';
            submitBtn.style.borderColor = '';
            submitBtn.style.opacity = '';
            submitBtn.disabled = false;
        }
    });
}

async function saveBookingRequest(data) {
    if (!supabaseClient) {
        throw new Error('Supabase is not configured on this page.');
    }

    const payload = {
        name: (data.name || '').trim(),
        email: (data.email || '').trim(),
        inquiry: (data.inquiry || '').trim(),
        requested_date: data.requestedDate || null,
        venue: (data.venue || '').trim(),
        offer_amount: (data.offerAmount || '').trim(),
        event_type: (data.eventType || '').trim(),
        other_artists: (data.otherArtists || '').trim(),
        promoter: (data.promoter || '').trim(),
        previous_bookings: (data.previousBookings || '').trim(),
        stage_time: (data.stageTime || '').trim(),
        event_name: (data.eventName || '').trim(),
        message: (data.message || '').trim()
    };

    const { error } = await supabaseClient.from('booking_requests').insert(payload);
    if (error) throw new Error(error.message || 'Supabase insert failed');
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

function showNotification(message, type = 'info', options = {}) {
    const target = options?.target instanceof Element ? options.target : document.body;
    const existing = target.querySelector('.notification');
    existing?.remove();

    const notification = document.createElement('div');
    notification.className = `notification notification--${type}`;
    notification.textContent = message;
    const isScoped = target !== document.body;
    notification.style.cssText = isScoped ? `
        position: absolute;
        top: 20px;
        right: 20px;
        max-width: min(420px, calc(100% - 40px));
        padding: 0.8rem 1rem;
        background: ${type === 'error' ? '#ef4444' : '#22c55e'};
        color: white;
        font-size: 0.82rem;
        font-weight: 500;
        z-index: 60;
        animation: slideIn 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3);
    ` : `
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

    target.appendChild(notification);

    setTimeout(() => {
        notification.style.animation = 'slideOut 0.4s cubic-bezier(0.4, 0, 0.2, 1) forwards';
        setTimeout(() => notification.remove(), 400);
    }, 4000);
}

/* ========================================
   Hero Slideshow
======================================== */
function initHeroAnimation() {
    let currentSlide = 0;
    const autoPlayInterval = 10000; // 10 seconds per slide
    let autoPlayTimer;

    function getNodes() {
        return {
            slides: Array.from(document.querySelectorAll('.hero__slide')),
            contents: Array.from(document.querySelectorAll('.hero__slides-content .hero__content')),
            navBtns: Array.from(document.querySelectorAll('.hero__nav-btn'))
        };
    }

    function goToSlide(index) {
        const { slides, contents, navBtns } = getNodes();
        const totalSlides = Math.min(slides.length, contents.length);
        if (!totalSlides) return;
        const safeIndex = ((index % totalSlides) + totalSlides) % totalSlides;

        // Remove active from all
        slides.forEach(s => s.classList.remove('active'));
        contents.forEach(c => c.classList.remove('active'));
        navBtns.forEach(b => b.classList.remove('active'));

        // Add active to current
        slides[safeIndex]?.classList.add('active');
        contents[safeIndex]?.classList.add('active');
        navBtns[safeIndex]?.classList.add('active');

        currentSlide = safeIndex;
    }

    function nextSlide() {
        const { slides, contents } = getNodes();
        const totalSlides = Math.min(slides.length, contents.length);
        if (!totalSlides) return;
        const next = (currentSlide + 1) % totalSlides;
        goToSlide(next);
    }

    function startAutoPlay() {
        stopAutoPlay();
        autoPlayTimer = setInterval(nextSlide, autoPlayInterval);
    }

    function stopAutoPlay() {
        clearInterval(autoPlayTimer);
    }

    const navWrap = document.querySelector('.hero__nav');
    navWrap?.addEventListener('click', (event) => {
        const btn = event.target.closest('.hero__nav-btn');
        if (!btn) return;
        const index = Number(btn.dataset.slide);
        if (Number.isNaN(index)) return;
        stopAutoPlay();
        goToSlide(index);
        startAutoPlay();
    });

    // Pause on hover
    const hero = document.querySelector('.hero');
    hero?.addEventListener('mouseenter', stopAutoPlay);
    hero?.addEventListener('mouseleave', startAutoPlay);

    // Start autoplay
    goToSlide(0);
    startAutoPlay();

    window.addEventListener('hero-slides-updated', () => {
        const { slides, contents } = getNodes();
        const totalSlides = Math.min(slides.length, contents.length);
        if (!totalSlides) {
            stopAutoPlay();
            return;
        }
        currentSlide = Math.min(currentSlide, totalSlides - 1);
        goToSlide(currentSlide);
        startAutoPlay();
    });
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
    const modalBackButton = document.getElementById('artistModalBack');
    const closeButtons = modal.querySelectorAll('[data-modal-close]');
    const dialog = modal.querySelector('.artist-modal__dialog');
    let lastFocusedElement = null;
    let openContext = 'grid';

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
        ].filter(([, value]) => value && String(value).trim().length);

        modalDetails.innerHTML = details.map(([label, value]) => (
            `<li><strong>${label}:</strong> ${value}</li>`
        )).join('');
    }

    function getFallbackDataFromCard(card) {
        const name = card?.querySelector('.talent-card__name')?.textContent?.trim() || '';
        const role = card?.querySelector('.talent-card__role')?.textContent?.trim() || '';
        return {
            name: name || 'Artist',
            subtitle: card?.dataset.subtitle || role || 'Profile',
            dob: card?.dataset.dob || '',
            genres: card?.dataset.genres || (card?.dataset.category || '').replace(/\s+/g, ', '),
            description: card?.dataset.description || 'Newly added artist profile.',
            metrics: card?.dataset.metrics || ''
        };
    }

    function openModal(card, options = {}) {
        const key = card?.dataset.artist;
        const data = artistData[key] || getFallbackDataFromCard(card);
        if (!data) return;
        openContext = options.context || 'grid';

        const img = card.querySelector('img');
        modalImage.src = img?.getAttribute('src') || '';
        modalImage.alt = img?.getAttribute('alt') || data.name;
        modalTitle.textContent = data.name;
        modalSubtitle.textContent = `Government name: ${data.subtitle}`;
        modalGenre.textContent = data.genres;
        buildDetailList(data);

        const sourceUrl = card?.dataset.youtube || artistVideos[key];
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

        if (modalBackButton) {
            modalBackButton.hidden = openContext !== 'full-roster';
        }

        lastFocusedElement = document.activeElement;
        modal.classList.add('is-open');
        modal.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
        dialog?.focus();
    }

    function openModalByKey(artistKey, options = {}) {
        const card = document.querySelector(`.talent-card[data-artist="${artistKey}"]`);
        if (!card) return;
        openModal(card, options);
    }

    function closeModal(options = {}) {
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
        if (modalBackButton) {
            modalBackButton.hidden = true;
        }
        if (options.restoreFocus !== false && lastFocusedElement && typeof lastFocusedElement.focus === 'function') {
            lastFocusedElement.focus();
        }
    }

    document.addEventListener('click', (event) => {
        const card = event.target.closest('.talent-card[data-artist]');
        if (!card) return;
        if (event.target.closest('a')) return;
        openModal(card);
    });

    closeButtons.forEach(btn => btn.addEventListener('click', closeModal));

    modalBackButton?.addEventListener('click', () => {
        if (openContext !== 'full-roster') return;
        closeModal({ restoreFocus: false });
        setTimeout(() => {
            window.dispatchEvent(new CustomEvent('reopen-full-roster', {
                detail: { state: fullRosterReturnState }
            }));
        }, MODAL_FLOW_DELAY);
    });

    window.addEventListener('open-artist-modal', (event) => {
        const artistKey = event?.detail?.artistKey;
        const context = event?.detail?.context || 'grid';
        fullRosterReturnState = event?.detail?.rosterState || null;
        if (!artistKey) return;
        openModalByKey(artistKey, { context });
    });

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
   Full Roster Modal
======================================== */
function initFullRosterModal() {
    const trigger = document.getElementById('fullRosterTrigger');
    const modal = document.getElementById('fullRosterModal');
    if (!trigger || !modal) return;

    const listWrap = document.getElementById('fullRosterListWrap');
    const list = document.getElementById('fullRosterList');
    const hints = document.getElementById('fullRosterHints');
    const alphaRail = document.getElementById('fullRosterAlpha');
    const dialog = modal.querySelector('.full-roster-modal__dialog');
    const closeButtons = modal.querySelectorAll('[data-full-roster-close]');
    let lastFocusedElement = null;
    let rosterItems = [];
    let lockedScrollY = 0;
    let lastActiveIndex = -1;
    let rafId = 0;
    let letterTargetTimer = 0;

    function lockPageScroll() {
        lockedScrollY = window.scrollY || window.pageYOffset || 0;
        document.body.style.top = `-${lockedScrollY}px`;
        document.body.classList.add('body--modal-locked');
    }

    function unlockPageScroll() {
        document.body.classList.remove('body--modal-locked');
        document.body.style.top = '';
        window.scrollTo(0, lockedScrollY);
    }

    function getAlpha(name) {
        const first = (name || '').trim().charAt(0).toUpperCase();
        return /^[A-Z]$/.test(first) ? first : '#';
    }

    function buildRosterList() {
        const cards = Array.from(document.querySelectorAll('.talent-card[data-artist]'));
        const byArtistKey = new Map();

        cards.forEach(card => {
            const key = card.dataset.artist || '';
            const name = card.querySelector('.talent-card__name')?.textContent?.trim() || '';
            const image = card.querySelector('.talent-card__image img')?.getAttribute('src') || '';
            const role = card.querySelector('.talent-card__role')?.textContent?.trim() || '';
            if (!key || !name || byArtistKey.has(key)) return;
            byArtistKey.set(key, { key, name, image, role });
        });

        const artists = Array.from(byArtistKey.values()).sort((a, b) =>
            a.name.localeCompare(b.name, undefined, { sensitivity: 'base' })
        );

        list.innerHTML = artists.map((artist, index) => `
            <li class="full-roster-modal__item" data-index="${index}" data-letter="${getAlpha(artist.name)}" data-artist-key="${artist.key}">
                <button type="button" class="full-roster-modal__item-btn" data-open-artist="${artist.key}">
                    <span class="full-roster-modal__item-index">${String(index + 1).padStart(2, '0')}</span>
                    <span class="full-roster-modal__item-thumb-wrap">
                        <img src="${artist.image}" alt="${artist.name}" class="full-roster-modal__item-thumb" loading="lazy">
                    </span>
                    <span class="full-roster-modal__item-text">
                        <span class="full-roster-modal__item-name">${artist.name}</span>
                        <span class="full-roster-modal__item-role">${artist.role}</span>
                    </span>
                </button>
            </li>
        `).join('');

        const letters = [...new Set(artists.map(artist => getAlpha(artist.name)))];
        alphaRail.innerHTML = letters.map(letter => `
            <span class="full-roster-modal__alpha-letter" data-letter="${letter}">${letter}</span>
        `).join('');

        rosterItems = Array.from(list.querySelectorAll('.full-roster-modal__item'));
    }

    function getActiveIndex() {
        if (!listWrap || !rosterItems.length) return 0;
        const scrollTop = listWrap.scrollTop;
        let activeIndex = 0;

        for (let i = 0; i < rosterItems.length; i += 1) {
            if (rosterItems[i].offsetTop - 16 <= scrollTop) {
                activeIndex = i;
            } else {
                break;
            }
        }

        return activeIndex;
    }

    function updateScrollHints() {
        if (!rosterItems.length || !hints || !alphaRail) return;
        const activeIndex = getActiveIndex();
        if (activeIndex === lastActiveIndex) return;
        lastActiveIndex = activeIndex;
        const preview = rosterItems.slice(activeIndex, activeIndex + 4);
        const activeLetter = rosterItems[activeIndex]?.dataset.letter || '';

        rosterItems.forEach((item, index) => {
            item.classList.toggle('is-active', index === activeIndex);
        });

        alphaRail.querySelectorAll('.full-roster-modal__alpha-letter').forEach(letter => {
            letter.classList.toggle('is-active', letter.dataset.letter === activeLetter);
        });

        const categoryHint = activeLetter ? `<span class="full-roster-modal__hint is-active">Category: ${activeLetter}</span>` : '';
        hints.innerHTML = categoryHint + preview.map((item, index) => {
            const name = item.querySelector('.full-roster-modal__item-name')?.textContent || '';
            const key = item.dataset.artistKey || '';
            const label = index === 0 ? 'Now' : 'Up next';
            const activeClass = index === 0 ? ' is-active' : '';
            return `<button type="button" class="full-roster-modal__hint${activeClass}" data-open-artist="${key}">${label}: ${name}</button>`;
        }).join('');
    }

    function getRosterState() {
        return {
            scrollTop: listWrap ? listWrap.scrollTop : 0
        };
    }

    function jumpToLetter(letter) {
        if (!listWrap || !rosterItems.length) return;
        const target = rosterItems.find(item => item.dataset.letter === letter);
        if (!target) return;

        listWrap.scrollTo({
            top: Math.max(target.offsetTop - 8, 0),
            behavior: 'smooth'
        });

        rosterItems.forEach(item => item.classList.remove('is-letter-target'));
        target.classList.add('is-letter-target');
        if (letterTargetTimer) clearTimeout(letterTargetTimer);
        letterTargetTimer = window.setTimeout(() => {
            target.classList.remove('is-letter-target');
        }, 600);
    }

    function openModal(event) {
        event?.preventDefault();
        buildRosterList();
        lastFocusedElement = document.activeElement;
        modal.classList.add('is-open');
        modal.setAttribute('aria-hidden', 'false');
        lockPageScroll();
        if (listWrap) {
            listWrap.scrollTop = fullRosterReturnState?.scrollTop || 0;
        }
        lastActiveIndex = -1;
        updateScrollHints();
        dialog?.focus();
    }

    function closeModal(options = {}) {
        modal.classList.remove('is-open');
        modal.setAttribute('aria-hidden', 'true');
        unlockPageScroll();
        if (rafId) {
            cancelAnimationFrame(rafId);
            rafId = 0;
        }
        if (options.restoreFocus !== false && lastFocusedElement && typeof lastFocusedElement.focus === 'function') {
            lastFocusedElement.focus();
        }
    }

    trigger.addEventListener('click', openModal);
    closeButtons.forEach(button => button.addEventListener('click', closeModal));

    list.addEventListener('click', (event) => {
        const button = event.target.closest('[data-open-artist]');
        if (!button) return;
        const artistKey = button.getAttribute('data-open-artist');
        if (!artistKey) return;
        fullRosterReturnState = getRosterState();
        closeModal({ restoreFocus: false });
        setTimeout(() => {
            window.dispatchEvent(new CustomEvent('open-artist-modal', {
                detail: {
                    artistKey,
                    context: 'full-roster',
                    rosterState: fullRosterReturnState
                }
            }));
        }, MODAL_FLOW_DELAY);
    });

    hints.addEventListener('click', (event) => {
        const button = event.target.closest('[data-open-artist]');
        if (!button) return;
        const artistKey = button.getAttribute('data-open-artist');
        if (!artistKey) return;
        fullRosterReturnState = getRosterState();
        closeModal({ restoreFocus: false });
        setTimeout(() => {
            window.dispatchEvent(new CustomEvent('open-artist-modal', {
                detail: {
                    artistKey,
                    context: 'full-roster',
                    rosterState: fullRosterReturnState
                }
            }));
        }, MODAL_FLOW_DELAY);
    });
    listWrap?.addEventListener('scroll', () => {
        if (rafId) return;
        rafId = requestAnimationFrame(() => {
            rafId = 0;
            updateScrollHints();
        });
    }, { passive: true });

    window.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && modal.classList.contains('is-open')) {
            closeModal();
        }
    });

    window.addEventListener('reopen-full-roster', (event) => {
        fullRosterReturnState = event?.detail?.state || fullRosterReturnState;
        openModal();
    });

    modal.addEventListener('keydown', (event) => {
        if (modal.classList.contains('is-open')) {
            const key = event.key || '';
            if (!event.ctrlKey && !event.metaKey && !event.altKey && key.length === 1 && /^[a-z]$/i.test(key)) {
                event.preventDefault();
                jumpToLetter(key.toUpperCase());
            }
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

    let touchStartX = 0;
    let touchStartY = 0;
    let touchStartTarget = null;

    const momentsGrid = document.getElementById('liveMomentsGrid');
    momentsGrid?.addEventListener('click', (event) => {
        const item = event.target.closest('.bookings__item');
        if (!item) return;
        const img = item.querySelector('img');
        if (img) openModal(img.src, img.alt);
    });

    momentsGrid?.addEventListener('touchstart', (event) => {
        const item = event.target.closest('.bookings__item');
        if (!item) return;
        const touch = event.changedTouches[0];
        touchStartX = touch.clientX;
        touchStartY = touch.clientY;
        touchStartTarget = item;
    }, { passive: true });

    momentsGrid?.addEventListener('touchend', (event) => {
        const touch = event.changedTouches[0];
        const deltaX = Math.abs(touch.clientX - touchStartX);
        const deltaY = Math.abs(touch.clientY - touchStartY);
        const endTarget = event.target.closest('.bookings__item');
        if (touchStartTarget && endTarget && touchStartTarget === endTarget && deltaX < 10 && deltaY < 10) {
            const img = endTarget.querySelector('img');
            if (img) openModal(img.src, img.alt);
        }
        touchStartTarget = null;
    }, { passive: true });

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
   Admin Panel (Supabase Auth)
======================================== */
function initAdminPanel() {
    const trigger = document.getElementById('openAdminPanel');
    const modal = document.getElementById('adminPanel');
    if (!trigger || !modal) return;
    const adminNotificationTarget = modal.querySelector('.admin-panel__dialog') || modal;
    const adminNotify = (message, type = 'info') => {
        showNotification(message, type, { target: adminNotificationTarget });
    };

    const closeButtons = modal.querySelectorAll('[data-admin-close]');
    const dialog = modal.querySelector('.admin-panel__dialog');
    const loginView = document.getElementById('adminLoginView');
    const dashboardView = document.getElementById('adminDashboardView');
    const loginForm = document.getElementById('adminLoginForm');
    const loginBtn = document.getElementById('adminLoginBtn');
    const logoutBtn = document.getElementById('adminLogoutBtn');
    const refreshBtn = document.getElementById('adminRefreshBookings');
    const addArtistForm = document.getElementById('adminAddArtistForm');
    const addArtistBtn = document.getElementById('adminAddArtistBtn');
    const imageFileInput = document.getElementById('adminArtistImageFile');
    const categorySelect = document.getElementById('adminArtistCategory');
    const categoryCustomWrap = document.getElementById('adminArtistCategoryCustomWrap');
    const categoryCustomInput = document.getElementById('adminArtistCategoryCustom');
    const genresSelect = document.getElementById('adminArtistGenres');
    const genresCustomWrap = document.getElementById('adminArtistGenresCustomWrap');
    const genresCustomInput = document.getElementById('adminArtistGenresCustom');
    const sessionUser = document.getElementById('adminSessionUser');
    const bookingsBody = document.getElementById('adminBookingsBody');
    const navButtons = Array.from(modal.querySelectorAll('[data-admin-section]'));
    const panes = Array.from(modal.querySelectorAll('[data-admin-pane]'));
    const artistCountEl = document.getElementById('adminArtistCount');
    const bookingCountEl = document.getElementById('adminBookingCount');
    const heroCountEl = document.getElementById('adminHeroCount');
    const newsCountEl = document.getElementById('adminNewsCount');
    const momentsCountEl = document.getElementById('adminMomentsCount');
    const tourSectionsCountEl = document.getElementById('adminTourSectionsCount');
    const previewNameEl = document.getElementById('adminPreviewName');
    const previewRoleEl = document.getElementById('adminPreviewRole');
    const previewImageEl = document.getElementById('adminPreviewImage');
    const rosterBody = document.getElementById('adminRosterBody');
    const rosterSearch = document.getElementById('adminRosterSearch');
    const cancelEditBtn = document.getElementById('adminCancelEditArtistBtn');
    const formModeEl = document.getElementById('adminArtistFormMode');
    const addPosterForm = document.getElementById('adminAddPosterForm');
    const addPosterBtn = document.getElementById('adminAddPosterBtn');
    const posterFileInput = document.getElementById('adminPosterFile');
    const momentsBody = document.getElementById('adminMomentsBody');
    const heroSlideForm = document.getElementById('adminHeroSlideForm');
    const heroSaveBtn = document.getElementById('adminHeroSaveBtn');
    const heroCancelEditBtn = document.getElementById('adminHeroCancelEditBtn');
    const heroFormModeEl = document.getElementById('adminHeroFormMode');
    const heroSlidesBody = document.getElementById('adminHeroSlidesBody');
    const heroImageFileInput = document.getElementById('adminHeroImageFile');
    const heroPreviewImageEl = document.getElementById('adminHeroPreviewImage');
    const heroPreviewTitleEl = document.getElementById('adminHeroPreviewTitle');
    const heroPreviewTaglineEl = document.getElementById('adminHeroPreviewTagline');
    const newsForm = document.getElementById('adminNewsForm');
    const newsSaveBtn = document.getElementById('adminNewsSaveBtn');
    const newsCancelEditBtn = document.getElementById('adminNewsCancelEditBtn');
    const newsFormModeEl = document.getElementById('adminNewsFormMode');
    const newsBody = document.getElementById('adminNewsBody');
    const newsImageFileInput = document.getElementById('adminNewsImageFile');
    const newsPreviewImageEl = document.getElementById('adminNewsPreviewImage');
    const newsPreviewDateEl = document.getElementById('adminNewsPreviewDate');
    const newsPreviewTitleEl = document.getElementById('adminNewsPreviewTitle');
    const newsPreviewExcerptEl = document.getElementById('adminNewsPreviewExcerpt');
    const newsPreviewLinkEl = document.getElementById('adminNewsPreviewLink');
    const tourSectionForm = document.getElementById('adminTourSectionForm');
    const tourSectionSaveBtn = document.getElementById('adminTourSectionSaveBtn');
    const tourSectionCancelEditBtn = document.getElementById('adminTourSectionCancelEditBtn');
    const tourSectionFormModeEl = document.getElementById('adminTourSectionFormMode');
    const tourSectionBody = document.getElementById('adminTourSectionsBody');
    const tourSectionPreviewTagEl = document.getElementById('adminTourSectionPreviewTag');
    const tourSectionPreviewTitleEl = document.getElementById('adminTourSectionPreviewTitle');
    let previewImageDataUrl = '';
    let bookingCount = 0;
    let lastFocusedElement = null;
    let editContext = null;
    let heroEditContext = null;
    let newsEditContext = null;
    let tourSectionEditContext = null;
    const STATIC_OVERRIDES_KEY = 'kot_static_roster_overrides';
    const STATIC_REMOVED_KEY = 'kot_static_roster_removed';
    const STATIC_POSTERS_REMOVED_KEY = 'kot_static_posters_removed';
    const STATIC_HERO_OVERRIDES_KEY = 'kot_static_hero_overrides';
    const STATIC_HERO_REMOVED_KEY = 'kot_static_hero_removed';
    const STATIC_NEWS_OVERRIDES_KEY = 'kot_static_news_overrides';
    const STATIC_NEWS_REMOVED_KEY = 'kot_static_news_removed';

    function openModal() {
        lastFocusedElement = document.activeElement;
        modal.classList.add('is-open');
        modal.setAttribute('aria-hidden', 'false');
        document.body.classList.add('body--modal-locked');
        dialog?.focus();
        void syncSessionState();
    }

    function closeModal() {
        modal.classList.remove('is-open');
        modal.setAttribute('aria-hidden', 'true');
        document.body.classList.remove('body--modal-locked');
        if (lastFocusedElement && typeof lastFocusedElement.focus === 'function') {
            lastFocusedElement.focus();
        }
    }

    function canAccessAdmin(email) {
        if (!email) return false;
        if (!ADMIN_ALLOWLIST.length) return true;
        return ADMIN_ALLOWLIST.includes(email.toLowerCase());
    }

    function renderLoginState(message = '') {
        if (loginView) loginView.hidden = false;
        if (dashboardView) dashboardView.hidden = true;
        if (sessionUser) sessionUser.textContent = '';
        setActiveSection('overview');
        bookingCount = 0;
        updateOverviewMetrics();
        if (message) adminNotify(message, 'error');
    }

    function truncate(text, max = 90) {
        if (!text) return '-';
        return text.length > max ? `${text.slice(0, max)}...` : text;
    }

    function isMissingBookingsTableError(error) {
        const code = String(error?.code || '');
        const message = String(error?.message || '').toLowerCase();
        return code === 'PGRST205'
            || code === '42P01'
            || message.includes('booking_requests')
            && (message.includes('not found') || message.includes('does not exist') || message.includes('schema cache'));
    }

    function isMissingArtistsTableError(error) {
        const code = String(error?.code || '');
        const message = String(error?.message || '').toLowerCase();
        return code === 'PGRST205'
            || code === '42P01'
            || message.includes('managed_artists')
            && (message.includes('not found') || message.includes('does not exist') || message.includes('schema cache'));
    }

    function isMissingTourSectionsTableError(error) {
        const code = String(error?.code || '');
        const message = String(error?.message || '').toLowerCase();
        return code === 'PGRST205'
            || code === '42P01'
            || message.includes('managed_tour_sections')
            && (message.includes('not found') || message.includes('does not exist') || message.includes('schema cache'));
    }

    function renderBookings(rows) {
        if (!bookingsBody) return;
        bookingCount = rows.length;
        updateOverviewMetrics();
        if (!rows.length) {
            bookingsBody.innerHTML = '<tr><td colspan="6">No booking submissions yet.</td></tr>';
            return;
        }

        bookingsBody.innerHTML = rows.map((row) => {
            const created = row.created_at ? new Date(row.created_at).toLocaleString() : '-';
            const name = row.name || '-';
            const email = row.email || '-';
            const inquiry = row.inquiry || '-';
            const eventName = row.event_name || '-';
            const message = truncate(row.message || '-');
            return `
                <tr>
                    <td>${created}</td>
                    <td>${name}</td>
                    <td>${email}</td>
                    <td>${inquiry}</td>
                    <td>${eventName}</td>
                    <td>${message}</td>
                </tr>
            `;
        }).join('');
    }

    async function loadBookings() {
        if (!supabaseClient) {
            renderBookings([]);
            throw new Error('Supabase client missing');
        }

        const { data, error } = await supabaseClient
            .from('booking_requests')
            .select('*')
            .order('created_at', { ascending: false })
            .limit(100);

        if (error) {
            if (isMissingBookingsTableError(error)) {
                renderBookings([]);
                if (bookingsBody) {
                    bookingsBody.innerHTML = `
                        <tr>
                            <td colspan="6">
                                Missing table: run <code>supabase/setup_booking_requests.sql</code> in Supabase SQL Editor.
                            </td>
                        </tr>
                    `;
                }
                bookingCount = 0;
                updateOverviewMetrics();
                return;
            }
            throw new Error(error.message || 'Could not load bookings');
        }
        renderBookings(data || []);
    }

    function setActiveSection(sectionName) {
        navButtons.forEach((button) => {
            button.classList.toggle('is-active', button.dataset.adminSection === sectionName);
        });
        panes.forEach((pane) => {
            const isActive = pane.dataset.adminPane === sectionName;
            pane.hidden = !isActive;
            pane.classList.toggle('is-active', isActive);
        });
    }

    function updateOverviewMetrics() {
        if (artistCountEl) {
            artistCountEl.textContent = String(document.querySelectorAll('.roster__grid .talent-card').length);
        }
        if (bookingCountEl) {
            bookingCountEl.textContent = String(bookingCount);
        }
        if (heroCountEl) {
            heroCountEl.textContent = String(document.querySelectorAll('.hero__slideshow .hero__slide').length);
        }
        if (newsCountEl) {
            newsCountEl.textContent = String(document.querySelectorAll('#newsCarousel .news__track .news-card').length);
        }
        if (momentsCountEl) {
            momentsCountEl.textContent = String(document.querySelectorAll('#liveMomentsGrid .bookings__item').length);
        }
        if (tourSectionsCountEl) {
            const managedCount = Array.isArray(managedTourSectionsCache) ? managedTourSectionsCache.length : 0;
            tourSectionsCountEl.textContent = String(Math.max(1, managedCount));
        }
    }

    function readStaticOverrides() {
        try {
            const parsed = JSON.parse(window.localStorage?.getItem(STATIC_OVERRIDES_KEY) || '{}');
            return parsed && typeof parsed === 'object' ? parsed : {};
        } catch {
            return {};
        }
    }

    function writeStaticOverrides(nextValue) {
        window.localStorage?.setItem(STATIC_OVERRIDES_KEY, JSON.stringify(nextValue));
    }

    function readStaticRemoved() {
        try {
            const parsed = JSON.parse(window.localStorage?.getItem(STATIC_REMOVED_KEY) || '[]');
            return Array.isArray(parsed) ? parsed : [];
        } catch {
            return [];
        }
    }

    function writeStaticRemoved(nextValue) {
        window.localStorage?.setItem(STATIC_REMOVED_KEY, JSON.stringify(nextValue));
    }

    function readStaticPostersRemoved() {
        try {
            const parsed = JSON.parse(window.localStorage?.getItem(STATIC_POSTERS_REMOVED_KEY) || '[]');
            return Array.isArray(parsed) ? parsed : [];
        } catch {
            return [];
        }
    }

    function writeStaticPostersRemoved(nextValue) {
        window.localStorage?.setItem(STATIC_POSTERS_REMOVED_KEY, JSON.stringify(nextValue));
    }

    function readStaticHeroOverrides() {
        try {
            const parsed = JSON.parse(window.localStorage?.getItem(STATIC_HERO_OVERRIDES_KEY) || '{}');
            return parsed && typeof parsed === 'object' ? parsed : {};
        } catch {
            return {};
        }
    }

    function writeStaticHeroOverrides(nextValue) {
        window.localStorage?.setItem(STATIC_HERO_OVERRIDES_KEY, JSON.stringify(nextValue));
    }

    function readStaticHeroRemoved() {
        try {
            const parsed = JSON.parse(window.localStorage?.getItem(STATIC_HERO_REMOVED_KEY) || '[]');
            return Array.isArray(parsed) ? parsed : [];
        } catch {
            return [];
        }
    }

    function writeStaticHeroRemoved(nextValue) {
        window.localStorage?.setItem(STATIC_HERO_REMOVED_KEY, JSON.stringify(nextValue));
    }

    function readStaticNewsOverrides() {
        try {
            const parsed = JSON.parse(window.localStorage?.getItem(STATIC_NEWS_OVERRIDES_KEY) || '{}');
            return parsed && typeof parsed === 'object' ? parsed : {};
        } catch {
            return {};
        }
    }

    function writeStaticNewsOverrides(nextValue) {
        window.localStorage?.setItem(STATIC_NEWS_OVERRIDES_KEY, JSON.stringify(nextValue));
    }

    function readStaticNewsRemoved() {
        try {
            const parsed = JSON.parse(window.localStorage?.getItem(STATIC_NEWS_REMOVED_KEY) || '[]');
            return Array.isArray(parsed) ? parsed : [];
        } catch {
            return [];
        }
    }

    function writeStaticNewsRemoved(nextValue) {
        window.localStorage?.setItem(STATIC_NEWS_REMOVED_KEY, JSON.stringify(nextValue));
    }

    function applyStaticRosterPersistence() {
        const overrides = readStaticOverrides();
        const removed = new Set(readStaticRemoved());
        document.querySelectorAll('.roster__grid .talent-card[data-artist]').forEach((card) => {
            const key = card.dataset.artist || '';
            if (!key || card.dataset.managedId) return;
            if (removed.has(key)) {
                card.remove();
                return;
            }
            const patch = overrides[key];
            if (patch) {
                updateTalentCardElement(card, patch);
            }
        });
    }

    function applyStaticLiveMomentsPersistence() {
        const removed = new Set(readStaticPostersRemoved());
        document.querySelectorAll('#liveMomentsGrid .bookings__item').forEach((item) => {
            if (item.dataset.managedPosterId) return;
            const img = item.querySelector('img');
            const src = img?.getAttribute('src') || '';
            if (removed.has(src)) item.remove();
        });
    }

    function applyStaticHeroPersistence() {
        const overrides = readStaticHeroOverrides();
        const removed = new Set(readStaticHeroRemoved());
        ensureStaticHeroSlideKeys();
        const slides = Array.from(document.querySelectorAll('.hero__slideshow .hero__slide[data-slide-key]'));
        slides.forEach((slide) => {
            if (slide.dataset.source !== 'static') return;
            const key = slide.dataset.slideKey || '';
            if (!key) return;
            if (removed.has(key)) {
                removeHeroSlideByKey(key);
                return;
            }
            const patch = overrides[key];
            if (patch) {
                updateHeroSlideByKey(key, patch);
            }
        });
    }

    function applyStaticNewsPersistence() {
        ensureStaticNewsKeys();
        const overrides = readStaticNewsOverrides();
        const removed = new Set(readStaticNewsRemoved());
        const cards = Array.from(document.querySelectorAll('#newsCarousel .news__track .news-card[data-news-key]'));
        cards.forEach((card) => {
            if (card.dataset.source !== 'static') return;
            const key = card.dataset.newsKey || '';
            if (!key) return;
            if (removed.has(key)) {
                removeNewsCardByKey(key);
                return;
            }
            const patch = overrides[key];
            if (patch) updateNewsCardByKey(key, patch);
        });
    }

    function getArtistSnapshotFromCard(card) {
        const socials = extractSocialLinksFromCard(card);
        return {
            key: card.dataset.artist || '',
            managedId: card.dataset.managedId || '',
            source: card.dataset.source || (card.dataset.managedId ? 'managed' : 'static'),
            name: card.querySelector('.talent-card__name')?.textContent?.trim() || '',
            role: card.querySelector('.talent-card__role')?.textContent?.trim() || '',
            category: (card.dataset.category || '').trim(),
            image_url: card.querySelector('.talent-card__image img')?.getAttribute('src') || '',
            subtitle: card.dataset.subtitle || '',
            dob: card.dataset.dob || '',
            genres: card.dataset.genres || '',
            description: card.dataset.description || '',
            metrics: card.dataset.metrics || '',
            youtube_url: card.dataset.youtube || socials.youtube_url || '',
            instagram_url: socials.instagram_url,
            twitter_url: socials.twitter_url,
            spotify_url: socials.spotify_url
        };
    }

    function getRosterCardsList() {
        return Array.from(document.querySelectorAll('.roster__grid .talent-card[data-artist]'))
            .map(card => ({ card, data: getArtistSnapshotFromCard(card) }))
            .sort((a, b) => a.data.name.localeCompare(b.data.name, undefined, { sensitivity: 'base' }));
    }

    function getLiveMomentSnapshotFromItem(item) {
        const img = item.querySelector('img');
        return {
            managedId: item.dataset.managedPosterId || '',
            source: item.dataset.managedPosterId ? 'managed' : 'static',
            image_url: img?.getAttribute('src') || '',
            alt_text: img?.getAttribute('alt') || 'Booking highlight'
        };
    }

    function getLiveMomentItemsList() {
        return Array.from(document.querySelectorAll('#liveMomentsGrid .bookings__item'))
            .map(item => ({ item, data: getLiveMomentSnapshotFromItem(item) }));
    }

    function getHeroSlidesList() {
        ensureStaticHeroSlideKeys();
        const slides = Array.from(document.querySelectorAll('.hero__slideshow .hero__slide[data-slide-key]'));
        return slides.map((slide) => {
            const key = slide.dataset.slideKey || '';
            return {
                key,
                data: getHeroSlideSnapshotByKey(key)
            };
        }).filter(entry => entry.data);
    }

    function renderRosterAdminList() {
        if (!rosterBody) return;
        const query = String(rosterSearch?.value || '').trim().toLowerCase();
        const rows = getRosterCardsList().filter(({ data }) => {
            if (!query) return true;
            return [data.name, data.role, data.category].some(value =>
                String(value || '').toLowerCase().includes(query)
            );
        });

        if (!rows.length) {
            rosterBody.innerHTML = '<tr><td colspan="5">No artists match your search.</td></tr>';
            return;
        }

        rosterBody.innerHTML = rows.map(({ data }) => `
            <tr data-roster-row="${escapeHtml(data.key)}">
                <td>${escapeHtml(data.name)}</td>
                <td>${escapeHtml(data.role)}</td>
                <td>${escapeHtml(data.category)}</td>
                <td>${escapeHtml(data.source === 'managed' ? 'Managed' : 'Static')}</td>
                <td>
                    <button type="button" class="btn btn--outline admin-panel__table-btn" data-admin-edit="${escapeHtml(data.key)}">Edit</button>
                    <button type="button" class="btn btn--outline admin-panel__table-btn admin-panel__table-btn--danger" data-admin-delete="${escapeHtml(data.key)}">Remove</button>
                </td>
            </tr>
        `).join('');
    }

    function renderLiveMomentsAdminList() {
        if (!momentsBody) return;
        const rows = getLiveMomentItemsList();
        if (!rows.length) {
            momentsBody.innerHTML = '<tr><td colspan="4">No posters found.</td></tr>';
            return;
        }

        momentsBody.innerHTML = rows.map(({ data }, index) => `
            <tr>
                <td>
                    <img src="${escapeHtml(data.image_url)}" alt="${escapeHtml(data.alt_text)}" class="admin-panel__moment-thumb">
                </td>
                <td>${escapeHtml(data.source === 'managed' ? 'Managed' : 'Static')}</td>
                <td>${escapeHtml(data.alt_text)}</td>
                <td>
                    <button type="button" class="btn btn--outline admin-panel__table-btn admin-panel__table-btn--danger" data-admin-delete-moment="${escapeHtml(data.managedId || data.image_url)}" data-admin-moment-source="${escapeHtml(data.source)}">Delete</button>
                </td>
            </tr>
        `).join('');
    }

    function renderHeroSlidesAdminList() {
        if (!heroSlidesBody) return;
        const rows = getHeroSlidesList();
        if (!rows.length) {
            heroSlidesBody.innerHTML = '<tr><td colspan="5">No hero slides found.</td></tr>';
            return;
        }

        heroSlidesBody.innerHTML = rows.map(({ data }) => `
            <tr>
                <td><img src="${escapeHtml(data.image_url)}" alt="${escapeHtml(data.alt_text)}" class="admin-panel__moment-thumb"></td>
                <td>${escapeHtml(`${data.title_line1 || ''} ${data.title_line2 || ''}`.trim() || 'Untitled')}</td>
                <td>${escapeHtml(data.tagline || '-')}</td>
                <td>${escapeHtml(data.source === 'managed' ? 'Managed' : 'Static')}</td>
                <td>
                    <button type="button" class="btn btn--outline admin-panel__table-btn" data-admin-edit-hero="${escapeHtml(data.key)}">Edit</button>
                    <button type="button" class="btn btn--outline admin-panel__table-btn admin-panel__table-btn--danger" data-admin-delete-hero="${escapeHtml(data.key)}">Delete</button>
                </td>
            </tr>
        `).join('');
    }

    function renderNewsAdminList() {
        if (!newsBody) return;
        ensureStaticNewsKeys();
        const cards = Array.from(document.querySelectorAll('#newsCarousel .news__track .news-card[data-news-key]'));
        if (!cards.length) {
            newsBody.innerHTML = '<tr><td colspan="5">No news cards found.</td></tr>';
            return;
        }
        newsBody.innerHTML = cards.map((card) => {
            const key = card.dataset.newsKey || '';
            const data = getNewsSnapshotByKey(key);
            if (!data) return '';
            return `
                <tr>
                    <td><img src="${escapeHtml(data.image_url || 'images/logo.png')}" alt="${escapeHtml(data.alt_text)}" class="admin-panel__moment-thumb"></td>
                    <td>${escapeHtml(data.date_label || '')}</td>
                    <td>${escapeHtml(data.title || '')}</td>
                    <td>${escapeHtml(data.source === 'managed' ? 'Managed' : 'Static')}</td>
                    <td>
                        <button type="button" class="btn btn--outline admin-panel__table-btn" data-admin-edit-news="${escapeHtml(key)}">Edit</button>
                        <button type="button" class="btn btn--outline admin-panel__table-btn admin-panel__table-btn--danger" data-admin-delete-news="${escapeHtml(key)}">Delete</button>
                    </td>
                </tr>
            `;
        }).join('');
    }

    function getTourSectionsList() {
        const managed = Array.isArray(managedTourSectionsCache) ? managedTourSectionsCache.slice() : [];
        const staticFallback = getToursSectionSnapshotFromDom();
        if (!managed.length) {
            return [{
                key: 'static',
                data: {
                    ...staticFallback,
                    source: 'static'
                }
            }];
        }
        return managed.map((row) => ({
            key: `managed-${row.id}`,
            data: {
                ...row,
                source: 'managed'
            }
        }));
    }

    function renderTourSectionsAdminList() {
        if (!tourSectionBody) return;
        const rows = getTourSectionsList();
        if (!rows.length) {
            tourSectionBody.innerHTML = '<tr><td colspan="5">No tour section headers found.</td></tr>';
            return;
        }

        tourSectionBody.innerHTML = rows.map(({ data }) => {
            const created = data.created_at ? new Date(data.created_at).toLocaleString() : '-';
            const rowKey = data.source === 'managed' ? String(data.id) : 'static';
            return `
                <tr>
                    <td>${escapeHtml(data.section_tag || '')}</td>
                    <td>${escapeHtml(data.section_title || '')}</td>
                    <td>${escapeHtml(data.is_active ? 'Active' : 'Inactive')}</td>
                    <td>${escapeHtml(created)}</td>
                    <td>
                        <button type="button" class="btn btn--outline admin-panel__table-btn" data-admin-edit-tour-section="${escapeHtml(rowKey)}">Edit</button>
                        ${data.source === 'managed' ? `<button type="button" class="btn btn--outline admin-panel__table-btn" data-admin-activate-tour-section="${escapeHtml(String(data.id))}">Activate</button>` : ''}
                        <button type="button" class="btn btn--outline admin-panel__table-btn admin-panel__table-btn--danger" data-admin-delete-tour-section="${escapeHtml(rowKey)}" data-admin-tour-section-source="${escapeHtml(data.source)}">Delete</button>
                    </td>
                </tr>
            `;
        }).join('');
    }

    function setTourSectionFormMode(modeLabel) {
        if (tourSectionFormModeEl) tourSectionFormModeEl.textContent = `Mode: ${modeLabel}`;
    }

    function updateTourSectionPreview() {
        if (!tourSectionForm) return;
        const formData = new FormData(tourSectionForm);
        const tag = String(formData.get('sectionTag') || '').trim() || 'Upcoming';
        const title = String(formData.get('sectionTitle') || '').trim() || 'Africa Tours 2026';
        if (tourSectionPreviewTagEl) tourSectionPreviewTagEl.textContent = tag;
        if (tourSectionPreviewTitleEl) tourSectionPreviewTitleEl.textContent = title;
    }

    function fillTourSectionForm(data) {
        if (!tourSectionForm) return;
        tourSectionForm.querySelector('#adminTourSectionTag').value = data.section_tag || 'Upcoming';
        tourSectionForm.querySelector('#adminTourSectionTitle').value = data.section_title || 'Africa Tours 2026';
        tourSectionForm.querySelector('#adminTourSectionActive').checked = Boolean(data.is_active);
        updateTourSectionPreview();
    }

    function resetTourSectionFormToCreate() {
        tourSectionEditContext = null;
        tourSectionForm?.reset();
        if (tourSectionForm) {
            tourSectionForm.querySelector('#adminTourSectionTag').value = 'Upcoming';
            tourSectionForm.querySelector('#adminTourSectionTitle').value = 'Africa Tours 2026';
            tourSectionForm.querySelector('#adminTourSectionActive').checked = true;
        }
        if (tourSectionCancelEditBtn) tourSectionCancelEditBtn.hidden = true;
        if (tourSectionSaveBtn) {
            tourSectionSaveBtn.disabled = false;
            tourSectionSaveBtn.textContent = 'Add Section Header';
        }
        setTourSectionFormMode('Create');
        updateTourSectionPreview();
    }

    function setNewsFormMode(modeLabel) {
        if (newsFormModeEl) newsFormModeEl.textContent = `Mode: ${modeLabel}`;
    }

    function updateNewsPreview() {
        if (!newsForm) return;
        const formData = new FormData(newsForm);
        const image = String(formData.get('image') || '').trim();
        const date = String(formData.get('date') || '').trim() || '2026';
        const title = String(formData.get('title') || '').trim() || 'New Announcement';
        const excerpt = String(formData.get('excerpt') || '').trim() || 'Preview of how the news card will appear on site.';
        const linkLabel = String(formData.get('linkLabel') || '').trim() || 'Read More';
        const linkHref = String(formData.get('linkHref') || '').trim() || '#contact';
        const file = newsImageFileInput?.files?.[0];

        if (newsPreviewDateEl) newsPreviewDateEl.textContent = date;
        if (newsPreviewTitleEl) newsPreviewTitleEl.textContent = title;
        if (newsPreviewExcerptEl) newsPreviewExcerptEl.textContent = excerpt;
        if (newsPreviewLinkEl) {
            newsPreviewLinkEl.textContent = linkLabel;
            newsPreviewLinkEl.setAttribute('href', linkHref);
        }

        if (file) {
            readFileAsDataUrl(file).then((dataUrl) => {
                if (newsPreviewImageEl) newsPreviewImageEl.src = dataUrl || image || 'images/logo.png';
            }).catch(() => {
                if (newsPreviewImageEl) newsPreviewImageEl.src = image || 'images/logo.png';
            });
        } else if (newsPreviewImageEl) {
            newsPreviewImageEl.src = image || 'images/logo.png';
        }
    }

    function fillNewsForm(data) {
        if (!newsForm) return;
        newsForm.querySelector('#adminNewsImage').value = data.image_url || '';
        newsForm.querySelector('#adminNewsAlt').value = data.alt_text || 'News image';
        newsForm.querySelector('#adminNewsDate').value = data.date_label || '2026';
        newsForm.querySelector('#adminNewsTitle').value = data.title || '';
        newsForm.querySelector('#adminNewsExcerpt').value = data.excerpt || '';
        newsForm.querySelector('#adminNewsLinkLabel').value = data.link_label || 'Read More';
        newsForm.querySelector('#adminNewsLinkHref').value = data.link_href || '#contact';
        if (newsImageFileInput) newsImageFileInput.value = '';
        updateNewsPreview();
    }

    function resetNewsFormToCreate() {
        newsEditContext = null;
        newsForm?.reset();
        if (newsForm) {
            newsForm.querySelector('#adminNewsAlt').value = 'News image';
            newsForm.querySelector('#adminNewsDate').value = '2026';
            newsForm.querySelector('#adminNewsLinkLabel').value = 'Read More';
            newsForm.querySelector('#adminNewsLinkHref').value = '#contact';
        }
        if (newsCancelEditBtn) newsCancelEditBtn.hidden = true;
        if (newsSaveBtn) {
            newsSaveBtn.disabled = false;
            newsSaveBtn.textContent = 'Add News';
        }
        setNewsFormMode('Create');
        updateNewsPreview();
    }

    function setHeroFormMode(modeLabel) {
        if (heroFormModeEl) heroFormModeEl.textContent = `Mode: ${modeLabel}`;
    }

    function updateHeroPreview() {
        if (!heroSlideForm) return;
        const formData = new FormData(heroSlideForm);
        const title1 = String(formData.get('titleLine1') || '').trim();
        const title2 = String(formData.get('titleLine2') || '').trim();
        const title = `${title1} ${title2}`.trim() || 'SLIDE TITLE';
        const tagline = String(formData.get('tagline') || '').trim() || 'TAGLINE';
        const image = String(formData.get('image') || '').trim();
        if (heroPreviewTitleEl) heroPreviewTitleEl.textContent = title;
        if (heroPreviewTaglineEl) heroPreviewTaglineEl.textContent = tagline;

        const file = heroImageFileInput?.files?.[0];
        if (file) {
            readFileAsDataUrl(file).then((dataUrl) => {
                if (heroPreviewImageEl) heroPreviewImageEl.src = dataUrl || image || 'images/hero.jpg';
            }).catch(() => {
                if (heroPreviewImageEl) heroPreviewImageEl.src = image || 'images/hero.jpg';
            });
        } else if (heroPreviewImageEl) {
            heroPreviewImageEl.src = image || 'images/hero.jpg';
        }
    }

    function fillHeroForm(data) {
        if (!heroSlideForm) return;
        heroSlideForm.querySelector('#adminHeroImage').value = data.image_url || '';
        heroSlideForm.querySelector('#adminHeroAlt').value = data.alt_text || 'Hero slide';
        heroSlideForm.querySelector('#adminHeroTagline').value = data.tagline || '';
        heroSlideForm.querySelector('#adminHeroTitleLine1').value = data.title_line1 || '';
        heroSlideForm.querySelector('#adminHeroTitleLine2').value = data.title_line2 || '';
        heroSlideForm.querySelector('#adminHeroPrimaryLabel').value = data.primary_label || 'View Tour';
        heroSlideForm.querySelector('#adminHeroPrimaryHref').value = data.primary_href || '#tours';
        heroSlideForm.querySelector('#adminHeroSecondaryLabel').value = data.secondary_label || 'Book Now';
        heroSlideForm.querySelector('#adminHeroSecondaryHref').value = data.secondary_href || '#contact';
        if (heroImageFileInput) heroImageFileInput.value = '';
        updateHeroPreview();
    }

    function resetHeroFormToCreate() {
        heroEditContext = null;
        heroSlideForm?.reset();
        if (heroSlideForm) {
            heroSlideForm.querySelector('#adminHeroAlt').value = 'Hero slide';
            heroSlideForm.querySelector('#adminHeroPrimaryLabel').value = 'View Tour';
            heroSlideForm.querySelector('#adminHeroPrimaryHref').value = '#tours';
            heroSlideForm.querySelector('#adminHeroSecondaryLabel').value = 'Book Now';
            heroSlideForm.querySelector('#adminHeroSecondaryHref').value = '#contact';
        }
        if (heroCancelEditBtn) heroCancelEditBtn.hidden = true;
        if (heroSaveBtn) {
            heroSaveBtn.disabled = false;
            heroSaveBtn.textContent = 'Add Slide';
        }
        setHeroFormMode('Create');
        updateHeroPreview();
    }

    function setFormMode(modeLabel) {
        if (formModeEl) formModeEl.textContent = `Mode: ${modeLabel}`;
    }

    function fillArtistForm(data) {
        if (!addArtistForm) return;
        addArtistForm.querySelector('#adminArtistName').value = data.name || '';
        addArtistForm.querySelector('#adminArtistRole').value = data.role || '';
        addArtistForm.querySelector('#adminArtistImage').value = data.image_url || '';
        addArtistForm.querySelector('#adminArtistInstagram').value = data.instagram_url || '';
        addArtistForm.querySelector('#adminArtistTwitter').value = data.twitter_url || '';
        addArtistForm.querySelector('#adminArtistSpotify').value = data.spotify_url || '';
        addArtistForm.querySelector('#adminArtistYouTube').value = data.youtube_url || '';
        addArtistForm.querySelector('#adminArtistSubtitle').value = data.subtitle || '';
        addArtistForm.querySelector('#adminArtistDob').value = data.dob || '';
        addArtistForm.querySelector('#adminArtistDescription').value = data.description || '';
        addArtistForm.querySelector('#adminArtistMetrics').value = data.metrics || '';

        const normalizedCategory = String(data.category || '').toLowerCase();
        ensureCategoryOption(normalizedCategory);
        if (categorySelect) {
            const hasCategory = Array.from(categorySelect.options).some(opt => opt.value === normalizedCategory);
            categorySelect.value = hasCategory ? normalizedCategory : '__custom__';
        }
        if (categoryCustomInput) categoryCustomInput.value = categorySelect?.value === '__custom__' ? normalizedCategory : '';
        updateCategoryCustomVisibility();

        if (genresSelect) {
            const hasGenre = Array.from(genresSelect.options).some(opt => opt.value === (data.genres || ''));
            genresSelect.value = hasGenre ? (data.genres || '') : '__custom__';
        }
        if (genresCustomInput) genresCustomInput.value = genresSelect?.value === '__custom__' ? (data.genres || '') : '';
        updateGenreCustomVisibility();
        if (imageFileInput) imageFileInput.value = '';
        void updateArtistPreview();
    }

    function resetArtistFormToCreate() {
        editContext = null;
        addArtistForm?.reset();
        if (cancelEditBtn) cancelEditBtn.hidden = true;
        addArtistBtn.textContent = 'Add Artist';
        addArtistBtn.disabled = false;
        setFormMode('Create');
        updateCategoryCustomVisibility();
        updateGenreCustomVisibility();
        previewImageDataUrl = '';
        void updateArtistPreview();
    }

    function getSelectedCategory(formData) {
        const selected = String(formData.get('categorySelect') || '').trim().toLowerCase();
        if (selected === '__custom__') {
            return String(formData.get('categoryCustom') || '').trim().toLowerCase();
        }
        return selected;
    }

    function getSelectedGenre(formData) {
        const selected = String(formData.get('genresSelect') || '').trim();
        if (selected === '__custom__') {
            return String(formData.get('genresCustom') || '').trim();
        }
        return selected;
    }

    function updateCategoryCustomVisibility() {
        const isCustom = categorySelect?.value === '__custom__';
        categoryCustomWrap?.classList.toggle('is-hidden', !isCustom);
        if (categoryCustomInput) categoryCustomInput.required = Boolean(isCustom);
    }

    function updateGenreCustomVisibility() {
        const isCustom = genresSelect?.value === '__custom__';
        genresCustomWrap?.classList.toggle('is-hidden', !isCustom);
        if (genresCustomInput) genresCustomInput.required = false;
    }

    function ensureCategoryOption(categoryValue) {
        if (!categorySelect || !categoryValue) return;
        const exists = Array.from(categorySelect.options).some((option) => option.value === categoryValue);
        if (exists) return;
        const option = document.createElement('option');
        option.value = categoryValue;
        option.textContent = categoryValue.charAt(0).toUpperCase() + categoryValue.slice(1);
        const customOption = Array.from(categorySelect.options).find((opt) => opt.value === '__custom__');
        if (customOption) {
            categorySelect.insertBefore(option, customOption);
        } else {
            categorySelect.appendChild(option);
        }
    }

    function readFileAsDataUrl(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(String(reader.result || ''));
            reader.onerror = () => reject(new Error('Image read failed.'));
            reader.readAsDataURL(file);
        });
    }

    async function updateArtistPreview() {
        if (!addArtistForm) return;
        const formData = new FormData(addArtistForm);
        const name = String(formData.get('name') || '').trim();
        const role = String(formData.get('role') || '').trim();
        const image = String(formData.get('image') || '').trim();
        const file = imageFileInput?.files?.[0];

        if (previewNameEl) previewNameEl.textContent = name || 'Artist Name';
        if (previewRoleEl) previewRoleEl.textContent = role || 'Role / Title';

        if (file) {
            try {
                previewImageDataUrl = await readFileAsDataUrl(file);
            } catch {
                previewImageDataUrl = '';
            }
        } else {
            previewImageDataUrl = '';
        }

        if (previewImageEl) {
            previewImageEl.src = previewImageDataUrl || image || 'images/logo.png';
            previewImageEl.alt = name ? `${name} preview image` : 'Preview artist image';
        }
    }

    async function renderDashboard(user) {
        if (!loginView || !dashboardView) return;
        loginView.hidden = true;
        dashboardView.hidden = false;
        applyStaticRosterPersistence();
        applyStaticLiveMomentsPersistence();
        applyStaticHeroPersistence();
        applyStaticNewsPersistence();
        if (sessionUser) {
            sessionUser.textContent = `Signed in as ${user.email || 'admin'}`;
        }
        setActiveSection('overview');
        updateOverviewMetrics();
        renderRosterAdminList();
        renderLiveMomentsAdminList();
        renderHeroSlidesAdminList();
        renderNewsAdminList();
        await initDynamicTourSections();
        renderTourSectionsAdminList();
        await loadBookings();
    }

    async function syncSessionState() {
        if (!supabaseClient) {
            renderLoginState('Supabase is not initialized.');
            return;
        }
        const { data, error } = await supabaseClient.auth.getSession();
        if (error) {
            renderLoginState(error.message || 'Session check failed.');
            return;
        }

        const user = data?.session?.user || null;
        if (!user) {
            renderLoginState();
            return;
        }

        if (!canAccessAdmin(user.email)) {
            await supabaseClient.auth.signOut();
            renderLoginState('This account is not allowed to access admin.');
            return;
        }

        await renderDashboard(user);
    }

    trigger.addEventListener('click', (event) => {
        event.preventDefault();
        openModal();
    });

    closeButtons.forEach((button) => {
        button.addEventListener('click', closeModal);
    });

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

    navButtons.forEach((button) => {
        button.addEventListener('click', async () => {
            const section = button.dataset.adminSection || 'overview';
            setActiveSection(section);
            if (section === 'bookings') {
                try {
                    await loadBookings();
                } catch (error) {
                    adminNotify(error.message || 'Could not load bookings.', 'error');
                }
            } else if (section === 'overview') {
                updateOverviewMetrics();
            } else if (section === 'artists') {
                renderRosterAdminList();
            } else if (section === 'slideshow') {
                renderHeroSlidesAdminList();
            } else if (section === 'tours') {
                renderTourSectionsAdminList();
            } else if (section === 'news') {
                renderNewsAdminList();
            } else if (section === 'moments') {
                renderLiveMomentsAdminList();
            }
        });
    });

    rosterSearch?.addEventListener('input', renderRosterAdminList);
    window.addEventListener('roster-updated', () => {
        renderRosterAdminList();
        updateOverviewMetrics();
    });
    window.addEventListener('live-moments-updated', renderLiveMomentsAdminList);
    window.addEventListener('hero-slides-updated', renderHeroSlidesAdminList);
    window.addEventListener('news-updated', renderNewsAdminList);
    window.addEventListener('tour-sections-updated', renderTourSectionsAdminList);
    window.addEventListener('live-moments-updated', updateOverviewMetrics);
    window.addEventListener('hero-slides-updated', updateOverviewMetrics);
    window.addEventListener('news-updated', updateOverviewMetrics);
    window.addEventListener('tour-sections-updated', updateOverviewMetrics);

    rosterBody?.addEventListener('click', async (event) => {
        const editBtn = event.target.closest('[data-admin-edit]');
        const deleteBtn = event.target.closest('[data-admin-delete]');
        if (editBtn) {
            const artistKey = editBtn.getAttribute('data-admin-edit') || '';
            const card = document.querySelector(`.roster__grid .talent-card[data-artist="${artistKey}"]`);
            if (!card) return;
            editContext = getArtistSnapshotFromCard(card);
            fillArtistForm(editContext);
            if (cancelEditBtn) cancelEditBtn.hidden = false;
            addArtistBtn.textContent = 'Update Artist';
            setFormMode('Edit');
            setActiveSection('artists');
            adminNotify(`Editing ${editContext.name}`, 'success');
            return;
        }

        if (deleteBtn) {
            const artistKey = deleteBtn.getAttribute('data-admin-delete') || '';
            const card = document.querySelector(`.roster__grid .talent-card[data-artist="${artistKey}"]`);
            if (!card) return;
            const data = getArtistSnapshotFromCard(card);
            const confirmed = window.confirm(`Remove ${data.name} from roster?`);
            if (!confirmed) return;

            try {
                if (data.managedId && supabaseClient) {
                    const { error } = await supabaseClient
                        .from('managed_artists')
                        .delete()
                        .eq('id', Number(data.managedId));
                    if (error) throw new Error(error.message || 'Delete failed');
                } else {
                    const removed = readStaticRemoved();
                    if (!removed.includes(data.key)) {
                        removed.push(data.key);
                        writeStaticRemoved(removed);
                    }
                    const overrides = readStaticOverrides();
                    delete overrides[data.key];
                    writeStaticOverrides(overrides);
                }
                card.remove();
                if (editContext?.key === data.key) {
                    resetArtistFormToCreate();
                }
                window.dispatchEvent(new CustomEvent('roster-updated'));
                if (typeof window.applyActiveRosterFilter === 'function') {
                    window.applyActiveRosterFilter();
                }
                adminNotify(`${data.name} removed.`, 'success');
            } catch (error) {
                adminNotify(error.message || 'Could not remove artist.', 'error');
            }
        }
    });

    cancelEditBtn?.addEventListener('click', () => {
        resetArtistFormToCreate();
    });

    momentsBody?.addEventListener('click', async (event) => {
        const deleteBtn = event.target.closest('[data-admin-delete-moment]');
        if (!deleteBtn) return;
        const source = deleteBtn.getAttribute('data-admin-moment-source') || 'static';
        const idOrSrc = deleteBtn.getAttribute('data-admin-delete-moment') || '';
        if (!idOrSrc) return;
        const confirmed = window.confirm('Delete this live moment poster?');
        if (!confirmed) return;

        try {
            if (source === 'managed') {
                if (!supabaseClient) throw new Error('Supabase is not initialized.');
                const { error } = await supabaseClient
                    .from('managed_posters')
                    .delete()
                    .eq('id', Number(idOrSrc));
                if (error) throw new Error(error.message || 'Delete failed');
                const item = document.querySelector(`#liveMomentsGrid .bookings__item[data-managed-poster-id="${idOrSrc}"]`);
                item?.remove();
            } else {
                const removed = readStaticPostersRemoved();
                if (!removed.includes(idOrSrc)) {
                    removed.push(idOrSrc);
                    writeStaticPostersRemoved(removed);
                }
                const item = Array.from(document.querySelectorAll('#liveMomentsGrid .bookings__item'))
                    .find((node) => (node.querySelector('img')?.getAttribute('src') || '') === idOrSrc);
                item?.remove();
            }
            window.dispatchEvent(new CustomEvent('live-moments-updated'));
            adminNotify('Poster removed.', 'success');
        } catch (error) {
            adminNotify(error.message || 'Could not delete poster.', 'error');
        }
    });

    heroSlidesBody?.addEventListener('click', async (event) => {
        const editBtn = event.target.closest('[data-admin-edit-hero]');
        const deleteBtn = event.target.closest('[data-admin-delete-hero]');
        if (editBtn) {
            const key = editBtn.getAttribute('data-admin-edit-hero') || '';
            const snapshot = getHeroSlideSnapshotByKey(key);
            if (!snapshot) return;
            heroEditContext = snapshot;
            fillHeroForm(snapshot);
            if (heroCancelEditBtn) heroCancelEditBtn.hidden = false;
            if (heroSaveBtn) heroSaveBtn.textContent = 'Update Slide';
            setHeroFormMode('Edit');
            setActiveSection('slideshow');
            return;
        }

        if (deleteBtn) {
            const key = deleteBtn.getAttribute('data-admin-delete-hero') || '';
            const snapshot = getHeroSlideSnapshotByKey(key);
            if (!snapshot) return;
            const confirmed = window.confirm('Delete this hero slide?');
            if (!confirmed) return;
            try {
                if (snapshot.managedId) {
                    if (!supabaseClient) throw new Error('Supabase is not initialized.');
                    const { error } = await supabaseClient
                        .from('managed_hero_slides')
                        .delete()
                        .eq('id', Number(snapshot.managedId));
                    if (error) throw new Error(error.message || 'Delete failed');
                } else {
                    const removed = readStaticHeroRemoved();
                    if (!removed.includes(snapshot.key)) {
                        removed.push(snapshot.key);
                        writeStaticHeroRemoved(removed);
                    }
                    const overrides = readStaticHeroOverrides();
                    delete overrides[snapshot.key];
                    writeStaticHeroOverrides(overrides);
                }
                removeHeroSlideByKey(snapshot.key);
                if (heroEditContext?.key === snapshot.key) resetHeroFormToCreate();
                adminNotify('Slide removed.', 'success');
            } catch (error) {
                adminNotify(error.message || 'Could not remove slide.', 'error');
            }
        }
    });

    heroSlideForm?.addEventListener('input', updateHeroPreview);
    heroImageFileInput?.addEventListener('change', updateHeroPreview);
    heroCancelEditBtn?.addEventListener('click', () => {
        resetHeroFormToCreate();
    });
    newsForm?.addEventListener('input', updateNewsPreview);
    newsImageFileInput?.addEventListener('change', updateNewsPreview);
    newsCancelEditBtn?.addEventListener('click', () => {
        resetNewsFormToCreate();
    });
    tourSectionForm?.addEventListener('input', updateTourSectionPreview);
    tourSectionCancelEditBtn?.addEventListener('click', () => {
        resetTourSectionFormToCreate();
    });

    addArtistForm?.addEventListener('input', () => {
        void updateArtistPreview();
    });
    categorySelect?.addEventListener('change', () => {
        updateCategoryCustomVisibility();
        void updateArtistPreview();
    });
    genresSelect?.addEventListener('change', () => {
        updateGenreCustomVisibility();
    });
    imageFileInput?.addEventListener('change', () => {
        void updateArtistPreview();
    });
    updateCategoryCustomVisibility();
    updateGenreCustomVisibility();
    void updateArtistPreview();
    renderRosterAdminList();
    renderLiveMomentsAdminList();
    renderHeroSlidesAdminList();
    renderNewsAdminList();
    renderTourSectionsAdminList();
    resetHeroFormToCreate();
    resetNewsFormToCreate();
    resetTourSectionFormToCreate();

    loginForm?.addEventListener('submit', async (event) => {
        event.preventDefault();
        if (!supabaseClient) {
            renderLoginState('Supabase is not initialized.');
            return;
        }

        const formData = new FormData(loginForm);
        const email = String(formData.get('email') || '').trim().toLowerCase();
        const password = String(formData.get('password') || '');

        loginBtn.disabled = true;
        loginBtn.textContent = 'Signing In...';

        try {
            const { data, error } = await supabaseClient.auth.signInWithPassword({ email, password });
            if (error) throw new Error(error.message || 'Login failed');
            const user = data?.user;
            if (!user || !canAccessAdmin(user.email)) {
                await supabaseClient.auth.signOut();
                throw new Error('This account is not allowed to access admin.');
            }
            loginForm.reset();
            await renderDashboard(user);
            adminNotify('Signed in.', 'success');
        } catch (error) {
            renderLoginState(error.message || 'Login failed.');
        } finally {
            loginBtn.disabled = false;
            loginBtn.textContent = 'Sign In';
        }
    });

    logoutBtn?.addEventListener('click', async () => {
        if (supabaseClient) {
            await supabaseClient.auth.signOut();
        }
        renderLoginState();
        adminNotify('Signed out.', 'success');
    });

    refreshBtn?.addEventListener('click', async () => {
        if (refreshBtn) {
            refreshBtn.disabled = true;
            refreshBtn.classList.add('is-loading');
            refreshBtn.textContent = 'Refreshing';
        }
        try {
            window.localStorage?.removeItem(MANAGED_ARTISTS_MISSING_FLAG);
            window.localStorage?.removeItem(MANAGED_POSTERS_MISSING_FLAG);
            window.localStorage?.removeItem(MANAGED_HERO_MISSING_FLAG);
            window.localStorage?.removeItem(MANAGED_NEWS_MISSING_FLAG);
            window.localStorage?.removeItem(MANAGED_TOUR_SECTIONS_MISSING_FLAG);
            await initDynamicArtists();
            await initDynamicLiveMoments();
            await initDynamicHeroSlides();
            await initDynamicNews();
            await initDynamicTourSections();
            await loadBookings();
            updateOverviewMetrics();
            adminNotify('Dashboard data refreshed.', 'success');
        } catch (error) {
            adminNotify(error.message || 'Refresh failed.', 'error');
        } finally {
            if (refreshBtn) {
                refreshBtn.disabled = false;
                refreshBtn.classList.remove('is-loading');
                refreshBtn.textContent = 'Refresh Data';
            }
        }
    });

    tourSectionBody?.addEventListener('click', async (event) => {
        const editBtn = event.target.closest('[data-admin-edit-tour-section]');
        const deleteBtn = event.target.closest('[data-admin-delete-tour-section]');
        const activateBtn = event.target.closest('[data-admin-activate-tour-section]');

        if (editBtn) {
            const rowId = editBtn.getAttribute('data-admin-edit-tour-section') || '';
            const target = rowId === 'static'
                ? { ...getToursSectionSnapshotFromDom(), source: 'static' }
                : managedTourSectionsCache.find((item) => String(item.id) === rowId);
            if (!target) return;
            tourSectionEditContext = {
                id: target.id || null,
                source: target.source || 'managed'
            };
            fillTourSectionForm(target);
            if (tourSectionCancelEditBtn) tourSectionCancelEditBtn.hidden = false;
            if (tourSectionSaveBtn) tourSectionSaveBtn.textContent = 'Update Section Header';
            setTourSectionFormMode('Edit');
            setActiveSection('tours');
            return;
        }

        if (activateBtn) {
            const id = Number(activateBtn.getAttribute('data-admin-activate-tour-section') || '0');
            if (!id) return;
            try {
                if (!supabaseClient) throw new Error('Supabase is not initialized.');
                const deactivateIds = managedTourSectionsCache
                    .map((row) => Number(row.id))
                    .filter((rowId) => rowId !== id);
                if (deactivateIds.length) {
                    const { error: deactivateError } = await supabaseClient
                        .from('managed_tour_sections')
                        .update({ is_active: false })
                        .in('id', deactivateIds);
                    if (deactivateError && !isMissingTourSectionsTableError(deactivateError)) {
                        throw new Error(deactivateError.message || 'Could not update active section');
                    }
                }
                const { error: activateError } = await supabaseClient
                    .from('managed_tour_sections')
                    .update({ is_active: true })
                    .eq('id', id);
                if (activateError) throw new Error(activateError.message || 'Could not activate section');
                await initDynamicTourSections();
                adminNotify('Tour section activated.', 'success');
            } catch (error) {
                adminNotify(error.message || 'Activate failed.', 'error');
            }
            return;
        }

        if (deleteBtn) {
            const rowId = deleteBtn.getAttribute('data-admin-delete-tour-section') || '';
            const source = deleteBtn.getAttribute('data-admin-tour-section-source') || 'managed';
            const confirmed = window.confirm('Delete this tour section header?');
            if (!confirmed) return;

            if (source === 'static') {
                adminNotify('Default static section cannot be deleted.', 'error');
                return;
            }

            try {
                if (!supabaseClient) throw new Error('Supabase is not initialized.');
                const { error } = await supabaseClient
                    .from('managed_tour_sections')
                    .delete()
                    .eq('id', Number(rowId));
                if (error) throw new Error(error.message || 'Delete failed');
                await initDynamicTourSections();
                if (tourSectionEditContext?.id && String(tourSectionEditContext.id) === rowId) {
                    resetTourSectionFormToCreate();
                }
                adminNotify('Tour section removed.', 'success');
            } catch (error) {
                adminNotify(error.message || 'Could not delete tour section.', 'error');
            }
        }
    });

    tourSectionForm?.addEventListener('submit', async (event) => {
        event.preventDefault();
        const isEditing = Boolean(tourSectionEditContext);
        const formData = new FormData(tourSectionForm);
        const sectionTag = String(formData.get('sectionTag') || '').trim();
        const sectionTitle = String(formData.get('sectionTitle') || '').trim();
        const isActive = formData.get('isActive') === 'on';

        if (!sectionTag || !sectionTitle) {
            adminNotify('Section tag and section title are required.', 'error');
            return;
        }

        if (tourSectionSaveBtn) {
            tourSectionSaveBtn.disabled = true;
            tourSectionSaveBtn.textContent = isEditing ? 'Updating...' : 'Adding...';
        }

        try {
            const payload = {
                section_tag: sectionTag,
                section_title: sectionTitle,
                is_active: isActive
            };

            if (tourSectionEditContext?.source === 'static') {
                if (!supabaseClient) throw new Error('Supabase is not initialized.');
                if (isActive) {
                    const existingIds = managedTourSectionsCache.map((row) => Number(row.id)).filter(Boolean);
                    if (existingIds.length) {
                        const { error: deactivateError } = await supabaseClient
                            .from('managed_tour_sections')
                            .update({ is_active: false })
                            .in('id', existingIds);
                        if (deactivateError && !isMissingTourSectionsTableError(deactivateError)) {
                            throw new Error(deactivateError.message || 'Could not update active state');
                        }
                    }
                }
                const { error } = await supabaseClient
                    .from('managed_tour_sections')
                    .insert(payload)
                    .select('*')
                    .single();
                if (error) {
                    if (isMissingTourSectionsTableError(error)) {
                        throw new Error('Missing table: run supabase/setup_booking_requests.sql first.');
                    }
                    throw new Error(error.message || 'Could not save section');
                }
                window.localStorage?.removeItem(MANAGED_TOUR_SECTIONS_MISSING_FLAG);
                await initDynamicTourSections();
            } else if (tourSectionEditContext?.id) {
                if (!supabaseClient) throw new Error('Supabase is not initialized.');
                if (isActive) {
                    const deactivateIds = managedTourSectionsCache
                        .map((row) => Number(row.id))
                        .filter((rowId) => rowId !== Number(tourSectionEditContext.id));
                    if (deactivateIds.length) {
                        const { error: deactivateError } = await supabaseClient
                            .from('managed_tour_sections')
                            .update({ is_active: false })
                            .in('id', deactivateIds);
                        if (deactivateError && !isMissingTourSectionsTableError(deactivateError)) {
                            throw new Error(deactivateError.message || 'Could not update active state');
                        }
                    }
                }
                const { error } = await supabaseClient
                    .from('managed_tour_sections')
                    .update(payload)
                    .eq('id', Number(tourSectionEditContext.id));
                if (error) throw new Error(error.message || 'Could not update section');
                await initDynamicTourSections();
            } else {
                if (!supabaseClient) throw new Error('Supabase is not initialized.');
                if (isActive) {
                    const existingIds = managedTourSectionsCache.map((row) => Number(row.id)).filter(Boolean);
                    if (existingIds.length) {
                        const { error: deactivateError } = await supabaseClient
                            .from('managed_tour_sections')
                            .update({ is_active: false })
                            .in('id', existingIds);
                        if (deactivateError && !isMissingTourSectionsTableError(deactivateError)) {
                            throw new Error(deactivateError.message || 'Could not update active state');
                        }
                    }
                }
                const { error } = await supabaseClient
                    .from('managed_tour_sections')
                    .insert(payload)
                    .select('*')
                    .single();
                if (error) {
                    if (isMissingTourSectionsTableError(error)) {
                        throw new Error('Missing table: run supabase/setup_booking_requests.sql first.');
                    }
                    throw new Error(error.message || 'Could not add section');
                }
                window.localStorage?.removeItem(MANAGED_TOUR_SECTIONS_MISSING_FLAG);
                await initDynamicTourSections();
            }

            resetTourSectionFormToCreate();
            adminNotify(isEditing ? 'Tour section updated.' : 'Tour section saved.', 'success');
        } catch (error) {
            adminNotify(error.message || 'Save failed.', 'error');
        } finally {
            if (tourSectionSaveBtn) {
                tourSectionSaveBtn.disabled = false;
                tourSectionSaveBtn.textContent = isEditing ? 'Update Section Header' : 'Add Section Header';
            }
        }
    });

    newsBody?.addEventListener('click', async (event) => {
        const editBtn = event.target.closest('[data-admin-edit-news]');
        const deleteBtn = event.target.closest('[data-admin-delete-news]');
        if (editBtn) {
            const key = editBtn.getAttribute('data-admin-edit-news') || '';
            const snapshot = getNewsSnapshotByKey(key);
            if (!snapshot) return;
            newsEditContext = snapshot;
            fillNewsForm(snapshot);
            if (newsCancelEditBtn) newsCancelEditBtn.hidden = false;
            if (newsSaveBtn) newsSaveBtn.textContent = 'Update News';
            setNewsFormMode('Edit');
            setActiveSection('news');
            return;
        }

        if (deleteBtn) {
            const key = deleteBtn.getAttribute('data-admin-delete-news') || '';
            const snapshot = getNewsSnapshotByKey(key);
            if (!snapshot) return;
            const confirmed = window.confirm('Delete this news card?');
            if (!confirmed) return;
            try {
                if (snapshot.managedId) {
                    if (!supabaseClient) throw new Error('Supabase is not initialized.');
                    const { error } = await supabaseClient
                        .from('managed_news')
                        .delete()
                        .eq('id', Number(snapshot.managedId));
                    if (error) throw new Error(error.message || 'Delete failed');
                } else {
                    const removed = readStaticNewsRemoved();
                    if (!removed.includes(snapshot.key)) {
                        removed.push(snapshot.key);
                        writeStaticNewsRemoved(removed);
                    }
                    const overrides = readStaticNewsOverrides();
                    delete overrides[snapshot.key];
                    writeStaticNewsOverrides(overrides);
                }
                removeNewsCardByKey(snapshot.key);
                if (newsEditContext?.key === snapshot.key) resetNewsFormToCreate();
                adminNotify('News card removed.', 'success');
            } catch (error) {
                adminNotify(error.message || 'Could not remove news card.', 'error');
            }
        }
    });

    newsForm?.addEventListener('submit', async (event) => {
        event.preventDefault();
        const isEditing = Boolean(newsEditContext);
        const formData = new FormData(newsForm);
        const imageInput = String(formData.get('image') || '').trim();
        const imageFile = newsImageFileInput?.files?.[0] || null;
        const imageUrl = imageFile ? await readFileAsDataUrl(imageFile) : imageInput;
        const title = String(formData.get('title') || '').trim();
        const excerpt = String(formData.get('excerpt') || '').trim();

        if (!imageUrl || !title || !excerpt) {
            adminNotify('Image, title, and excerpt are required.', 'error');
            return;
        }

        const payload = {
            image_url: imageUrl,
            alt_text: String(formData.get('alt') || 'News image').trim() || 'News image',
            date_label: String(formData.get('date') || '2026').trim() || '2026',
            title,
            excerpt,
            link_label: String(formData.get('linkLabel') || 'Read More').trim() || 'Read More',
            link_href: String(formData.get('linkHref') || '#contact').trim() || '#contact'
        };

        if (newsSaveBtn) {
            newsSaveBtn.disabled = true;
            newsSaveBtn.textContent = isEditing ? 'Updating...' : 'Adding...';
        }

        try {
            if (newsEditContext?.managedId) {
                if (!supabaseClient) throw new Error('Supabase is not initialized.');
                const { data, error } = await supabaseClient
                    .from('managed_news')
                    .update(payload)
                    .eq('id', Number(newsEditContext.managedId))
                    .select('*')
                    .single();
                if (error) {
                    const code = String(error.code || '');
                    if (code === 'PGRST205' || code === '42P01') {
                        throw new Error('Missing table: run supabase/setup_booking_requests.sql first.');
                    }
                    throw new Error(error.message || 'Could not update news');
                }
                const next = { ...(data || payload), id: data?.id || Number(newsEditContext.managedId) };
                updateNewsCardByKey(newsEditContext.key, next);
            } else if (newsEditContext) {
                updateNewsCardByKey(newsEditContext.key, payload);
                const overrides = readStaticNewsOverrides();
                overrides[newsEditContext.key] = payload;
                writeStaticNewsOverrides(overrides);
                const removed = readStaticNewsRemoved().filter((key) => key !== newsEditContext.key);
                writeStaticNewsRemoved(removed);
            } else {
                if (!supabaseClient) throw new Error('Supabase is not initialized.');
                const { data, error } = await supabaseClient
                    .from('managed_news')
                    .insert(payload)
                    .select('*')
                    .single();
                if (error) {
                    const code = String(error.code || '');
                    if (code === 'PGRST205' || code === '42P01') {
                        throw new Error('Missing table: run supabase/setup_booking_requests.sql first.');
                    }
                    throw new Error(error.message || 'Could not add news');
                }
                addNewsCardToTrack(data || payload);
                window.localStorage?.removeItem(MANAGED_NEWS_MISSING_FLAG);
            }

            resetNewsFormToCreate();
            adminNotify(isEditing ? 'News updated.' : 'News added.', 'success');
        } catch (error) {
            adminNotify(error.message || 'Save news failed.', 'error');
        } finally {
            if (newsSaveBtn) {
                newsSaveBtn.disabled = false;
                newsSaveBtn.textContent = isEditing ? 'Update News' : 'Add News';
            }
        }
    });

    heroSlideForm?.addEventListener('submit', async (event) => {
        event.preventDefault();
        const isEditing = Boolean(heroEditContext);
        const formData = new FormData(heroSlideForm);
        const imageInput = String(formData.get('image') || '').trim();
        const imageFile = heroImageFileInput?.files?.[0] || null;
        const imageUrl = imageFile ? await readFileAsDataUrl(imageFile) : imageInput;
        if (!imageUrl) {
            adminNotify('Slide image is required.', 'error');
            return;
        }

        const payload = {
            image_url: imageUrl,
            alt_text: String(formData.get('alt') || 'Hero slide').trim() || 'Hero slide',
            title_line1: String(formData.get('titleLine1') || '').trim(),
            title_line2: String(formData.get('titleLine2') || '').trim(),
            tagline: String(formData.get('tagline') || '').trim(),
            primary_label: String(formData.get('primaryLabel') || 'View Tour').trim() || 'View Tour',
            primary_href: String(formData.get('primaryHref') || '#tours').trim() || '#tours',
            secondary_label: String(formData.get('secondaryLabel') || 'Book Now').trim() || 'Book Now',
            secondary_href: String(formData.get('secondaryHref') || '#contact').trim() || '#contact'
        };

        if (heroSaveBtn) {
            heroSaveBtn.disabled = true;
            heroSaveBtn.textContent = heroEditContext ? 'Updating...' : 'Adding...';
        }

        try {
            if (heroEditContext?.managedId) {
                if (!supabaseClient) throw new Error('Supabase is not initialized.');
                const { data, error } = await supabaseClient
                    .from('managed_hero_slides')
                    .update(payload)
                    .eq('id', Number(heroEditContext.managedId))
                    .select('*')
                    .single();
                if (error) throw new Error(error.message || 'Could not update slide');
                const next = { ...(data || payload), id: data?.id || Number(heroEditContext.managedId) };
                updateHeroSlideByKey(heroEditContext.key, next);
            } else if (heroEditContext) {
                updateHeroSlideByKey(heroEditContext.key, payload);
                const overrides = readStaticHeroOverrides();
                overrides[heroEditContext.key] = payload;
                writeStaticHeroOverrides(overrides);
                const removed = readStaticHeroRemoved().filter((key) => key !== heroEditContext.key);
                writeStaticHeroRemoved(removed);
            } else {
                if (!supabaseClient) throw new Error('Supabase is not initialized.');
                const { data, error } = await supabaseClient
                    .from('managed_hero_slides')
                    .insert(payload)
                    .select('*')
                    .single();
                if (error) {
                    const code = String(error.code || '');
                    if (code === 'PGRST205' || code === '42P01') {
                        throw new Error('Missing table: run supabase/setup_booking_requests.sql first.');
                    }
                    throw new Error(error.message || 'Could not add slide');
                }
                addHeroSlideToDom(data || payload);
                window.localStorage?.removeItem(MANAGED_HERO_MISSING_FLAG);
            }

            resetHeroFormToCreate();
            adminNotify(isEditing ? 'Slide updated.' : 'Slide added.', 'success');
        } catch (error) {
            adminNotify(error.message || 'Save slide failed.', 'error');
        } finally {
            if (heroSaveBtn) {
                heroSaveBtn.disabled = false;
                heroSaveBtn.textContent = heroEditContext ? 'Update Slide' : 'Add Slide';
            }
        }
    });

    addPosterForm?.addEventListener('submit', async (event) => {
        event.preventDefault();
        const formData = new FormData(addPosterForm);
        const imageInput = String(formData.get('image') || '').trim();
        const file = posterFileInput?.files?.[0] || null;
        const alt = String(formData.get('alt') || 'Booking highlight').trim() || 'Booking highlight';
        const imageUrl = file ? await readFileAsDataUrl(file) : imageInput;

        if (!imageUrl) {
            adminNotify('Please provide a poster image URL/path or upload a file.', 'error');
            return;
        }

        addPosterBtn.disabled = true;
        addPosterBtn.textContent = 'Adding...';

        try {
            if (!supabaseClient) throw new Error('Supabase is not initialized.');
            const payload = { image_url: imageUrl, alt_text: alt };
            const { data, error } = await supabaseClient
                .from('managed_posters')
                .insert(payload)
                .select('*')
                .single();
            if (error) {
                const code = String(error.code || '');
                if (code === 'PGRST205' || code === '42P01') {
                    throw new Error('Missing table: run supabase/setup_booking_requests.sql first.');
                }
                throw new Error(error.message || 'Could not add poster');
            }

            addPosterToLiveMomentsGrid(data || payload);
            window.localStorage?.removeItem(MANAGED_POSTERS_MISSING_FLAG);
            addPosterForm.reset();
            adminNotify('Live moment poster added.', 'success');
        } catch (error) {
            adminNotify(error.message || 'Add poster failed.', 'error');
        } finally {
            addPosterBtn.disabled = false;
            addPosterBtn.textContent = 'Add Poster';
        }
    });

    addArtistForm?.addEventListener('submit', async (event) => {
        event.preventDefault();

        const formData = new FormData(addArtistForm);
        const name = String(formData.get('name') || '').trim();
        const role = String(formData.get('role') || '').trim();
        const category = getSelectedCategory(formData);
        const genresValue = getSelectedGenre(formData);
        const imageUrlInput = String(formData.get('image') || '').trim();
        const imageFile = imageFileInput?.files?.[0] || null;
        const imageUrl = imageFile ? await readFileAsDataUrl(imageFile) : imageUrlInput;

        if (!name || !role || !category || !imageUrl) {
            adminNotify('Name, role, category, and an image (URL or file) are required.', 'error');
            return;
        }

        const artistKey = editContext?.key || normalizeArtistKey(name);
        const payload = {
            artist_key: artistKey,
            name,
            role,
            category,
            image_url: imageUrl,
            instagram_url: String(formData.get('instagram') || '').trim(),
            twitter_url: String(formData.get('twitter') || '').trim(),
            spotify_url: String(formData.get('spotify') || '').trim(),
            youtube_url: String(formData.get('youtube') || '').trim(),
            subtitle: String(formData.get('subtitle') || '').trim(),
            dob: String(formData.get('dob') || '').trim(),
            genres: genresValue,
            description: String(formData.get('description') || '').trim(),
            metrics: String(formData.get('metrics') || '').trim()
        };

        addArtistBtn.disabled = true;
        addArtistBtn.textContent = editContext ? 'Updating...' : 'Adding...';

        try {
            const existingCard = document.querySelector(`.roster__grid .talent-card[data-artist="${artistKey}"]`);
            if (!editContext && existingCard) {
                throw new Error('Artist key already exists on page.');
            }

            let savedRow = null;
            if (editContext?.managedId) {
                if (!supabaseClient) throw new Error('Supabase is not initialized.');
                const { data, error } = await supabaseClient
                    .from('managed_artists')
                    .update(payload)
                    .eq('id', Number(editContext.managedId))
                    .select('*')
                    .single();
                if (error) {
                    if (isMissingArtistsTableError(error)) {
                        throw new Error('Missing table: run supabase/setup_booking_requests.sql first.');
                    }
                    throw new Error(error.message || 'Could not update artist');
                }
                savedRow = data;
            } else if (!editContext) {
                if (!supabaseClient) throw new Error('Supabase is not initialized.');
                const { data, error } = await supabaseClient
                    .from('managed_artists')
                    .insert(payload)
                    .select('*')
                    .single();
                if (error) {
                    if (isMissingArtistsTableError(error)) {
                        throw new Error('Missing table: run supabase/setup_booking_requests.sql first.');
                    }
                    throw new Error(error.message || 'Could not add artist');
                }
                savedRow = data;
            }

            if (editContext) {
                const target = document.querySelector(`.roster__grid .talent-card[data-artist="${editContext.key}"]`);
                if (!target) throw new Error('Could not find artist card to update.');
                const updatedData = {
                    ...(savedRow || payload),
                    id: savedRow?.id || editContext.managedId || undefined
                };
                updateTalentCardElement(target, updatedData);
                if (!editContext.managedId) {
                    const overrides = readStaticOverrides();
                    overrides[editContext.key] = updatedData;
                    writeStaticOverrides(overrides);
                    const removed = readStaticRemoved().filter(key => key !== editContext.key);
                    writeStaticRemoved(removed);
                }
                if (typeof window.applyActiveRosterFilter === 'function') {
                    window.applyActiveRosterFilter();
                }
                adminNotify('Artist updated.', 'success');
            } else {
                const added = addArtistCardToRoster(savedRow || payload);
                if (!added) {
                    throw new Error('Artist key already exists on page.');
                }
                adminNotify('Artist added to roster.', 'success');
            }

            ensureCategoryOption(category);
            window.localStorage?.removeItem(MANAGED_ARTISTS_MISSING_FLAG);
            resetArtistFormToCreate();
            window.dispatchEvent(new CustomEvent('roster-updated'));
        } catch (error) {
            adminNotify(error.message || 'Save artist failed.', 'error');
        } finally {
            addArtistBtn.disabled = false;
            addArtistBtn.textContent = editContext ? 'Update Artist' : 'Add Artist';
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
