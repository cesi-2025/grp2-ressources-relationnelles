# Plan de soutenance orale — (RE)Sources Relationnelles

**Duree totale : 20 minutes de presentation + 10 minutes de questions**
**Format : ~12 slides + demo live**

---

## SLIDE 1 — Page de titre (30 secondes)

**Titre :** (RE)Sources Relationnelles — Dossier Technique
**Sous-titre :** Projet collaboratif INFCDAAL2 — CESI Ecole d'Ingenieurs

**Contenu visuel :**
- Logo du projet
- Noms des 4 membres + roles (Chamil = Backend, Jamal = Frontend, Romain = Back-office, Leon = Mobile)
- Date de soutenance

**Ce qu'il faut dire :**
> "Bonjour, nous sommes le groupe 2 et nous vous presentons notre projet (RE)Sources Relationnelles, une plateforme de ressources pour ameliorer les relations entre citoyens."

---

## SLIDE 2 — Contexte et enjeux (1 minute 30)

**Titre :** Contexte : le Ministere des Solidarites et de la Sante

**Contenu visuel :**
- Image/logo du Ministere
- Pyramide de Maslow (schema simple)
- 3 bullet points cles

**Points cles a dire :**
- Le projet s'inscrit dans une demarche du Ministere pour proposer des ressources ameliorant les relations citoyennes
- La pyramide de Maslow : nos besoins fondamentaux passent par la qualite de nos relations (famille, couple, amis, collegues)
- Objectif principal : plateforme de ressources variees (articles, videos, activites) avec echange modere

**Texte oral :**
> "Le projet simule une commande du Ministere des Solidarites. L'idee part d'un constat simple : la qualite de nos relations est un levier majeur de bien-etre. Notre plateforme propose des ressources pour tous les types de relations — couple, famille, collegues — avec un espace d'echange modere."

---

## SLIDE 3 — Analyse du besoin (1 minute 30)

**Titre :** Analyse fonctionnelle

**Contenu visuel :**
- Diagramme de cas d'utilisation UML (le visuel migre depuis le dossier)
- 5 acteurs bien visibles

**Points cles a dire :**
- Presenter les 5 acteurs : citoyen non connecte, citoyen connecte, moderateur, administrateur, super-admin
- Expliquer la hierarchie des droits
- Montrer les cas d'utilisation principaux par acteur

**Texte oral :**
> "Nous avons identifie 5 profils d'utilisateurs avec des droits progressifs. Le citoyen consulte et cree des ressources, le moderateur les valide, l'admin gere le catalogue et les stats, le super-admin cree les comptes privilegies."

---

## SLIDE 4 — Analyse de la valeur (1 minute)

**Titre :** A qui rend-on service ? Sur quoi agit-on ?

**Contenu visuel :**
- Diagramme bete a cornes (migre depuis le dossier)
- Diagramme pieuvre (migre depuis le dossier)
- Les deux visuels cote a cote

**Points cles a dire :**
- Bete a cornes : rend service aux citoyens, agit sur les relations, but = ameliorer la qualite des liens
- Pieuvre : fonctions principales (acces web + mobile) et contraintes (RGPD, RGAA, compatibilite navigateurs)

**Texte oral :**
> "L'analyse de la valeur montre que notre produit rend service a tous les citoyens en agissant sur leurs relations interpersonnelles. Les contraintes principales sont l'accessibilite RGAA et la protection des donnees RGPD."

---

## SLIDE 5 — Choix techniques : le comparatif (1 minute 30)

**Titre :** Pourquoi Laravel + Next.js + PostgreSQL ?

**Contenu visuel :**
- Tableau comparatif : Laravel vs Symfony vs Express.js
- 3 criteres cles : MVC natif, Auth integree, Ecosysteme
- Logos des technologies choisies

**Points cles a dire :**
- Laravel : MVC natif (reponse directe au CCTP), Sanctum pour l'auth, Eloquent pour les relations
- Next.js : App Router, SSR pour le SEO, TypeScript, expertise React de l'equipe
- PostgreSQL : chiffrement natif pour le RGPD, robustesse ACID

**Texte oral :**
> "Nous avons compare trois options pour le backend. Laravel s'est impose grace a son architecture MVC native — c'est une exigence directe du CCTP — et Sanctum pour une gestion de tokens legere. Cote frontend, Next.js nous donne le SSR pour le referencement et l'App Router pour une structure claire. PostgreSQL a ete choisi pour ses capacites de chiffrement, essentielles pour le RGPD."

---

## SLIDE 6 — Demo live : Front-office citoyen (3 minutes)

**Titre :** Demonstration — Parcours citoyen

**Contenu visuel :** DEMO LIVE dans le navigateur

