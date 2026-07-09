# poc-pays-basque

POC de migration dataviz — Architecture Astro + React + Lit.js pour le portail Open Data du Pays Basque.

## Structure du projet

```
pays-basque/
├── astro.config.mjs          # Configuration Astro (React + Tailwind)
├── tailwind.config.mjs       # Configuration Tailwind CSS
├── package.json
├── librairieUmami/           # Librairie source des Web Components Lit (référence)
│   ├── umami-context.js
│   ├── umami-aggregation.js
│   ├── umami-filter.js
│   └── umami-chart.js
├── public/
│   └── components/           # Web Components Lit servis comme assets statiques
│       ├── umami-context.js
│       ├── umami-aggregation.js
│       ├── umami-filter.js
│       └── umami-chart.js
└── src/
    ├── layouts/
    │   └── Layout.astro      # Layout HTML de base
    ├── components/
    │   └── ObservatoireCards.jsx  # Composant React — grille des observatoires
    └── pages/
        ├── index.astro       # Page socle commun (navbar + hero + cards)
        └── observatoires/
            └── arbres-remarquables.astro  # Page observatoire avec Lit WC
```

## Pages

| URL | Description |
|-----|-------------|
| `/` | Socle commun : navbar, hero, grille des 3 observatoires |
| `/observatoires/arbres-remarquables` | Dataviz Lit — arbres remarquables de Paris |

## Commandes

```bash
# Développement local
npm run dev

# Build de production (dossier dist/)
npm run build

# Prévisualiser le build
npm run preview
```

## Stack technique

- **Astro** — framework de pages statiques
- **React** — composant `ObservatoireCards` (grille des cards)
- **Lit.js** — Web Components `umami-*` (graphiques, agrégations, filtres)
- **Tailwind CSS** — styles utilitaires
- **Hébergement cible** — Clever Cloud (application Static)

