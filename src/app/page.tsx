import { getAllVerbs } from "@/lib/verbs";
import HomeClient from "@/components/HomeClient";

// Force static generation
export const dynamic = "force-static";

export default async function Home() {
  const verbs = await getAllVerbs();

  return (
    <>
      <HomeClient initialVerbs={verbs} />

      <footer className="footer">
        <div className="footer-content">
          <p>
            Desenvolvido por <strong>Sardonix Idiomas</strong>
          </p>
          <p className="footer-sub">
            Material auxiliar do curso de inglês ministrado pelo professor Pedro (<a href="https://sardonixidiomas.com" target="_blank" rel="noopener noreferrer">sardonixidiomas.com</a>)
          </p>
        </div>
      </footer>
    </>
  );
}
