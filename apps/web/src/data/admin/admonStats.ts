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
  { key: 'created',             label: 'Ressources créées',    style: s.statCard },
  { key: 'published_ressource', label: 'Ressources publiées',  style: { ...s.statCard, ...s.statCardGreen } },
  { key: 'pending_ressourecs',  label: 'En attente',           style: { ...s.statCard, ...s.statCardYellow } },
  { key: 'exploite',            label: 'Exploitations',        style: { ...s.statCard, ...s.statCardPurple } },
  { key: 'favorite',            label: 'Favoris',              style: { ...s.statCard, ...s.statCardCoral } },
  { key: 'commente',            label: 'Commentaires',         style: { ...s.statCard, ...s.statCardGray } },
];