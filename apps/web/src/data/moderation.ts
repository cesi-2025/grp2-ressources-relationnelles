import { ResourceItem } from "./resources";
import { RESOURCES } from "@/data/resources";
 
export interface Comment {
  id: number;
  resourceId: number;
  resourceTitle: string;
  author: string;
  content: string;
  createdAt: string;
  flagged: boolean;
}
 
export const PENDING_RESOURCES: ResourceItem[] = RESOURCES.slice(0, 4).map((r) => ({
  ...r,
  createdAt: new Date().toISOString().split("T")[0],
}));
 
export const INITIAL_COMMENTS: Comment[] = [
  { id: 1, resourceId: 1, resourceTitle: "L'écoute active au quotidien",  author: "Marc L.",   content: "Contenu très utile, merci pour ce partage !",                     createdAt: "2026-03-10", flagged: true  },
  { id: 2, resourceId: 1, resourceTitle: "L'écoute active au quotidien",  author: "Sandra B.", content: "Ce guide m'a vraiment aidé dans ma relation de couple.",            createdAt: "2026-03-09", flagged: false },
  { id: 3, resourceId: 2, resourceTitle: "Gérer les conflits en famille", author: "Ali K.",    content: "Propos blessants envers un autre utilisateur, à supprimer.",        createdAt: "2026-03-08", flagged: true  },
  { id: 4, resourceId: 3, resourceTitle: "Développer son empathie",       author: "Lucie M.",  content: "Excellent contenu, je partage avec mon équipe dès demain.",          createdAt: "2026-03-07", flagged: false },
  { id: 5, resourceId: 2, resourceTitle: "Gérer les conflits en famille", author: "Romain T.", content: "Spam : achetez maintenant sur ce lien !!!",                         createdAt: "2026-03-06", flagged: true  },
  { id: 6, resourceId: 4, resourceTitle: "Communication non violente",    author: "Fatima O.", content: "La section sur les besoins est particulièrement bien expliquée.",    createdAt: "2026-03-05", flagged: false },
];