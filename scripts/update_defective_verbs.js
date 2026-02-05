const fs = require('fs');
const path = require('path');

const dataDir = path.join(__dirname, '../data/verbs');

// Definition of Defective Verbs
const defectiveVerbs = [
    // --- MODALS PURO ---
    { inf: 'can', trans: 'poder, conseguir', model: 'modal_pure', cat: 'Modal Puro', forms: { base: 'can', pastSimple: 'could', thirdPerson: 'can' }, irregular: true },
    { inf: 'could', trans: 'poderia, podia', model: 'modal_pure', cat: 'Modal Puro', forms: { base: 'could', pastSimple: '-', thirdPerson: 'could' }, irregular: true },
    { inf: 'may', trans: 'poder (possibilidade)', model: 'modal_pure', cat: 'Modal Puro', forms: { base: 'may', pastSimple: 'might', thirdPerson: 'may' }, irregular: true },
    { inf: 'might', trans: 'poderia (remota)', model: 'modal_pure', cat: 'Modal Puro', forms: { base: 'might', pastSimple: '-', thirdPerson: 'might' }, irregular: true },
    { inf: 'must', trans: 'dever (obrigação)', model: 'modal_pure', cat: 'Modal Puro', forms: { base: 'must', pastSimple: '-', thirdPerson: 'must' }, irregular: true },
    { inf: 'shall', trans: 'dever (formal)', model: 'modal_pure', cat: 'Modal Puro', forms: { base: 'shall', pastSimple: 'should', thirdPerson: 'shall' }, irregular: true },
    { inf: 'should', trans: 'deveria', model: 'modal_pure', cat: 'Modal Puro', forms: { base: 'should', pastSimple: '-', thirdPerson: 'should' }, irregular: true },
    { inf: 'will', trans: 'irá (futuro)', model: 'modal_pure', cat: 'Modal Puro', forms: { base: 'will', pastSimple: 'would', thirdPerson: 'will' }, irregular: true },
    { inf: 'would', trans: '-ria (condicional)', model: 'modal_pure', cat: 'Modal Puro', forms: { base: 'would', pastSimple: '-', thirdPerson: 'would' }, irregular: true },
    { inf: 'ought to', trans: 'deveria (moral)', model: 'modal_pure', cat: 'Modal Semântico', forms: { base: 'ought to', pastSimple: '-', thirdPerson: 'ought to' }, irregular: true },

    // --- IMPERSONAL ---
    { inf: 'rain', trans: 'chover', model: 'impersonal', cat: 'Impessoal', forms: { base: 'rain', pastSimple: 'rained', pastParticiple: 'rained', presentParticiple: 'raining', thirdPerson: 'rains' }, irregular: false },
    { inf: 'snow', trans: 'nevar', model: 'impersonal', cat: 'Impessoal', forms: { base: 'snow', pastSimple: 'snowed', pastParticiple: 'snowed', presentParticiple: 'snowing', thirdPerson: 'snows' }, irregular: false },
    { inf: 'hail', trans: 'granizar', model: 'impersonal', cat: 'Impessoal (Meteorológico)', forms: { base: 'hail', pastSimple: 'hailed', pastParticiple: 'hailed', presentParticiple: 'hailing', thirdPerson: 'hails' }, irregular: false }, // Already exists, update cat
    { inf: 'drizzle', trans: 'garoar', model: 'impersonal', cat: 'Impessoal (Meteorológico)', forms: { base: 'drizzle', pastSimple: 'drizzled', pastParticiple: 'drizzled', presentParticiple: 'drizzling', thirdPerson: 'drizzles' }, irregular: false },
    { inf: 'behoove', trans: 'convir', model: 'impersonal', cat: 'Impessoal (Formal)', forms: { base: 'behoove', pastSimple: 'behooved', pastParticiple: 'behooved', presentParticiple: 'behooving', thirdPerson: 'behooves' }, irregular: false },

    // --- RESTRICTED ---
    { inf: 'used to', trans: 'costumava', model: 'restricted_past', cat: 'Restrito (Apenas Passado)', forms: { base: 'used to', pastSimple: 'used to', thirdPerson: 'used to' }, irregular: true },
    { inf: 'beware', trans: 'acautelar-se', model: 'restricted_imperative', cat: 'Restrito (Imperativo)', forms: { base: 'beware' }, irregular: true },
    { inf: 'begone', trans: 'vá embora', model: 'restricted_imperative', cat: 'Restrito (Imperativo)', forms: { base: 'begone' }, irregular: true },
    { inf: 'hark', trans: 'escute', model: 'restricted_imperative', cat: 'Arcaico (Imperativo)', forms: { base: 'hark' }, irregular: true },
    { inf: 'hear', trans: 'ouvir', model: null, cat: 'Imperativo Isolado (Parlamentar)', override: true }, // Hear exists, just update cat if needed, but 'Hear, Hear' is expression. Standard 'hear' is normal. 'Hear' listed by user is likely 'Hear, hear!' expression. I will update standard 'hear' category or add note? User said "Hear: Imperativo Isolado". This usually refers to "Hear, hear!". I'll stick to updating existing 'hear' with a note or category "Normal / Parlamentar". Actually user listed it in table. I'll just add category info to existing 'hear'.

    // --- ARCHAIC / OTHER ---
    { inf: 'quoth', trans: 'disse', model: 'archaic_quoted', cat: 'Arcaico (Fossilizado)', forms: { base: 'quoth', pastSimple: 'quoth' }, irregular: true },
    { inf: 'methinks', trans: 'parece-me', model: 'archaic', cat: 'Arcaico (Impessoal)', forms: { base: 'methinks' }, irregular: true },
    { inf: 'wit', trans: 'saber / isto é', model: 'archaic', cat: 'Arcaico / Legalês', forms: { base: 'wit' }, irregular: true },
    { inf: 'hight', trans: 'chamar-se', model: 'archaic', cat: 'Arcaico (Passivo)', forms: { base: 'hight' }, irregular: true },
    { inf: 'yclept', trans: 'chamado', model: 'archaic', cat: 'Fóssil (Particípio)', forms: { base: 'yclept' }, irregular: true },
    { inf: 'worth', trans: 'acontecer', model: 'archaic', cat: 'Arcaico (Subjuntivo)', forms: { base: 'worth' }, irregular: true },
    { inf: 'gone', trans: 'ido', model: 'archaic', cat: 'Particípio Isolado', forms: { base: 'gone' }, irregular: true },
    { inf: 'born', trans: 'nascido', model: 'archaic', cat: 'Passivo Isolado', forms: { base: 'born' }, irregular: true },

    // --- MARGINAL (Normal model but Cat Info) ---
    { inf: 'need', trans: 'precisar', model: null, cat: 'Híbrido (Modal Marginal)', forms: null }, // specific handling
    { inf: 'dare', trans: 'ousar', model: null, cat: 'Híbrido (Modal Marginal)', forms: null },

    // --- LOCUÇÕES DEFEITUOSAS ---
    { inf: 'had better', trans: 'seria melhor', model: 'modal_pure', cat: 'Locução Modal', forms: { base: 'had better', pastSimple: 'had better', thirdPerson: 'had better' }, irregular: true },
    { inf: 'would rather', trans: 'preferiria', model: 'modal_pure', cat: 'Locução Modal', forms: { base: 'would rather', pastSimple: 'would rather', thirdPerson: 'would rather' }, irregular: true },
];

