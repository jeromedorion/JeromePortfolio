# Portfolio de Jérôme Dorion

Portfolio de designer d'interaction, transféré depuis Framer et codé à la main.
Site original : https://jeromedorionportfolio.framer.website/

## Communication

- **Toujours commencer chaque réponse par le prénom de Jérôme** (ex. « Jérôme, … »).

## Structure

- `index.html` — accueil (nav, hero pleine largeur, cartes projets, à propos, footer)
- `projets/` — études de cas : radio-canada.html, remi.html, safeway.html
- `css/style.css` — toute la mise en forme (variables CSS en haut du fichier)
- `js/main.js` — tout le comportement (révélations au scroll, rideau, menus…)

## Conventions de design (décisions de Jérôme — à respecter)

- **Typos** : Manrope (titres + texte), IBM Plex Mono (tags, étiquettes,
  chiffres, temps de lecture) et Anton (`--police-display`, réservé au grand
  nom du hero d'accueil). AUCUN italique.
- **Palette noir et blanc strict** : fond blanc cassé (#fafafa), texte noir,
  gris neutres. Pas de couleur d'accent (seule exception : le rouge #e45a4b
  des schémas/pastilles des pages projets).
- **Coins carrés partout** : `--rayon: 0`. Aucun coin arrondi.
- Cartes projets : photo à gauche, nom du projet en gros à droite,
  question en plus petit, tags mono, temps de lecture avec icône de livre.
- Code et commentaires en français.

## Navigation et accueil (état actuel)

- **Barre de nav fixe en haut** (l'ancienne barre latérale noire n'existe plus) :
  logo « JD », rôle animé au survol (Designer d'interaction ⇄ Jérôme Dorion),
  liens Projets / À propos / Contact (volet Courriel + LinkedIn) / CV (téléchargement),
  bouton « English » à droite (pointe vers `#` en attendant).
  Sous 900px : menu hamburger (English reste visible à part).
- **Pop-up Projets** : au survol du lien « Projets », panneau sous la nav
  avec les 3 projets (photo, titre, question, tags, durée). Clic = repli tactile.
- **Rideau de transition** entre les pages (panneau noir + nom de la destination) :
  « Bonjour » à la première arrivée sur le site, sinon nom de la page
  (drapeau `transitionInterne` en sessionStorage).
- **Hero d'accueil** : nom dimensionné par JS pour remplir exactement
  la largeur de la nav (mesure canvas + DOM) ; le nom s'estompe en montant
  au défilement. Sous le nom : onglets « À propos » (Présentation / Parcours /
  Objectifs / Intérêts), barre segmentée façon Arestov, un panneau visible
  à la fois (bascule dans main.js, fondu CSS panneau-fondu). L'ancienne
  phrase d'intro du hero a été retirée.
- **Curseur « Voir »** : rond noir qui suit la souris sur les cartes projets
  et les liens « Voir un autre projet » (appareils à pointeur seulement).

## Composants des pages projets (état actuel)

- Sommaire collant à gauche (`.sommaire`, généré par main.js depuis les h2),
  sections numérotées automatiquement « (01) » par compteur CSS.
- Comparaisons Avant/Après (`.comparaison-annotee` + `.trois-col`/`.quatre-col`) :
  maquettes PNG sans ombre, ratio 0.483, exports dans photos-a-trier/Radio-Canada/.
- Annotations (`.annotation-point` + `.ligne` ou `.coude`) : EN FLUX NORMAL
  (jamais position:absolute, sinon chevauchements — seule exception : l'annotation
  `.ancre-bas` de `.trois-maquettes`, dont le débordement est compensé par JS).
  Ancrage vertical par --marge en % de la largeur de colonne. Point collé à la
  maquette, flèche vers le titre. Réglages fins faits à l'œil avec Jérôme.
- Parcours utilisateurs (`.parcours`) : texte + constats à pastilles rouges
  #e45a4b (couleur des schémas), schéma PNG à droite.
- Stats animées (décompte de 0 à la valeur, main.js), vidéos Rémi
  auto-lecture au défilement (la 2e avec son), mosaïque photos Rémi.
- ATTENTION : bug récurrent de fichiers tronqués/corrompus en fin de fichier
  (octets nuls). Si une page « casse » (sommaire disparu, vidéos mortes),
  vérifier que le fichier se termine bien par </html> et que la balise
  <script> est présente.

## À faire (idées en attente)

- Créer la version anglaise (le bouton « English » de la nav pointe
  vers `#` en attendant).
- Optimiser le poids des images d'assets/ avant la mise en ligne
  (~117 Mo au total, certains PNG font 5-15 Mo).
- Nettoyer les polices inutilisées chargées dans index.html
  (Oswald, DM Mono, Iosevka Charon Mono — seuls Manrope, IBM Plex Mono
  et Anton servent).
- Trancher le TEST en cours : `--police-accent` est à Manrope
  (au lieu d'IBM Plex Mono) — garder ou annuler.

## Images

- Toutes les images et les 2 vidéos de démo sont locales dans `assets/`
  (radio-canada/, remi/, safeway/), vérifiées identiques aux originaux Framer.
- Seule la grosse vidéo de présentation de Rémi (285 Mo) reste hébergée
  à distance (r2.dev).
- `photos-a-trier/` contient les originaux de Jérôme, dont certains
  pas encore utilisés sur le site — ne pas supprimer.

## Publication (état)

- Dépôt Git créé et publié sur GitHub via GitHub Desktop.
- Flux de travail : modifications → Changes → Commit to main → Push origin.
- Reste à faire quand le site sera prêt : activer GitHub Pages
  (Settings → Pages → Deploy from a branch → main → root),
  puis éventuellement acheter un nom de domaine personnalisé.

## Développement

Ouvrir `index.html` avec Live Server (VS Code) pour le rechargement automatique.
Aucun build, aucune dépendance : HTML/CSS/JS pur.
