// Main App Module
const App = {
    elements: {
        verbGrid: null
    },

    init() {
        this.cacheElements();

        // Initialize all modules
        TTS.init();
        Settings.init();
        Search.init();
        Conjugator.init();

        const count = Object.keys(window.verbDatabase).length;
        console.log(`Loaded ${count} verbs`);

        // Setup Infinite Scroll Observer
        this.observer = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting && this.hasMoreItems()) {
                this.currentPage++;
                this.renderPage(false);
            }
        }, { rootMargin: '100px' });

        // Render initial verb list
        this.renderVerbs(Object.values(window.verbDatabase));
    },

    cacheElements() {
        this.elements.verbGrid = document.getElementById('verbGrid');
    },

    currentVerbs: [],
    currentPage: 1,
    itemsPerPage: 50,
    observer: null,

    renderVerbs(verbs) {
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

        // If resetting, we render from 0 to end (first page)
        // If appending, we want to render strictly the new page slice
        // BUT the original code was: const start = 0; const end = this.currentPage * this.itemsPerPage;
        // which implies re-rendering the whole list every time?
        // Let's optimize: append if not reset.

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

        return `
            <article class="verb-card" data-verb="${verb.infinitive}">
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
        // We only need to bind events for NEW items if appending, 
        // but current implementation binds to ALL queries in verbGrid.
        // It's safer to re-bind or use event delegation.
        // For now, to match existing logic style but avoid duplicate listeners:

        // Better approach: Use Event Delegation on the grid itself
        // But to minimize refactor risk of breaking other logic, let's keep it simple.
        // However, adding listeners repeatedly to existing elements is bad.
        // Let's use event delegation for the Grid once in init? 
        // No, let's stick to the plan but be careful.

        // Actually, the original code querySelectorAll('.verb-card') re-binds everything.
        // Use cloneNode or removeEventListener? 
        // EASIEST SAFE FIX: Event delegation on #verbGrid.
    },

    // Changing bindCardEvents to event delegation to support infinite scroll efficiently
    bindGlobalEvents() {
        this.elements.verbGrid.addEventListener('click', (e) => {
            const card = e.target.closest('.verb-card');
            const speakBtn = e.target.closest('.verb-speak-btn');

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
