"use client";

import { VerbData } from "@/lib/types";
import { Heart, Volume2 } from "lucide-react";
import clsx from "clsx";
import { useState } from "react";

interface VerbCardProps {
    verb: VerbData;
    isFavorite?: boolean;
    onToggleFavorite?: (verb: string) => void;
    onSpeak?: (text: string) => void;
    onClick?: (verb: string) => void;
}

export default function VerbCard({
    verb,
    isFavorite = false,
    onToggleFavorite,
    onSpeak,
    onClick,
}: VerbCardProps) {
    const [isHovered, setIsHovered] = useState(false);

    const handleSpeak = (e: React.MouseEvent) => {
        e.stopPropagation();
        onSpeak?.(verb.infinitive);
    };

    const handleFavorite = (e: React.MouseEvent) => {
        e.stopPropagation();
        onToggleFavorite?.(verb.infinitive);
    };

    return (
        <article
            className="verb-card"
            onClick={() => onClick?.(verb.infinitive)}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <button
                className={clsx("verb-favorite-btn", { active: isFavorite })}
                onClick={handleFavorite}
                aria-label="Favoritar"
            >
                <Heart
                    size={18}
                    fill={isFavorite ? "currentColor" : "none"}
                    className="transition-transform duration-200"
                />
            </button>

            <div className="verb-tags-mini">
                {verb.tags.includes("irregular") && (
                    <span className="tag-mini tag-irregular" title="Irregular"></span>
                )}
                {verb.tags.includes("phrasal") && (
                    <span className="tag-mini tag-phrasal" title="Phrasal verb"></span>
                )}
            </div>

            <div className="verb-card-content">
                <h3 className="verb-infinitive flex items-center gap-2">
                    {verb.infinitive}
                    {verb.uk && (
                        <span className="verb-uk" title={`UK Spelling: ${verb.uk}`}>
                            🇬🇧 {verb.uk}
                        </span>
                    )}
                </h3>
                <p className="verb-translation">{verb.translation}</p>
                <div className="verb-preview">
                    <span className="verb-form-mini">{verb.forms.pastSimple}</span>
                    <span className="verb-form-mini">{verb.forms.pastParticiple}</span>
                </div>
            </div>

            <button
                className={clsx("verb-speak-btn", { "opacity-100": isHovered })}
                onClick={handleSpeak}
                aria-label="Pronunciar"
            >
                <Volume2 size={16} />
            </button>
        </article>
    );
}
