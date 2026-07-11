import { useState, useEffect } from 'react'

export default function ObservatoireCards() {
  const [observatoires, setObservatoires] = useState([])

  useEffect(() => {
    fetch('/observatoires/index.json')
      .then((res) => res.json())
      .then(setObservatoires)
  }, [])

  return (
    <div className="cards-grid">
      {observatoires.map((obs) => {
        const card = (
          <div className={`card ${obs.disponible ? "card--active" : "card--disabled"}`}>
            <div className={`card-banner ${obs.bannerClass}`}>{obs.emoji}</div>
            <div className="card-content">
              <div className="card-content-header">
                <h3>{obs.titre}</h3>
                {!obs.disponible && <span className="card-badge">Bientôt</span>}
              </div>
              <p>{obs.description}</p>
              {obs.disponible && <span className="card-link">Explorer →</span>}
            </div>
          </div>
        );

        return obs.disponible ? (
          <a key={obs.slug} href={`/observatoires/${obs.slug}.html`} className="card-wrapper">
            {card}
          </a>
        ) : (
          <div key={obs.slug}>{card}</div>
        );
      })}
    </div>
  );
}
