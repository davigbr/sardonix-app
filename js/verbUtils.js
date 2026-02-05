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
     * Generates full tense objects from verb forms
     */
    generateTenses(verb) {
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
        title: "Present Tenses",
        tenses: {
            presentSimple: { name: "Simple Present", desc: "Describes habits, general facts, or actions happening now." },
            presentContinuous: { name: "Present Continuous", desc: "Describes ongoing actions happening right now." },
            presentPerfect: { name: "Present Perfect", desc: "Describes completed actions connecting past to present." },
            presentPerfectContinuous: { name: "Present Perfect Continuous", desc: "Describes ongoing actions that started in the past and continue to now." }
        }
    },
    past: {
        title: "Past Tenses",
        tenses: {
            pastSimple: { name: "Simple Past", desc: "Describes completed actions in the past." },
            pastContinuous: { name: "Past Continuous", desc: "Describes ongoing actions in the past." },
            pastPerfect: { name: "Past Perfect", desc: "Describes completed actions that occurred before another past action." },
            pastPerfectContinuous: { name: "Past Perfect Continuous", desc: "Describes ongoing actions that started and continued before another past action." }
        }
    },
    future: {
        title: "Future Tenses",
        tenses: {
            futureSimple: { name: "Future Simple", desc: "Describes actions that will happen in the future." },
            futureContinuous: { name: "Future Continuous", desc: "Describes ongoing actions in the future." },
            futurePerfect: { name: "Future Perfect", desc: "Describes actions that will be completed before a specific future time." },
            futurePerfectContinuous: { name: "Future Perfect Continuous", desc: "Describes ongoing actions that will continue until a specific future time." }
        }
    },
    conditional: {
        title: "Conditional Tenses",
        tenses: {
            conditionalSimple: { name: "Conditional Simple", desc: "Describes hypothetical situations." },
            conditionalContinuous: { name: "Conditional Continuous", desc: "Describes hypothetical ongoing actions." },
            conditionalPerfect: { name: "Conditional Perfect", desc: "Describes hypothetical completed actions." },
            conditionalPerfectContinuous: { name: "Conditional Perfect Continuous", desc: "Describes hypothetical ongoing actions that would have continued." }
        }
    }
};
