// Text-to-Speech Module
const TTS = {
    synth: window.speechSynthesis,
    voices: [],
    settings: {
        accent: 'en-US',
        rate: 1.0
    },

    init() {
        this.loadSettings();
        this.loadVoices();
        if (this.synth.onvoiceschanged !== undefined) {
            this.synth.onvoiceschanged = () => this.loadVoices();
        }
    },

    loadVoices() {
        this.voices = this.synth.getVoices();
    },

    loadSettings() {
        const saved = localStorage.getItem('sardonix_settings');
        if (saved) {
            const parsed = JSON.parse(saved);
            this.settings.accent = parsed.accent || 'en-US';
            this.settings.rate = parsed.rate || 1.0;
        }
    },

    saveSettings() {
        localStorage.setItem('sardonix_settings', JSON.stringify(this.settings));
    },

    setAccent(accent) {
        this.settings.accent = accent;
        this.saveSettings();
    },

    setRate(rate) {
        this.settings.rate = parseFloat(rate);
        this.saveSettings();
    },

    getVoice() {
        const targetLang = this.settings.accent;
        let voice = this.voices.find(v => v.lang === targetLang);
        if (!voice) {
            voice = this.voices.find(v => v.lang.startsWith('en'));
        }
        return voice;
    },

    speak(text) {
        if (this.synth.speaking) {
            this.synth.cancel();
        }

        const utterance = new SpeechSynthesisUtterance(text);
        const voice = this.getVoice();

        if (voice) {
            utterance.voice = voice;
        }

        utterance.lang = this.settings.accent;
        utterance.rate = this.settings.rate;
        utterance.pitch = 1;

        this.synth.speak(utterance);
        return utterance;
    },

    preview() {
        this.speak("Hello, this is a test of the pronunciation.");
    }
};

window.TTS = TTS;
