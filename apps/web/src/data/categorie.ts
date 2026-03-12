export interface CategorieItems {
  id: number;
  nom: string;
  description: string;
}

export const CATEGORIE: CategorieItems[] = [
  { id: 1,  nom: "Respiration",                description: "Techniques de respiration consciente pour réduire le stress et retrouver un état de calme en quelques minutes."                                             },
  { id: 2,  nom: "Évènementiel",               description: "Organisation d'événements collectifs favorisant le lien social, la cohésion d'équipe et l'engagement communautaire."                                        },
  { id: 3,  nom: "Activité",                   description: "Activités pratiques et exercices concrets pour développer des compétences relationnelles et de communication."                                               },
  { id: 4,  nom: "Gestion des conflits",        description: "Ressources pour identifier, désamorcer et résoudre les tensions relationnelles dans un cadre professionnel ou personnel."                                  },
  { id: 5,  nom: "Intelligence émotionnelle",   description: "Outils et méthodes pour mieux comprendre, réguler et exprimer ses émotions afin de favoriser des interactions sereines."                                   },
  { id: 6,  nom: "Collaboration",               description: "Guides et bonnes pratiques pour travailler efficacement en équipe, répartir les rôles et maintenir une dynamique collective durable."                      },
  { id: 7,  nom: "Communication non violente",  description: "Introduction aux quatre étapes de la CNV pour exprimer ses besoins sans agresser et accueillir ceux des autres avec bienveillance."                        },
  { id: 8,  nom: "Écoute active",               description: "Techniques pour écouter sans juger, reformuler avec précision et offrir un cadre rassurant lors d'échanges délicats."                                      },
  { id: 9,  nom: "Empathie",                    description: "Ressources pour développer la capacité à reconnaître les émotions d'autrui et adapter sa posture relationnelle en toute situation."                        },
  { id: 10, nom: "Médiation",                   description: "Méthodes de médiation pour faciliter le dialogue entre parties en désaccord et construire des solutions acceptables par tous."                              },
  { id: 11, nom: "Prise de décision",           description: "Outils pour structurer la réflexion collective, limiter les biais émotionnels et aboutir à des décisions partagées et durables."                           },
  { id: 12, nom: "Bien-être au travail",         description: "Pratiques et ressources pour préserver l'équilibre émotionnel, réduire le burn-out et cultiver un environnement de travail sain et bienveillant."         },
];

export function getUserById(id: number): CategorieItems | undefined {
  return CATEGORIE.find((u) => u.id === id);
}




