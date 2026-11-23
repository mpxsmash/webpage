import { lazy, Suspense, useMemo, useState, type ReactNode } from "react";
import { Header, type NavItem } from "./components/Header";
import { ResultsSelectionContext } from "./hooks/useResultsSelection";
import { Hero } from "./sections/Hero";
import { Season } from "./sections/Season";
import { Contact } from "./sections/Contact";

// Lo que queda debajo del primer pantallazo va en chunks aparte.
const Results = lazy(() => import("./sections/Results").then((m) => ({ default: m.Results })));
const Gallery = lazy(() => import("./sections/Gallery").then((m) => ({ default: m.Gallery })));
const Accounts = lazy(() => import("./sections/Accounts").then((m) => ({ default: m.Accounts })));

// Fase 2 sumará Ranking (#ranking) y Fase 3 Rifas (#rifas), en ese orden después de Resultados.
const NAV: readonly NavItem[] = [
  { id: "inicio", label: "Inicio" },
  { id: "temporada", label: "Temporada" },
  { id: "resultados", label: "Resultados" },
  { id: "galeria", label: "Galería" },
  { id: "cuentas", label: "Cuentas" },
  { id: "contacto", label: "Contacto" },
];

/** Ancla estable para el menú y el IntersectionObserver, aunque su contenido cargue en diferido. */
function Anchor({ id, children }: { id: string; children: ReactNode }) {
  return (
    <div id={id} className="anchor">
      {children}
    </div>
  );
}

export function App() {
  const [resultsTournamentId, setResultsTournamentId] = useState<string | null>(null);
  const selection = useMemo(
    () => ({ tournamentId: resultsTournamentId, select: setResultsTournamentId }),
    [resultsTournamentId],
  );

  return (
    <ResultsSelectionContext.Provider value={selection}>
      <a href="#contenido" className="skip-link">
        Saltar al contenido
      </a>
      <Header items={NAV} />
      <main id="contenido">
        <Anchor id="inicio">
          <Hero />
        </Anchor>
        <Anchor id="temporada">
          <Season />
        </Anchor>
        <Suspense fallback={null}>
          <Anchor id="resultados">
            <Results />
          </Anchor>
          <Anchor id="galeria">
            <Gallery />
          </Anchor>
          <Anchor id="cuentas">
            <Accounts />
          </Anchor>
        </Suspense>
      </main>
      <Anchor id="contacto">
        <Contact />
      </Anchor>
    </ResultsSelectionContext.Provider>
  );
}
