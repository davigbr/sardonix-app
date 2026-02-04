const fs = require('fs');
const path = require('path');

// Configuration
const CSV_PATH = path.join(__dirname, '../verbs.csv');
const JS_DATA_PATH = path.join(__dirname, '../js/verbData.js');

// Read Files
try {
    const csvContent = fs.readFileSync(CSV_PATH, 'utf8');
    let jsContent = fs.readFileSync(JS_DATA_PATH, 'utf8');

    // Parse CSV safely (handling quotes)
    // Simple regex for CSV parsing that respects quotes
    const parseCSV = (text) => {
        const lines = text.split(/\r?\n/).filter(l => l.trim());
        const headers = lines[0].split(',').map(h => h.trim());
        const result = [];

        for (let i = 1; i < lines.length; i++) {
            // Split by comma, but ignore commas inside quotes
            const row = lines[i].match(/(".*?"|[^",\s]+)(?=\s*,|\s*$)/g);
            if (!row) continue;

            // Clean quotes
            const cleanRow = row.map(val => val.replace(/^"|"$/g, '').trim());

            // Map to object
            const obj = {};
            headers.forEach((h, index) => {
                obj[h] = cleanRow[index] || '';
            });
            result.push(obj);
        }
        return result;
    };

    const csvData = parseCSV(csvContent);
    console.log(`Parsed ${csvData.length} verbs from CSV.`);

    // Extract existing keys from JS file to avoid duplicates
    // We look for keys in the object: "key": {
    const existingKeysMatch = jsContent.match(/"?([a-zA-Z0-9_\-]+)"?:\s*{/g);
    const existingKeys = new Set(
        existingKeysMatch ? existingKeysMatch.map(k => k.replace(/["':{\s]/g, '')) : []
    );

    // Find the insertion point (before the last closing brace)
    const lastBraceIndex = jsContent.lastIndexOf('}');
    if (lastBraceIndex === -1) {
        throw new Error("Could not find closing brace in verbData.js");
    }

    let newVerbsCount = 0;
    let newEntriesString = '';

    csvData.forEach(row => {
        const verbKey = row.infinitive;

        // Skip if already exists
        if (existingKeys.has(verbKey)) return;

        // Create Compact Verb Object through the Generator logic
        // We only store: forms, irregular, tags, related, translation, explanation, examples

        // Map CSV columns to our schema
        // CSV: infinitive,past,past_participle,third,present_participle,type1,portuguese_translation

        const isIrregular = row.type1 === 'irregular';
        const tags = [];
        if (isIrregular) tags.push('irregular');
        if (row.type1 === 'regular') tags.push('regular');
        if (row.type2 === 'phrasal') tags.push('phrasal'); // phrasal verbs logic might need tweak if it's the main type?

        const newEntry = `
    "${verbKey}": {
        infinitive: "${row.infinitive}",
        translation: "${row.portuguese_translation}",
        forms: {
            base: "${row.infinitive}",
            pastSimple: "${row.past}",
            pastParticiple: "${row.past_participle}",
            presentParticiple: "${row.present_participle}",
            thirdPerson: "${row.third}"
        },
        irregular: ${isIrregular},
        tags: ${JSON.stringify(tags)},
        related: [], // CSV does not have related verbs easily mappable yet
        explanation: "Verbo ${row.type1} que significa '${row.portuguese_translation}'.",
        examples: []
    },`;

        newEntriesString += newEntry;
        newVerbsCount++;
    });

    if (newVerbsCount > 0) {
        // Remove trailing comma from last entry if we were strictly JSON, but valid JS tolerates it?
        // Actually, we are appending to the object list which is comma separated.
        // We need to ensure the previous last item has a comma.

        // Check if the character before last brace is a comma
        // A safer bet is to always prepend a comma to our block

        const contentBefore = jsContent.substring(0, lastBraceIndex).trimRight();
        const contentAfter = jsContent.substring(lastBraceIndex);

        // If contentBefore doesn't end with comma, add one
        const needsComma = !contentBefore.trim().endsWith(',') && !contentBefore.trim().endsWith('{');

        const finalContent = contentBefore + (needsComma ? ',' : '') + newEntriesString + "\n" + contentAfter;

        fs.writeFileSync(JS_DATA_PATH, finalContent, 'utf8');
        console.log(`Successfully added ${newVerbsCount} new verbs to verbData.js`);
    } else {
        console.log("No new verbs to add.");
    }

} catch (err) {
    console.error("Error processing files:", err);
    process.exit(1);
}
