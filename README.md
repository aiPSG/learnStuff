# learnStuff – Lern-Apps 🧮🔬

Zwei Lern-Apps mit gemeinsamer Technik, gemeinsamen Credits und einem gemeinsamen Avatar:

| App | Fach | Adresse |
|---|---|---|
| **TermQuest** 🧮 | Mathe: Selbstdiagnosebogen „Terme II“ | `/` |
| **ZellQuest** 🔬 | Bio 8: Checkliste Klassenarbeit „Zellen“ | `/bio/` |

# TermQuest 🧮 – Terme II

Eine Lern-App für Schülerinnen und Schüler (ca. 12–13 Jahre) zu allen zehn Punkten des
Selbstdiagnosebogens **„Terme II“**: erklären, üben, testen.

## Starten

Keine Installation nötig – einfach `index.html` im Browser öffnen (Doppelklick genügt).
Oder als kleine Webseite ausliefern, z. B.:

```bash
python3 -m http.server 8000   # dann http://localhost:8000 öffnen
```

Funktioniert auf Computer, Tablet und Handy. Der Fortschritt wird nur lokal im Browser gespeichert.

## Was ist drin?

| # | Thema (aus dem Bogen) | Lernen | Üben |
|---|---|---|---|
| 1 | Variable, Term, Gleichung, Gleichungskette | Begriffe, „=“-Zähltrick | Zuordnen (Multiple Choice) |
| 2 | Kommutativ- & Assoziativgesetz | animierte Beispiele | Gesetz erkennen, Fachbegriffe |
| 3 | Rechenbaum, Wortform, Termschreibweise | Zufallsbeispiele in allen 3 Formen | Baum ↔ Term ↔ Wortform, Termart |
| 4 | Wert eines Terms | Regler zum Einsetzen | Zahl eingeben |
| 5 | Gleichartige Terme zusammenfassen | Farbtrick | Term eingeben |
| 6 | Produkte vereinfachen | Sortieren, Potenzen, Vorzeichen | Term eingeben |
| 7 | Minusklammern | Schritt-für-Schritt-Animation | Term eingeben |
| 8 | Distributivgesetz (ausmultiplizieren/ausklammern) | Flächenmodell | Term eingeben, größter Faktor |
| 9 | Produkte von Summen | 4-Felder-Rechteck | Term eingeben |
| 10 | Terme mit Abbildungen (Fläche, Volumen) | Figuren & Quader | Term zur Figur eingeben |

* **Selbsteinschätzung** mit den vier Spalten des Bogens pro Thema, plus Buchverweise vom Bogen.
* **Großer Test** mit 2 Fragen pro Thema. Die Auswertung vergleicht das Ergebnis mit der Selbsteinschätzung.
* **XP, Level, Sterne, Serien** 🔥 zur Motivation.
* **Feedback:** Jede Aktion hat einen Ton (Web Audio, keine Dateien) und einen visuellen Effekt
  (Konfetti, Wackeln, Pulsieren, schwebende Punkte). Ton lässt sich oben rechts ausschalten.
  Erklärungen und Fragen können vorgelesen werden (Sprachausgabe des Browsers, Deutsch).
* Bei Term-Aufgaben wird **mathematisch** geprüft: `4b + 3a` ist genauso richtig wie `3a + 4b`.
  Ist ein Term gleichwertig, aber noch nicht fertig vereinfacht, gibt es ein „Fast!“ mit Hinweis statt „falsch“.
  Eingabe per Tastatur (`3a^2`, `3a²`, `2(x-1)`) oder Bildschirmtasten.
* Alle Aufgaben werden zufällig erzeugt – es gibt immer neue.
* **Avatar & Shop:** Für jedes abgeschlossene Quiz gibt es Credits 🪙 (5 pro Punkt + Sterne-Bonus).
  Damit kauft man Oberteile, Hüte, Brillen, Extras, Haarfarben und Hintergründe. Aussehen (Haut, Frisur, Haarfarbe) ist kostenlos.
* **Frag Claude:** Unter jeder Quizfrage gibt es einen Chat mit Claude und Knöpfe mit typischen Fragen zum Thema.
  Die Knöpfe antworten mit fest hinterlegten Erklärungen (ohne KI, immer verfügbar).
  Solange eine Aufgabe nicht beantwortet ist, gibt Claude nur Tipps und verrät die Lösung nicht.

## Claude einrichten – und wo der API-Key NICHT hingehört

**Niemals einen API-Key ins Repository legen** (auch nicht als `key.txt`): Das Repository und die
GitHub-Pages-Seite sind öffentlich, jede Datei ist für alle abrufbar.

* **Eine Familie:** Ein Elternteil öffnet ⚙️ oben rechts und trägt den Key ein. Er wird nur im Browser
  dieses Geräts gespeichert. In der Anthropic Console ein niedriges Ausgabenlimit setzen.
* **Klasse / mehrere Kinder:** Den Proxy aus [`proxy/`](proxy/README.md) betreiben (Key liegt dort als Secret)
  und seine Adresse in `js/config.js` bei `proxyUrl` eintragen.

