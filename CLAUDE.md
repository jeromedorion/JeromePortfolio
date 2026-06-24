# Portfolio de Jérôme Dorion

Portfolio de designer d'interaction, transféré depuis Framer et codé à la main.
Site original : https://jeromedorionportfolio.framer.website/

## Communication

- **Toujours commencer chaque réponse par le prénom de Jérôme** (ex. « Jérôme, … »).

## Structure

- `index.html` — accueil (hero centré, cartes projets, à propos, footer)
- `projets/` — études de cas : radio-canada.html, remi.html, safeway.html
- `css/style.css` — toute la mise en forme (variables CSS en haut du fichier)
- `js/main.js` — animations d'apparition au défilement (classe `.reveler`)

## Conventions de design (décisions de Jérôme — à respecter)

- **Deux typos maximum** : Manrope (titres + texte) et IBM Plex Mono (tags,
  étiquettes, chiffres, temps de lecture, barre latérale). AUCUN italique.
- **Palette noir et blanc strict** : fond blanc pur, texte noir, gris neutres.
  Pas d'orange, pas de beige, pas de couleur d'accent.
- **Coins carrés partout** : `--rayon: 0`. Aucun coin arrondi.
- **Barre latérale noire fixe à droite** (96px) : « Contact » en haut et
  « EN » en bas, tous deux en texte vertical. Elle suit le scroll.
  Sur mobile elle passe en barre horizontale en bas.
- Cartes projets : photo à gauche, nom du projet en gros à droite,
  question en plus petit, tags mono, temps de lecture avec icône de livre.
- Code et commentaires en français.

## Composants des pages projets (état actuel)

- Sommaire collant à gauche (`.sommaire`, généré par main.js depuis les h2),
  sections numérotées automatiquement « (01) » par compteur CSS.
- Comparaisons Avant/Après (`.comparaison-annotee` + `.trois-col`/`.quatre-col`) :
  maquettes PNG sans ombre, ratio 0.483, exports dans photos-a-trier/Radio-Canada/.
- Annotations (`.annotation-point` + `.ligne` ou `.coude`) : EN FLUX NORMAL
  (jamais position:absolute, sinon chevauchements). Ancrage vertical par
  --marge en % de la largeur de colonne. Point collé à la maquette,
  flèche vers le titre. Réglages fins faits à l'œil avec Jérôme.
- Parcours utilisateurs (`.parcours`) : texte + constats à pastilles rouges
  #e45a4b (couleur des schémas), schéma PNG à droite.
- Stats animées (décompte de 0 à la valeur, main.js), vidéos Rémi
  auto-lecture au défilement (la 2e avec son), mosaïque photos Rémi.
- ATTENTION : bug récurrent de fichiers tronqués/corrompus en fin de fichier
  (octets nuls). Si une page « casse » (sommaire disparu, vidéos mortes),
  vérifier que le fichier se termine bien par </html> et que la balise
  <script> est présente.

## À faire (idées en attente)

- Créer la version anglaise (le bouton EN de la barre latérale pointe
  vers `#` en attendant).
- Optimiser le poids des images d'assets/ avant la mise en ligne
  (~89 Mo au total, certains PNG font 5-15 Mo).

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
