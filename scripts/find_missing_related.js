const fs = require('fs');
const path = require('path');

const VERBS_DIR = path.join(__dirname, '../data/verbs');
const OUTPUT_FILE = path.join(__dirname, '../missing_verbs_report.json');

async function findMissingRelated() {
    console.log('Scanning for missing related verbs...');

    const allVerbs = {};
    const files = fs.readdirSync(VERBS_DIR).filter(f => f.endsWith('.json'));

    // 1. Load all existing verbs
    for (const file of files) {
        const content = fs.readFileSync(path.join(VERBS_DIR, file), 'utf8');
        try {
            const data = JSON.parse(content);
            Object.assign(allVerbs, data);
        } catch (err) {
            console.error(`Error parsing ${file}:`, err.message);
        }
    }

    const existingKeys = new Set(Object.keys(allVerbs));
    const missingVerbs = new Set();
    const references = {}; // To track where they are referenced, for context if needed

    // 2. Scan for missing references
    for (const [verb, data] of Object.entries(allVerbs)) {
        if (data.related && Array.isArray(data.related)) {
            data.related.forEach(relatedVerb => {
                const cleanedRelated = relatedVerb.trim().toLowerCase();
                // Handle multi-word verbs if necessary, but keys are usually the infinitive
                // Some related might be "go up", ensure we check correctly.
                // Assuming keys in DB match the related string exactly.

                if (!existingKeys.has(cleanedRelated)) {
                    missingVerbs.add(cleanedRelated);

                    if (!references[cleanedRelated]) references[cleanedRelated] = [];
                    references[cleanedRelated].push(verb);
                }
            });
        }
    }

    const missingList = Array.from(missingVerbs).sort();

    console.log(`Found ${missingList.length} missing verbs.`);

    // 3. Write report
    const report = {
        count: missingList.length,
        missing: missingList,
        references: references
    };

    fs.writeFileSync(OUTPUT_FILE, JSON.stringify(report, null, 2));
    console.log(`Report written to ${OUTPUT_FILE}`);
}

findMissingRelated();
