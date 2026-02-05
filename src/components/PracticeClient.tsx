"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { ArrowLeft, Check, X, RefreshCw, Trophy, Volume2 } from "lucide-react";
import { VerbData } from "@/lib/types";
import { useFavorites } from "@/hooks/useFavorites";
import { TTS } from "@/utils/tts";
import clsx from "clsx";

interface PracticeClientProps {
    allVerbs: VerbData[];
}

interface QuizState {
    currentVerb: VerbData | null;
    inputSimple: string;
    inputParticiple: string;
    isChecked: boolean;
    isCorrect: boolean;
    streak: number;
    score: number;
    total: number;
    source: 'favorites' | 'all';
}

export default function PracticeClient({ allVerbs }: PracticeClientProps) {
    const router = useRouter();
    const { favorites, isLoaded } = useFavorites();
    const [state, setState] = useState<QuizState>({
        currentVerb: null,
        inputSimple: "",
        inputParticiple: "",
        isChecked: false,
        isCorrect: false,
        streak: 0,
        score: 0,
        total: 0,
        source: 'all'
    });

    // Refs for focusing inputs
    const simpleInputRef = useRef<HTMLInputElement>(null);
    const nextButtonRef = useRef<HTMLButtonElement>(null);

    // Initial load
    useEffect(() => {
        if (isLoaded && !state.currentVerb) {
            startNewRound();
        }
    }, [isLoaded]);

    const startNewRound = () => {
        // Determine source
        const useFavorites = favorites.length >= 10;
        const source = useFavorites ? 'favorites' : 'all';

        let pool = allVerbs;
        if (useFavorites) {
            pool = allVerbs.filter(v => favorites.includes(v.infinitive));
        }

        // Random selection
        const randomVerb = pool[Math.floor(Math.random() * pool.length)];

        setState(prev => ({
            ...prev,
            currentVerb: randomVerb,
            inputSimple: "",
            inputParticiple: "",
            isChecked: false,
            isCorrect: false,
            source
        }));

        // Focus first input
        setTimeout(() => {
            simpleInputRef.current?.focus();
        }, 100);
    };

    const normalize = (s: string) => s.trim().toLowerCase();

    const checkAnswer = () => {
        if (!state.currentVerb) return;

        const targetSimple = normalize(state.currentVerb.forms.pastSimple);
        const targetParticiple = normalize(state.currentVerb.forms.pastParticiple);

        const userSimple = normalize(state.inputSimple);
        const userParticiple = normalize(state.inputParticiple);

        // Simple validation: check if user input matches target
        // NOTE: This handles simple cases. Some verbs have variants (slash separated).
        // For MVP we match exact string or assume user types one of them? 
        // Let's split by "/" for variants support.
        const validSimples = targetSimple.split('/').map(s => s.trim());
        const validParticiples = targetParticiple.split('/').map(s => s.trim());

        const isSimpleCorrect = validSimples.includes(userSimple);
        const isParticipleCorrect = validParticiples.includes(userParticiple);
        const isAllCorrect = isSimpleCorrect && isParticipleCorrect;

        setState(prev => ({
            ...prev,
            isChecked: true,
            isCorrect: isAllCorrect,
            streak: isAllCorrect ? prev.streak + 1 : 0,
            score: isAllCorrect ? prev.score + 1 : prev.score,
            total: prev.total + 1
        }));

        if (isAllCorrect) {
            // Play sound/TTS?
            // TTS.speak("Correct!"); 
            // Maybe just focus the next button
            setTimeout(() => nextButtonRef.current?.focus(), 100);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            if (state.isChecked) {
                // If already checked, go to next
                startNewRound();
            } else {
                // Otherwise check
                checkAnswer();
            }
        }
    };

    if (!isLoaded || !state.currentVerb) {
        return <div className="p-8 text-center">Loading quiz...</div>;
    }

    return (
        <div className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)] flex flex-col items-center p-4">

            {/* Header */}
            <div className="w-full max-w-2xl flex justify-between items-center mb-8 mt-4">
                <button
                    onClick={() => router.push('/')}
                    className="p-2 rounded-full hover:bg-[var(--bg-elevated)] transition-colors text-[var(--text-secondary)]"
                >
                    <ArrowLeft size={24} />
                </button>

                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2 text-[var(--accent-primary)]">
                        <Trophy size={20} />
                        <span className="font-bold text-lg">{state.streak}</span>
                    </div>
                </div>
            </div>

            {/* Quiz Card */}
            <div className="w-full max-w-2xl bg-[var(--bg-secondary)] rounded-2xl border border-[var(--border-default)] p-8 shadow-xl">

                {/* Source Indicator */}
                <div className="mb-6 text-center">
                    <span className={clsx(
                        "text-xs uppercase tracking-wider font-semibold px-3 py-1 rounded-full",
                        state.source === 'favorites'
                            ? "bg-[var(--accent-glow)] text-[var(--accent-secondary)]"
                            : "bg-[var(--bg-tertiary)] text-[var(--text-muted)]"
                    )}>
                        {state.source === 'favorites' ? 'Practicing Favorites' : 'All Verbs Mode'}
                    </span>
                    {state.source === 'all' && favorites.length < 10 && (
                        <p className="text-xs text-[var(--text-muted)] mt-2">
                            Add {10 - favorites.length} more favorites to unlock focused practice.
                        </p>
                    )}
                </div>

                {/* Verb Display */}
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold mb-2 capitalize">{state.currentVerb.infinitive}</h1>
                    <p className="text-xl text-[var(--text-secondary)]">{state.currentVerb.translation}</p>
                </div>

                {/* Inputs */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-medium text-[var(--text-secondary)]">Past Simple</label>
                        <input
                            ref={simpleInputRef}
                            type="text"
                            value={state.inputSimple}
                            onChange={(e) => setState(prev => ({ ...prev, inputSimple: e.target.value }))}
                            onKeyDown={handleKeyDown}
                            disabled={state.isChecked && state.isCorrect}
                            className={clsx(
                                "w-full bg-[var(--bg-tertiary)] border rounded-lg px-4 py-3 outline-none transition-all text-lg",
                                // Validation styles
                                !state.isChecked && "border-[var(--border-default)] focus:border-[var(--accent-primary)]",
                                state.isChecked && state.currentVerb.forms.pastSimple.includes(state.inputSimple) // Simple check for style
                                    ? "border-[var(--success)] text-[var(--success)] bg-[#22c55e10]"
                                    : state.isChecked ? "border-[var(--error)]" : ""
                            )}
                            placeholder="e.g. went"
                            autoComplete="off"
                            autoCorrect="off"
                            autoCapitalize="none"
                        />
                        {state.isChecked && (
                            <div className="text-sm min-h-[20px] text-[var(--text-muted)]">
                                Answer: <span className="text-[var(--text-primary)]">{state.currentVerb.forms.pastSimple}</span>
                            </div>
                        )}
                    </div>

                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-medium text-[var(--text-secondary)]">Past Participle</label>
                        <input
                            type="text"
                            value={state.inputParticiple}
                            onChange={(e) => setState(prev => ({ ...prev, inputParticiple: e.target.value }))}
                            onKeyDown={handleKeyDown}
                            disabled={state.isChecked && state.isCorrect}
                            className={clsx(
                                "w-full bg-[var(--bg-tertiary)] border rounded-lg px-4 py-3 outline-none transition-all text-lg",
                                !state.isChecked && "border-[var(--border-default)] focus:border-[var(--accent-primary)]",
                                state.isChecked && state.currentVerb.forms.pastParticiple.includes(state.inputParticiple)
                                    ? "border-[var(--success)] text-[var(--success)] bg-[#22c55e10]"
                                    : state.isChecked ? "border-[var(--error)]" : ""
                            )}
                            placeholder="e.g. gone"
                            autoComplete="off"
                            autoCorrect="off"
                            autoCapitalize="none"
                        />
                        {state.isChecked && (
                            <div className="text-sm min-h-[20px] text-[var(--text-muted)]">
                                Answer: <span className="text-[var(--text-primary)]">{state.currentVerb.forms.pastParticiple}</span>
                            </div>
                        )}
                    </div>
                </div>

                {/* Actions */}
                <div className="flex justify-end">
                    {!state.isChecked ? (
                        <button
                            onClick={checkAnswer}
                            className="bg-[var(--accent-primary)] hover:bg-[var(--accent-secondary)] text-white font-bold py-3 px-8 rounded-xl transition-all shadow-[0_0_20px_var(--accent-glow)] transform hover:scale-105"
                        >
                            Check Answer
                        </button>
                    ) : (
                        <button
                            ref={nextButtonRef}
                            onClick={startNewRound}
                            className={clsx(
                                "font-bold py-3 px-8 rounded-xl transition-all flex items-center gap-2",
                                state.isCorrect
                                    ? "bg-[var(--success)] text-white shadow-[0_0_20px_rgba(34,197,94,0.4)]"
                                    : "bg-[var(--bg-tertiary)] border border-[var(--border-default)] hover:bg-[var(--bg-elevated)]"
                            )}
                        >
                            {state.isCorrect ? "Correct! Next Verb" : "Next Verb"}
                            <RefreshCw size={20} />
                        </button>
                    )}
                </div>

            </div>
        </div>
    );
}
