import { VerbData, TenseGroups } from "./types";

export const tenseConfig: Record<string, { title: string; tenses: Record<string, { name: string; desc: string }> }> = {
    present: {
        title: "Present",
        tenses: {
            presentSimple: { name: "Present Simple", desc: "Describes habits, general facts, or actions happening now." },
            presentContinuous: { name: "Present Continuous", desc: "Describes actions happening right now." },
            presentPerfect: { name: "Present Perfect", desc: "Describes completed actions connecting past to present." },
            presentPerfectContinuous: { name: "Present Perfect Continuous", desc: "Describes actions that started in the past and continue to now." }
        }
    },
    past: {
        title: "Past",
        tenses: {
            pastSimple: { name: "Past Simple", desc: "Describes actions completed in the past." },
            pastContinuous: { name: "Past Continuous", desc: "Describes actions in progress at a specific time in the past." },
            pastPerfect: { name: "Past Perfect", desc: "Describes actions completed before another past action." },
            pastPerfectContinuous: { name: "Past Perfect Continuous", desc: "Describes actions in progress that started before another past action." }
        }
    },
    future: {
        title: "Future",
        tenses: {
            futureSimple: { name: "Future Simple", desc: "Describes actions that will happen." },
            futureContinuous: { name: "Future Continuous", desc: "Describes actions that will be in progress in the future." },
            futurePerfect: { name: "Future Perfect", desc: "Describes actions that will be completed by a certain future time." },
            futurePerfectContinuous: { name: "Future Perfect Continuous", desc: "Describes actions in progress that will continue until a future time." }
        }
    },
    conditional: {
        title: "Conditional",
        tenses: {
            conditionalSimple: { name: "Conditional Simple", desc: "Describes hypothetical situations." },
            conditionalContinuous: { name: "Conditional Continuous", desc: "Describes hypothetical actions in progress." },
            conditionalPerfect: { name: "Conditional Perfect", desc: "Describes hypothetical actions that would have been completed." },
            conditionalPerfectContinuous: { name: "Conditional Perfect Continuous", desc: "Describes hypothetical actions that would have been in progress." }
        }
    }
};

