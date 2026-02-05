"use client";

interface TTSSettings {
    accent: string;
    rate: number;
}

class TTSManager {
    private synth: SpeechSynthesis | null = null;
    private voices: SpeechSynthesisVoice[] = [];
    private settings: TTSSettings = {
        accent: 'en-US',
        rate: 0.5
    };

    constructor() {
        if (typeof window !== 'undefined' && window.speechSynthesis) {
            this.synth = window.speechSynthesis;
            this.loadSettings();
            this.loadVoices();
            if (this.synth.onvoiceschanged !== undefined) {
                this.synth.onvoiceschanged = () => this.loadVoices();
            }
        }
    }

    private loadVoices() {
        if (!this.synth) return;
        this.voices = this.synth.getVoices();
    }

    private loadSettings() {
        if (typeof window === 'undefined') return;
        const saved = localStorage.getItem('sardonix_settings');
        if (saved) {
            try {
                const parsed = JSON.parse(saved);
                this.settings.accent = parsed.accent || 'en-US';
                // Use stored rate, or default to 0.5 if not present (checking strictly for undefined to allow 0 if ever needed, though min is 0.25)
                this.settings.rate = parsed.rate !== undefined ? parsed.rate : 0.5;
            } catch (e) {
                console.error("Error loading TTS settings", e);
            }
        }
    }

    public speak(text: string) {
        if (!this.synth) return;
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
    }

    public setAccent(accent: string) {
        this.settings.accent = accent;
        this.saveSettings();
    }

    public setRate(rate: number) {
        this.settings.rate = rate;
        this.saveSettings();
    }

    public getSettings() {
        return { ...this.settings };
    }

    private saveSettings() {
        localStorage.setItem('sardonix_settings', JSON.stringify(this.settings));
    }

    private getVoice(): SpeechSynthesisVoice | null {
        const targetLang = this.settings.accent;
        let voice = this.voices.find(v => v.lang === targetLang);
        if (!voice) {
            voice = this.voices.find(v => v.lang.startsWith('en'));
        }
        return voice || null;
    }
}

// Singleton instance
export const TTS = new TTSManager();
