const fs = require('fs');
const path = require('path');

// Mock window
const window = {
    verbDatabase: {}
};

const verbsDir = path.join(__dirname, 'js/verbs');

try {
    const files = fs.readdirSync(verbsDir).filter(f => f.startsWith('verbData_') && f.endsWith('.js'));
    console.log(`Found ${files.length} verb data files.`);

    files.sort(); // Ensure order a-z

    for (const file of files) {
        const filePath = path.join(verbsDir, file);
        console.log(`Checking ${file}...`);
        const content = fs.readFileSync(filePath, 'utf8');
        try {
            eval(content);
            const count = Object.keys(window.verbDatabase).length;
            console.log(`  OK. Total verbs so far: ${count}`);
        } catch (e) {
            console.error(`  ERROR in ${file}: ${e.message}`);
            // Show some context if possible
            if (e.stack) console.error(e.stack.split('\n')[0]);

            // If syntax error, maybe try to pinpoint line?
            // Node's eval usually gives line number relative to eval start
        }
    }
} catch (err) {
    console.error("Fatal error:", err);
}