export function generateTenses(verb: VerbData): TenseGroups {
    if (verb.tags.includes('defective') || verb.tags.includes('modal')) {
        return generateDefectiveTenses(verb);
    }

    // Base forms
    const f = {
        base: verb.infinitive,
        pastSimple: verb.forms.pastSimple.split('/')[0], // Take primary if multiple
        pastParticiple: verb.forms.pastParticiple.split('/')[0],
        gerund: verb.infinitive + "ing", // Simple approximation, refining below
        thirdPerson: verb.infinitive + "s" // Simple approximation
    };

    // Refine Gerund/ThirdPerson logic (basic rules)
    if (f.base.endsWith('e') && !f.base.endsWith('ee')) {
        f.gerund = f.base.slice(0, -1) + "ing";
    }
    if (f.base.endsWith('ss') || f.base.endsWith('sh') || f.base.endsWith('ch') || f.base.endsWith('x') || f.base.endsWith('o')) {
        f.thirdPerson = f.base + "es";
    } else if (f.base.endsWith('y') && !/[aeiou]y/.test(f.base)) {
        f.thirdPerson = f.base.slice(0, -1) + "ies";
    }

    // Handle "to be" exception
    if (verb.infinitive === "be") {
        return {
            presentSimple: { I: "am", you: "are", "he/she/it": "is", we: "are", they: "are" },
            presentContinuous: { I: "am being", you: "are being", "he/she/it": "is being", we: "are being", they: "are being" },
            presentPerfect: { I: "have been", you: "have been", "he/she/it": "has been", we: "have been", they: "have been" },
            presentPerfectContinuous: { I: "have been being", you: "have been being", "he/she/it": "has been being", we: "have been being", they: "have been being" },

            pastSimple: { I: "was", you: "were", "he/she/it": "was", we: "were", they: "were" },
            pastContinuous: { I: "was being", you: "were being", "he/she/it": "was being", we: "were being", they: "were being" },
            pastPerfect: { I: "had been", you: "had been", "he/she/it": "had been", we: "had been", they: "had been" },
            pastPerfectContinuous: { I: "had been being", you: "had been being", "he/she/it": "had been being", we: "had been being", they: "had been being" },

            futureSimple: { I: "will be", you: "will be", "he/she/it": "will be", we: "will be", they: "will be" },
            futureContinuous: { I: "will be being", you: "will be being", "he/she/it": "will be being", we: "will be being", they: "will be being" },
            futurePerfect: { I: "will have been", you: "will have been", "he/she/it": "will have been", we: "will have been", they: "will have been" },
            futurePerfectContinuous: { I: "will have been being", you: "will have been being", "he/she/it": "will have been being", we: "will have been being", they: "will have been being" },

            conditionalSimple: { I: "would be", you: "would be", "he/she/it": "would be", we: "would be", they: "would be" },
            conditionalContinuous: { I: "would be being", you: "would be being", "he/she/it": "would be being", we: "would be being", they: "would be being" },
            conditionalPerfect: { I: "would have been", you: "would have been", "he/she/it": "would have been", we: "would have been", they: "would have been" },
            conditionalPerfectContinuous: { I: "would have been being", you: "would have been being", "he/she/it": "would have been being", we: "would have been being", they: "would have been being" }
        };
    }

    // Standard Conjugation logic
    return {
        presentSimple: {
            I: f.base,
            you: f.base,
            "he/she/it": f.thirdPerson,
            we: f.base,
            they: f.base
        },
        presentContinuous: {
            I: `am ${f.gerund}`,
            you: `are ${f.gerund}`,
            "he/she/it": `is ${f.gerund}`,
            we: `are ${f.gerund}`,
            they: `are ${f.gerund}`
        },
        presentPerfect: {
            I: `have ${f.pastParticiple}`,
            you: `have ${f.pastParticiple}`,
            "he/she/it": `has ${f.pastParticiple}`,
            we: `have ${f.pastParticiple}`,
            they: `have ${f.pastParticiple}`
        },
        presentPerfectContinuous: {
            I: `have been ${f.gerund}`,
            you: `have been ${f.gerund}`,
            "he/she/it": `has been ${f.gerund}`,
            we: `have been ${f.gerund}`,
            they: `have been ${f.gerund}`
        },

        pastSimple: {
            I: f.pastSimple,
            you: f.pastSimple,
            "he/she/it": f.pastSimple,
            we: f.pastSimple,
            they: f.pastSimple
        },
        pastContinuous: {
            I: `was ${f.gerund}`,
            you: `were ${f.gerund}`,
            "he/she/it": `was ${f.gerund}`,
            we: `were ${f.gerund}`,
            they: `were ${f.gerund}`
        },
        pastPerfect: {
            I: `had ${f.pastParticiple}`,
            you: `had ${f.pastParticiple}`,
            "he/she/it": `had ${f.pastParticiple}`,
            we: `had ${f.pastParticiple}`,
            they: `had ${f.pastParticiple}`
        },
        pastPerfectContinuous: {
            I: `had been ${f.gerund}`,
            you: `had been ${f.gerund}`,
            "he/she/it": `had been ${f.gerund}`,
            we: `had been ${f.gerund}`,
            they: `had been ${f.gerund}`
        },

        futureSimple: {
            I: `will ${f.base}`,
            you: `will ${f.base}`,
            "he/she/it": `will ${f.base}`,
            we: `will ${f.base}`,
            they: `will ${f.base}`
        },
        futureContinuous: {
            I: `will be ${f.gerund}`,
            you: `will be ${f.gerund}`,
            "he/she/it": `will be ${f.gerund}`,
            we: `will be ${f.gerund}`,
            they: `will be ${f.gerund}`
        },
        futurePerfect: {
            I: `will have ${f.pastParticiple}`,
            you: `will have ${f.pastParticiple}`,
            "he/she/it": `will have ${f.pastParticiple}`,
            we: `will have ${f.pastParticiple}`,
            they: `will have ${f.pastParticiple}`
        },
        futurePerfectContinuous: {
            I: `will have been ${f.gerund}`,
            you: `will have been ${f.gerund}`,
            "he/she/it": `will have been ${f.gerund}`,
            we: `will have been ${f.gerund}`,
            they: `will have been ${f.gerund}`
        },

        conditionalSimple: {
            I: `would ${f.base}`,
            you: `would ${f.base}`,
            "he/she/it": `would ${f.base}`,
            we: `would ${f.base}`,
            they: `would ${f.base}`
        },
        conditionalContinuous: {
            I: `would be ${f.gerund}`,
            you: `would be ${f.gerund}`,
            "he/she/it": `would be ${f.gerund}`,
            we: `would be ${f.gerund}`,
            they: `would be ${f.gerund}`
        },
        conditionalPerfect: {
            I: `would have ${f.pastParticiple}`,
            you: `would have ${f.pastParticiple}`,
            "he/she/it": `would have ${f.pastParticiple}`,
            we: `would have ${f.pastParticiple}`,
            they: `would have ${f.pastParticiple}`
        },
        conditionalPerfectContinuous: {
            I: `would have been ${f.gerund}`,
            you: `would have been ${f.gerund}`,
            "he/she/it": `would have been ${f.gerund}`,
            we: `would have been ${f.gerund}`,
            they: `would have been ${f.gerund}`
        }
    };
}

function generateDefectiveTenses(verb: VerbData): TenseGroups {
    // Basic implementation for modals - usually they lack many tenses
    return {
        presentSimple: {
            I: verb.infinitive,
            you: verb.infinitive,
            "he/she/it": verb.infinitive, // Modals don't add 's'
            we: verb.infinitive,
            they: verb.infinitive
        }
    };
}
