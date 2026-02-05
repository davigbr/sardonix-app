const fs = require('fs');
const path = require('path');

const dataDir = path.join(__dirname, '../public/data');
const verbFiles = fs.readdirSync(dataDir).filter(f => f.endsWith('.json'));

let totalUpdates = 0;
let totalCleaned = 0;
const report = [];

// Clean up known false positives from previous run
const badValues = [
    'mirrour', 'censour', 'jogue', 'long four', 'licence', 'glover', 'motour', 'conductour', 'doctour', 'sponsour'
];

// Whitelist for -or -> -our (Safer than regexing all)
const ourWords = new Set([
    'color', 'honor', 'labor', 'favor', 'flavor', 'vapor', 'neighbor',
    'behavior', 'rumor', 'humor', 'savor', 'endeavor', 'clamor', 'splendor',
    'armor', 'enamor', 'candor', 'fervor', 'harbor', 'parlor', 'rancor', 'succor'
]);

// Whitelist for -er -> -re
const reWords = new Set([
    'center', 'theater', 'meter', 'liter', 'fiber', 'caliber', 'somber', 'specter', 'maneuver' // maneuver->manoeuvre handled by manual?
]);

// Manual Mappings (High priority)
const manualMap = {
    'practice': 'practise', // verb
    'license': 'license',   // verb is usually license in UK too, so removing if set to licence
    'program': 'programme',
    'maneuver': 'manoeuvre',
    'peddler': 'pedlar',
    'defense': 'defence',
    'check': 'check', // cheque is noun
    'analyze': 'analyse',
    'paralyze': 'paralyse',
    'breathalyze': 'breathalyse',
    'catalyze': 'catalyse',
    'hydrolyze': 'hydrolyse',
    'electrolyze': 'electrolyse'
};

// Patterns
const patterns = [
    { regex: /ize$/, replace: 'ise', type: '-ize -> -ise' }, // Generally safe for verbs? (realize->realise). Oxford allows z, but s is common.
    { regex: /yze$/, replace: 'yse', type: '-yze -> -yse' },
    { regex: /og$/, replace: 'ogue', type: '-og -> -ogue' } // catalog, dialog
];

// Exceptions to patterns
const exceptions = ['capsize', 'size', 'seize', 'prize']; // prize vs prise?

console.log('Scanning for UK candidates (Refined)...');

verbFiles.forEach(file => {
    const filePath = path.join(dataDir, file);
    let data;
    try {
        data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    } catch (e) {
        console.error(`Error reading ${file}`);
        return;
    }

    let modified = false;

    for (const key in data) {
        const verb = data[key];
        const inf = verb.infinitive;

        // 1. Cleanup Bad Data
        if (verb.uk && (badValues.includes(verb.uk) || verb.uk === inf)) {
            console.log(`Cleaning bad UK value: ${verb.uk} for ${inf}`);
            delete verb.uk;
            modified = true;
            totalCleaned++;
        }

        // Special case: 'license' should NOT have 'licence' as uk verb
        if (inf === 'license' && verb.uk === 'licence') {
            delete verb.uk;
            modified = true;
        }

        // If UK is set (and valid), skip
        if (verb.uk) continue;

        let candidate = null;
        let rule = '';

        // 2. Check Valid Lists
        if (manualMap[inf]) {
            if (manualMap[inf] !== inf) {
                candidate = manualMap[inf];
                rule = 'Manual Map';
            }
        }
        else if (ourWords.has(inf)) {
            candidate = inf.replace(/or$/, 'our');
            rule = 'Whitelist -our';
        }
        else if (reWords.has(inf)) {
            candidate = inf.replace(/er$/, 're');
            rule = 'Whitelist -re';
        }
        else if (['catalog', 'dialog', 'monolog', 'epilog', 'prolog'].includes(inf)) {
            candidate = inf + 'ue';
            rule = '-og -> -ogue';
        }
        else {
            // Regex checks (be careful)
            for (const p of patterns) {
                if (p.regex.test(inf)) {
                    if (exceptions.includes(inf)) continue;

                    // Specific logic for -log (whitelist handled above, disable generic)
                    if (p.type.includes('-og')) continue;

                    candidate = inf.replace(p.regex, p.replace);
                    rule = p.type;
                    break;
                }
            }
        }

        if (candidate && candidate !== inf) {
            verb.uk = candidate;
            modified = true;
            totalUpdates++;
            report.push(`${inf} -> ${candidate} (${rule})`);
        }
    }

    if (modified) {
        fs.writeFileSync(filePath, JSON.stringify(data, null, 4), 'utf8');
    }
});

console.log('Scan Complete.');
console.log(`Cleaned ${totalCleaned} bad entries.`);
console.log(`Added ${totalUpdates} new UK variants.`);
console.log('--- Sample Updates ---');
console.log(report.slice(0, 20).join('\n'));
