// [DEPRECATED] This script targets the legacy monolithic verbData.js file.
// It needs to be rewritten if we want to batch-optimize the JSON files in public/data.

const fs = require('fs');
const path = require('path');

const JS_DATA_PATH = path.join(__dirname, '../js/verbData.js');

try {
    // Read the file
    let content = fs.readFileSync(JS_DATA_PATH, 'utf8');

    // Extract the object part
    // We need to be careful with the window assignment at the end
    // Strategy: Evaluate the file in a sandbox or just regex parse?
    // Regex parsing for 1.3MB text might be fragile if not careful.
    // Better: Helper wrapper to load it as a module? 
    // Since it acts as a global var assignment, we can "mock" window.

    // Quick hack: eval the content in a safe context to get the object
    const window = {};
    const tenseNames = {}; // Mock dependency

    // We need to strip the "const verbDatabase =" and specific exports to eval it safely
    // or just assume the file structure.
    // The file ends with window.verbDatabase = ...

    // Let's rely on Node require if we modify the file to be a module temporarily? 
    // Or just use the fact it's a huge object literal.

    // Let's try to load it by cleaning the top and bottom.
    // Top: "const verbDatabase = {" -> "module.exports = {"
    // Bottom: "window.verbDatabase..." -> remove

    let moduleContent = content
        .replace('const verbDatabase =', 'module.exports =')
        .replace(/window\.verbDatabase.*/s, ''); // Remove the end assignments

    // Write to a temp file
    const tempPath = path.join(__dirname, 'temp_verbs.js');
    fs.writeFileSync(tempPath, moduleContent);

    // Require it
    const database = require(tempPath);

    let optimizedCount = 0;

    // Optimize
    for (const key in database) {
        const verb = database[key];

        // 1. Remove tenses
        if (verb.tenses) {
            delete verb.tenses;
            optimizedCount++;
        }

        // 2. Ensure related exists
        if (!verb.related) {
            verb.related = [];
        }

        // 3. Ensure examples exists
        if (!verb.examples) {
            verb.examples = [];
        }

        // 4. Ensure explanation exists
        if (!verb.explanation) {
            verb.explanation = `Definição de ${verb.infinitive}`;
        }
    }

    console.log(`Optimized ${optimizedCount} verbs by removing static tenses.`);

    // Serialize back
    // We want a pretty print but compact enough.
    // JSON.stringify(database, null, 4) might be too verbose.
    // Let's stick to standard indentation.

    const newContent = `// Sardonix Verb Database (Optimized)
const verbDatabase = ${JSON.stringify(database, null, 4)};

// Export for use in other modules
window.verbDatabase = verbDatabase;
`;

    // Write back
    fs.writeFileSync(JS_DATA_PATH, newContent);

    // Cleanup
    fs.unlinkSync(tempPath);

    console.log('Successfully rewrote verbData.js');

} catch (err) {
    console.error('Error optimizing database:', err);
}
