import type { MockComment, MockResourceDetail } from "@/data/types";

export const MOCK_RESOURCES: MockResourceDetail[] = [
  {
    id: 1,
    title: "Écoute active en 5 minutes",
    content:
      "Reformulez ce que vous avez entendu avant de répondre. Cela désamorce les malentendus et montre que vous prenez au sérieux l’autre personne. Exercice : pendant une conversation, notez mentalement trois idées clés puis résumez-les à voix haute.",
    status: "published",
    is_public: true,
    created_at: "2025-11-02T10:00:00.000Z",
    category_id: 1,
    category: { id: 1, name: "Communication" },
    resource_type: { id: 3, name: "guide" },
    relation_type: { id: 3, name: "professionnelle" },
    user: { id: 2, name: "Association Bienveillance" },
  },
  {
    id: 2,
    title: "Désescalade : respirer avant de répondre",
    content:
      "Quand la tension monte, prenez trois respirations profondes par le nez. Fixez un objectif relationnel (« comprendre » plutôt que « gagner »). Proposez une pause si nécessaire.",
    status: "published",
    is_public: true,
    created_at: "2025-10-18T14:30:00.000Z",
    category_id: 2,
    category: { id: 2, name: "Conflits" },
    resource_type: { id: 1, name: "article" },
    relation_type: { id: 1, name: "famille" },
    user: { id: 3, name: "Médiations & Cie" },
  },
  {
    id: 3,
    title: "Journal de gratitude (modèle)",
    content:
      "Chaque soir, écrivez trois moments agréables — même minimes. Après deux semaines, relisez vos entrées pour ancrer une vision plus équilibrée du quotidien.",
    status: "published",
    is_public: true,
    created_at: "2025-09-05T09:15:00.000Z",
    category_id: 3,
    category: { id: 3, name: "Développement personnel" },
    resource_type: { id: 4, name: "activite" },
    relation_type: { id: 2, name: "amicale" },
    user: { id: 1, name: "Camille Martin" },
  },
  {
    id: 4,
    title: "Sortie nature en groupe : checklist",
    content:
      "Itinéraire, matériel partagé, rôle d’un·e coordinateur·rice, temps de debrief. Pensez à une activité accessible à tous les niveaux de forme.",
    status: "published",
    is_public: true,
    created_at: "2025-08-22T16:45:00.000Z",
    category_id: 4,
    category: { id: 4, name: "Loisirs" },
    resource_type: { id: 3, name: "guide" },
    relation_type: { id: 4, name: "intergenerationnelle" },
    user: { id: 4, name: "Club Rando Solidaire" },
  },
  {
    id: 5,
    title: "Donner un feedback constructif",
    content:
      "Structure SBI : Situation observée, Comportement factuel, Impact sur vous ou l’équipe. Terminez par une invitation à co-construire la suite.",
    status: "published",
    is_public: true,
    created_at: "2025-11-10T11:20:00.000Z",
    category_id: 1,
    category: { id: 1, name: "Communication" },
    resource_type: { id: 2, name: "video" },
    relation_type: { id: 3, name: "professionnelle" },
    user: { id: 2, name: "Association Bienveillance" },
  },
  {
    id: 6,
    title: "Réunion de famille sans dérapage",
    content:
      "Fixez un ordre du jour léger, limitez la durée, désignez un modérateur bienveillant. Les sujets sensibles peuvent être reportés à un binôme ou une médiation.",
    status: "published",
    is_public: true,
    created_at: "2025-07-30T08:00:00.000Z",
    category_id: 2,
    category: { id: 2, name: "Conflits" },
    resource_type: { id: 1, name: "article" },
    relation_type: { id: 1, name: "famille" },
    user: { id: 3, name: "Médiations & Cie" },
  },
];

const MOCK_COMMENTS: Record<number, MockComment[]> = {
  1: [
    {
      id: 101,
      content: "Très concret, merci ! Je l’ai testé au travail cette semaine.",
      created_at: "2025-11-03T12:00:00.000Z",
      user: { id: 10, name: "Samir" },
    },
    {
      id: 102,
      content: "La partie « reformuler » change vraiment la dynamique.",
      created_at: "2025-11-04T09:30:00.000Z",
      user: { id: 11, name: "Léa" },
      replies: [
        {
          id: 103,
          content: "D’accord, surtout quand on est pressé.",
          created_at: "2025-11-04T10:00:00.000Z",
          user: { id: 12, name: "Thomas" },
        },
      ],
    },
  ],
  2: [
    {
      id: 201,
      content: "La pause proposée m’a sauvé une discussion difficile.",
      created_at: "2025-10-20T18:00:00.000Z",
      user: { id: 13, name: "Inès" },
    },
  ],
};

export function getMockResourceById(id: number): MockResourceDetail | undefined {
  return MOCK_RESOURCES.find((r) => r.id === id);
}

export function getMockComments(resourceId: number): MockComment[] {
  return MOCK_COMMENTS[resourceId] ?? [];
}
