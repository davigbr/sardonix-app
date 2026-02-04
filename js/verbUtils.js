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
        return {
            simplePresent: {
                I: f.base,
                you: f.base,
                "he/she/it": f.thirdPerson,
                we: f.base,
                they: f.base
            },
            simplePast: {
                I: f.pastSimple,
                you: f.pastSimple,
                "he/she/it": f.pastSimple,
                we: f.pastSimple,
                they: f.pastSimple
            },
            simpleFuture: {
                I: `will ${f.base}`,
                you: `will ${f.base}`,
                "he/she/it": `will ${f.base}`,
                we: `will ${f.base}`,
                they: `will ${f.base}`
            },
            presentContinuous: {
                I: `am ${f.presentParticiple}`,
                you: `are ${f.presentParticiple}`,
                "he/she/it": `is ${f.presentParticiple}`,
                we: `are ${f.presentParticiple}`,
                they: `are ${f.presentParticiple}`
            },
            pastContinuous: {
                I: `was ${f.presentParticiple}`,
                you: `were ${f.presentParticiple}`,
                "he/she/it": `was ${f.presentParticiple}`,
                we: `were ${f.presentParticiple}`,
                they: `were ${f.presentParticiple}`
            },
            presentPerfect: {
                I: `have ${f.pastParticiple}`,
                you: `have ${f.pastParticiple}`,
                "he/she/it": `has ${f.pastParticiple}`,
                we: `have ${f.pastParticiple}`,
                they: `have ${f.pastParticiple}`
            },
            pastPerfect: {
                I: `had ${f.pastParticiple}`,
                you: `had ${f.pastParticiple}`,
                "he/she/it": `had ${f.pastParticiple}`,
                we: `had ${f.pastParticiple}`,
                they: `had ${f.pastParticiple}`
            },
            futurePerfect: {
                I: `will have ${f.pastParticiple}`,
                you: `will have ${f.pastParticiple}`,
                "he/she/it": `will have ${f.pastParticiple}`,
                we: `will have ${f.pastParticiple}`,
                they: `will have ${f.pastParticiple}`
            }
        };
    }
};

window.VerbUtils = VerbUtils;

window.tenseNames = {
    simplePresent: "Present Simple",
    simplePast: "Past Simple",
    simpleFuture: "Future Simple",
    presentContinuous: "Present Continuous",
    pastContinuous: "Past Continuous",
    presentPerfect: "Present Perfect",
    pastPerfect: "Past Perfect",
    futurePerfect: "Future Perfect"
};
