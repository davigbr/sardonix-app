// Settings Module
const Settings = {
    elements: {
        overlay: null,
        panel: null,
        closeBtn: null,
        openBtn: null,
        accentUS: null,
        accentUK: null,
        speedSlider: null,
        currentSpeed: null,
        previewBtn: null
    },

    init() {
        this.cacheElements();
        this.bindEvents();
        this.loadSettings();
    },

    cacheElements() {
        this.elements.overlay = document.getElementById('settingsOverlay');
        this.elements.panel = document.getElementById('settingsPanel');
        this.elements.closeBtn = document.getElementById('settingsClose');
        this.elements.openBtn = document.getElementById('settingsBtn');
        this.elements.accentUS = document.getElementById('accentUS');
        this.elements.accentUK = document.getElementById('accentUK');
        this.elements.speedSlider = document.getElementById('speedSlider');
        this.elements.currentSpeed = document.getElementById('currentSpeed');
        this.elements.previewBtn = document.getElementById('previewVoice');
    },

    bindEvents() {
        this.elements.openBtn.addEventListener('click', () => this.open());
        this.elements.closeBtn.addEventListener('click', () => this.close());
        this.elements.overlay.addEventListener('click', (e) => {
            if (e.target === this.elements.overlay) this.close();
        });

        this.elements.accentUS.addEventListener('click', () => this.setAccent('en-US'));
        this.elements.accentUK.addEventListener('click', () => this.setAccent('en-GB'));

        this.elements.speedSlider.addEventListener('input', (e) => {
            this.setSpeed(e.target.value);
        });

        this.elements.previewBtn.addEventListener('click', () => {
            TTS.preview();
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isOpen()) {
                this.close();
            }
        });
    },

    loadSettings() {
        const accent = TTS.settings.accent;
        const rate = TTS.settings.rate;

        this.updateAccentUI(accent);
        this.elements.speedSlider.value = rate;
        this.elements.currentSpeed.textContent = rate.toFixed(1);
    },

    setAccent(accent) {
        TTS.setAccent(accent);
        this.updateAccentUI(accent);
    },

    updateAccentUI(accent) {
        this.elements.accentUS.classList.toggle('active', accent === 'en-US');
        this.elements.accentUK.classList.toggle('active', accent === 'en-GB');
    },

    setSpeed(value) {
        TTS.setRate(value);
        this.elements.currentSpeed.textContent = parseFloat(value).toFixed(1);
    },

    open() {
        this.elements.overlay.classList.add('active'); // Still uses .active
        document.body.style.overflow = 'hidden';
    },

    close() {
        this.elements.overlay.classList.remove('active');
        document.body.style.overflow = '';
    },

    isOpen() {
        return this.elements.overlay.classList.contains('active');
    }
};

window.Settings = Settings;
