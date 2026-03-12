export interface UserItem {
  id: number;
  nom: string;
  role: string;
  status: string;
  email: string;
  joined: string;
}


export const USERS: UserItem[] = [
   { id: 1,  nom: "Alice Martin",      role: "admin",       status: "Désactivé",    email: "alice.martin@corp.io",     joined: "2026-03-01" },
  { id: 2,  nom: "Julie Renard",      role: "super-admin", status: "Actif",   email: "julie.renard@corp.io",     joined: "2026-02-27" },
  { id: 3,  nom: "Nicolas Rey",       role: "citoyen",     status: "Désactivé",    email: "nicolas.rey@corp.io",      joined: "2026-02-22" },
  { id: 4,  nom: "Thomas Durand",     role: "moderateur",  status: "Actif", email: "thomas.durand@corp.io",    joined: "2026-02-19" },
  { id: 5,  nom: "Sophie Bernard",    role: "citoyen",     status: "Désactivé",    email: "sophie.bernard@corp.io",   joined: "2026-02-14" },
  { id: 6,  nom: "Yanis Lefebvre",    role: "admin",     status: "Actif",    email: "yanis.lefebvre@corp.io",   joined: "2026-02-10" },
  { id: 7,  nom: "Camille Robert",    role: "citoyen",     status: "Désactivé",   email: "camille.robert@corp.io",   joined: "2026-02-08" },
  { id: 8,  nom: "Anaïs Dupont",      role: "admin",     status: "Actif",   email: "anais.dupont@corp.io",     joined: "2026-02-05" },
  { id: 9,  nom: "Mina Charbonnier",  role: "citoyen",     status: "Actif",    email: "mina.charbonnier@corp.io", joined: "2026-01-30" },
  { id: 10, nom: "Louis Garnier",     role: "moderateur",  status: "Désactivé",   email: "louis.garnier@corp.io",    joined: "2026-01-25" },
  { id: 11, nom: "Emma Fontaine",     role: "citoyen",     status: "Actif",    email: "emma.fontaine@corp.io",    joined: "2026-01-18" },
  { id: 12, nom: "Pierre Mercier",    role: "admin",     status: "Désactivé",   email: "pierre.mercier@corp.io",   joined: "2026-01-12" },
];

export const ROLES = [
  "admin", "super-admin", "modérateur", "citoyen"
];

export const STATUSES = ["Actif", "Désactivé"];

export function getUserById(id: number): UserItem | undefined {
  return USERS.find((u) => u.id === id);
}
