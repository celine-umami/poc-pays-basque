# Pays Basque Open Data — POC

POC d'architecture pour le portail Open Data du Pays Basque (migration OpenDataSoft → Koumoul).

## Concept

Ce projet adopte une architecture **hybride React + HTML statique** répondant à deux besoins distincts :

- **Équipe dev :** Une SPA React + Vite pour le socle commun (page d'accueil, navigation, thèmes).
- **Client non-dev :** Le client crée et maintient ses pages "Observatoires" en écrivant du HTML minimal dans `public/observatoires/`, sans toucher au code React ni déclencher de build.

Les widgets de visualisation (`umami-context`, `umami-chart`, etc.) sont des Web Components servis comme assets statiques, utilisables directement dans les pages HTML du client. Le composant `<umami-page>` encapsule automatiquement toute la structure de la page (nav, header, footer) — le client n'écrit que le contenu de ses blocs de données.

La nav et le footer sont définis en **source unique** dans `shared/layout.js`, partagé entre React et les Web Components.

## Commandes

```bash
npm run dev      # Démarre le serveur de développement (http://localhost:5173)
npm run build    # Compile pour la production → dist/
npm run preview  # Prévisualise le build de production en local
```

## Structure du projet

```
pays-basque/
├── index.html                      # Point d'entrée Vite pour l'app React
├── vite.config.js                  # Configuration Vite (+ plugin shared-layout)
├── package.json
├── shared/
│   └── layout.js                   # ← Source unique nav + footer (React & Web Components)
├── librairieUmami/                 # Librairie source des Web Components (ne pas modifier)
│   ├── umami-context.js
│   ├── umami-aggregation.js
│   ├── umami-filter.js
│   └── umami-chart.js
├── public/                         # Fichiers servis statiquement (hors React)
│   ├── style.css                   # Feuille de style globale (React + pages HTML)
│   ├── components/                 # Web Components prêts à l'emploi
│   │   ├── umami-page.js           # Layout complet (nav + header + footer) — NE PAS MODIFIER
│   │   ├── umami-context.js
│   │   ├── umami-aggregation.js
│   │   ├── umami-filter.js
│   │   └── umami-chart.js
│   └── observatoires/              # ← ZONE CLIENT (HTML minimal, sans build)
│       ├── index.json              # Registre des observatoires (lu par React)
│       ├── arbres-remarquables.html
│       └── climat.html
└── src/
    ├── main.jsx                    # Bootstrap React
    ├── App.jsx                     # Page d'accueil (nav + hero + cards)
    └── components/
        └── ObservatoireCards.jsx   # Grille des observatoires (chargée depuis index.json)
```

## Source unique de vérité — nav & footer

La nav et le footer sont définis une seule fois dans **`shared/layout.js`**.  
Ce fichier est utilisé par les deux parties du projet :

| Consommateur | Mécanisme |
|---|---|
| `src/App.jsx` (React) | `import '../shared/layout.js'` — bundlé par Vite |
| `public/components/umami-page.js` (Web Component) | `import '/shared/layout.js'` — URL servie par le plugin Vite |

> **Pour modifier la nav ou le footer**, ne changer que `shared/layout.js`.

## Ajouter un observatoire (côté client)

### 1. Créer la page HTML

Créer `public/observatoires/mon-observatoire.html` en copiant un fichier existant.  
La page se résume à un import + un composant `<umami-page>` :

```html
<script type="module" src="/components/umami-page.js"></script>

<umami-page
  title="🗺️ Mon Observatoire"
  description="Description affichée sous le titre.">

  <!-- BLOC 1 -->
  <section class="obs-section">
    <h2>Mon graphique</h2>
    <div class="obs-chart-wrapper">
      <umami-context
        context="ctx"
        ctx-domain="mon-domaine.koumoul.com"
        ctx-dataset="identifiant-du-dataset"
      >
        <umami-chart context="ctx" type="bar" x="CHAMP_X" y="CHAMP_Y" operation="count"></umami-chart>
      </umami-context>
    </div>
  </section>

</umami-page>
```

`<umami-page>` génère automatiquement la nav, le header et le footer.  
Le client n'écrit que les blocs `<section>` à l'intérieur.

### 2. Référencer dans le registre

Ajouter une entrée dans `public/observatoires/index.json` :

```json
{
  "slug": "mon-observatoire",
  "titre": "Mon Observatoire",
  "description": "Description affichée sur la card.",
  "emoji": "🗺️",
  "bannerClass": "card-banner--green",
  "disponible": true
}
```

Les valeurs possibles pour `bannerClass` : `card-banner--green`, `card-banner--blue`, `card-banner--purple`.  
Mettre `"disponible": false` pour afficher la card avec le badge "Bientôt" sans lien.

## Web Components disponibles

| Composant | Rôle |
|---|---|
| `<umami-page>` | Structure complète de la page (nav, header, footer) |
| `<umami-context>` | Déclare la source de données (domaine + dataset) |
| `<umami-aggregation>` | Affiche un KPI (somme, moyenne, compte…) |
| `<umami-chart>` | Affiche un graphique (`bar`, `line`, `pie`) |
| `<umami-filter>` | Ajoute un filtre interactif par champ |

## Stack technique

- **React + Vite** — SPA pour le socle commun
- **Web Components** — widgets `umami-*` (graphiques, agrégations, filtres, layout)
- **HTML statique** — pages observatoires maintenues par le client
- **Hébergement cible** — Clever Cloud (application Static)
