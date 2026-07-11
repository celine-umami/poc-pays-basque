import ObservatoireCards from './components/ObservatoireCards.jsx'

export default function App() {
  return (
    <>
      <nav className="nav">
        <div className="nav-inner">
          <a href="/" className="nav-brand">
            Pays Basque <span>Open Data</span>
          </a>
          <ul className="nav-links">
            <li><a href="/">Accueil</a></li>
            <li><a href="#observatoires">Observatoires</a></li>
            <li>
              <a href="https://koumoul.com" target="_blank" rel="noopener noreferrer">
                Catalogue
              </a>
            </li>
          </ul>
        </div>
      </nav>

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

      <footer className="footer">
        <p>© {new Date().getFullYear()} Pays Basque Open Data — Propulsé par Koumoul</p>
      </footer>
    </>
  )
}
