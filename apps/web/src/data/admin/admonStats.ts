import s from "@/style/dashboardStyle"

export default interface Stats{
    consulted: number
    searchs: number
    exploited: number
    created: number
    favorite: number
    commente: number
    pending_ressources: number
    published_ressources: number
}

export const STAT_CARDS = [
  { key: 'creations',           label: 'Ressources créées',    style: s.statCard },
  { key: 'resources_published', label: 'Ressources publiées',  style: { ...s.statCard, ...s.statCardGreen } },
  { key: 'resources_pending',   label: 'En attente',           style: { ...s.statCard, ...s.statCardYellow } },
  { key: 'exploitations',       label: 'Exploitations',        style: { ...s.statCard, ...s.statCardPurple } },
  { key: 'favoris',             label: 'Favoris',              style: { ...s.statCard, ...s.statCardCoral } },
  { key: 'commentaires',        label: 'Commentaires',         style: { ...s.statCard, ...s.statCardGray } },
];