const fs = require('fs');
const path = require('path');

const dataDir = path.join(__dirname, '../data/verbs');
const outputFile = path.join(__dirname, '../verbs_export.csv');

const letters = 'abcdefghijklmnopqrstuvwxyz'.split('');

// CSV Header
const headers = [
    'infinitive', 'translation',
    'base', 'pastSimple', 'pastParticiple', 'presentParticiple', 'thirdPerson',
    'irregular', 'tags', 'related',
    'explanation',
    'example1_en', 'example1_pt',
    'example2_en', 'example2_pt'
];

function escapeCsv(value) {
    if (value === null || value === undefined) return '';
    const stringValue = String(value);
    if (stringValue.includes(',') || stringValue.includes('"') || stringValue.includes('\n')) {
        return `"${stringValue.replace(/"/g, '""')}"`;
    }
    return stringValue;
}

const rows = [headers.join(',')];
let totalVerbs = 0;

console.log('Starting CSV Export...');

letters.forEach(letter => {
    const filePath = path.join(dataDir, `${letter}.json`);
    if (fs.existsSync(filePath)) {
        try {
            const content = fs.readFileSync(filePath, 'utf8');
            const data = JSON.parse(content);

            Object.values(data).forEach(verb => {
                const forms = verb.forms || {};
                const examples = verb.examples || [];

                const row = [
                    verb.infinitive,
                    verb.translation,
                    forms.base,
                    forms.pastSimple,
                    forms.pastParticiple,
                    forms.presentParticiple,
                    forms.thirdPerson,
                    verb.irregular,
                    (verb.tags || []).join(';'), // Using semicolon for list inside CSV
                    (verb.related || []).join(';'),
                    verb.explanation,
                    examples[0] ? examples[0].en : '',
                    examples[0] ? examples[0].pt : '',
                    examples[1] ? examples[1].en : '',
                    examples[1] ? examples[1].pt : ''
                ].map(escapeCsv).join(',');

                rows.push(row);
                totalVerbs++;
            });
        } catch (err) {
            console.error(`Error processing ${letter}.json: ${err.message}`);
        }
    }
});

fs.writeFileSync(outputFile, rows.join('\n') + '\n', 'utf8');
console.log(`Export complete! ${totalVerbs} verbs written to ${outputFile}`);
