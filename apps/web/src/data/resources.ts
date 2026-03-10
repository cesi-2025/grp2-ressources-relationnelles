export interface ResourceItem {
  id: number;
  title: string;
  category: string;
  relationType: string;
  resourceType: string;
  excerpt: string;
  content: string;
  author: string;
  createdAt: string;
  updatedAt: string;
}

export interface ResourceComment {
  id: number;
  resourceId: number;
  author: string;
  message: string;
  createdAt: string;
}

export const RESOURCES: ResourceItem[] = [
  {
    id: 1,
    title: "Mieux communiquer en équipe au quotidien",
    category: "Communication",
    relationType: "Professionnelle",
    resourceType: "Article",
    excerpt: "Techniques simples pour clarifier vos messages et éviter les malentendus en contexte de travail.",
    content:
      "Une communication d'équipe efficace repose sur trois piliers : la clarté, l'écoute et la reformulation. Commencez par définir un objectif précis pour chaque échange. Ensuite, adoptez un langage direct, évitez les formulations ambiguës et validez la compréhension mutuelle en reformulant les points clés. Ces habitudes réduisent les incompréhensions et renforcent la confiance entre collègues.",
    author: "Équipe éditoriale",
    createdAt: "2026-03-01",
    updatedAt: "2026-03-03",
  },
  {
    id: 2,
    title: "Exercices d'écoute active pour les échanges difficiles",
    category: "Écoute active",
    relationType: "Personnelle",
    resourceType: "Guide",
    excerpt: "Une méthode pas à pas pour écouter sans juger et reformuler avec précision.",
    content:
      "L'écoute active consiste à suspendre son jugement, accueillir l'autre et reformuler son propos. En pratique, vous pouvez poser des questions ouvertes, refléter les émotions perçues et résumer les idées principales. Ce guide propose des exercices progressifs à pratiquer seul ou en binôme.",
    author: "Julie Martin",
    createdAt: "2026-02-27",
    updatedAt: "2026-03-01",
  },
  {
    id: 3,
    title: "Comprendre l'empathie dans les relations sociales",
    category: "Empathie",
    relationType: "Sociale",
    resourceType: "Vidéo",
    excerpt: "Comment reconnaître les émotions d'autrui et adapter sa posture relationnelle.",
    content:
      "L'empathie ne signifie pas être d'accord, mais comprendre sincèrement le vécu de l'autre. Cette ressource vidéo explique comment repérer les signaux émotionnels, adapter sa réponse relationnelle et maintenir un cadre de respect mutuel.",
    author: "Nicolas Rey",
    createdAt: "2026-02-22",
    updatedAt: "2026-02-22",
  },
  {
    id: 4,
    title: "Prévenir les conflits avant qu'ils ne s'installent",
    category: "Gestion des conflits",
    relationType: "Professionnelle",
    resourceType: "Article",
    excerpt: "Signaux faibles et stratégies d'apaisement pour maintenir un climat constructif.",
    content:
      "Les conflits naissent souvent de signaux faibles ignorés : interruptions répétées, non-dits, frustration accumulée. L'article propose une grille simple pour détecter ces signaux tôt et instaurer des rituels de régulation collective.",
    author: "Équipe éditoriale",
    createdAt: "2026-02-19",
    updatedAt: "2026-02-20",
  },
  {
    id: 5,
    title: "Développer son intelligence émotionnelle",
    category: "Intelligence émotionnelle",
    relationType: "Personnelle",
    resourceType: "Podcast",
    excerpt: "Identifier, accueillir et réguler ses émotions pour des interactions plus sereines.",
    content:
      "La régulation émotionnelle est une compétence clé. Ce podcast présente des techniques respiratoires, des méthodes de recul cognitif et des outils de communication assertive pour mieux vivre les tensions du quotidien.",
    author: "Sophie Bernard",
    createdAt: "2026-02-14",
    updatedAt: "2026-02-15",
  },
  {
    id: 6,
    title: "Collaborer efficacement dans un groupe citoyen",
    category: "Collaboration",
    relationType: "Sociale",
    resourceType: "Guide",
    excerpt: "Répartition des rôles, décisions collectives et bonnes pratiques de coopération.",
    content:
      "Une collaboration durable repose sur des rôles clairs, une décision transparente et un suivi régulier. Ce guide propose des templates de réunions, une matrice de responsabilités et des règles de feedback constructif.",
    author: "Collectif citoyen",
    createdAt: "2026-02-10",
    updatedAt: "2026-02-11",
  },
  {
    id: 7,
    title: "Communication non violente : les bases",
    category: "Communication",
    relationType: "Personnelle",
    resourceType: "Vidéo",
    excerpt: "Découvrir les quatre étapes de la CNV pour désamorcer les tensions relationnelles.",
    content:
      "Observation, sentiment, besoin, demande : les quatre étapes de la CNV permettent d'exprimer un désaccord sans agresser. Cette vidéo propose des exemples concrets de reformulations en contexte familial.",
    author: "Camille Robert",
    createdAt: "2026-02-08",
    updatedAt: "2026-02-09",
  },
  {
    id: 8,
    title: "Écouter pour mieux accompagner les proches",
    category: "Écoute active",
    relationType: "Familiale",
    resourceType: "Article",
    excerpt: "Des pratiques concrètes pour soutenir un proche dans un moment délicat.",
    content:
      "L'accompagnement d'un proche repose d'abord sur la qualité de présence. Cet article aide à éviter les conseils non sollicités, à poser des questions utiles et à offrir un cadre rassurant.",
    author: "Équipe éditoriale",
    createdAt: "2026-02-05",
    updatedAt: "2026-02-06",
  },
  {
    id: 9,
    title: "Empathie et diversité des points de vue",
    category: "Empathie",
    relationType: "Sociale",
    resourceType: "Guide",
    excerpt: "Apprendre à accueillir la différence et créer des échanges respectueux.",
    content:
      "Accueillir des points de vue différents demande une posture d'ouverture, des questions de clarification et une capacité à dissocier la personne de l'idée. Le guide propose des scénarios d'entraînement.",
    author: "Nicolas Rey",
    createdAt: "2026-01-30",
    updatedAt: "2026-01-31",
  },
  {
    id: 10,
    title: "Gérer un désaccord en réunion",
    category: "Gestion des conflits",
    relationType: "Professionnelle",
    resourceType: "Vidéo",
    excerpt: "Structurer un débat productif et transformer le conflit en opportunité.",
    content:
      "Un désaccord bien géré améliore la qualité des décisions. Cette vidéo montre comment cadrer le débat, expliciter les critères de décision et conclure avec un plan d'action partagé.",
    author: "Julie Martin",
    createdAt: "2026-01-25",
    updatedAt: "2026-01-25",
  },
  {
    id: 11,
    title: "Intelligence émotionnelle et prise de décision",
    category: "Intelligence émotionnelle",
    relationType: "Professionnelle",
    resourceType: "Article",
    excerpt: "Mieux décider en tenant compte des biais émotionnels et du contexte collectif.",
    content:
      "Les émotions influencent fortement les arbitrages. Cet article présente des techniques de pause décisionnelle, de vérification des biais et d'alignement collectif avant validation finale.",
    author: "Sophie Bernard",
    createdAt: "2026-01-18",
    updatedAt: "2026-01-19",
  },
  {
    id: 12,
    title: "Méthodes de collaboration en projet associatif",
    category: "Collaboration",
    relationType: "Sociale",
    resourceType: "Podcast",
    excerpt: "Coordonner des bénévoles et garder une dynamique durable dans le temps.",
    content:
      "Dans un projet associatif, la motivation fluctue. Ce podcast partage des pratiques pour maintenir l'engagement, organiser les rôles tournants et célébrer les avancées collectives.",
    author: "Collectif citoyen",
    createdAt: "2026-01-12",
    updatedAt: "2026-01-12",
  },
];

export const RESOURCE_COMMENTS: ResourceComment[] = [
  {
    id: 1,
    resourceId: 1,
    author: "Anaïs",
    message: "Excellente ressource, la partie sur la reformulation m'a beaucoup aidée.",
    createdAt: "2026-03-04",
  },
  {
    id: 2,
    resourceId: 1,
    author: "Louis",
    message: "Très clair et concret, surtout pour les réunions d'équipe.",
    createdAt: "2026-03-05",
  },
  {
    id: 3,
    resourceId: 3,
    author: "Mina",
    message: "La vidéo est courte mais très utile pour comprendre l'empathie au quotidien.",
    createdAt: "2026-02-23",
  },
  {
    id: 4,
    resourceId: 6,
    author: "Yanis",
    message: "Les templates de réunion sont super pratiques pour les associations.",
    createdAt: "2026-02-12",
  },
];

export function getResourceById(id: number): ResourceItem | undefined {
  return RESOURCES.find((resource) => resource.id === id);
}

export function getCommentsByResourceId(resourceId: number): ResourceComment[] {
  return RESOURCE_COMMENTS.filter((comment) => comment.resourceId === resourceId);
}
