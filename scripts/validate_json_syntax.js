const fs = require('fs');
const path = require('path');

const verbsDir = path.join(__dirname, '../public/data');
const files = fs.readdirSync(verbsDir).filter(f => f.endsWith('.json'));

console.log('Validating JSON files...');
let hasErrors = false;

files.forEach(file => {
    const filePath = path.join(verbsDir, file);
    try {
        const content = fs.readFileSync(filePath, 'utf8');
        JSON.parse(content);
        // console.log(`✅ ${file} is valid`);
    } catch (e) {
        console.error(`❌ ERROR in ${file}: ${e.message}`);
        hasErrors = true;
    }
});

if (!hasErrors) {
    console.log('All JSON files are valid.');
} else {
    console.log('Found errors in JSON files.');
}
