"use client";

import { TTS } from "@/utils/tts";
import { X, Play, Settings } from "lucide-react";
import { useEffect, useState } from "react";
import clsx from "clsx";

interface SettingsModalProps {
    onClose: () => void;
}

export default function SettingsModal({ onClose }: SettingsModalProps) {
    const [accent, setAccent] = useState("en-US");
    const [rate, setRate] = useState(0.5);

    useEffect(() => {
        // Load current settings
        const current = TTS.getSettings();
        setAccent(current.accent);
        setRate(current.rate);
    }, []);

    const handleAccentChange = (newAccent: string) => {
        setAccent(newAccent);
        TTS.setAccent(newAccent);
    };

    const handleRateChange = (newRate: number) => {
        setRate(newRate);
        TTS.setRate(newRate);
    };

    const handlePreview = () => {
        TTS.speak("Hello, this is a test of the pronunciation.");
    };

    return (
        <div className="panel-overlay active" onClick={(e) => e.target === e.currentTarget && onClose()}>
            <div className="side-panel active">
                <div className="panel-header">
                    <h2 className="flex items-center gap-2">
                        <Settings size={20} />
                        Configurações
                    </h2>
                    <button className="panel-close" onClick={onClose} aria-label="Fechar">
                        <X size={24} />
                    </button>
                </div>

                <div className="panel-content settings-content">
                    {/* Pronunciation Preference */}
                    <div className="setting-group">
                        <label className="setting-label">Preferência de pronúncia</label>
                        <div className="toggle-group">
                            <button
                                className={clsx("toggle-option", { active: accent === "en-US" })}
                                onClick={() => handleAccentChange("en-US")}
                            >
                                <span className="text-xl mr-2">🇺🇸</span>
                                <span>American</span>
                            </button>
                            <button
                                className={clsx("toggle-option", { active: accent === "en-GB" })}
                                onClick={() => handleAccentChange("en-GB")}
                            >
                                <span className="text-xl mr-2">🇬🇧</span>
                                <span>British</span>
                            </button>
                        </div>
                        <p className="setting-hint">Variações de escrita são sempre mostradas</p>
                    </div>

                    {/* Speech Speed */}
                    <div className="setting-group">
                        <label className="setting-label">Velocidade da pronúncia</label>
                        <div className="speed-control">
                            <span className="speed-label">0.25x</span>
                            <input
                                type="range"
                                min="0.25"
                                max="2"
                                step="0.25"
                                value={rate}
                                onChange={(e) => handleRateChange(parseFloat(e.target.value))}
                                className="speed-slider"
                            />
                            <span className="speed-label">2x</span>
                        </div>
                        <p className="speed-value">
                            Atual: <span>{rate.toFixed(1)}</span>x
                        </p>
                    </div>

                    {/* Voice Preview */}
                    <div className="setting-group">
                        <button className="preview-btn" onClick={handlePreview}>
                            <Play size={18} className="mr-2" />
                            Testar pronúncia
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
