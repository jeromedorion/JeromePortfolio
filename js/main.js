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
