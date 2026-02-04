const fs = require('fs');
const path = require('path');

// Configuration
const CSV_PATH = path.join(__dirname, '../verbs.csv');
const EXISTING_DATA_PATH = path.join(__dirname, '../js/verbData.js');
const OUTPUT_DIR = path.join(__dirname, '../js/verbs');

// Ensure output dir exists
if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

// 1. Read CSV
function parseCSV(text) {
    const lines = text.split(/\r?\n/).filter(l => l.trim());
    const headers = lines[0].split(',').map(h => h.trim());
    const result = [];

    for (let i = 1; i < lines.length; i++) {
        const row = lines[i].match(/(".*?"|[^",\s]+)(?=\s*,|\s*$)/g);
        if (!row) continue;
        const cleanRow = row.map(val => val.replace(/^"|"$/g, '').trim());
        const obj = {};
        headers.forEach((h, index) => {
            obj[h] = cleanRow[index] || '';
        });
        result.push(obj);
    }
    return result;
}

// 2. Read Existing Data (Best Effort)
let existingData = {};
try {
    const content = fs.readFileSync(EXISTING_DATA_PATH, 'utf8');
    // Hacky parse similar to before, but we know it's "const verbDatabase = {...}"
    // or we can use the technique of module.exports
    const tempPath = path.join(__dirname, 'temp_reader.js');
    let moduleContent = content
        .replace(/const\s+verbDatabase\s*=\s*/, 'module.exports = ')
        .replace(/window\.verbDatabase.*/s, '');

    fs.writeFileSync(tempPath, moduleContent);
    existingData = require(tempPath);
    fs.unlinkSync(tempPath);
    console.log(`Loaded ${Object.keys(existingData).length} existing verbs to preserve.`);
} catch (e) {
    console.warn("Could not load existing data, starting fresh from CSV.", e.message);
}

// 3. Process and Merge
const csvData = parseCSV(fs.readFileSync(CSV_PATH, 'utf8'));
console.log(`Loaded ${csvData.length} verbs from CSV.`);

const finalDatabase = {};

// First, populate from CSV
csvData.forEach(row => {
    const key = row.infinitive.toLowerCase(); // Ensure lowercase key
    if (!key) return;

    const isIrregular = row.type1 === 'irregular';
    const tags = [];
    if (isIrregular) tags.push('irregular');
    if (row.type1 === 'regular') tags.push('regular');
    if (row.type2 === 'phrasal') tags.push('phrasal');

    finalDatabase[key] = {
        infinitive: row.infinitive,
        translation: row.portuguese_translation,
        forms: {
            base: row.infinitive,
            pastSimple: row.past,
            pastParticiple: row.past_participle,
            presentParticiple: row.present_participle,
            thirdPerson: row.third
        },
        irregular: isIrregular,
        tags: tags,
        related: [],
        explanation: `Verbo ${row.type1} que significa '${row.portuguese_translation}'.`,
        examples: []
    };
});

// Second, overlay existing data (to keep manual edits like examples, better explanations)
for (const key in existingData) {
    if (finalDatabase[key]) {
        // Merge strategy: keep existing non-empty fields
        const existing = existingData[key];
        const fresh = finalDatabase[key];

        finalDatabase[key] = {
            ...fresh,
            ...existing, // Overwrite with existing
            // Deep merge specific fields if needed
            forms: { ...fresh.forms, ...(existing.forms || {}) },
            tags: [...new Set([...fresh.tags, ...(existing.tags || [])])],
            examples: existing.examples.length > 0 ? existing.examples : fresh.examples
        };
        // Remove tenses if they exist in valid data (we want compact)
        delete finalDatabase[key].tenses;
    } else {
        // Existing verb not in CSV? Keep it.
        finalDatabase[key] = existingData[key];
        delete finalDatabase[key].tenses;
    }
}

// 4. Split by Letter
const grouped = {};
Object.keys(finalDatabase).sort().forEach(key => {
    const letter = key[0].toLowerCase();
    if (!grouped[letter]) grouped[letter] = {};
    grouped[letter][key] = finalDatabase[key];
});

// 5. Write Files
let totalVerbs = 0;
for (const letter in grouped) {
    if (!letter.match(/[a-z]/)) continue; // Skip non-alpha if any

    const verbs = grouped[letter];
    const count = Object.keys(verbs).length;
    totalVerbs += count;

    const fileContent = `
window.verbDatabase = window.verbDatabase || {};
Object.assign(window.verbDatabase, ${JSON.stringify(verbs, null, 0)});
`;
    // Using 0 indentation for max compactness as requested "mais compacto possível"

    fs.writeFileSync(path.join(OUTPUT_DIR, `verbData_${letter}.js`), fileContent);
    console.log(`Wrote verbData_${letter}.js with ${count} verbs.`);
}

console.log(`Total verbs exported: ${totalVerbs}`);
