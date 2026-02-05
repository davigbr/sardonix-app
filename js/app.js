// Main App Module
const App = {
    elements: {
        verbGrid: null,
        favoriteFilterBtn: null
    },

    showFavoritesOnly: false,

    async init() {
        console.log('App v3.0 - Full JSON Migration');
        this.cacheElements();

        // Initialize Favorites
        Favorites.init();

        // Setup Infinite Scroll Observer FIRST
        this.observer = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting && this.hasMoreItems()) {
                this.currentPage++;
                this.renderPage(false);
            }
        }, { rootMargin: '100px' });

        // Initialize all modules
        TTS.init();
        Settings.init();
        Search.init();
        Conjugator.init();

        // Load all verb data (A-Z)
        const letters = 'abcdefghijklmnopqrstuvwxyz'.split('');
        const timestamp = Date.now(); // Unified cache buster

        console.time('LoadVerbs');

        try {
            const promises = letters.map(async (letter) => {
                try {
                    const response = await fetch(`data/verbs/${letter}.json?v=${timestamp}`);
                    if (!response.ok) throw new Error(`HTTP ${response.status}`);
                    return await response.json();
                } catch (err) {
                    console.warn(`Failed to load ${letter}.json:`, err.message);
                    return null;
                }
            });

            const results = await Promise.all(promises);

            // Initialize database
            window.verbDatabase = window.verbDatabase || {};

            let totalLoaded = 0;
            results.forEach(data => {
                if (data) {
                    Object.assign(window.verbDatabase, data);
                    totalLoaded += Object.keys(data).length;
                }
            });

            console.log(`Total verbs loaded: ${totalLoaded}`);
            console.timeEnd('LoadVerbs');

            // Render final list
            this.refreshVerbs();

        } catch (err) {
            console.error('Critical error loading verbs:', err);
            alert('Erro crítico ao carregar verbos. Verifique o console.');
        }
    },

    refreshVerbs() {
        // Sort verbs alphabetically
        const verbs = Object.values(window.verbDatabase).sort((a, b) =>
            a.infinitive.localeCompare(b.infinitive)
        );
        this.renderVerbs(verbs);
    },

    cacheElements() {
        this.elements.verbGrid = document.getElementById('verbGrid');
        this.elements.favoriteFilterBtn = document.getElementById('favoriteFilterBtn');
    },

    currentVerbs: [],
    currentPage: 1,
    itemsPerPage: 50,
    observer: null,

    renderVerbs(verbs) {
        // Apply Favorites Filter if active
        if (this.showFavoritesOnly) {
            verbs = verbs.filter(v => Favorites.isFavorite(v.infinitive));
        }

        if (!verbs || verbs.length === 0) {
            this.elements.verbGrid.innerHTML = `
                <div class="no-results">
                    <div class="no-results-icon">🔍</div>
                    <h3>Nenhum verbo encontrado</h3>
                    <p>Tente buscar por outra palavra ou forma verbal</p>
                </div>
            `;
            return;
        }

        this.currentVerbs = verbs;
        this.currentPage = 1;
        this.renderPage(true);
    },

    hasMoreItems() {
        return (this.currentPage * this.itemsPerPage) < this.currentVerbs.length;
    },

    renderPage(reset = false) {
        const start = reset ? 0 : (this.currentPage - 1) * this.itemsPerPage;
        const end = this.currentPage * this.itemsPerPage;

        const sliceStart = reset ? 0 : start;
        const verbsToShow = this.currentVerbs.slice(sliceStart, end);
        const gridContent = verbsToShow.map(verb => this.renderVerbCard(verb)).join('');

        if (reset) {
            this.elements.verbGrid.innerHTML = gridContent;
            window.scrollTo(0, 0); // Reset scroll on fresh search/load
        } else {
            // Remove previous sentinel if it exists
            const sentinel = document.getElementById('scroll-sentinel');
            if (sentinel) sentinel.remove();

            this.elements.verbGrid.insertAdjacentHTML('beforeend', gridContent);
        }

        this.bindCardEvents();

        // Append Sentinel if there are more items
        if (this.hasMoreItems()) {
            const sentinel = document.createElement('div');
            sentinel.id = 'scroll-sentinel';
            sentinel.style.height = '20px';
            sentinel.style.width = '100%';
            // sentinel.style.background = 'red'; // Debugging
            this.elements.verbGrid.appendChild(sentinel);
            this.observer.observe(sentinel);
        }
    },

    renderVerbCard(verb) {
        const tagDots = verb.tags.map(tag => {
            if (tag === 'irregular') return '<span class="tag-mini tag-irregular" title="Irregular"></span>';
            if (tag === 'phrasal') return '<span class="tag-mini tag-phrasal" title="Phrasal verb"></span>';
            return '';
        }).join('');

        const isFavorite = Favorites.isFavorite(verb.infinitive);
        const heartClass = isFavorite ? 'active' : '';
        const heartFill = isFavorite ? 'currentColor' : 'none';

        return `
            <article class="verb-card" data-verb="${verb.infinitive}">
                <button class="verb-favorite-btn ${heartClass}" data-verb="${verb.infinitive}" aria-label="Favoritar">
                     <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="${heartFill}" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                    </svg>
                </button>
                <div class="verb-tags-mini">${tagDots}</div>
                <div class="verb-card-content">
                    <h3 class="verb-infinitive">${verb.infinitive}</h3>
                    <p class="verb-translation">${verb.translation}</p>
                    <div class="verb-preview">
                        <span class="verb-form-mini">${verb.forms.pastSimple}</span>
                        <span class="verb-form-mini">${verb.forms.pastParticiple}</span>
                    </div>
                </div>
                <button class="verb-speak-btn" data-speak="${verb.infinitive}" aria-label="Pronunciar">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
                        <path d="M15.54 8.46a5 5 0 0 1 0 7.07"></path>
                    </svg>
                </button>
            </article>
        `;
    },

    bindCardEvents() {
        // Keeping empty as requested by previous logic context, relying on delegation
    },

    // Changing bindCardEvents to event delegation to support infinite scroll efficiently
    bindGlobalEvents() {
        // Favorite Filter Toggle
        this.elements.favoriteFilterBtn.addEventListener('click', () => {
            this.showFavoritesOnly = !this.showFavoritesOnly;
            this.elements.favoriteFilterBtn.classList.toggle('active', this.showFavoritesOnly);

            // Re-run search if active, otherwise refresh list
            if (document.getElementById('searchInput').value.trim()) {
                Search.runSearch(document.getElementById('searchInput').value);
            } else {
                this.refreshVerbs();
            }
        });

        this.elements.verbGrid.addEventListener('click', (e) => {
            const card = e.target.closest('.verb-card');
            const speakBtn = e.target.closest('.verb-speak-btn');
            const favBtn = e.target.closest('.verb-favorite-btn');

            if (favBtn) {
                e.stopPropagation();
                const verb = favBtn.dataset.verb;
                const isFav = Favorites.toggle(verb);

                favBtn.classList.toggle('active', isFav);
                const svg = favBtn.querySelector('svg');
                svg.setAttribute('fill', isFav ? 'currentColor' : 'none');

                // If in "Favorites Only" mode and un-favorited, remove card
                if (this.showFavoritesOnly && !isFav) {
                    this.refreshVerbs();
                }
                return;
            }

            if (speakBtn) {
                e.stopPropagation();
                TTS.speak(speakBtn.dataset.speak);
                return;
            }

            if (card) {
                Conjugator.open(card.dataset.verb);
            }
        });
    }
};

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    App.init();
    App.bindGlobalEvents(); // Bind delegation once
});

window.App = App;
