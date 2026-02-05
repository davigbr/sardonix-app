"use client";

// Singleton for managing favorites in localStorage
// Replicates functionality of legacy favorites.js

export class FavoritesManager {
    private static instance: FavoritesManager;
    private favorites: Set<string>;
    private listeners: Set<() => void>;

    private constructor() {
        this.favorites = new Set();
        this.listeners = new Set();
        if (typeof window !== 'undefined') {
            this.load();
        }
    }

    public static getInstance(): FavoritesManager {
        if (!FavoritesManager.instance) {
            FavoritesManager.instance = new FavoritesManager();
        }
        return FavoritesManager.instance;
    }

    private load() {
        try {
            const saved = localStorage.getItem('sardonix_favorites');
            if (saved) {
                const list = JSON.parse(saved);
                if (Array.isArray(list)) {
                    this.favorites = new Set(list);
                }
            }
        } catch (e) {
            console.error('Failed to load favorites', e);
        }
    }

    private save() {
        try {
            localStorage.setItem('sardonix_favorites', JSON.stringify(Array.from(this.favorites)));
            this.notify();
        } catch (e) {
            console.error('Failed to save favorites', e);
        }
    }

    public add(verb: string) {
        this.favorites.add(verb);
        this.save();
    }

    public remove(verb: string) {
        this.favorites.delete(verb);
        this.save();
    }

    public toggle(verb: string) {
        if (this.favorites.has(verb)) {
            this.remove(verb);
        } else {
            this.add(verb);
        }
    }

    public isFavorite(verb: string): boolean {
        return this.favorites.has(verb);
    }

    public getFavorites(): string[] {
        return Array.from(this.favorites);
    }

    public subscribe(listener: () => void) {
        this.listeners.add(listener);
        return () => { this.listeners.delete(listener); };
    }

    private notify() {
        this.listeners.forEach(listener => listener());
    }
}

export const favoritesManager = FavoritesManager.getInstance();
