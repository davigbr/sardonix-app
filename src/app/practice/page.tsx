import { getAllVerbs } from "@/lib/verbs";
import PracticeClient from "@/components/PracticeClient";

// Force static generation
export const dynamic = "force-static";

export default async function PracticePage() {
    const verbs = await getAllVerbs();

    return <PracticeClient allVerbs={verbs} />;
}
