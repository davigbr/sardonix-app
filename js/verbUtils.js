/**
 * Verb Utility Functions
 * Handles the hydration of compact verb data into full conjugation objects.
 */

const VerbUtils = {
    /**
     * Expands the verb database by generating full tense objects for verbs that only have base forms
     */
    hydrateDatabase(database) {
        for (const key in database) {
            const verb = database[key];
            if (!verb.tenses) {
                verb.tenses = this.generateTenses(verb);
            }
        }
    },

    /**
     * Generates tenses for defective/irregular models
     */
    generateDefectiveTenses(verb) {
        const f = verb.forms;
        const model = verb.model;
        const tenses = {};

        // Helper to create empty tense object
        const emptyTense = () => ({ I: '-', you: '-', "he/she/it": '-', we: '-', they: '-' });

        // --- MODEL: MODAL PURO (Can, Must, Should) ---
        if (model === 'modal_pure') {
            // Present: No 's' in 3rd person
            tenses.presentSimple = {
                I: f.base, you: f.base, "he/she/it": f.base, we: f.base, they: f.base
            };

            // Past: only if a specific past form exists (can -> could)
            // Some modals like 'must' have no past form here (substituted by had to)
            if (f.pastSimple && f.pastSimple !== '-') {
                tenses.pastSimple = {
                    I: f.pastSimple, you: f.pastSimple, "he/she/it": f.pastSimple, we: f.pastSimple, they: f.pastSimple
                };
            }
        }

        // --- MODEL: IMPERSONAL (Rain, Snow) ---
        else if (model === 'impersonal') {
            // Only 3rd person singular (It ...)
            if (f.thirdPerson) {
                tenses.presentSimple = { ...emptyTense(), "he/she/it": f.thirdPerson };
            }
            if (f.presentParticiple) {
                tenses.presentContinuous = { ...emptyTense(), "he/she/it": `is ${f.presentParticiple}` };
            }
            // Past
            if (f.pastSimple) {
                tenses.pastSimple = { ...emptyTense(), "he/she/it": f.pastSimple };
            }
            // Future
            tenses.futureSimple = { ...emptyTense(), "he/she/it": `will ${f.base}` };
        }

        // --- MODEL: RESTRICTED PAST (Used to) ---
        else if (model === 'restricted_past') {
            tenses.pastSimple = {
                I: f.pastSimple, you: f.pastSimple, "he/she/it": f.pastSimple, we: f.pastSimple, they: f.pastSimple
            };
        }

        // --- MODEL: ARCHAIC QUOTED (Quoth) ---
        else if (model === 'archaic_quoted') {
            // Quoth is only past, 1st/3rd person usually
            tenses.pastSimple = {
                I: f.pastSimple, you: '-', "he/she/it": f.pastSimple, we: '-', they: '-'
            };
        }

        // --- MODEL: RESTRICTED IMPERATIVE / ARCHAIC ---
        // Beware, Begone, Hark, etc. -> No standard conjugation, just Base form usually.
        else if (model === 'restricted_imperative' || model === 'archaic') {
            // Return empty tenses, Conjugator will show "Base Form" in header but empty table
            return {};
        }

        return tenses;
    },

    /**
     * Generates full tense objects from verb forms
     */
    generateTenses(verb) {
        // Delegate to defective logic if a specific model is defined
        if (verb.model) {
            return this.generateDefectiveTenses(verb);
        }

        const f = verb.forms;
        const pp = f.pastParticiple;
        const ing = f.presentParticiple;
        const base = f.base;

        return {
            // --- PRESENT ---
            presentSimple: {
                I: f.base,
                you: f.base,
                "he/she/it": f.thirdPerson,
                we: f.base,
                they: f.base
            },
            presentContinuous: {
                I: `am ${ing}`,
                you: `are ${ing}`,
                "he/she/it": `is ${ing}`,
                we: `are ${ing}`,
                they: `are ${ing}`
            },
            presentPerfect: {
                I: `have ${pp}`,
                you: `have ${pp}`,
                "he/she/it": `has ${pp}`,
                we: `have ${pp}`,
                they: `have ${pp}`
            },
            presentPerfectContinuous: {
                I: `have been ${ing}`,
                you: `have been ${ing}`,
                "he/she/it": `has been ${ing}`,
                we: `have been ${ing}`,
                they: `have been ${ing}`
            },

            // --- PAST ---
            pastSimple: {
                I: f.pastSimple,
                you: f.pastSimple,
                "he/she/it": f.pastSimple,
                we: f.pastSimple,
                they: f.pastSimple
            },
            pastContinuous: {
                I: `was ${ing}`,
                you: `were ${ing}`,
                "he/she/it": `was ${ing}`,
                we: `were ${ing}`,
                they: `were ${ing}`
            },
            pastPerfect: {
                I: `had ${pp}`,
                you: `had ${pp}`,
                "he/she/it": `had ${pp}`,
                we: `had ${pp}`,
                they: `had ${pp}`
            },
            pastPerfectContinuous: {
                I: `had been ${ing}`,
                you: `had been ${ing}`,
                "he/she/it": `had been ${ing}`,
                we: `had been ${ing}`,
                they: `had been ${ing}`
            },

            // --- FUTURE ---
            futureSimple: {
                I: `will ${base}`,
                you: `will ${base}`,
                "he/she/it": `will ${base}`,
                we: `will ${base}`,
                they: `will ${base}`
            },
            futureContinuous: {
                I: `will be ${ing}`,
                you: `will be ${ing}`,
                "he/she/it": `will be ${ing}`,
                we: `will be ${ing}`,
                they: `will be ${ing}`
            },
            futurePerfect: {
                I: `will have ${pp}`,
                you: `will have ${pp}`,
                "he/she/it": `will have ${pp}`,
                we: `will have ${pp}`,
                they: `will have ${pp}`
            },
            futurePerfectContinuous: {
                I: `will have been ${ing}`,
                you: `will have been ${ing}`,
                "he/she/it": `will have been ${ing}`,
                we: `will have been ${ing}`,
                they: `will have been ${ing}`
            },

            // --- CONDITIONAL ---
            conditionalSimple: {
                I: `would ${base}`,
                you: `would ${base}`,
                "he/she/it": `would ${base}`,
                we: `would ${base}`,
                they: `would ${base}`
            },
            conditionalContinuous: {
                I: `would be ${ing}`,
                you: `would be ${ing}`,
                "he/she/it": `would be ${ing}`,
                we: `would be ${ing}`,
                they: `would be ${ing}`
            },
            conditionalPerfect: {
                I: `would have ${pp}`,
                you: `would have ${pp}`,
                "he/she/it": `would have ${pp}`,
                we: `would have ${pp}`,
                they: `would have ${pp}`
            },
            conditionalPerfectContinuous: {
                I: `would have been ${ing}`,
                you: `would have been ${ing}`,
                "he/she/it": `would have been ${ing}`,
                we: `would have been ${ing}`,
                they: `would have been ${ing}`
            }
        };
    }
};

