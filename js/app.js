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
        // alert(`Debug: Loaded ${count} verbs`); // Use this for debugging if needed

        // Render initial verb list (pagination handles performance)
        this.renderVerbs(Object.values(window.verbDatabase));
    },

    cacheElements() {
        this.elements.verbGrid = document.getElementById('verbGrid');
    },

    currentVerbs: [],
    currentPage: 1,
    itemsPerPage: 50,

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

    renderPage(reset = false) {
        const start = 0;
        const end = this.currentPage * this.itemsPerPage;
        const verbsToShow = this.currentVerbs.slice(start, end);

        const gridContent = verbsToShow.map(verb => this.renderVerbCard(verb)).join('');

        // Add Load More button if there are more verbs
        let loadMoreHtml = '';
        if (end < this.currentVerbs.length) {
            loadMoreHtml = `
                <div class="load-more-container" style="grid-column: 1/-1; text-align: center; padding: 20px;">
                    <button id="loadMoreBtn" class="btn-primary" style="padding: 10px 30px;">
                        Carregar Mais (${this.currentVerbs.length - end} restantes)
                    </button>
                </div>
            `;
        }

        this.elements.verbGrid.innerHTML = gridContent + loadMoreHtml;
        this.bindCardEvents();

        // Bind Load More event
        const loadMoreBtn = document.getElementById('loadMoreBtn');
        if (loadMoreBtn) {
            loadMoreBtn.addEventListener('click', () => {
                this.currentPage++;
                this.renderPage(false);
            });
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
        // Card click opens conjugation
        this.elements.verbGrid.querySelectorAll('.verb-card').forEach(card => {
            card.addEventListener('click', (e) => {
                if (e.target.closest('.verb-speak-btn')) return;
                Conjugator.open(card.dataset.verb);
            });
        });

        // Speak button
        this.elements.verbGrid.querySelectorAll('.verb-speak-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                TTS.speak(btn.dataset.speak);
            });
        });
    }
};

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    App.init();
});

window.App = App;
