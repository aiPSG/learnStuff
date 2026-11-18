/*
 * Fach-Konfiguration für ArguQuest (Deutsch: Thesen, Argumente, Zitiertechnik).
 */
window.Subject = {
  key: 'arguquest-v1',
  appName: 'ArguQuest',
  homeTitle: 'ArguQuest – Thesen & Zitate',
  intro: 'Willkommen bei <b>ArguQuest</b>. Hier übst du alles von deiner <b>Deutsch-Checkliste</b>: Feststellung und These unterscheiden, Thesen formulieren, be- und widerlegen und richtig zitieren. Sammle Sterne ⭐, XP und Credits für deinen Avatar!',
  topics: window.DeTopics.list,
  widgets: window.DeTopics.widgets,
  levels: ['Thesen-Neuling', 'Satz-Sortierer', 'Argument-Sammler', 'Beleg-Profi', 'Widerlegungs-Ass', 'Zitier-Meister', 'Rede-Legende'],
  self: ['Das kann ich anderen erklären.', 'Dabei mache ich nur selten Fehler.', 'Das muss ich noch üben.', 'Dabei brauche ich Hilfe von anderen.'],
  selfIcons: ['🧑‍🏫', '✅', '🏋️', '🙋'],
  selfConfident: [0, 1],
  test: { title: 'Deutscharbeit-Probe', sub: '2 Aufgaben zu jedem Thema', perTopic: 2 },
  bookNote: '(laut Deutsch-Checkliste im Hausaufgabenheft)',
  hints: {
    1: 'Tipp: Kann man es nachprüfen (Feststellung) – oder könnte jemand widersprechen (These)?',
    2: 'Tipp: Eine These ist ein Aussagesatz mit klarem, strittigem Standpunkt zur Streitfrage.',
    3: 'Tipp: These = Was meine ich? Argument = Warum? Beleg = Woran sieht man das?',
    4: 'Tipp: These → Argument → Beleg → Schlussfolgerung. Scheinargumente begründen nichts.',
    5: 'Tipp: Widerlegen heißt: Gegenargument einräumen und dann entkräften („Zwar …, aber …“).',
    6: 'Tipp: Anführungszeichen, Wort für Wort, Zeilenangabe – (Z. 4 f.) bei zwei Zeilen.',
    7: 'Tipp: Weglassen [ … ] und Ergänzen [ ] immer mit eckigen Klammern.',
    8: 'Tipp: Ein Zitat ist ein Beleg – es muss zur These passen.',
  },
  extraHome: [{ href: '#/p/glossar', label: '📖 Glossar' }],
  pages: { glossar: window.DeTopics.glossaryPage },
  otherApps: [{ href: '../', label: '🧮 Mathe: TermQuest' }, { href: '../bio/', label: '🔬 Bio: ZellQuest' }],
  tutor: {
    faq: window.DeTopics.FAQ,
    tagline: 'Dein KI-Deutsch-Tutor – gibt Tipps und Feedback, verrät aber keine Lösungen, solange du die Aufgabe bearbeitest.',
    placeholder: 'Deine Frage zu Thesen, Argumenten oder Zitaten …',
    about: 'Du bist Claude, der freundliche Deutsch-Tutor in der Lern-App „ArguQuest“. Du hilfst Schülerinnen und Schülern der 8. Klasse (13–14 Jahre) in Deutschland bei der Vorbereitung auf eine Deutscharbeit zu diesen Punkten: Feststellung und These unterscheiden (Kennzeichen), selbst Thesen formulieren, Thesen mit Argumenten und Belegen stützen und Gegenargumente widerlegen, Zitiertechnik (Anführungszeichen, Zeilenangaben wie (Z. 4) und (Z. 4 f.), Auslassungen […], Ergänzungen in eckigen Klammern, Zitat im Zitat mit ‚…‘, sinngemäße Wiedergabe mit vgl.). Wenn ein Kind einen eigenen Text zeigt, gib konkretes, freundliches Feedback: zuerst, was gut gelungen ist, dann höchstens zwei Verbesserungsvorschläge. Schreib den Text nicht für das Kind neu.',
  },
};
