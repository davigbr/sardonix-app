"use client";

import { VerbData } from "@/lib/types";
import { generateTenses, tenseConfig } from "@/lib/conjugator";
import { TTS } from "@/utils/tts";
import { X, Volume2, ChevronDown, ChevronRight, Info } from "lucide-react";
import { useEffect, useState, useMemo } from "react";
import clsx from "clsx";

interface VerbModalProps {
    verb: VerbData | null;
    onClose: () => void;
    onSelectRelated?: (verb: string) => void;
    onSpeak?: (text: string) => void;
}

export default function VerbModal({ verb, onClose, onSelectRelated, onSpeak }: VerbModalProps) {
    const [showFullConjugation, setShowFullConjugation] = useState(false);
    const [showPhrasal, setShowPhrasal] = useState(false);

    // Reset state when verb changes
    useEffect(() => {
        setShowFullConjugation(false);
        setShowPhrasal(false);
    }, [verb]);

    // Lock body scroll
    useEffect(() => {
        if (verb) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "";
        }
        return () => {
            document.body.style.overflow = "";
        };
    }, [verb]);

    // Handle ESC key
    useEffect(() => {
        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose();
        };
        window.addEventListener("keydown", handleEsc);
        return () => window.removeEventListener("keydown", handleEsc);
    }, [onClose]);

    if (!verb) return null;

    const tenses = useMemo(() => generateTenses(verb), [verb]);

    const handleSpeak = (text: string) => {
        TTS.speak(text);
    };

    const tagConfig: Record<string, { label: string; title: string }> = {
        regular: { label: "Regular", title: "Verbo que segue o padrão -ed no passado" },
        irregular: { label: "Irregular", title: "Verbo com formas próprias de passado" },
        modal: { label: "Modal", title: "Verbo auxiliar que expressa necessidade, possibilidade, etc." },
        defective: { label: "Defectivo", title: "Verbo que não possui todas as formas conjugadas" },
        phrasal: { label: "Phrasal", title: "Verbo composto com preposição que altera seu sentido" },
    };

    return (
        <div className="modal-overlay active" onClick={(e) => e.target === e.currentTarget && onClose()}>
            <div className="modal">
                <button className="modal-close" onClick={onClose} aria-label="Fechar">
                    <X size={24} />
                </button>

                <header className="modal-header">
                    <div className="modal-title-container">
                        <div className="verb-title-group">
                            <h2 className="modal-title">
                                {verb.infinitive}
                            </h2>
                            <span className="modal-translation">{verb.translation}</span>
                            {verb.uk && (
                                <span className="text-sm text-gray-400 font-normal ml-2" title={`UK Spelling: ${verb.uk}`}>
                                    🇬🇧 {verb.uk}
                                </span>
                            )}
                        </div>
                    </div>
                    <div className="verb-tags">
                        {verb.tags.map((tag) => {
                            const config = tagConfig[tag] || { label: tag, title: "" };
                            return (
                                <span key={tag} className={`verb-tag tag-${tag}`} title={config.title}>
                                    {config.label}
                                </span>
                            );
                        })}
                        {/* Show Phrasal tag if it has phrasal verbs logic */}
                        {verb.phrasal && verb.phrasal.length > 0 && !verb.tags.includes('phrasal') && (
                            <span className="verb-tag tag-phrasal" title={tagConfig.phrasal.title}>
                                {tagConfig.phrasal.label}
                            </span>
                        )}
                    </div>
                </header>

                <section className="principal-parts" id="principalParts">
                    <div className="principal-part">
                        <span className="part-label">Base Form</span>
                        <button className="part-value speakable" onClick={() => handleSpeak(verb.forms.base)}>
                            {verb.forms.base || "N/A"}
                        </button>
                    </div>
                    <div className="principal-part">
                        <span className="part-label">Past Simple</span>
                        <button className="part-value speakable" onClick={() => handleSpeak(verb.forms.pastSimple)}>
                            {verb.forms.pastSimple || "N/A"}
                        </button>
                    </div>
                    <div className="principal-part">
                        <span className="part-label">Past Participle</span>
                        <button className="part-value speakable" onClick={() => handleSpeak(verb.forms.pastParticiple)}>
                            {verb.forms.pastParticiple || "N/A"}
                        </button>
                    </div>
                </section>

                <div className="explanation-section">
                    <p className="verb-explanation">{verb.explanation}</p>
                </div>

                <div className="examples-section">
                    <h4 className="section-subtitle">Exemplos</h4>
                    <ul className="examples-list">
                        {verb.examples && verb.examples.length > 0 ? (
                            verb.examples.map((ex, i) => (
                                <li key={i} className="example-item">
                                    <button className="example-en speakable" onClick={() => handleSpeak(ex.en)}>
                                        {ex.en}
                                    </button>
                                    <span className="example-pt">{ex.pt}</span>
                                </li>
                            ))
                        ) : (
                            <li className="no-examples">Nenhum exemplo disponível</li>
                        )}
                    </ul>
                </div>

                {/* Phrasal Verbs Section */}
                {verb.phrasal && verb.phrasal.length > 0 && (
                    <div className="phrasal-section">
                        <button
                            className={clsx("section-toggle", { active: showPhrasal })}
                            onClick={() => setShowPhrasal(!showPhrasal)}
                        >
                            <span>Ver {verb.phrasal.length} Phrasal Verbs</span>
                            <div className="toggle-icon">
                                <ChevronDown size={20} />
                            </div>
                        </button>
                        <div className={clsx("phrasal-list-container", { active: showPhrasal })}>
                            {verb.phrasal.map((p, i) => (
                                <div key={i} className="phrasal-item">
                                    <div className="phrasal-header">
                                        <span className="phrasal-verb-name">{p.verb}</span>
                                    </div>
                                    <p className="phrasal-definition">{p.definition}</p>
                                    <div className="phrasal-example">
                                        <button className="phrasal-example-en speakable" onClick={() => handleSpeak(p.example.en)}>
                                            "{p.example.en}"
                                        </button>
                                        <div className="phrasal-example-pt">{p.example.pt}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Full Conjugation Section */}
                <div className="conjugation-section">
                    <button
                        className={clsx("section-toggle", { active: showFullConjugation })}
                        onClick={() => setShowFullConjugation(!showFullConjugation)}
                    >
                        <span>Ver Conjugação Completa</span>
                        <div className="toggle-icon">
                            <ChevronDown size={20} />
                        </div>
                    </button>

                    <div className={clsx("full-conjugation", { active: showFullConjugation })}>
                        <div className="conjugation-groups">
                            {Object.entries(tenseConfig).map(([groupKey, groupConfig]) => {
                                // Check if any tense in this group handles data
                                const hasData = Object.keys(groupConfig.tenses).some(k => tenses[k]);
                                if (!hasData) return null;

                                return (
                                    <div key={groupKey} className="conjugation-group">
                                        <h3 className="tense-group-header">{groupConfig.title}</h3>
                                        <div className="conjugation-table-wrapper">
                                            <table className="conjugation-table">
                                                <thead>
                                                    <tr>
                                                        <th>Tense</th>
                                                        <th>I</th>
                                                        <th>You</th>
                                                        <th>He/She/It</th>
                                                        <th>We</th>
                                                        <th>They</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {Object.entries(groupConfig.tenses).map(([tenseKey, tenseInfo]) => {
                                                        const forms: any = tenses[tenseKey];
                                                        if (!forms) return null;

                                                        return (
                                                            <tr key={tenseKey}>
                                                                <td>
                                                                    <div className="tense-name-container flex items-center gap-2">
                                                                        <strong>{tenseInfo.name}</strong>
                                                                        {tenseInfo.desc && (
                                                                            <div className="tooltip-icon" title={tenseInfo.desc}>
                                                                                <Info size={14} className="text-gray-500 hover:text-gray-300 transition-colors" />
                                                                            </div>
                                                                        )}
                                                                    </div>
                                                                </td>
                                                                {['I', 'you', 'he/she/it', 'we', 'they'].map(pronoun => {
                                                                    const val = forms[pronoun] || '-';
                                                                    // TTS Logic for pronoun
                                                                    let speakText = `${pronoun} ${val}`;
                                                                    if (pronoun === 'he/she/it') {
                                                                        const isWeather = verb.tags.includes('weather') || ['rain', 'snow', 'hail', 'freeze'].includes(verb.infinitive);
                                                                        const person = isWeather ? 'it' : 'he';
                                                                        speakText = `${person} ${val}`;
                                                                    }

                                                                    return (
                                                                        <td key={pronoun}>
                                                                            <button className="speakable" onClick={() => handleSpeak(speakText)}>
                                                                                {val}
                                                                            </button>
                                                                        </td>
                                                                    )
                                                                })}
                                                            </tr>
                                                        )
                                                    })}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                </div>

                {/* Related Verbs */}
                <div className="related-section">
                    <h4 className="related-title">Verbos Relacionados</h4>
                    <div className="related-verbs">
                        {(!verb.related || verb.related.length === 0) ? (
                            <span className="no-related">Nenhum verbo relacionado</span>
                        ) : (
                            verb.related.map(r => (
                                <button
                                    key={r}
                                    className="related-verb"
                                    onClick={() => onSelectRelated && onSelectRelated(r)}
                                >
                                    {r}
                                </button>
                            ))
                        )}
                    </div>
                </div>

            </div>
        </div>
    );
}
