import type { MockProgressionRow } from "@/data/types";

export const MOCK_PROGRESSION: {
  favorites: MockProgressionRow[];
  exploited: MockProgressionRow[];
  set_aside: MockProgressionRow[];
} = {
  favorites: [
    {
      resource: { id: 1, title: "Écoute active en 5 minutes" },
    },
    {
      resource: { id: 3, title: "Journal de gratitude (modèle)" },
    },
  ],
  exploited: [
    {
      resource: { id: 4, title: "Sortie nature en groupe : checklist" },
    },
  ],
  set_aside: [
    {
      resource: { id: 6, title: "Réunion de famille sans dérapage" },
    },
  ],
};
