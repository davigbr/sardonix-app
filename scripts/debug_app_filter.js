const fs = require('fs');
const path = require('path');

const filters = {
    type: 'all', // can be 'all', 'regular', 'irregular'
    phrasal: false,
    favorites: false
};

const Favorites = { isFavorite: () => false };

function applyFilters(verbs) {
    return verbs.filter(verb => {
        // Type Filter
        if (filters.type === 'regular' && verb.tags.includes('irregular')) return false;
        if (filters.type === 'irregular' && !verb.tags.includes('irregular')) return false;

        // Phrasal Filter
        if (filters.phrasal && !verb.tags.includes('phrasal')) return false;

        // Favorites Filter
        if (filters.favorites && !Favorites.isFavorite(verb.infinitive)) return false;

        return true;
    });
}

const mContent = fs.readFileSync(path.join(__dirname, '../data/verbs/m.json'), 'utf8');
const mData = JSON.parse(mContent);
const must = mData['must'];
const verbs = [must];


console.log('Testing "must" visibility:');

filters.type = 'all';
console.log('Filter ALL:', applyFilters(verbs).length > 0 ? 'VISIBLE' : 'HIDDEN');

filters.type = 'regular';
console.log('Filter REGULAR:', applyFilters(verbs).length > 0 ? 'VISIBLE (Incorrect)' : 'HIDDEN');

filters.type = 'irregular';
console.log('Filter IRREGULAR:', applyFilters(verbs).length > 0 ? 'VISIBLE' : 'HIDDEN (Problem)');
