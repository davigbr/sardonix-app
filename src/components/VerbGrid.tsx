"use client";

import { VerbData } from "@/lib/types";
import VerbCard from "./VerbCard";

interface VerbGridProps {
    verbs: VerbData[];
    favorites: string[];
    onVerbClick?: (verb: string) => void;
    onToggleFavorite?: (verb: string) => void;
    onSpeak?: (text: string) => void;
}

export default function VerbGrid({
    verbs,
    favorites,
    onVerbClick,
    onToggleFavorite,
    onSpeak
}: VerbGridProps) {
    const handleClick = (verb: string) => {
        onVerbClick?.(verb);
    };

    return (
        <div className="verb-section">
            <div className="verb-grid">
                {verbs.map((verb) => (
                    <VerbCard
                        key={verb.infinitive}
                        verb={verb}
                        isFavorite={favorites.includes(verb.infinitive)}
                        onToggleFavorite={onToggleFavorite}
                        onSpeak={onSpeak}
                        onClick={handleClick}
                    />
                ))}
            </div>

            {verbs.length === 0 && (
                <div className="no-results">
                    <div className="no-results-icon">🔍</div>
                    <h3>Nenhum verbo encontrado</h3>
                    <p>Tente buscar por outra palavra ou forma verbal</p>
                </div>
            )}
        </div>
    );
}
