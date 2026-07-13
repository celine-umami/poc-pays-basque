/**
 * Source unique de vérité pour la nav et le footer.
 *
 * Ce fichier est importé par deux contextes différents :
 *   - Les web components  → import ES module URL  : import { … } from '/shared/layout.js'
 *   - React / Vite build  → import relatif        : import { … } from '../shared/layout.js'
 *
 * Pour modifier nav ou footer, ne changer QUE ce fichier.
 */

// Nav de la page d'accueil (avec les liens de navigation)
export const HOME_NAV_HTML = `
<nav class="nav">
  <div class="nav-inner">
    <a href="/" class="nav-brand">Pays Basque <span>Open Data</span></a>
    <ul class="nav-links">
      <li><a href="/">Accueil</a></li>
      <li><a href="#observatoires">Observatoires</a></li>
      <li><a href="https://koumoul.com" target="_blank" rel="noopener noreferrer">Catalogue</a></li>
    </ul>
  </div>
</nav>`;

// Nav des pages observatoires (avec le lien retour)
export const OBS_NAV_HTML = `
<nav class="nav">
  <div class="nav-inner">
    <a href="/" class="nav-brand">Pays Basque <span>Open Data</span></a>
    <a href="/" class="nav-back">← Tous les observatoires</a>
  </div>
</nav>`;

// Footer commun à toutes les pages
// new Date().getFullYear() s'évalue au runtime navigateur dans les deux cas
export const FOOTER_HTML = `
<footer class="footer">
  <p>© ${new Date().getFullYear()} Pays Basque Open Data — Propulsé par Koumoul</p>
</footer>`;
