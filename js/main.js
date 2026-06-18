// ==========================================================
// PORTFOLIO — JÉRÔME DORION
// Script principal : animations d'apparition au défilement
// ==========================================================

// Signale que le JS est actif : le CSS ne cache les éléments
// .reveler que dans ce cas (voir style.css).
document.documentElement.classList.add("js");

const elements = document.querySelectorAll(".reveler");

function toutReveler() {
  elements.forEach((el) => el.classList.add("visible"));
}

try {
  // Fait apparaître en douceur les éléments quand ils entrent dans la fenêtre
  const observateur = new IntersectionObserver(
    (entrees) => {
      entrees.forEach((entree) => {
        if (entree.isIntersecting) {
          entree.target.classList.add("visible");
          observateur.unobserve(entree.target); // une seule fois
        }
      });
    },
    { threshold: 0.12 }
  );

  elements.forEach((el) => observateur.observe(el));

  // Filet de sécurité : après 1 seconde, on révèle tout ce qui est
  // déjà dans l'écran, au cas où l'observateur n'aurait pas réagi.
  setTimeout(() => {
    elements.forEach((el) => {
      const r = el.getBoundingClientRect();
      if (r.top < window.innerHeight && r.bottom > 0) {
        el.classList.add("visible");
      }
    });
  }, 1000);
} catch (e) {
  // En cas de pépin, on affiche tout : le contenu passe avant l'animation.
  toutReveler();
}

// Met l'année courante dans le pied de page
const annee = document.querySelector("[data-annee]");
if (annee) {
  annee.textContent = new Date().getFullYear();
}

// ==========================================================
// Décompte animé des statistiques (.stat .chiffre)
// Le chiffre part de 0 et monte rapidement jusqu'à sa valeur
// réelle quand la carte entre dans l'écran, avec une
// décélération en fin de course. Joue une seule fois.
// ==========================================================
const chiffres = document.querySelectorAll(".stat .chiffre");
const mouvementReduit = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

if (chiffres.length > 0 && "IntersectionObserver" in window && !mouvementReduit) {
  const animerChiffre = (el) => {
    const m = el.textContent.trim().match(/^(\d+)([\s\S]*)$/);
    if (!m) return; // pas un chiffre : on ne touche à rien
    const cible = parseInt(m[1], 10);
    const suffixe = m[2]; // ex. : " %"
    const duree = 1700;   // millisecondes
    const debut = performance.now();

    const etape = (maintenant) => {
      const progres = Math.min((maintenant - debut) / duree, 1);
      // décélération marquée : le décompte ralentit tôt et
      // approche doucement du nombre final
      const decelere = 1 - Math.pow(1 - progres, 5);
      el.textContent = Math.round(cible * decelere) + suffixe;
      if (progres < 1) requestAnimationFrame(etape);
    };
    requestAnimationFrame(etape);
  };

  const observateurChiffres = new IntersectionObserver(
    (entrees) => {
      entrees.forEach((entree) => {
        if (entree.isIntersecting) {
          animerChiffre(entree.target);
          observateurChiffres.unobserve(entree.target); // une seule fois
        }
      });
    },
    { threshold: 0.6 }
  );

  chiffres.forEach((c) => observateurChiffres.observe(c));
}

// ==========================================================
// Points et légende reliés, dans les deux sens :
// - survol d'un point -> sa description est mise en évidence
// - survol d'une description -> son point grossit
// ==========================================================
document.querySelectorAll(".point-survol").forEach((point) => {
  const cible = document.getElementById(point.dataset.cible);
  if (!cible) return;
  const legende = cible.closest(".legende-annotations");

  // point -> description
  const activer = () => {
    legende.classList.add("survol-actif");
    cible.classList.add("surligne");
  };
  const desactiver = () => {
    legende.classList.remove("survol-actif");
    cible.classList.remove("surligne");
  };
  point.addEventListener("mouseenter", activer);
  point.addEventListener("mouseleave", desactiver);
  point.addEventListener("focus", activer); // accessible au clavier
  point.addEventListener("blur", desactiver);

  // description -> point
  cible.addEventListener("mouseenter", () => point.classList.add("surligne"));
  cible.addEventListener("mouseleave", () => point.classList.remove("surligne"));
});

// ==========================================================
// Sommaire collant (.sommaire) des pages projets
// Construit automatiquement à partir des titres <h2> des
// sections, et surligne la section visible au défilement.
// ==========================================================
const sommaire = document.querySelector(".sommaire");

