// Conjugator Module
const Conjugator = {
    elements: {
        overlay: null,
        modal: null,
        closeBtn: null,
        title: null,
        translation: null,
        tags: null,
        principalParts: null,
        toggleBtn: null,
        fullConjugation: null,
        relatedVerbs: null
    },
    currentVerb: null,

    init() {
        this.cacheElements();
        this.bindEvents();
    },

    cacheElements() {
        this.elements.overlay = document.getElementById('modalOverlay');
        this.elements.modal = document.getElementById('conjugationModal');
        this.elements.closeBtn = document.getElementById('modalClose');
        this.elements.title = document.getElementById('modalVerbTitle');
        this.elements.translation = document.getElementById('modalVerbTranslation');
        this.elements.tags = document.getElementById('modalVerbTags');
        this.elements.principalParts = document.getElementById('principalParts');
        this.elements.toggleBtn = document.getElementById('toggleFullConjugation');
        this.elements.fullConjugation = document.getElementById('fullConjugation');
        this.elements.relatedVerbs = document.getElementById('relatedVerbs');
    },

    bindEvents() {
        this.elements.closeBtn.addEventListener('click', () => this.close());
        this.elements.overlay.addEventListener('click', (e) => {
            if (e.target === this.elements.overlay) this.close();
        });
        this.elements.toggleBtn.addEventListener('click', () => this.toggleFullConjugation());

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isOpen()) {
                this.close();
            }
        });
    },

    open(verbKey) {
        const verb = window.verbDatabase[verbKey];
        if (!verb) return;

        this.currentVerb = verb;
        this.render(verb);
        this.elements.overlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    },

    close() {
        this.elements.overlay.classList.remove('active');
        document.body.style.overflow = '';
        this.elements.toggleBtn.classList.remove('active');
    },

    isOpen() {
        return this.elements.overlay.classList.contains('active');
    },

    render(verb) {
        this.elements.title.textContent = verb.infinitive;
        this.elements.translation.textContent = verb.translation;

        // Tags
        this.elements.tags.innerHTML = verb.tags.map(tag =>
            `<span class="verb-tag ${tag}">${tag}</span>`
        ).join('');

        // Principal parts
        this.elements.principalParts.innerHTML = `
            <div class="principal-part">
                <span class="part-label">Base Form</span>
                <button class="part-value speakable" data-speak="${verb.forms.base}">${verb.forms.base}</button>
            </div>
            <div class="principal-part">
                <span class="part-label">Past Simple</span>
                <button class="part-value speakable" data-speak="${verb.forms.pastSimple}">${verb.forms.pastSimple}</button>
            </div>
            <div class="principal-part">
                <span class="part-label">Past Participle</span>
                <button class="part-value speakable" data-speak="${verb.forms.pastParticiple}">${verb.forms.pastParticiple}</button>
            </div>
        `;

        // Full conjugation
        this.elements.fullConjugation.innerHTML = this.renderFullConjugation(verb);

        // Related verbs
        this.renderRelatedVerbs(verb.related);

        // Bind speak events
        this.bindSpeakEvents();
    },

    renderFullConjugation(verb) {
        const pronouns = ['I', 'you', 'he/she/it', 'we', 'they'];
        let html = '<div class="conjugation-table-wrapper"><table class="conjugation-table">';
        html += `<thead><tr><th>Tense</th>${pronouns.map(p => `<th>${p}</th>`).join('')}</tr></thead>`;
        html += '<tbody>';

        for (const [tenseKey, conjugations] of Object.entries(verb.tenses)) {
            const tenseName = window.tenseNames[tenseKey] || tenseKey;
            html += `<tr>`;
            html += `<td><strong>${tenseName}</strong></td>`;
            for (const pronoun of pronouns) {
                const form = conjugations[pronoun] || '-';
                // Include pronoun in speech for context (e.g., "I am" instead of just "am")
                const speakText = pronoun === 'he/she/it' ? `he ${form}` : `${pronoun} ${form}`;
                html += `<td><button class="speakable" data-speak="${speakText}">${form}</button></td>`;
            }
            html += '</tr>';
        }

        html += '</tbody></table></div>';
        return html;
    },

    renderRelatedVerbs(related) {
        if (!related || related.length === 0) {
            this.elements.relatedVerbs.innerHTML = '<span class="no-related">Nenhum verbo relacionado</span>';
            return;
        }

        this.elements.relatedVerbs.innerHTML = related.map(verbKey => {
            const exists = window.verbDatabase[verbKey];
            return `<button class="related-verb${exists ? '' : ' disabled'}" 
                data-verb="${verbKey}" ${!exists ? 'disabled' : ''}>
                ${verbKey}
            </button>`;
        }).join('');

        // Bind click events for related verbs
        this.elements.relatedVerbs.querySelectorAll('.related-verb:not(.disabled)').forEach(btn => {
            btn.addEventListener('click', () => {
                this.open(btn.dataset.verb);
            });
        });
    },

    toggleFullConjugation() {
        this.elements.toggleBtn.classList.toggle('active');
    },

    bindSpeakEvents() {
        this.elements.modal.querySelectorAll('.speakable').forEach(el => {
            el.addEventListener('click', (e) => {
                e.stopPropagation();
                const text = el.dataset.speak || el.textContent;
                TTS.speak(text);

                el.classList.add('speaking');
                setTimeout(() => el.classList.remove('speaking'), 500);
            });
        });
    }
};

window.Conjugator = Conjugator;
