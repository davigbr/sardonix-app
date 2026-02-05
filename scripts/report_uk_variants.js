const fs = require('fs');
const path = require('path');

const dataDir = path.join(__dirname, '../public/data');
const verbFiles = fs.readdirSync(dataDir).filter(f => f.endsWith('.json')).sort();

console.log('# British English Variants Report\n');

let total = 0;

verbFiles.forEach(file => {
    try {
        const filePath = path.join(dataDir, file);
        const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
        const letter = file.replace('.json', '').toUpperCase();

        const variants = [];
        Object.values(data).forEach(verb => {
            if (verb.uk) {
                variants.push(`- **${verb.infinitive}**: ${verb.uk}`);
            }
        });

        if (variants.length > 0) {
            console.log(`## Letter ${letter}`);
            console.log(variants.join('\n'));
            console.log('');
            total += variants.length;
        }
    } catch (e) {
        console.error(`Error reading ${file}: ${e.message}`);
    }
});

console.log(`\n**Total Variants Found:** ${total}`);
