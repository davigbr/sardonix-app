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
        relatedVerbs: null,
        // Phrasal Verbs Elements
        phrasalSection: null,
        togglePhrasalBtn: null,
        phrasalContainer: null
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
        this.elements.explanation = document.getElementById('verbExplanation');
        this.elements.examplesList = document.getElementById('examplesList');
        this.elements.toggleBtn = document.getElementById('toggleFullConjugation');
        this.elements.fullConjugation = document.getElementById('fullConjugation');
        this.elements.relatedVerbs = document.getElementById('relatedVerbs');

        // Phrasal Verbs Elements
        this.elements.phrasalSection = document.getElementById('phrasalSection');
        this.elements.togglePhrasalBtn = document.getElementById('togglePhrasalVerbs');
        this.elements.phrasalContainer = document.getElementById('phrasalVerbsContainer');
    },

    bindEvents() {
        this.elements.closeBtn.addEventListener('click', () => this.close());
        this.elements.overlay.addEventListener('click', (e) => {
            if (e.target === this.elements.overlay) this.close();
        });
        this.elements.toggleBtn.addEventListener('click', () => this.toggleFullConjugation());
        this.elements.togglePhrasalBtn.addEventListener('click', () => this.togglePhrasalVerbs());

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isOpen()) {
                this.close();
            }
        });
    },

    open(verbKey) {
        try {
            const verb = window.verbDatabase[verbKey.toLowerCase()];
            if (!verb) {
                console.error('Verb not found:', verbKey);
                return;
            }

            // Ensure verb is hydrated (tenses generated) before rendering
            if (!verb.tenses && window.VerbUtils) {
                verb.tenses = window.VerbUtils.generateTenses(verb);
            }

            this.currentVerb = verb;
            this.render(verb);
            this.elements.modal.scrollTop = 0;
            this.elements.overlay.classList.add('active');
            document.body.style.overflow = 'hidden';

            console.log('Opened modal for:', verbKey);
        } catch (err) {
            console.error('Error opening conjugator:', err);
            alert('Erro ao abrir o modal: ' + err.message);
        }
    },

    close() {
        this.elements.overlay.classList.remove('active');
        document.body.style.overflow = '';
        this.elements.toggleBtn.classList.remove('active');
        this.elements.togglePhrasalBtn.classList.remove('active');
        this.elements.phrasalContainer.classList.remove('active');
    },

    isOpen() {
        return this.elements.overlay.classList.contains('active');
    },

    render(verb) {
        this.elements.title.innerHTML = `
            ${verb.infinitive}
            ${verb.uk ? `<span style="font-size: 0.6em; color: var(--text-secondary); margin-left:8px;">🇬🇧 ${verb.uk}</span>` : ''}
        `;
        this.elements.translation.textContent = verb.translation;

        // Tag Definitions
        const tagConfig = {
            'regular': { label: 'Regular', title: 'Verbo que segue o padrão -ed no passado' },
            'irregular': { label: 'Irregular', title: 'Verbo com formas próprias de passado' },
            'modal': { label: 'Modal', title: 'Verbo auxiliar que expressa necessidade, possibilidade, etc.' },
            'defective': { label: 'Defectivo', title: 'Verbo que não possui todas as formas conjugadas' },
            'phrasal': { label: 'Phrasal', title: 'Verbo composto com preposição que altera seu sentido' }
        };

        // Tags
        this.elements.tags.innerHTML = verb.tags.map(tag => {
            const config = tagConfig[tag] || { label: tag, title: '' };
            return `<span class="verb-tag tag-${tag}" title="${config.title}">${config.label}</span>`;
        }).join('');

        if (verb.phrasal) {
            const config = tagConfig['phrasal'];
            this.elements.tags.innerHTML += `<span class="verb-tag tag-phrasal" title="${config.title}">${config.label}</span>`;
        }

        // Principal parts
        this.elements.principalParts.innerHTML = `
            <div class="principal-part">
                <span class="part-label">Base Form</span>
                <button class="part-value speakable" data-speak="${verb.forms.base}">${verb.forms.base || 'N/A'}</button>
            </div>
            <div class="principal-part">
                <span class="part-label">Past Simple</span>
                <button class="part-value speakable" data-speak="${verb.forms.pastSimple}">${verb.forms.pastSimple || 'N/A'}</button>
            </div>
            <div class="principal-part">
                <span class="part-label">Past Participle</span>
                <button class="part-value speakable" data-speak="${verb.forms.pastParticiple}">${verb.forms.pastParticiple || 'N/A'}</button>
            </div>
`;

        // Explanation
        this.elements.explanation.textContent = verb.explanation || '';

        // Examples
        if (verb.examples && verb.examples.length > 0) {
            this.elements.examplesList.innerHTML = verb.examples.map(ex => `
                <li class="example-item">
                    <button class="example-en speakable" data-speak="${ex.en}">${ex.en}</button>
                    <span class="example-pt">${ex.pt}</span>
                </li>
            `).join('');
        } else {
            this.elements.examplesList.innerHTML = '<li class="no-examples">Nenhum exemplo disponível</li>';
        }

        // Phrasal Verbs Section
        if (verb.phrasal && verb.phrasal.length > 0) {
            this.elements.phrasalSection.style.display = 'block';
            this.elements.togglePhrasalBtn.querySelector('span').textContent = `Ver ${verb.phrasal.length} Phrasal Verbs`;

            this.elements.phrasalContainer.innerHTML = verb.phrasal.map(p => `
                <div class="phrasal-item">
                    <div class="phrasal-header">
                        <span class="phrasal-verb-name">${p.verb}</span>
                    </div>
                    <p class="phrasal-definition">${p.definition}</p>
                    <div class="phrasal-example">
                        <div class="phrasal-example-en speakable" data-speak="${p.example.en}">
                            "${p.example.en}"
                        </div>
                        <div class="phrasal-example-pt">${p.example.pt}</div>
                    </div>
                </div>
            `).join('');
        } else {
            this.elements.phrasalSection.style.display = 'none';
        }

        // Reset accordion states for new verb
        this.elements.toggleBtn.classList.remove('active');
        this.elements.togglePhrasalBtn.classList.remove('active');
        this.elements.phrasalContainer.classList.remove('active');

        // Full conjugation
        this.elements.fullConjugation.innerHTML = this.renderFullConjugation(verb);

        // Related verbs
        this.renderRelatedVerbs(verb.related);

        // Bind speak events
        this.bindSpeakEvents(this.elements.modal);
    },

    renderFullConjugation(verb) {
        const pronouns = ['I', 'you', 'he/she/it', 'we', 'they'];
        let html = '<div class="conjugation-groups">';

        // Iterate over Config Groups (Present, Past, Future, Conditional)
        for (const [groupKey, groupConfig] of Object.entries(window.tenseConfig)) {
            // Check if any tense in this group exists for the verb
            const hasTenses = Object.keys(groupConfig.tenses).some(k => verb.tenses[k]);
            if (!hasTenses) continue;

            html += `
                <div class="conjugation-group">
                    <h3 class="group-title">${groupConfig.title}</h3>
                    <div class="conjugation-table-wrapper">
                        <table class="conjugation-table">
                            <thead>
                                <tr>
                                    <th>Tense</th>
                                    ${pronouns.map(p => `<th>${p}</th>`).join('')}
                                </tr>
                            </thead>
                            <tbody>
            `;

            // Iterate over tenses in this group
            for (const [tenseKey, tenseInfo] of Object.entries(groupConfig.tenses)) {
                const conjugations = verb.tenses[tenseKey];
                if (!conjugations) continue;

                html += `<tr>`;
                html += `
                    <td>
                        <div class="tense-name-container">
                            <strong>${tenseInfo.name}</strong>
                            <div class="tooltip-icon" data-tooltip="${tenseInfo.desc}">
                                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>
                            </div>
                        </div>
                    </td>`;

                for (const pronoun of pronouns) {
                    const form = conjugations[pronoun] || '-';

                    let speakText = `${pronoun} ${form}`;
                    if (pronoun === 'he/she/it') {
                        // Use 'it' for weather verbs, 'he' for others
                        const isWeather = verb.tags.includes('weather') || ['rain', 'snow', 'hail', 'thunder', 'freeze'].includes(verb.infinitive);
                        const person = isWeather ? 'it' : 'he';
                        speakText = `${person} ${form}`;
                    }

                    html += `<td><button class="speakable" data-speak="${speakText}">${form}</button></td>`;
                }
                html += '</tr>';
            }

            html += `
                            </tbody>
                        </table>
                    </div>
                </div>
            `;
        }

        html += '</div>';
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

    togglePhrasalVerbs() {
        this.elements.togglePhrasalBtn.classList.toggle('active');
        this.elements.phrasalContainer.classList.toggle('active');
    },

    bindSpeakEvents(container) {
        if (!container) return;
        container.querySelectorAll('.speakable').forEach(el => {
            el.addEventListener('click', (e) => {
                e.stopPropagation();
                const text = el.dataset.speak || el.textContent;
                TTS.speak(text);

                el.classList.add('speaking');
                setTimeout(() => el.classList.remove('speaking'), 500);
            });
        });
    },

};

window.Conjugator = Conjugator;