if (sommaire) {
  const sections = document.querySelectorAll(".contenu-projet .bloc h2");

  sections.forEach((titre, i) => {
    const section = titre.closest("section");

    // identifiant d'ancre à partir du titre (sans accents ni espaces)
    if (!section.id) {
      section.id = titre.textContent
        .toLowerCase()
        .normalize("NFD")
        .replace(/[̀-ͯ]/g, "") // retire les accents
        .replace(/[^a-z0-9]+/g, "-")     // espaces et symboles -> tirets
        .replace(/^-|-$/g, "");
    }

    const lien = document.createElement("a");
    lien.href = "#" + section.id;
    lien.textContent = titre.textContent;
    sommaire.appendChild(lien);
  });

  // Surligne le lien de la section actuellement à l'écran
  if ("IntersectionObserver" in window) {
    const observateurSommaire = new IntersectionObserver(
      (entrees) => {
        entrees.forEach((entree) => {
          if (entree.isIntersecting) {
            sommaire.querySelectorAll("a").forEach((a) => {
              a.classList.toggle(
                "actif",
                a.getAttribute("href") === "#" + entree.target.id
              );
            });
          }
        });
      },
      // la section "active" est celle dans le tiers supérieur de l'écran
      { rootMargin: "-15% 0px -70% 0px" }
    );

    sections.forEach((titre) =>
      observateurSommaire.observe(titre.closest("section"))
    );
  }
}

// ==========================================================
// Vidéos d'animation (.video-defilement)
// Lecture automatique quand la vidéo entre dans l'écran,
// pause quand elle en sort, et reprise du début à chaque retour.
// ==========================================================
const videos = document.querySelectorAll(".video-defilement");

if (videos.length > 0 && "IntersectionObserver" in window) {
  const observateurVideos = new IntersectionObserver(
    (entrees) => {
      entrees.forEach((entree) => {
        const video = entree.target;
        if (entree.isIntersecting) {
          video.currentTime = 0; // on repart du début à chaque apparition

          if (video.dataset.son === "oui") {
            // Vidéo avec son : on tente la lecture audio ; si le
            // navigateur la refuse (aucune interaction encore), on
            // se rabat sur la lecture en sourdine.
            video.muted = false;
            video.play().catch(() => {
              video.muted = true;
              video.play().catch(() => {});
            });
          } else {
            const lecture = video.play();
            if (lecture) {
              lecture.catch(() => {}); // ignore un éventuel refus du navigateur
            }
          }
        } else {
          video.pause();
        }
      });
    },
    { threshold: 0.4 } // démarre quand 40 % de la vidéo est visible
  );

  videos.forEach((v) => observateurVideos.observe(v));
}


// ==========================================================
// Rideau de transition entre les pages
// Au clic sur un lien interne, un panneau noir monte pour couvrir
// l'écran (avec le nom de la destination) avant la navigation. À
// l'arrivée, le CSS le fait monter pour révéler la nouvelle page.
// ==========================================================
const rideau = document.querySelector(".rideau");
const mouvementReduitRideau = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

if (rideau && !mouvementReduitRideau) {
  const nomRideau = rideau.querySelector(".rideau-nom");
  const noms = {
    "index.html": "Accueil",
    "": "Accueil",
    "radio-canada.html": "Radio-Canada",
    "remi.html": "R\u00e9mi",
    "safeway.html": "Safeway",
  };
  const nomPour = (url) => {
    const fichier = url.pathname.split("/").pop() || "index.html";
    return noms[fichier] || "";
  };

  document.addEventListener("click", (e) => {
    // uniquement un clic gauche simple, sans touche de modification
    if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;

    const lien = e.target.closest("a");
    if (!lien) return;

    const href = lien.getAttribute("href");
    if (!href) return;
    // on laisse passer : ancres internes, courriel, téléphone, nouvel onglet
    if (href.startsWith("#") || href.startsWith("mailto:") || href.startsWith("tel:")) return;
    if (lien.target === "_blank") return;

    let dest;
    try {
      dest = new URL(lien.href, window.location.href);
    } catch (err) {
      return;
    }
    // uniquement les liens du même site
    if (dest.origin !== window.location.origin) return;
    // on ne saute que les ancres internes (même page AVEC un #, ex. #projets) :
    // elles font défiler la page. Un lien vers la même page SANS ancre (ex. le
    // logo « JD » quand on est déjà sur l'accueil) joue la transition complète.
    if (dest.pathname === window.location.pathname && dest.search === window.location.search && dest.hash) return;

    // vraie navigation interne : on joue le rideau puis on change de page
    e.preventDefault();
    // mémorise que la page suivante est atteinte par navigation interne :
    // le rideau de l'accueil affichera « Accueil » (et non « Bonjour », qui
    // est réservé à la première arrivée directe sur le site).
    try { sessionStorage.setItem("transitionInterne", "1"); } catch (err) {}
    if (nomRideau) nomRideau.textContent = nomPour(dest);

    rideau.classList.add("rideau--sortie"); // joue l'animation de sortie (montée + étirement + rebond)

    setTimeout(() => {
      window.location.href = lien.href;
    }, 950);
  });
}


