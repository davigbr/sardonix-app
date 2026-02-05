"use client";

import { useState, useMemo, useEffect, Suspense } from "react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { VerbData } from "@/lib/types";
import SearchBar from "./SearchBar";
import FilterBar, { FilterType } from "./FilterBar";
import VerbGrid from "./VerbGrid";
import VerbModal from "./VerbModal";
import GuideModal from "./GuideModal";
import SettingsModal from "./SettingsModal";
import { Settings, BookOpen } from "lucide-react";
import { TTS } from "@/utils/tts";
import { useFavorites } from "@/hooks/useFavorites";

interface HomeClientProps {
    initialVerbs: VerbData[];
}

function HomeContent({ initialVerbs }: HomeClientProps) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [query, setQuery] = useState("");
    const [filterType, setFilterType] = useState<FilterType>("all");
    const [showPhrasal, setShowPhrasal] = useState(false);
    const [showFavorites, setShowFavorites] = useState(false);
    const [selectedVerb, setSelectedVerb] = useState<VerbData | null>(null);
    const [showSettings, setShowSettings] = useState(false);
    const [showGuide, setShowGuide] = useState(false);

    // Hooks
    const { favorites, toggleFavorite, isFavorite } = useFavorites();

    // Sync selected verb with URL
    useEffect(() => {
        const verbParam = searchParams.get('verb');
        if (verbParam) {
            const found = initialVerbs.find(v => v.infinitive.toLowerCase() === verbParam.toLowerCase());
            setSelectedVerb(found || null);
        } else {
            setSelectedVerb(null);
        }
    }, [searchParams, initialVerbs]);

    // Update URL when filters change (Debounce?)
    // For now, let's just keep filters local + localStorage as per original app
    // Original app: localStorage, no URL param for filters.
    // We already have localStorage logic in useEffect below.

    useEffect(() => {
        const saved = localStorage.getItem("sardonix_filters");
        if (saved) {
            try {
                const parsed = JSON.parse(saved);
                if (parsed.type) setFilterType(parsed.type);
                if (parsed.phrasal !== undefined) setShowPhrasal(parsed.phrasal);
                if (parsed.favorites !== undefined) setShowFavorites(parsed.favorites);
            } catch (e) {
                console.error("Failed to load filters", e);
            }
        }
    }, []);

    const saveFilters = (newFilters: { type?: FilterType; phrasal?: boolean; favorites?: boolean }) => {
        const current = {
            type: filterType,
            phrasal: showPhrasal,
            favorites: showFavorites,
            ...newFilters
        };
        localStorage.setItem("sardonix_filters", JSON.stringify(current));
    };

    const filteredVerbs = useMemo(() => {
        return initialVerbs.filter((verb) => {
            // 1. Search Query
            if (query) {
                const q = query.toLowerCase();
                const matches =
                    verb.infinitive.toLowerCase().includes(q) ||
                    verb.translation.toLowerCase().includes(q) ||
                    verb.forms.pastSimple.toLowerCase().includes(q) ||
                    verb.forms.pastParticiple.toLowerCase().includes(q);
                if (!matches) return false;
            }

            // 2. Type Filter
            const isModal = verb.tags.includes("modal");
            const isIrregular = verb.tags.includes("irregular") || verb.tags.includes("defective") || isModal;

            if (filterType === "modal" && !isModal) return false;
            if (filterType === "regular" && isIrregular) return false;
            if (filterType === "irregular" && !isIrregular) return false;

            // 3. Phrasal Filter
            if (showPhrasal && !verb.tags.includes("phrasal")) return false;

            // 4. Favorites Filter
            if (showFavorites && !favorites.includes(verb.infinitive)) return false;

            return true;
        });
    }, [initialVerbs, query, filterType, showPhrasal, showFavorites, favorites]);

    const handleVerbClick = (verb: string) => {
        router.push(`/?verb=${encodeURIComponent(verb)}`, { scroll: false });
    };

    const handleCloseModal = () => {
        router.push('/', { scroll: false });
    };

    const handleSpeak = (text: string) => {
        TTS.speak(text);
    };

    return (
        <>
            <header className="header">
                <div className="header-content">
                    <div className="logo">
                        <Image
                            src={process.env.NODE_ENV === 'production' ? '/sardonix-app/assets/icons/owl.png' : '/assets/icons/owl.png'}
                            alt="Sardonix Logo"
                            width={50}
                            height={50}
                            className="logo-icon-img"
                            unoptimized
                        />
                        <div className="logo-text">
                            <h1>English Verbs</h1>
                            <span className="logo-subtitle">por Sardonix Idiomas</span>
                        </div>
                    </div>
                    <div className="header-actions">
                        <button className="settings-btn" onClick={() => setShowGuide(true)} aria-label="Abrir Guia">
                            <BookOpen size={24} />
                        </button>
                        <button className="settings-btn" onClick={() => setShowSettings(true)} aria-label="Configurações">
                            <Settings size={24} />
                        </button>
                    </div>
                </div>
            </header>

            <main className="main">
                <section className="search-section">
                    <SearchBar onSearch={setQuery} />

                    <div className="results-count">
                        {filteredVerbs.length} {filteredVerbs.length === 1 ? 'verbo encontrado' : 'verbos encontrados'}
                    </div>

                    <FilterBar
                        currentType={filterType}
                        showPhrasal={showPhrasal}
                        showFavorites={showFavorites}
                        onTypeChange={(t) => { setFilterType(t); saveFilters({ type: t }); }}
                        onPhrasalChange={() => { setShowPhrasal(p => { saveFilters({ phrasal: !p }); return !p; }); }}
                        onFavoritesChange={() => { setShowFavorites(f => { saveFilters({ favorites: !f }); return !f; }); }}
                    />
                </section>

                <VerbGrid
                    verbs={filteredVerbs}
                    favorites={favorites}
                    onVerbClick={handleVerbClick}
                    onToggleFavorite={toggleFavorite}
                    onSpeak={handleSpeak}
                />

                {selectedVerb && (
                    <VerbModal
                        verb={selectedVerb}
                        onClose={handleCloseModal}
                        onSelectRelated={handleVerbClick}
                        onSpeak={handleSpeak}
                    />
                )}

                {showSettings && (
                    <SettingsModal onClose={() => setShowSettings(false)} />
                )}

                {showGuide && (
                    <GuideModal onClose={() => setShowGuide(false)} />
                )}
            </main>
        </>
    );
}

// Wrapper for Suspense
export default function HomeClient(props: HomeClientProps) {
    return (
        <Suspense fallback={<div className="loading-spinner">Carregando...</div>}>
            <HomeContent {...props} />
        </Suspense>
    )
}
