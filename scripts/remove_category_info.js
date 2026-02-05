const fs = require('fs');
const path = require('path');

const verbsDir = path.join(__dirname, '../data/verbs');
const files = fs.readdirSync(verbsDir).filter(f => f.endsWith('.json'));

let updatedCount = 0;

files.forEach(file => {
    const filePath = path.join(verbsDir, file);
    let content = fs.readFileSync(filePath, 'utf8');
    let data = JSON.parse(content);
    let modified = false;

    for (const verb in data) {
        if (data[verb].category_info) {
            delete data[verb].category_info;
            modified = true;
        }
    }

    if (modified) {
        fs.writeFileSync(filePath, JSON.stringify(data, null, 4));
        console.log(`Updated ${file}`);
        updatedCount++;
    }
});

console.log(`Cleaned up 'category_info' from ${updatedCount} files.`);
