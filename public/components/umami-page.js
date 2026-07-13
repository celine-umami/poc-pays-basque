// Importe automatiquement tous les composants Umami —
// le client n'a plus besoin de les déclarer lui-même.
import './umami-context.js';
import './umami-aggregation.js';
import './umami-filter.js';
import './umami-chart.js';

// Source unique de vérité pour nav et footer (partagée avec React)
import { OBS_NAV_HTML, FOOTER_HTML } from '/shared/layout.js';

class UmamiPage extends HTMLElement {
  connectedCallback() {
    const title       = this.getAttribute('title') || '';
    const description = this.getAttribute('description') || '';

    // --- <head> : charset, viewport, titre, styles ---
    document.documentElement.lang = 'fr';

    if (!document.querySelector('meta[charset]')) {
      const meta = document.createElement('meta');
      meta.setAttribute('charset', 'UTF-8');
      document.head.insertAdjacentElement('afterbegin', meta);
    }

    if (!document.querySelector('meta[name="viewport"]')) {
      const meta = document.createElement('meta');
      meta.name    = 'viewport';
      meta.content = 'width=device-width, initial-scale=1.0';
      document.head.appendChild(meta);
    }

    document.title = title ? `${title} — Pays Basque Open Data` : 'Pays Basque Open Data';

    if (!document.querySelector('link[href="/style.css"]')) {
      const link = document.createElement('link');
      link.rel  = 'stylesheet';
      link.href = '/style.css';
      document.head.appendChild(link);
    }

    // --- Sauvegarde du contenu fourni par le client (<section>…) ---
    const sections = Array.from(this.childNodes);

    // --- Structure de la page ---
    this.innerHTML = `
      ${OBS_NAV_HTML}
      <header class="obs-header">
        <div class="obs-header-inner">
          <p class="label">Observatoire</p>
          <h1></h1>
          <p></p>
        </div>
      </header>
      <main class="obs-content"></main>
      ${FOOTER_HTML}
    `;

    // textContent évite toute injection HTML accidentelle
    this.querySelector('.obs-header-inner h1').textContent       = title;
    this.querySelector('.obs-header-inner p:last-child').textContent = description;

    // --- Réinjection du contenu client dans le <main> ---
    const main = this.querySelector('main');
    sections.forEach(node => main.appendChild(node));
  }
}

// display:contents rend l'élément transparent au layout :
// nav/header/main/footer se comportent comme des enfants directs de <body>
const style = document.createElement('style');
style.textContent = 'umami-page { display: contents; }';
document.head.appendChild(style);

customElements.define('umami-page', UmamiPage);
