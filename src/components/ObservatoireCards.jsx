const observatoires = [
  {
    slug: "arbres-remarquables",
    titre: "Arbres Remarquables",
    description:
      "Explorez la diversité des arbres remarquables répertoriés sur le territoire : espèces, circonférences, répartition géographique.",
    emoji: "🌳",
    bannerClass: "card-banner--green",
    disponible: true,
  },
  {
    slug: "climat",
    titre: "Climat & Météo",
    description:
      "Données de vigilance météorologique et indicateurs climatiques pour mieux anticiper les phénomènes naturels.",
    emoji: "🌤️",
    bannerClass: "card-banner--blue",
    disponible: false,
  },
  {
    slug: "biodiversite",
    titre: "Biodiversité",
    description:
      "Suivi de la faune et de la flore locales, espèces protégées et zones naturelles d'intérêt écologique.",
    emoji: "🦋",
    bannerClass: "card-banner--purple",
    disponible: false,
  },
];

export default function ObservatoireCards() {
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
          <a key={obs.slug} href={`/observatoires/${obs.slug}`} className="card-wrapper">
            {card}
          </a>
        ) : (
          <div key={obs.slug}>{card}</div>
        );
      })}
    </div>
  );
}
