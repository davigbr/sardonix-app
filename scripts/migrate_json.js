const fs = require('fs');
const path = require('path');
const vm = require('vm');

const jsDir = path.join(__dirname, '../js/verbs');
const jsonDir = path.join(__dirname, '../data/verbs');

// Ensure output dir exists
if (!fs.existsSync(jsonDir)) {
    fs.mkdirSync(jsonDir, { recursive: true });
}

const letters = 'abcdefghijklmnopqrstuvwxyz'.split('');

letters.forEach(letter => {
    // Skip 'a' if it's already done/deleted, but the letters array includes it.
    // However, if 'a.json' exists and 'verbData_a.js' is gone, it will just log "No JS file found" which is fine.

    const jsFile = path.join(jsDir, `verbData_${letter}.js`);
    const jsonFile = path.join(jsonDir, `${letter}.json`);

    if (fs.existsSync(jsFile)) {
        console.log(`Processing ${letter}...`);

        try {
            const content = fs.readFileSync(jsFile, 'utf8');

            // Create a sandbox to run the script
            const sandbox = {
                window: {
                    verbDatabase: {}
                },
                Object: Object
            };

            vm.createContext(sandbox);
            vm.runInContext(content, sandbox);

            const data = sandbox.window.verbDatabase;

            // Check if empty
            if (Object.keys(data).length === 0) {
                console.warn(`  Warning: No data found for ${letter}`);
            }

            // Write to JSON
            fs.writeFileSync(jsonFile, JSON.stringify(data, null, 4));
            console.log(`  -> Created ${letter}.json with ${Object.keys(data).length} verbs`);

            // Delete original file
            fs.unlinkSync(jsFile);
            console.log(`  -> Deleted verbData_${letter}.js`);

        } catch (err) {
            console.error(`Error processing ${letter}:`, err.message);
        }
    } else {
        // console.log(`Skipping ${letter}: No JS file found`);
    }
});

console.log('Migration complete.');
