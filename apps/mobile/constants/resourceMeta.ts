export type ResourceMetaOption = {
  id: number;
  name: string;
};

/** Repli si aucune ressource publiée ne permet de déduire les types, ou si le catalogue est indisponible. */
export const FALLBACK_RELATION_TYPE_OPTIONS: readonly ResourceMetaOption[] = [
  { id: 1, name: "famille" },
  { id: 2, name: "amicale" },
  { id: 3, name: "professionnelle" },
  { id: 4, name: "intergenerationnelle" },
];

/** Repli si aucune ressource publiée ne permet de déduire les types, ou si le catalogue est indisponible. */
export const FALLBACK_RESOURCE_TYPE_OPTIONS: readonly ResourceMetaOption[] = [
  { id: 1, name: "article" },
  { id: 2, name: "video" },
  { id: 3, name: "guide" },
  { id: 4, name: "activite" },
];