**Parcours a montrer :**
1. Page d'accueil : hero, categories, fonctionnement
2. Page ressources : filtres (categorie, type relation), recherche, pagination
3. Detail d'une ressource : contenu, commentaires hierarchiques
4. Inscription d'un nouveau compte (formulaire avec validation)
5. Connexion et acces aux fonctionnalites authentifiees
6. Ajout aux favoris, ajout d'un commentaire
7. Page progression (favoris, exploites, mis de cote)

**Texte oral :**
> "Je vais vous montrer le parcours d'un citoyen. Voici la page d'accueil avec nos 6 categories... [navigation live] On peut filtrer les ressources par categorie et type de relation... [clic] Ici le detail d'une ressource avec ses commentaires en arbre... Je vais maintenant me connecter pour montrer les fonctionnalites authentifiees..."

**CONSEIL :** Preparer les donnees de demo en avance (docker compose up + seed). Avoir un compte citoyen pre-existant pour eviter les temps morts.

---

## SLIDE 7 — Demo live : Back-office admin (2 minutes)

**Titre :** Demonstration — Espace d'administration

**Contenu visuel :** DEMO LIVE ou captures d'ecran preparees

**Parcours a montrer :**
1. Tableau de bord statistiques : metriques cles, graphique barres (inscriptions/mois), donut (categories)
2. Page moderation : onglet ressources en attente → approuver une ressource
3. Page moderation : onglet commentaires → approuver/supprimer
4. Gestion des utilisateurs : liste, creation, edition
5. Gestion des categories

**Texte oral :**
> "Cote admin, voici le tableau de bord avec les metriques en temps reel... [montre les graphiques] Ici la moderation : une ressource en attente, je l'approuve et elle passe en 'published'... [clic] Et la gestion des utilisateurs avec tous les roles."

---

## SLIDE 8 — Demo : Application mobile (1 minute 30)

**Titre :** Application mobile — React Native / Expo

**Contenu visuel :**
- Si prototype existant : demo live sur emulateur ou telephone
- Sinon : maquettes/wireframes des ecrans principaux
- Schema d'architecture mobile (migre depuis le dossier)

**Points cles a dire :**
- Architecture cross-platform iOS/Android via Expo
- Meme API REST que le web (pas de duplication backend)
- Ecrans principaux : accueil, ressources, detail, connexion, profil, progression
- Navigation par onglets adaptee au mobile

**Texte oral :**
> "L'application mobile utilise React Native avec Expo pour un deploiement iOS et Android. Elle consomme exactement la meme API que le web — un seul backend pour deux clients. Voici les ecrans principaux..."

---

## SLIDE 9 — Securite : les details techniques (1 minute)

**Titre :** Securite en profondeur

**Contenu visuel :**
- Schema : couches de securite (validation → sanitization → auth → roles → chiffrement)
- Liste des headers HTTP de securite

**Points cles a dire :**
- 6 headers de securite : X-Content-Type-Options nosniff, X-Frame-Options DENY, CSP restrictive, Referrer-Policy, X-XSS-Protection
- Rate limiting : 5 tentatives/minute sur login/register
- Sanitization de toutes les entrees (strip_tags, trim, normalisation)
- Tests de securite : verifications des headers dans les tests feature

**Texte oral :**
> "La securite est implementee en couches. Chaque requete passe par la sanitization, puis la validation, puis l'authentification Sanctum, puis le controle de role. On a aussi ajoute un middleware de headers de securite avec une CSP restrictive et X-Frame-Options DENY contre le clickjacking. Le rate limiting bloque apres 5 tentatives echouees."

---

## SLIDE 10 — Organisation de l'equipe (1 minute)

**Titre :** Notre organisation

