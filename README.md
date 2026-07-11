# Pays Basque Open Data — POC

POC d'architecture pour le portail Open Data du Pays Basque (migration OpenDataSoft → Koumoul).

## Concept

Ce projet adopte une architecture **hybride React + HTML statique** répondant à deux besoins distincts :

- **Équipe dev :** Une SPA React + Vite pour le socle commun (page d'accueil, navigation, thèmes).
- **Client non-dev :** Le client crée et maintient ses pages "Observatoires" en écrivant du HTML pur dans `public/observatoires/`, sans toucher au code React ni déclencher de build.

Les widgets de visualisation (`umami-context`, `umami-chart`, etc.) sont des Web Components servis comme assets statiques, utilisables directement dans les pages HTML du client.

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
├── vite.config.js                  # Configuration Vite
├── package.json
├── librairieUmami/                 # Librairie source des Web Components (ne pas modifier)
│   ├── umami-context.js
│   ├── umami-aggregation.js
│   ├── umami-filter.js
│   └── umami-chart.js
├── public/                         # Fichiers servis statiquement (hors React)
│   ├── style.css                   # Feuille de style globale (React + pages HTML)
│   ├── components/                 # Web Components prêts à l'emploi
│   │   ├── umami-context.js
│   │   ├── umami-aggregation.js
│   │   ├── umami-filter.js
│   │   └── umami-chart.js
│   └── observatoires/              # ← ZONE CLIENT (HTML pur, sans build)
│       ├── index.json              # Registre des observatoires (lu par React)
│       ├── arbres-remarquables.html
│       └── climat.html
└── src/
    ├── main.jsx                    # Bootstrap React
    ├── App.jsx                     # Page d'accueil (nav + hero + cards)
    └── components/
        └── ObservatoireCards.jsx   # Grille des observatoires (chargée depuis index.json)
```

## Ajouter un observatoire (côté client)

1. Créer `public/observatoires/mon-observatoire.html` en copiant un fichier existant.
2. Ajouter une entrée dans `public/observatoires/index.json` :

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
| `<umami-context>` | Déclare la source de données (domaine + dataset) |
| `<umami-aggregation>` | Affiche un KPI (somme, moyenne, compte…) |
| `<umami-chart>` | Affiche un graphique (`bar`, `line`, `pie`) |
| `<umami-filter>` | Ajoute un filtre interactif par champ |

## Stack technique

- **React + Vite** — SPA pour le socle commun
- **Web Components** — widgets `umami-*` (graphiques, agrégations, filtres)
- **HTML statique** — pages observatoires maintenues par le client
- **Hébergement cible** — Clever Cloud (application Static)