// ==========================================================
// Espace sous la section « barres de navigation »
// La 2e annotation y est détachée du flux (position absolue), donc son
// texte déborde sous les maquettes sans pousser le contenu. On mesure
// ce débordement et on l'ajoute en marge basse de la comparaison : le
// footer descend ainsi exactement sous le texte, et suit s'il s'allonge.
// Recalculé au chargement et au redimensionnement.
// ==========================================================
function ajusterEspaceBarresNav() {
  document.querySelectorAll(".trois-maquettes").forEach((comp) => {
    const ancre = comp.querySelector(".annotation-point.ancre-bas");
    if (!ancre) return;

    // en format empilé l'annotation revient dans le flux : aucune réserve
    if (getComputedStyle(ancre).position !== "absolute") {
      comp.style.marginBottom = "";
      return;
    }

    const bas = comp.getBoundingClientRect().bottom;
    const basTexte = ancre.getBoundingClientRect().bottom;
    const debordement = basTexte - bas;
    comp.style.marginBottom = debordement > 0 ? Math.ceil(debordement + 32) + "px" : "";
  });
}

if (document.querySelector(".trois-maquettes .annotation-point.ancre-bas")) {
  window.addEventListener("load", ajusterEspaceBarresNav);
  // mise à jour synchronisée avec l'affichage (une fois par image) :
  // le footer suit le texte de façon fluide, sans délai
  let rafEspaceNav = null;
  window.addEventListener("resize", () => {
    if (rafEspaceNav) cancelAnimationFrame(rafEspaceNav);
    rafEspaceNav = requestAnimationFrame(ajusterEspaceBarresNav);
  });
  ajusterEspaceBarresNav();
  setTimeout(ajusterEspaceBarresNav, 300); // après chargement des polices/images
}


// ==========================================================
// Zoom doux du header des pages projet au défilement
// L'image grandit légèrement à mesure qu'on défile (jusqu'à +12 %),
// clippée dans son cadre. Synchronisé à l'affichage (rAF) pour rester
// fluide ; désactivé si l'utilisateur a demandé de réduire les animations.
// ==========================================================
const heroProjet = document.querySelector(".projet-hero");
const heroProjetImg = heroProjet ? heroProjet.querySelector("img") : null;
const mouvementReduitZoom = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

if (heroProjetImg && !mouvementReduitZoom) {
  let enAttente = false;
  const majZoom = () => {
    enAttente = false;
    const hauteur = heroProjet.offsetHeight || 1;
    const progres = Math.min(Math.max(window.scrollY / hauteur, 0), 1);
    const echelle = 1 + progres * 0.12; // zoom progressif jusqu'à 1.12
    heroProjetImg.style.transform = "scale(" + echelle + ")";
  };
  window.addEventListener("scroll", () => {
    if (!enAttente) {
      enAttente = true;
      requestAnimationFrame(majZoom);
    }
  }, { passive: true });
  majZoom();
}


// ==========================================================
// Effet de défilement du hero d'accueil (nom + phrase)
// En descendant, le nom monte doucement et s'efface ; la phrase suit un
// peu moins vite. Synchronisé à l'affichage (rAF). L'animation d'entrée
// utilise le remplissage « backwards », donc une fois jouée ces styles
// inline reprennent la main sans accroc.
// ==========================================================
const heroAccueil = document.querySelector(".hero");
const heroNom = heroAccueil ? heroAccueil.querySelector("h1") : null;
const heroPhrase = heroAccueil ? heroAccueil.querySelector(".hero-phrase") : null;
const mouvementReduitHero = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