**Contenu visuel :**
- Timeline des 4 sprints (S1 Fondations → S2 Coeur → S3 Avance → S4 Polish)
- Schema Git Flow : main ← develop ← feature/*
- Repartition des roles (tableau ou pictogrammes)

**Points cles a dire :**
- 4 sprints d'une semaine chacun
- Git Flow : jamais de push direct sur main/develop, tout passe par PR avec review
- Conventional Commits (feat, fix, docs, test...)
- Squash and merge pour un historique propre

**Texte oral :**
> "On a travaille en 4 sprints. Le premier pour les fondations, le dernier pour les tests et la documentation. Cote Git, tout passe par des Pull Requests avec review obligatoire et on utilise les Conventional Commits."

---

## SLIDE 11 — Bilan et retour d'experience (1 minute)

**Titre :** Ce qui a bien fonctionne

**Contenu visuel :**
- 6 bullet points avec icones de validation

**Points forts a presenter :**
- Architecture MVC stricte avec Laravel : maintenabilite et testabilite
- Securite renforcee : chiffrement, anonymisation RGPD, headers, rate limiting
- Accessibilite RGAA integree des la conception (skip links, ARIA, focus visible)
- 27 tests backend couvrant auth, CRUD, interactions, admin, moderation
- Environnement Docker reproductible entre tous les postes
- Workflow Git structure avec PR et conventions

**Texte oral :**
> "Parmi nos points forts : une architecture MVC stricte qui a facilite les tests — 27 tests backend couvrent tous les parcours. La securite avec le chiffrement des donnees personnelles et l'anonymisation RGPD. Et l'accessibilite RGAA integree des le depart, pas ajoutee apres coup."

---

## SLIDE 12 — Perspectives et ameliorations (1 minute)

**Titre :** Et si on continuait ?

**Contenu visuel :**
- Roadmap visuelle avec 3 phases (Court terme / Moyen terme / Long terme)

**Perspectives a presenter :**

**Court terme :**
- Tests automatises frontend (Jest/Vitest) et E2E (Cypress/Playwright)
- Enrichissement de l'application mobile

**Moyen terme :**
- Messagerie entre participants et invitations
- Export des statistiques (CSV, PDF)
- Pipeline CI/CD (GitHub Actions)

**Long terme :**
- Support multilingue
- Notifications push sur mobile
- Mode hors-ligne partiel

**Texte oral :**
> "Si le projet continuait, notre priorite serait d'ajouter des tests frontend automatises et de completer l'application mobile. A moyen terme, la messagerie entre participants et l'export de statistiques. A plus long terme, le multilingue et les notifications push."

---

## QUESTIONS DU JURY — Points a preparer

### Questions probables et reponses suggerees :

**Q : "Pourquoi avoir choisi l'anonymisation plutot que la suppression physique ?"**
> R : La suppression casserait l'integrite referentielle — les ressources et commentaires de l'utilisateur deviendraient orphelins. L'anonymisation preserve la coherence historique tout en rendant l'identification impossible.

**Q : "Quel est votre niveau de conformite RGAA ?"**
> R : Nous avons implemente les criteres principaux (landmarks, skip links, aria, contraste AAA, focus visible, labels). Le niveau vise est AA mais un audit formel avec axe-core serait necessaire pour le confirmer.

**Q : "Comment gerez-vous la securite des tokens ?"**
> R : Les tokens Sanctum sont stockes en localStorage cote client et dans personal_access_tokens en base. Ils sont revoques a la deconnexion et a l'anonymisation. Le rate limiting protege contre le brute force.

**Q : "Ou en est l'application mobile ?"**
> R : L'architecture est definie et l'API est deja prete a etre consommee par le mobile (memes endpoints que le web). Le developpement mobile est la prochaine etape du backlog.

**Q : "Pourquoi pas de tests frontend ?"**
> R : Nous avons priorise la couverture backend ou les tests ont le plus d'impact (auth, securite, integrite des donnees). Les tests frontend E2E sont dans nos perspectives d'amelioration.

**Q : "Comment fonctionne le chiffrement des emails si vous ne pouvez pas les chercher ?"**
> R : On stocke un email_hash (SHA-256 de l'email normalise en minuscules) qui sert de cle de recherche. L'email chiffre n'est dechiffre qu'a l'affichage, jamais pour la recherche.

---

## CHECKLIST AVANT LA SOUTENANCE

- [ ] Docker Compose lance et fonctionnel (`docker compose up -d --build`)
- [ ] Base de donnees seedee (`docker compose exec api php artisan migrate:fresh --seed --force`)
- [ ] Comptes de demo prets : superadmin@ressources.local / citizen1@ressources.local (mdp: password123)
- [ ] Navigateur ouvert avec les pages cles en onglets
- [ ] PowerPoint teste en mode presentation
- [ ] Backup : captures d'ecran au cas ou Docker ne fonctionne pas le jour J
- [ ] Chronometre : 20 minutes max, prevoir 2 min de marge
- [ ] Chaque membre connait sa partie et les transitions

## REPARTITION DU TEMPS DE PAROLE

| Membre | Slides | Duree | Sujet |
|--------|--------|-------|-------|
| Tous | 1 | 0:30 | Presentation |
| Membre 1 | 2-4 | 4:00 | Contexte, analyse fonctionnelle, analyse valeur |
| Membre 2 | 5, 9 | 2:30 | Choix techniques, securite |
| Membre 3 | 6-7 | 5:00 | Demo front-office + back-office |
| Membre 4 | 8 | 1:30 | Demo mobile |
| Membre 1-2 | 10 | 1:00 | Organisation |
| Membre 3-4 | 11-12 | 2:00 | Bilan, perspectives |
| **Total** | | **~17 min** | Marge de 3 min pour transitions |
