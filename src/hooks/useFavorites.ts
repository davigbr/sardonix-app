"use client";

import { useState, useEffect } from "react";
import { favoritesManager } from "@/utils/favorites";

export function useFavorites() {
    const [favorites, setFavorites] = useState<string[]>([]);
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        // Initial load
        setFavorites(favoritesManager.getFavorites());
        setIsLoaded(true);

        // Subscribe to changes
        const unsubscribe = favoritesManager.subscribe(() => {
            setFavorites(favoritesManager.getFavorites());
        });

        return () => { unsubscribe(); };
    }, []);

    const toggleFavorite = (verb: string) => {
        favoritesManager.toggle(verb);
    };

    const isFavorite = (verb: string) => {
        return favorites.includes(verb);
    };

    return { favorites, toggleFavorite, isFavorite, isLoaded };
}
