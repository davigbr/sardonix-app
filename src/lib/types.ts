export interface VerbForms {
    base: string;
    pastSimple: string;
    pastParticiple: string;
    presentParticiple: string;
    thirdPerson: string;
}

export interface VerbData {
    infinitive: string;
    translation: string;
    forms: VerbForms;
    uk?: string; // e.g. "cancelled"
    irregular: boolean;
    tags: string[]; // "irregular", "regular", "phrasal", "modal", "defective"
    related: string[];
    explanation?: string;
    examples?: { en: string; pt: string }[];
    phrasal?: { verb: string; definition: string; example: { en: string; pt: string } }[];
    model?: string;
    tenses?: TenseGroups;
}

export interface ConjugationTable {
    I: string;
    you: string;
    "he/she/it": string;
    we: string;
    they: string;
}

export interface TenseGroups {
    [key: string]: ConjugationTable;
}

export interface VerbMap {
    [key: string]: VerbData;
}
