import { createContext, useContext } from "react";

type ResultsSelection = {
  tournamentId: string | null;
  select: (id: string) => void;
};

/** Torneo elegido en la sección Resultados; "Ver resultados" en Temporada lo cambia. */
export const ResultsSelectionContext = createContext<ResultsSelection>({
  tournamentId: null,
  select: () => {},
});

export function useResultsSelection() {
  return useContext(ResultsSelectionContext);
}
