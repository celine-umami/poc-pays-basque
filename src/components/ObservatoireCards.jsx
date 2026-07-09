const observatoires = [
  {
    slug: "arbres-remarquables",
    titre: "Arbres Remarquables",
    description:
      "Explorez la diversité des arbres remarquables répertoriés sur le territoire : espèces, circonférences, répartition géographique.",
    emoji: "🌳",
    couleur: "from-emerald-500 to-teal-600",
    disponible: true,
  },
  {
    slug: "climat",
    titre: "Climat & Météo",
    description:
      "Données de vigilance météorologique et indicateurs climatiques pour mieux anticiper les phénomènes naturels.",
    emoji: "🌤️",
    couleur: "from-sky-400 to-blue-600",
    disponible: false,
  },
  {
    slug: "biodiversite",
    titre: "Biodiversité",
    description:
      "Suivi de la faune et de la flore locales, espèces protégées et zones naturelles d'intérêt écologique.",
    emoji: "🦋",
    couleur: "from-violet-400 to-purple-600",
    disponible: false,
  },
];

export default function ObservatoireCards() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {observatoires.map((obs) => {
        const Card = (
          <div
            className={`relative flex flex-col rounded-2xl overflow-hidden shadow-md transition-all duration-200 ${
              obs.disponible
                ? "hover:shadow-xl hover:-translate-y-1 cursor-pointer"
                : "opacity-60 cursor-not-allowed"
            }`}
          >
            {/* Bandeau couleur */}
            <div className={`bg-gradient-to-r ${obs.couleur} h-32 flex items-center justify-center text-6xl`}>
              {obs.emoji}
            </div>

            {/* Contenu */}
            <div className="flex flex-col flex-1 p-6 bg-white border border-t-0 border-gray-100 rounded-b-2xl">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-lg font-bold text-gray-800">{obs.titre}</h3>
                {!obs.disponible && (
                  <span className="text-xs font-semibold bg-gray-100 text-gray-500 px-2 py-1 rounded-full whitespace-nowrap">
                    Bientôt
                  </span>
                )}
              </div>
              <p className="text-sm text-gray-500 flex-1">{obs.description}</p>

              {obs.disponible && (
                <div className="mt-4 text-sm font-semibold text-emerald-600 flex items-center gap-1">
                  Explorer →
                </div>
              )}
            </div>
          </div>
        );

        return obs.disponible ? (
          <a key={obs.slug} href={`/observatoires/${obs.slug}`} className="block no-underline">
            {Card}
          </a>
        ) : (
          <div key={obs.slug}>{Card}</div>
        );
      })}
    </div>
  );
}