Die App lädt das offizielle Anthropic-SDK zur Laufzeit von jsDelivr (Version in `js/config.js`).

# ZellQuest 🔬 – Zellen & Mikroskop

Zur **Checkliste Klassenarbeit Bio 8a**. Neun Themen – genau die Zeilen der Checkliste (inkl. Buchverweise),
Selbsteinschätzung mit den Spalten „…noch nicht (gut)“ / „…sicher“, eine **Klassenarbeit-Probe** und ein **Glossar**
mit Karteikarten (die Checkliste empfiehlt, eines anzulegen).

| # | Thema | Lernen | Üben |
|---|---|---|---|
| 1 | Was ist eine Zelle? | Einzeller/Vielzeller, Kennzeichen des Lebens, Größen | Auswahl, Richtig/Falsch, Reihenfolge, Zahl |
| 2 | Bestandteile des Mikroskops | antippbares Mikroskop, Lichtweg, Vergrößerung | Teil antippen, markiertes Teil benennen, Vergrößerung rechnen |
| 3 | Vorgehen beim Mikroskopieren | Schritte, Nasspräparat, Regeln | Schritte ordnen, Regeln begründen |
| 4 | Zellen skizzieren | Skizzenregeln, beschriftete Zellen | „Was fehlt in der Skizze?“, Mehrfachauswahl |
| 5 | Zellbestandteile benennen | Zellen zum Antippen, Vergleichstabelle | Teil antippen, markierten Teil benennen |
| 6 | Funktionen erklären | „Zelle als Fabrik“, Funktionsliste | Funktion ↔ Bestandteil |
| 7 | Zelltyp erkennen & begründen | Detektiv-Fragen, Fallen, Detektiv-Spiel | Zelltyp aus Bild/Beschreibung, Begründung wählen |
| 8 | Bakterien vs. Tier-/Pflanzenzelle | Pro-/Eukaryoten, Unterschiede, Gemeinsamkeiten | Richtig/Falsch, Mehrfachauswahl, Antippen |
| 9 | Aufgaben rund um Zellen | Lerntipps, typische Aufgaben, Größe berechnen | Anwenden, Rechnen + Mix aus allen Themen |

Die Inhalte entsprechen dem üblichen Stoff der 7./8. Klasse. **Mit Heft, Buch und den Its-learning-Materialien
abgleichen** – die App kennt diese Unterlagen nicht.

## Aufbau (beide Apps)

`js/app.js` ist die gemeinsame Lern-App (Navigation, Quiz mit allen Fragetypen, Shop, Chat).
Was fachspezifisch ist, steht in einer Fach-Datei: `js/subject-terme.js` bzw. `bio/subject.js`.
Ein neues Fach braucht nur einen eigenen Ordner mit `index.html`, Themen-Datei und `subject.js`.

```
bio/index.html   ZellQuest-Seite
bio/cells.js     Zell- und Mikroskop-Diagramme (SVG, antippbar)
bio/topics.js    Inhalte, Aufgaben, Glossar, Fragen-Knöpfe
bio/subject.js   Fach-Konfiguration ZellQuest
js/subject-terme.js  Fach-Konfiguration TermQuest
```

Fragetypen: Auswahl (`mc`), Zahl (`num`), Term (`term`), Diagramm antippen (`hotspot`),
Mehrfachauswahl (`multi`), Reihenfolge (`order`).

## Aufbau TermQuest

```
index.html
css/style.css
js/mathterm.js   Term-Parser, Normalform, Prüfung auf Gleichwertigkeit/Vereinfachung
js/sound.js      Töne (Web Audio) und Vorlesen (speechSynthesis)
js/fx.js         Konfetti & Animationen
js/visuals.js    Zufall, Rechenbäume und Figuren als SVG
js/topics.js     Inhalte und Aufgaben-Generatoren der 10 Themen
js/app.js        Navigation, Quiz, Fortschritt, Shop, Einstellungen
js/avatar.js     Avatar (SVG) und Shop-Artikel
js/tutor.js      Chat mit Claude, Fragen-Knöpfe mit Antworten
js/config.js     Einstellungen für den Tutor (kein Key!)
proxy/           optionaler Proxy, der den Key sicher hält
tests/           node tests/mathterm.test.js · node tests/generators.test.js
```

## Tests

```bash
node tests/mathterm.test.js     # Parser & Prüfung
node tests/generators.test.js   # erzeugt 15.000+ Aufgaben und prüft, dass jede Musterlösung akzeptiert wird
node tests/bio.test.js          # erzeugt 18.000+ Bio-Aufgaben und prüft sie
# Browser-Test (beide Apps): Server starten, dann
python3 -m http.server 8765 &
NODE_PATH=$(npm root -g) node tests/e2e.js http://localhost:8765/
NODE_PATH=$(npm root -g) node tests/e2e.js http://localhost:8765/bio/
```
