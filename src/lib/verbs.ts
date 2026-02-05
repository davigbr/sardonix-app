import fs from 'fs';
import path from 'path';
import { VerbData, VerbMap } from './types';

const dataDirectory = path.join(process.cwd(), 'public/data/verbs');

export async function getAllVerbs(): Promise<VerbData[]> {
    const letters = 'abcdefghijklmnopqrstuvwxyz'.split('');
    let allVerbs: VerbMap = {};

    for (const letter of letters) {
        const filePath = path.join(dataDirectory, `${letter}.json`);
        try {
            if (fs.existsSync(filePath)) {
                const fileContents = fs.readFileSync(filePath, 'utf8');
                const letterData: VerbMap = JSON.parse(fileContents);
                allVerbs = { ...allVerbs, ...letterData };
            }
        } catch (error) {
            console.error(`Error loading verbs for letter ${letter}:`, error);
        }
    }

    // Sort alphabetically
    return Object.values(allVerbs).sort((a, b) =>
        a.infinitive.localeCompare(b.infinitive)
    );
}

export async function getVerb(infinitive: string): Promise<VerbData | null> {
    // Optimization: If we knew the starting letter, we could load just that file.
    // For now, let's load everything or implement a smarter lookup if needed.
    // Given the dataset is small (~1000 verbs), loading all is probably fine for SSG.

    // Better approach for dynamic lookup without loading everything:
    const letter = infinitive.charAt(0).toLowerCase();
    const filePath = path.join(dataDirectory, `${letter}.json`);

    try {
        if (fs.existsSync(filePath)) {
            const fileContents = fs.readFileSync(filePath, 'utf8');
            const letterData: VerbMap = JSON.parse(fileContents);
            return letterData[infinitive.toLowerCase()] || null;
        }
    } catch (error) {
        console.error(`Error loading verb ${infinitive}:`, error);
    }

    return null;
}
