const Favorites = {
    storageKey: 'sardonix_favorites',
    items: new Set(),

    init() {
        try {
            const stored = localStorage.getItem(this.storageKey);
            if (stored) {
                this.items = new Set(JSON.parse(stored));
            }
        } catch (e) {
            console.warn('Failed to load favorites:', e);
            this.items = new Set();
        }
    },

    save() {
        try {
            localStorage.setItem(this.storageKey, JSON.stringify([...this.items]));
        } catch (e) {
            console.warn('Failed to save favorites:', e);
        }
    },

    toggle(verb) {
        if (this.items.has(verb)) {
            this.items.delete(verb);
            this.save();
            return false; // Removed
        } else {
            this.items.add(verb);
            this.save();
            return true; // Added
        }
    },

    isFavorite(verb) {
        return this.items.has(verb);
    },

    getFavorites() {
        return [...this.items];
    },

    count() {
        return this.items.size;
    }
};

window.Favorites = Favorites;
