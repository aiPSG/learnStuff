/*
 * Fach-Konfiguration für ZellQuest (Biologie, „Checkliste Klassenarbeit Bio 8a“ – Zellen).
 */
window.Subject = {
  key: 'zellquest-v1',
  appName: 'ZellQuest',
  homeTitle: 'ZellQuest – Zellen & Mikroskop',
  intro: 'Willkommen bei <b>ZellQuest</b>. Hier lernst und übst du alles von der <b>Checkliste Klassenarbeit Bio 8a</b>: Zellen, Mikroskop, Zelltypen. Sammle Sterne ⭐, XP und Credits für deinen Avatar!',
  topics: window.BioTopics.list,
  widgets: window.BioTopics.widgets,
  levels: ['Zell-Neuling', 'Mikroskop-Lehrling', 'Präparat-Profi', 'Zellkern-Kenner', 'Organellen-Ass', 'Zell-Detektiv', 'Bio-Legende'],
  self: ['… noch nicht (gut)', '… sicher'],
  selfIcons: ['🏋️', '✅'],
  selfConfident: [1],
  test: { title: 'Klassenarbeit-Probe', sub: '2 Aufgaben zu jedem Punkt der Checkliste', perTopic: 2 },
  bookNote: '(Angaben von der Checkliste)',
  hints: {
    2: 'Tipp: Denk an den Weg des Lichts – von der Lampe unten bis zum Okular oben.',
    3: 'Tipp: Immer klein anfangen – kleinstes Objektiv, Grobtrieb nur von der Seite, dann Feintrieb.',
    4: 'Tipp: Überlege, welche Bestandteile typisch für genau diesen Zelltyp sind.',
    5: 'Tipp: Pflanzenzellen haben Zellwand, Vakuole und Chloroplasten; Bakterien keinen Zellkern.',
    6: 'Tipp: Kraftwerk = Mitochondrien, Steuerzentrale = Zellkern, Fotosynthese = Chloroplasten.',
    7: 'Tipp: Erst fragen: Zellkern? Dann: Zellwand?',
    8: 'Tipp: Bakterien sind Prokaryoten – ohne Zellkern und ohne Mitochondrien.',
    9: 'Tipp: Wirkliche Größe = Bildgröße : Vergrößerung. 1 mm = 1000 µm.',
  },
  extraHome: [{ href: '#/p/glossar', label: '📖 Glossar' }],
  pages: { glossar: window.BioTopics.glossaryPage },
  otherApps: [{ href: '../', label: '🧮 Mathe: TermQuest – Terme' }],
  tutor: {
    faq: window.BioTopics.FAQ,
    tagline: 'Dein KI-Bio-Tutor – gibt Tipps, aber verrät keine Lösungen, solange du die Aufgabe bearbeitest.',
    placeholder: 'Deine Frage zu Zellen oder zum Mikroskop …',
    about: 'Du bist Claude, der freundliche Biologie-Tutor in der Lern-App „ZellQuest“. Du hilfst Schülerinnen und Schülern der 8. Klasse (13–14 Jahre) in Deutschland bei der Vorbereitung auf eine Klassenarbeit zum Thema Zellen: Was ist eine Zelle, Bau und Bedienung des Lichtmikroskops, Nasspräparate, Aufbau von Pflanzen-, Tier- und Bakterienzellen, Funktionen der Zellbestandteile (Zellwand, Zellmembran, Zellplasma, Zellkern, Mitochondrien, Chloroplasten, Vakuole, Ribosomen, Bakterienchromosom, Plasmide, Geißel, Pili, Kapsel), Zelltypen erkennen und begründen, Prokaryoten und Eukaryoten, Vergrößerung und wirkliche Größe berechnen. Bleib auf dem Niveau der 8. Klasse; wenn etwas darüber hinausgeht, sag kurz, dass das später kommt.',
  },
};