if (heroNom && !mouvementReduitHero) {
  let enAttenteHero = false;
  const majHero = () => {
    enAttenteHero = false;
    // progression sur ~65 % de la hauteur de l'écran
    const progres = Math.min(Math.max(window.scrollY / (window.innerHeight * 0.65), 0), 1);
    const opacite = 1 - progres;
    heroNom.style.opacity = opacite;
    heroNom.style.transform = "translateY(" + (-progres * 90) + "px)";
    if (heroPhrase) {
      heroPhrase.style.opacity = opacite;
      heroPhrase.style.transform = "translateY(" + (-progres * 70) + "px)";
    }
  };
  window.addEventListener("scroll", () => {
    if (!enAttenteHero) {
      enAttenteHero = true;
      requestAnimationFrame(majHero);
    }
  }, { passive: true });
  majHero();
}


// ==========================================================
// Curseur personnalisé « Voir » sur les liens « Voir un autre projet »
// Un rond noir avec « Voir » qui suit la souris et apparaît au survol des
// liens. Uniquement sur les appareils à vrai pointeur (pas tactile).
// ==========================================================
const liensAutreProjet = document.querySelectorAll(".autres-projets .liens a, .carte-projet");
if (liensAutreProjet.length > 0 && window.matchMedia("(hover: hover)").matches) {
  const curseurVoir = document.createElement("div");
  curseurVoir.className = "curseur-voir";
  curseurVoir.textContent = "Voir";
  curseurVoir.setAttribute("aria-hidden", "true");
  document.body.appendChild(curseurVoir);

  // cible = position de la souris ; pos = position lissée du rond, qui
  // glisse vers la souris avec un très léger retard (0.22 : plus haut =
  // colle davantage à la souris, plus bas = plus de traîne).
  let cibleX = window.innerWidth / 2, cibleY = window.innerHeight / 2;
  let posX = cibleX, posY = cibleY;
  window.addEventListener("mousemove", (e) => {
    cibleX = e.clientX;
    cibleY = e.clientY;
  }, { passive: true });

  const suivreVoir = () => {
    posX += (cibleX - posX) * 0.22;
    posY += (cibleY - posY) * 0.22;
    curseurVoir.style.left = posX + "px";
    curseurVoir.style.top = posY + "px";
    requestAnimationFrame(suivreVoir);
  };
  requestAnimationFrame(suivreVoir);

  liensAutreProjet.forEach((lien) => {
    lien.addEventListener("mouseenter", () => curseurVoir.classList.add("actif"));
    lien.addEventListener("mouseleave", () => curseurVoir.classList.remove("actif"));
  });
}


// ==========================================================
// Menu déroulant (petit écran)
// Le bouton hamburger ouvre/ferme la liste des liens. « EN » n'en fait
// pas partie : il reste visible à part dans la barre.
// ==========================================================
const navBascule = document.querySelector(".nav-bascule");
const navMenu = document.querySelector(".nav-liens");
if (navBascule && navMenu) {
  const fermer = () => {
    navMenu.classList.remove("ouvert");
    navBascule.classList.remove("ouvert");
    navBascule.setAttribute("aria-expanded", "false");
  };
  navBascule.addEventListener("click", () => {
    const ouvert = navMenu.classList.toggle("ouvert");
    navBascule.classList.toggle("ouvert", ouvert);
    navBascule.setAttribute("aria-expanded", ouvert ? "true" : "false");
  });
  // Un clic sur un lien referme le menu
  navMenu.querySelectorAll("a").forEach((a) => a.addEventListener("click", fermer));
}


// ==========================================================
// « Me contacter » dans le menu replié : tap pour déplier Courriel + LinkedIn.
// (Sur grand écran, l'ouverture se fait au survol, gérée par le CSS.)
// ==========================================================
const contactBouton = document.querySelector(".nav-contact-bouton");
const contactVolet = document.querySelector(".nav-contact-volet");
if (contactBouton && contactVolet) {
  const basculerContact = () => {
    const ouvert = contactVolet.classList.toggle("ouvert");
    contactBouton.setAttribute("aria-expanded", ouvert ? "true" : "false");
  };
  contactBouton.addEventListener("click", basculerContact);
  contactBouton.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      basculerContact();
    }
  });
}
