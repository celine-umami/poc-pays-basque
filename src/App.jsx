import ObservatoireCards from './components/ObservatoireCards.jsx'
import { HOME_NAV_HTML, FOOTER_HTML } from '../shared/layout.js'

export default function App() {
  return (
    <>
      {/* Nav et footer injectés depuis la source unique : public/shared/layout.js */}
      <div dangerouslySetInnerHTML={{ __html: HOME_NAV_HTML }} style={{ display: 'contents' }} />

      <header className="hero">
        <div className="hero-inner">
          <h1>
            Bienvenue sur le portail<br />
            <span>Open Data</span> du Pays Basque
          </h1>
          <p>
            Explorez les données ouvertes de notre territoire : environnement, mobilité,
            économie et bien plus encore.
          </p>
        </div>
      </header>

      <main id="observatoires" className="section">
        <div className="section-header">
          <h2>Nos Observatoires</h2>
          <p>Chaque observatoire regroupe des visualisations interactives autour d'une thématique.</p>
        </div>
        <ObservatoireCards />
      </main>

      <div dangerouslySetInnerHTML={{ __html: FOOTER_HTML }} style={{ display: 'contents' }} />
    </>
  )
}
