// Search Module
const Search = {
    elements: {
        input: null,
        clearBtn: null
    },
    currentQuery: '',

    init() {
        this.cacheElements();
        this.bindEvents();
    },

    cacheElements() {
        this.elements.input = document.getElementById('searchInput');
        this.elements.clearBtn = document.getElementById('searchClear');
    },

    bindEvents() {
        this.elements.input.addEventListener('input', (e) => {
            this.handleSearch(e.target.value);
        });

        this.elements.clearBtn.addEventListener('click', () => {
            this.clear();
        });

        this.elements.input.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.clear();
                this.elements.input.blur();
            }
        });
    },

    handleSearch(query) {
        this.currentQuery = query.toLowerCase().trim();
        const results = this.search(this.currentQuery);
        App.renderVerbs(results);
    },

    search(query) {
        if (!query) {
            return Object.values(window.verbDatabase);
        }

        const results = [];

        for (const [key, verb] of Object.entries(window.verbDatabase)) {
            let score = 0;

            // Match infinitive
            if (verb.infinitive.toLowerCase().includes(query)) {
                score += verb.infinitive.toLowerCase() === query ? 100 : 50;
            }

            // Match translation
            if (verb.translation.toLowerCase().includes(query)) {
                score += 40;
            }

            // Match UK spelling
            if (verb.uk && verb.uk.toLowerCase().includes(query)) {
                score += 90; // High score for direct UK match
            }

            // Match forms
            for (const form of Object.values(verb.forms)) {
                if (form.toLowerCase().includes(query)) {
                    score += 30;
                    break;
                }
            }

            // Match conjugations (only if hydrated)
            if (verb.tenses) {
                for (const tense of Object.values(verb.tenses)) {
                    for (const conjugation of Object.values(tense)) {
                        if (conjugation.toLowerCase().includes(query)) {
                            score += 20;
                            break;
                        }
                    }
                    if (score > 0) break;
                }
            }

            if (score > 0) {
                results.push({ ...verb, score });
            }
        }

        return results.sort((a, b) => b.score - a.score);
    },

    clear() {
        this.elements.input.value = '';
        this.currentQuery = '';
        App.renderVerbs(Object.values(window.verbDatabase));
    }
};

window.Search = Search;