window.VerbUtils = VerbUtils;

window.tenseConfig = {
    present: {
        title: "Presente",
        tenses: {
            presentSimple: { name: "Presente Simples", desc: "Descreve hábitos, fatos gerais ou ações que acontecem agora." },
            presentContinuous: { name: "Presente Contínuo", desc: "Descreve ações em andamento acontecendo agora." },
            presentPerfect: { name: "Presente Perfeito", desc: "Descreve ações completadas que conectam o passado ao presente." },
            presentPerfectContinuous: { name: "Presente Perfeito Contínuo", desc: "Descreve ações em andamento que começaram no passado e continuam até agora." }
        }
    },
    past: {
        title: "Passado",
        tenses: {
            pastSimple: { name: "Passado Simples", desc: "Descreve ações completadas no passado." },
            pastContinuous: { name: "Passado Contínuo", desc: "Descreve ações em andamento no passado." },
            pastPerfect: { name: "Passado Perfeito", desc: "Descreve ações completadas que ocorreram antes de outra ação passada." },
            pastPerfectContinuous: { name: "Passado Perfeito Contínuo", desc: "Descreve ações em andamento que começaram e continuaram antes de outra ação passada." }
        }
    },
    future: {
        title: "Futuro",
        tenses: {
            futureSimple: { name: "Futuro Simples", desc: "Descreve ações que acontecerão no futuro." },
            futureContinuous: { name: "Futuro Contínuo", desc: "Descreve ações em andamento no futuro." },
            futurePerfect: { name: "Futuro Perfeito", desc: "Descreve ações que serão completadas antes de um tempo específico no futuro." },
            futurePerfectContinuous: { name: "Futuro Perfeito Contínuo", desc: "Descreve ações em andamento que continuarão até um tempo específico no futuro." }
        }
    },
    conditional: {
        title: "Condicional",
        tenses: {
            conditionalSimple: { name: "Condicional Simples", desc: "Descreve situações hipotéticas." },
            conditionalContinuous: { name: "Condicional Contínuo", desc: "Descreve ações hipotéticas em andamento." },
            conditionalPerfect: { name: "Condicional Perfeito", desc: "Descreve ações hipotéticas completadas." },
            conditionalPerfectContinuous: { name: "Condicional Perfeito Contínuo", desc: "Descreve ações hipotéticas em andamento que teriam continuado." }
        }
    }
};
