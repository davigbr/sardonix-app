"use client";

import { Heart } from "lucide-react";
import clsx from "clsx";

export type FilterType = 'all' | 'regular' | 'irregular' | 'modal';

interface FilterBarProps {
    currentType: FilterType;
    showPhrasal: boolean;
    showFavorites: boolean;
    onTypeChange: (type: FilterType) => void;
    onPhrasalChange: () => void;
    onFavoritesChange: () => void;
}

export default function FilterBar({
    currentType,
    showPhrasal,
    showFavorites,
    onTypeChange,
    onPhrasalChange,
    onFavoritesChange,
}: FilterBarProps) {
    return (
        <div className="filter-bar">
            <div className="filter-group" id="typeFilters">
                <button
                    className={clsx("filter-chip", { active: currentType === "all" })}
                    onClick={() => onTypeChange("all")}
                >
                    Todos
                </button>
                <button
                    className={clsx("filter-chip", { active: currentType === "irregular" })}
                    onClick={() => onTypeChange("irregular")}
                >
                    Irregulares
                </button>
                <button
                    className={clsx("filter-chip", { active: currentType === "regular" })}
                    onClick={() => onTypeChange("regular")}
                >
                    Regulares
                </button>
                <button // Added Modal filter as per previous feature request in vanilla
                    className={clsx("filter-chip", { active: currentType === "modal" })}
                    onClick={() => onTypeChange("modal")}
                >
                    Modais
                </button>
            </div>

            <div className="filter-divider"></div>

            <button
                id="phrasalFilterBtn"
                className={clsx("filter-toggle", { active: showPhrasal })}
                onClick={onPhrasalChange}
            >
                Phrasal Verbs
            </button>

            <div className="filter-divider"></div>

            <button
                className={clsx("favorite-filter-btn", { active: showFavorites })}
                onClick={onFavoritesChange}
            >
                <Heart size={16} fill={showFavorites ? "currentColor" : "none"} />
                <span>Favoritos</span>
            </button>
        </div>
    );
}
