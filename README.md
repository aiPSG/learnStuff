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

## Aufbau

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
```
