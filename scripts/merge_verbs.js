const fs = require('fs');
const path = require('path');

const VERBS_DIR = path.join(__dirname, '../data/verbs');

// Accepts the input file path as a command line argument
const inputFile = process.argv[2];

if (!inputFile) {
    console.error('Usage: node scripts/merge_verbs.js <input_file.json>');
    process.exit(1);
}

try {
    const startContent = fs.readFileSync(inputFile, 'utf8');
    const newVerbs = JSON.parse(startContent);
    const updates = {}; // Map of letter -> object of verbs to add

    console.log(`Loaded ${Object.keys(newVerbs).length} verbs to merge.`);

    // 1. Group by letter
    for (const [key, data] of Object.entries(newVerbs)) {
        let cleanKey = key.trim().toLowerCase();
        // Handle "be present" -> 'b', "call on" -> 'c'
        const firstLetter = cleanKey.charAt(0);

        if (!updates[firstLetter]) {
            updates[firstLetter] = {};
        }
        updates[firstLetter][cleanKey] = data;
    }

    // 2. Process updates per letter
    for (const letter of Object.keys(updates)) {
        const filePath = path.join(VERBS_DIR, `${letter}.json`);
        let fileContent = {};

        if (fs.existsSync(filePath)) {
            try {
                fileContent = JSON.parse(fs.readFileSync(filePath, 'utf8'));
            } catch (e) {
                console.error(`Error reading ${letter}.json: ${e.message}`);
                continue;
            }
        } else {
            console.log(`Creating new file for letter ${letter}`);
        }

        const verbsToAdd = updates[letter];
        let addedCount = 0;

        for (const [verb, data] of Object.entries(verbsToAdd)) {
            if (!fileContent[verb]) {
                fileContent[verb] = data;
                addedCount++;
            } else {
                console.warn(`Verb '${verb}' already exists in ${letter}.json. Skipping.`);
            }
        }

        // Sort keys alphabetically
        const sortedContent = {};
        Object.keys(fileContent).sort().forEach(key => {
            sortedContent[key] = fileContent[key];
        });

        fs.writeFileSync(filePath, JSON.stringify(sortedContent, null, 4));
        console.log(`Updated ${letter}.json: joined ${addedCount} new verbs.`);
    }

    console.log('Merge complete.');

} catch (err) {
    console.error(`Fatal error: ${err.message}`);
    process.exit(1);
}
