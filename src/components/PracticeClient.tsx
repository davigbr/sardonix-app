"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { ArrowLeft, Check, X, RefreshCw, Trophy, Volume2, RotateCcw } from "lucide-react";
import { VerbData } from "@/lib/types";
import { useFavorites } from "@/hooks/useFavorites";
import { TTS } from "@/utils/tts";
import clsx from "clsx";
import styles from "./PracticeClient.module.css";

interface PracticeClientProps {
    allVerbs: VerbData[];
}

interface QuizState {
    mode: 'playing' | 'summary';
    currentVerb: VerbData | null;
    inputSimple: string;
    inputParticiple: string;
    isChecked: boolean;
    isCorrect: boolean;

    // Session Stats
    roundSize: number;
    currentIndex: number;
    roundHistory: { verb: string, correct: boolean }[];

    // Global Stats (optional to keep)
    streak: number;

    source: 'favorites' | 'all';
}

const ROUND_SIZE = 10;

export default function PracticeClient({ allVerbs }: PracticeClientProps) {
    const router = useRouter();
    const { favorites, isLoaded } = useFavorites();
    const [state, setState] = useState<QuizState>({
        mode: 'playing',
        currentVerb: null,
        inputSimple: "",
        inputParticiple: "",
        isChecked: false,
        isCorrect: false,
        roundSize: ROUND_SIZE,
        currentIndex: 0,
        roundHistory: [],
        streak: 0,
        source: 'all'
    });

    // Refs for focusing inputs
    const simpleInputRef = useRef<HTMLInputElement>(null);
    const nextButtonRef = useRef<HTMLButtonElement>(null);

    // Initial load
    useEffect(() => {
        if (isLoaded && !state.currentVerb) {
            initGame();
        }
    }, [isLoaded]);

    const initGame = () => {
        // Determine source
        const useFavorites = favorites.length >= 10;
        const source = useFavorites ? 'favorites' : 'all';

        pickNextVerb(source, 0, [], 0);
    };

    const pickNextVerb = (source: 'favorites' | 'all', index: number, history: any[], currentStreak: number) => {
        let pool = allVerbs;
        if (source === 'favorites') {
            pool = allVerbs.filter(v => favorites.includes(v.infinitive));
        }

        // Avoid repeating verbs in the immediate same round if possible?
        // For simplicity, random pick for now.
        const randomVerb = pool[Math.floor(Math.random() * pool.length)];

        setState({
            mode: 'playing',
            currentVerb: randomVerb,
            inputSimple: "",
            inputParticiple: "",
            isChecked: false,
            isCorrect: false,
            roundSize: ROUND_SIZE,
            currentIndex: index,
            roundHistory: history,
            streak: currentStreak,
            source
        });

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

        const validSimples = targetSimple.split('/').map(s => s.trim());
        const validParticiples = targetParticiple.split('/').map(s => s.trim());

        const isSimpleCorrect = validSimples.includes(userSimple);
        const isParticipleCorrect = validParticiples.includes(userParticiple);
        const isAllCorrect = isSimpleCorrect && isParticipleCorrect;

        setState(prev => ({
            ...prev,
            isChecked: true,
            isCorrect: isAllCorrect,
            streak: isAllCorrect ? prev.streak + 1 : 0
        }));

        if (isAllCorrect) {
            setTimeout(() => nextButtonRef.current?.focus(), 100);
        }
    };

    const handleNext = () => {
        const newHistory = [
            ...state.roundHistory,
            { verb: state.currentVerb!.infinitive, correct: state.isCorrect }
        ];

        if (state.currentIndex + 1 >= state.roundSize) {
            // End of round
            setState(prev => ({
                ...prev,
                mode: 'summary',
                roundHistory: newHistory
            }));
        } else {
            // Next question
            pickNextVerb(state.source, state.currentIndex + 1, newHistory, state.streak);
        }
    };

    const handleRestart = () => {
        initGame();
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            if (state.isChecked) {
                if (state.mode === 'playing') handleNext();
            } else {
                checkAnswer();
            }
        }
    };

    const getScore = () => state.roundHistory.filter(h => h.correct).length;

    // Helper for input styles
    const getInputClass = (isFieldCorrect: boolean) => {
        if (!state.isChecked) return "";
        // If checked:
        // - if field correct -> green
        // - if field wrong -> red
        return isFieldCorrect ? styles.inputCorrect : styles.inputWrong;
    };

    // Check individual field correctness
    const isSimpleCorrect = state.currentVerb ? state.currentVerb.forms.pastSimple.split('/').map(s => s.trim()).includes(normalize(state.inputSimple)) : false;
    const isParticipleCorrect = state.currentVerb ? state.currentVerb.forms.pastParticiple.split('/').map(s => s.trim()).includes(normalize(state.inputParticiple)) : false;


    if (!isLoaded || !state.currentVerb) {
        return <div className="p-8 text-center">Carregando quiz...</div>;
    }

    return (
        <div className={styles.container}>

            {/* Header */}
            <div className={styles.header}>
                <button
                    onClick={() => router.push('/')}
                    className={styles.backButton}
                >
                    <ArrowLeft size={24} />
                </button>

                {state.mode === 'playing' && (
                    <div className={styles.streakContainer}>
                        <div className={styles.streak}>
                            <Trophy size={20} />
                            <span>{state.streak}</span>
                        </div>
                    </div>
                )}
            </div>

            {/* Progress Bar */}
            {state.mode === 'playing' && (
                <div className={styles.progressContainer}>
                    <div
                        className={styles.progressBar}
                        style={{ width: `${((state.currentIndex) / state.roundSize) * 100}%` }}
                    />
                </div>
            )}

            {/* Main Card */}
            <div className={styles.card}>

                {state.mode === 'summary' ? (
                    <div className={styles.summaryContainer}>
                        <h2 className={styles.summaryTitle}>Rodada Completa!</h2>
                        <div className={styles.summaryScore}>
                            {getScore()} / {state.roundSize}
                        </div>
                        <p className={styles.summaryText}>verbos dominados</p>

                        <div className={styles.summaryStats}>
                            <div className={styles.statBox}>
                                <span className={styles.statValue} style={{ color: 'var(--success)' }}>{getScore()}</span>
                                <span className={styles.statLabel}>Acertos</span>
                            </div>
                            <div className={styles.statBox}>
                                <span className={styles.statValue} style={{ color: 'var(--error)' }}>{state.roundSize - getScore()}</span>
                                <span className={styles.statLabel}>Erros</span>
                            </div>
                        </div>

                        <button onClick={handleRestart} className={styles.restartButton}>
                            <RotateCcw size={20} />
                            Nova Rodada
                        </button>
                    </div>
                ) : (
                    <>
                        {/* Source Indicator */}
                        <div className={styles.sourceIndicator}>
                            <span className={clsx(
                                styles.badge,
                                state.source === 'favorites' ? styles.badgeFavorites : styles.badgeAll
                            )}>
                                {state.source === 'favorites' ? 'Praticando Favoritos' : 'Modo Todos os Verbos'}
                            </span>
                            <p className={styles.subText}>
                                Pergunta {state.currentIndex + 1} de {state.roundSize}
                            </p>
                            {state.source === 'all' && favorites.length < 10 && (
                                <p className={styles.subText} style={{ marginTop: '0.5rem', opacity: 0.8 }}>
                                    Adicione {10 - favorites.length} favoritos para desbloquear o treino focado.
                                </p>
                            )}
                        </div>

                        {/* Verb Display */}
                        <div className={styles.verbDisplay}>
                            <h1 className={styles.infinitive}>{state.currentVerb.infinitive}</h1>
                            <p className={styles.translation}>{state.currentVerb.translation}</p>
                        </div>

                        {/* Inputs */}
                        <div className={styles.inputsGrid}>
                            <div className={styles.inputGroup}>
                                <label className={styles.label}>Passado Simples</label>
                                <input
                                    ref={simpleInputRef}
                                    type="text"
                                    value={state.inputSimple}
                                    onChange={(e) => setState(prev => ({ ...prev, inputSimple: e.target.value }))}
                                    onKeyDown={handleKeyDown}
                                    disabled={state.isChecked && state.isCorrect}
                                    className={clsx(
                                        styles.input,
                                        getInputClass(isSimpleCorrect)
                                    )}
                                    placeholder="ex: went"
                                    autoComplete="off"
                                    autoCorrect="off"
                                    autoCapitalize="none"
                                />
                                {state.isChecked && (
                                    <div className={styles.answerReveal}>
                                        Resposta: <span>{state.currentVerb.forms.pastSimple}</span>
                                    </div>
                                )}
                            </div>

                            <div className={styles.inputGroup}>
                                <label className={styles.label}>Particípio Passado</label>
                                <input
                                    type="text"
                                    value={state.inputParticiple}
                                    onChange={(e) => setState(prev => ({ ...prev, inputParticiple: e.target.value }))}
                                    onKeyDown={handleKeyDown}
                                    disabled={state.isChecked && state.isCorrect}
                                    className={clsx(
                                        styles.input,
                                        getInputClass(isParticipleCorrect)
                                    )}
                                    placeholder="ex: gone"
                                    autoComplete="off"
                                    autoCorrect="off"
                                    autoCapitalize="none"
                                />
                                {state.isChecked && (
                                    <div className={styles.answerReveal}>
                                        Resposta: <span>{state.currentVerb.forms.pastParticiple}</span>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Actions */}
                        <div className={styles.actions}>
                            {!state.isChecked ? (
                                <button
                                    onClick={checkAnswer}
                                    className={styles.checkButton}
                                >
                                    Verificar
                                </button>
                            ) : (
                                <button
                                    ref={nextButtonRef}
                                    onClick={handleNext}
                                    className={clsx(
                                        styles.nextButton,
                                        state.isCorrect ? styles.nextButtonCorrect : styles.nextButtonDefault
                                    )}
                                >
                                    {state.currentIndex + 1 >= state.roundSize ? "Finalizar" : "Próximo"}
                                    {state.currentIndex + 1 >= state.roundSize ? <Trophy size={20} /> : <RefreshCw size={20} />}
                                </button>
                            )}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
