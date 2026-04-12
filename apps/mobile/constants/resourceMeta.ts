export type ResourceMetaOption = {
  id: number;
  name: string;
};

export const RELATION_TYPE_OPTIONS: readonly ResourceMetaOption[] = [
  { id: 1, name: "famille" },
  { id: 2, name: "amicale" },
  { id: 3, name: "professionnelle" },
  { id: 4, name: "intergenerationnelle" },
];

export const RESOURCE_TYPE_OPTIONS: readonly ResourceMetaOption[] = [
  { id: 1, name: "article" },
  { id: 2, name: "video" },
  { id: 3, name: "guide" },
  { id: 4, name: "activite" },
];
