/*
 * Fach-Konfiguration für TermQuest (Mathe, Selbstdiagnosebogen „Terme II“).
 * Die gemeinsame App-Logik (js/app.js) liest alles Fachspezifische von hier.
 */
window.Subject = {
  key: 'termquest-v1',
  appName: 'TermQuest',
  intro: 'Willkommen bei <b>TermQuest</b>. Hier lernst und übst du alles aus dem Selbstdiagnosebogen <b>„Terme II“</b>. Wähle ein Thema, lies die Erklärung und sammle beim Üben Sterne ⭐ und XP!',
  homeTitle: 'TermQuest – Terme II',
  topics: window.Topics.list,
  widgets: window.Topics.widgets,
  levels: ['Term-Neuling', 'Variablen-Entdecker', 'Klammer-Knacker', 'Term-Profi', 'Algebra-Ass', 'Term-Meister', 'Mathe-Legende'],
  self: ['Das kann ich anderen erklären.', 'Dabei mache ich nur selten Fehler.', 'Das muss ich noch üben.', 'Dabei brauche ich Hilfe von anderen.'],
  selfIcons: ['🧑‍🏫', '✅', '🏋️', '🙋'],
  selfConfident: [0, 1],
  test: { title: 'Großer Test', sub: '2 Fragen zu jedem Thema', perTopic: 2 },
  bookNote: '(Angaben vom Selbstdiagnosebogen)',
  hints: {
    4: 'Tipp: Setze negative Zahlen in Klammern und denk an Punkt vor Strich.',
    5: 'Tipp: Fasse nur Terme mit genau denselben Variablen und Hochzahlen zusammen.',
    6: 'Tipp: Multipliziere erst die Zahlen, dann die Variablen. Zähle die Minuszeichen!',
    7: 'Tipp: Minus vor der Klammer dreht ALLE Vorzeichen in der Klammer um.',
    8: 'Tipp: Jeder Summand in der Klammer wird mit dem Faktor multipliziert – Vorzeichen beachten!',
    9: 'Tipp: Jeder mit jedem – und am Ende gleichartige Terme zusammenfassen.',
    10: 'Tipp: Fläche = Länge · Breite. Zusammengesetzte Seiten gehören in Klammern.',
  },
  otherApps: [{ href: 'bio/', label: '🔬 Biologie: ZellQuest – Zellen & Mikroskop' }, { href: 'deutsch/', label: '✍️ Deutsch: ArguQuest – Thesen & Zitate' }],
  // Tutor nutzt seine eingebauten Mathe-Vorgaben (js/tutor.js)
};
