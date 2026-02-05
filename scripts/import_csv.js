const fs = require('fs');
const path = require('path');

const dataDir = path.join(__dirname, '../data/verbs');
const inputFile = process.argv[2] || path.join(__dirname, '../verbs_export.csv');

if (!fs.existsSync(inputFile)) {
    console.error(`Error: File ${inputFile} not found.`);
    process.exit(1);
}

console.log(`Reading from ${inputFile}...`);

// Helper to parse CSV line handling quotes
function parseCsvLine(line) {
    const values = [];
    let current = '';
    let inQuotes = false;

    for (let i = 0; i < line.length; i++) {
        const char = line[i];

        if (inQuotes) {
            if (char === '"') {
                if (i + 1 < line.length && line[i + 1] === '"') {
                    current += '"';
                    i++;
                } else {
                    inQuotes = false;
                }
            } else {
                current += char;
            }
        } else {
            if (char === '"') {
                inQuotes = true;
            } else if (char === ',') {
                values.push(current);
                current = '';
            } else {
                current += char;
            }
        }
    }
    values.push(current);
    return values;
}

const content = fs.readFileSync(inputFile, 'utf8');
const lines = content.split('\n');
const header = parseCsvLine(lines[0]);

// Map header names to indices
const col = {};
header.forEach((h, i) => col[h.trim()] = i);

const verbsByLetter = {};

// Initialize buckets usually
'abcdefghijklmnopqrstuvwxyz'.split('').forEach(l => verbsByLetter[l] = {});

let count = 0;

for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;

    const values = parseCsvLine(line);
    if (values.length < header.length) continue;

    const infinitive = values[col['infinitive']];
    if (!infinitive) continue;

    const letter = infinitive[0].toLowerCase();

    // Construct Verb Object
    const verb = {
        infinitive: infinitive,
        translation: values[col['translation']],
        forms: {
            base: values[col['base']],
            pastSimple: values[col['pastSimple']],
            pastParticiple: values[col['pastParticiple']],
            presentParticiple: values[col['presentParticiple']],
            thirdPerson: values[col['thirdPerson']]
        },
        irregular: values[col['irregular']] === 'true',
        tags: values[col['tags']] ? values[col['tags']].split(';') : [],
        related: values[col['related']] ? values[col['related']].split(';') : [],
        explanation: values[col['explanation']],
        examples: []
    };

    // Add Examples if they exist
    if (values[col['example1_en']] || values[col['example1_pt']]) {
        verb.examples.push({
            en: values[col['example1_en']],
            pt: values[col['example1_pt']]
        });
    }
    if (values[col['example2_en']] || values[col['example2_pt']]) {
        verb.examples.push({
            en: values[col['example2_en']],
            pt: values[col['example2_pt']]
        });
    }

    if (!verbsByLetter[letter]) verbsByLetter[letter] = {};
    verbsByLetter[letter][infinitive] = verb;
    count++;
}

console.log(`Parsed ${count} verbs. Updating JSON files...`);

// Load existing files to merge (preserving non-CSV data if any, although here we might overwrite for consistency with CSV source of truth)
// Strategy: Load existing, update with CSV data, save.
Object.keys(verbsByLetter).forEach(letter => {
    const filePath = path.join(dataDir, `${letter}.json`);
    let existingData = {};

    if (fs.existsSync(filePath)) {
        try {
            existingData = JSON.parse(fs.readFileSync(filePath, 'utf8'));
        } catch (e) {
            console.warn(`Warning: Could not read ${letter}.json, creating new.`);
        }
    }

    // Merge: CSV data takes precedence
    const newData = { ...existingData, ...verbsByLetter[letter] };

    // Sort keys alphabetically
    const sortedData = {};
    Object.keys(newData).sort().forEach(key => {
        sortedData[key] = newData[key];
    });

    fs.writeFileSync(filePath, JSON.stringify(sortedData, null, 4), 'utf8');
    console.log(`Updated ${letter}.json`);
});

console.log('Import complete!');
