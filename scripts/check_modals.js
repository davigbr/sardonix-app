const fs = require('fs');
const path = require('path');

const verbsDir = path.join(__dirname, '../data/verbs');

function checkVerb(file, verb) {
    try {
        const content = fs.readFileSync(path.join(verbsDir, file), 'utf8');
        const data = JSON.parse(content);
        if (data[verb]) {
            console.log(`✅ ${verb} found in ${file}`);
            console.log(`   Tags: ${JSON.stringify(data[verb].tags)}`);
            console.log(`   Explanation: ${data[verb].explanation.substring(0, 50)}...`);
        } else {
            console.error(`❌ ${verb} NOT found in ${file}`);
        }
    } catch (e) {
        console.error(`❌ Error reading ${file}: ${e.message}`);
    }
}

checkVerb('m.json', 'must');
checkVerb('c.json', 'can');
checkVerb('s.json', 'should');
checkVerb('w.json', 'will');
checkVerb('o.json', 'ought to');