function getFileForVerb(inf) {
    const letter = inf.charAt(0).toLowerCase();
    return path.join(dataDir, `${letter}.json`);
}

function updateVerbs() {
    const updates = {};

    // Load needed files mostly to memory
    const letters = new Set(defectiveVerbs.map(v => v.inf.charAt(0).toLowerCase()));
    const fileCache = {};

    letters.forEach(l => {
        try {
            const p = path.join(dataDir, `${l}.json`);
            if (fs.existsSync(p)) {
                fileCache[l] = JSON.parse(fs.readFileSync(p, 'utf8'));
            } else {
                fileCache[l] = {};
            }
        } catch (e) { console.error(e); }
    });

    defectiveVerbs.forEach(def => {
        const l = def.inf.charAt(0).toLowerCase();
        const db = fileCache[l];

        let verb = db[def.inf];
        if (!verb) {
            console.log(`Creating new verb: ${def.inf}`);
            verb = {
                infinitive: def.inf,
                translation: def.trans,
                forms: def.forms || { base: def.inf, pastSimple: def.inf + 'ed', pastParticiple: def.inf + 'ed', presentParticiple: def.inf + 'ing', thirdPerson: def.inf + 's' }, // Default fallback
                irregular: def.irregular,
                tags: ["defective"],
                related: [],
                explanation: `Verbo ${def.cat}.`,
                examples: []
            };
        } else {
            console.log(`Updating existing verb: ${def.inf}`);
        }

        // Update props
        verb.category_info = def.cat;
        if (def.model) verb.model = def.model;
        if (def.forms) verb.forms = { ...verb.forms, ...def.forms }; // Merge forms

        // Update tags
        if (!verb.tags.includes('defective')) verb.tags.push('defective');
        if (def.model === 'modal_pure' && !verb.tags.includes('modal')) verb.tags.push('modal');

        // Handle Phrasal Tag
        if (def.inf.includes(' ')) {
            if (def.model === 'modal_pure') {
                // Modals like 'had better' are NOT phrasal verbs, remove if present
                verb.tags = verb.tags.filter(t => t !== 'phrasal');
            } else if (!verb.tags.includes('phrasal')) {
                // Other space-containing verbs (like 'wake up') get phrasal tag
                verb.tags.push('phrasal');
            }
        }

        // De-duplicate tags just in case
        verb.tags = [...new Set(verb.tags)];

        db[def.inf] = verb;
    });

    // Save back
    Object.keys(fileCache).forEach(l => {
        const p = path.join(dataDir, `${l}.json`);
        // Sort keys
        const sortedDb = {};
        Object.keys(fileCache[l]).sort().forEach(key => {
            sortedDb[key] = fileCache[l][key];
        });

        fs.writeFileSync(p, JSON.stringify(sortedDb, null, 4));
        console.log(`Saved ${l}.json`);
    });
}

updateVerbs();
