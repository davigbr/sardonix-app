"use client";

import { X, BookOpen, Circle } from "lucide-react";
import { tenseConfig } from "@/lib/conjugator";
import { useEffect } from "react";

interface GuideModalProps {
    onClose: () => void;
}

export default function GuideModal({ onClose }: GuideModalProps) {
    // Lock scroll
    useEffect(() => {
        document.body.style.overflow = "hidden";
        return () => {
            document.body.style.overflow = "";
        };
    }, []);

    // Handle ESC
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose();
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [onClose]);

    return (
        <div className="panel-overlay active" onClick={(e) => e.target === e.currentTarget && onClose()}>
            <div className="side-panel">
                <div className="panel-header">
                    <h2>Guia de Estudo</h2>
                    <button className="panel-close" onClick={onClose} aria-label="Fechar">
                        <X size={24} />
                    </button>
                </div>

                <div className="panel-content guide-content">
                    <section className="guide-section">
                        <h3>Entendendo as Tags</h3>
                        <div className="tag-explanation">
                            <span className="verb-tag tag-regular">Regular</span>
                            <p>Verbos que seguem o padrão de adicionar <strong>-ed</strong> para formar o passado e o particípio passado. Exemplo: <em>work → worked</em>.</p>
                        </div>
                        <div className="tag-explanation">
                            <span className="verb-tag tag-irregular">Irregular</span>
                            <p>Verbos que têm formas próprias e únicas para o passado e particípio, não seguindo regras fixas. Exemplo: <em>go → went → gone</em>.</p>
                        </div>
                        <div className="tag-explanation">
                            <span className="verb-tag tag-base">Modal</span>
                            <p>Verbos auxiliares que expressam necessidade, possibilidade, permissão ou habilidade. Não mudam com a pessoa. Exemplos: <em>can, must, should</em>.</p>
                        </div>
                        <div className="tag-explanation">
                            <span className="verb-tag tag-defective">Defectivo</span>
                            <p>Verbos incompletos que não possuem todas as formas conjugadas (como infinitivo ou particípio). Muitos modais são defectivos.</p>
                        </div>
                        <div className="tag-explanation">
                            <span className="verb-tag tag-phrasal">Phrasal</span>
                            <p>Verbos compostos (verbo + preposição/advérbio) que criam um novo significado. Exemplo: <em>give up</em> (desistir).</p>
                        </div>
                    </section>

                    <section className="guide-section">
                        <h3>Tempos Verbais</h3>
                        <div className="tense-list">
                            {Object.entries(tenseConfig).map(([key, group]: [string, any]) => (
                                <div key={key} className="tense-group-container">
                                    <h3 className="flex items-center gap-2 mt-4 mb-2 text-sm font-semibold text-gray-400">
                                        <Circle size={12} strokeWidth={3} />
                                        {group.title}
                                    </h3>
                                    {Object.entries(group.tenses).map(([tenseKey, tense]: [string, any]) => (
                                        <div key={tenseKey} className="tense-item mb-3 bg-[#1a1a25] p-3 rounded-lg">
                                            <div className="tense-name text-white font-medium mb-1">{tense.name}</div>
                                            <div className="tense-desc text-sm text-gray-400">{tense.desc}</div>
                                        </div>
                                    ))}
                                </div>
                            ))}
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
}
