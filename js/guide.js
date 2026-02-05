// Guide Module
const Guide = {
    elements: {
        overlay: null,
        panel: null,
        closeBtn: null,
        openBtn: null,
        tensesList: null
    },

    init() {
        this.cacheElements();
        if (!this.elements.overlay) return; // Guard clause in case elements aren't found
        this.bindEvents();
        this.renderTenses();
    },

    cacheElements() {
        this.elements.overlay = document.getElementById('guideOverlay');
        this.elements.panel = document.getElementById('guidePanel');
        this.elements.closeBtn = document.getElementById('guideClose');
        this.elements.openBtn = document.getElementById('guideBtn');
        this.elements.tensesList = document.getElementById('guideTensesList');
    },

    bindEvents() {
        if (this.elements.openBtn) {
            this.elements.openBtn.addEventListener('click', () => this.open());
        }

        if (this.elements.closeBtn) {
            this.elements.closeBtn.addEventListener('click', () => this.close());
        }

        if (this.elements.overlay) {
            this.elements.overlay.addEventListener('click', (e) => {
                if (e.target === this.elements.overlay) this.close();
            });
        }

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isOpen()) {
                this.close();
            }
        });
    },

    renderTenses() {
        const container = this.elements.tensesList;
        if (!container || !window.tenseConfig) return;

        container.innerHTML = '';

        for (const [key, group] of Object.entries(window.tenseConfig)) {
            // Create Group Title
            const groupHeader = document.createElement('h3');
            groupHeader.innerHTML = `
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
                ${group.title}
            `;
            container.appendChild(groupHeader);

            // Create Tense Items
            for (const [tenseKey, tense] of Object.entries(group.tenses)) {
                const item = document.createElement('div');
                item.className = 'tense-item';

                const name = document.createElement('div');
                name.className = 'tense-name';
                name.textContent = tense.name;

                const desc = document.createElement('div');
                desc.className = 'tense-desc';
                desc.textContent = tense.desc;

                item.appendChild(name);
                item.appendChild(desc);
                container.appendChild(item);
            }
        }
    },

    open() {
        this.elements.overlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    },

    close() {
        this.elements.overlay.classList.remove('active');
        document.body.style.overflow = '';
    },

    isOpen() {
        return this.elements.overlay && this.elements.overlay.classList.contains('active');
    }
};

document.addEventListener('DOMContentLoaded', () => {
    Guide.init();
});
