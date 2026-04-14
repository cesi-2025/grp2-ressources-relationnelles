import s from "@/style/dashboardStyle"

export interface Stats{
    consultations: number
    recherches: number
    exploitations: number
    creations: number
    favoris: number
    commentaires: number
    resources_pending: number
    resources_published: number
}
export interface StatsMod{
    recherches: number
    commentaires: number
    resources_pending: number
}

export const STAT_CARDS = [
  { key: 'creations',           label: 'Ressources créées',    style: s.statCard },
  { key: 'resources_published', label: 'Ressources publiées',  style: { ...s.statCard, ...s.statCardGreen } },
  { key: 'resources_pending',   label: 'En attente',           style: { ...s.statCard, ...s.statCardYellow } },
  { key: 'exploitations',       label: 'Exploitations',        style: { ...s.statCard, ...s.statCardPurple } },
  { key: 'favoris',             label: 'Favoris',              style: { ...s.statCard, ...s.statCardCoral } },
  { key: 'commentaires',        label: 'Commentaires',         style: { ...s.statCard, ...s.statCardGray } },
];

export const STAT_MOD_CARDS = [
  { key: 'creations',           label: 'Ressources créées',    style: s.statCard },
  { key: 'resources_pending',   label: 'En attente',           style: { ...s.statCard, ...s.statCardYellow } },
  { key: 'commentaires',        label: 'Commentaires',         style: { ...s.statCard, ...s.statCardGray } },
];