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

        // Render initial verb list
        this.renderVerbs(Object.values(window.verbDatabase));
    },

    cacheElements() {
        this.elements.verbGrid = document.getElementById('verbGrid');
    },

    renderVerbs(verbs) {
        if (verbs.length === 0) {
            this.elements.verbGrid.innerHTML = `
                <div class="no-results">
                    <div class="no-results-icon">🔍</div>
                    <h3>Nenhum verbo encontrado</h3>
                    <p>Tente buscar por outra palavra ou forma verbal</p>
                </div>
            `;
            return;
        }

        this.elements.verbGrid.innerHTML = verbs.map(verb => this.renderVerbCard(verb)).join('');
        this.bindCardEvents();
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
