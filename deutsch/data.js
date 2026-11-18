/*
 * ArguQuest – Material: Streitfragen, Sätze, Belege, Zitier-Texte.
 * Alle Texte sind für diese App geschrieben (keine fremden Texte).
 */
(function (root) {
  'use strict';

  // Streitfragen mit Thesen, Argumenten [Argument, Beleg/Beispiel, Widerlegung]
  // P = Argumente für die These „pro“, C = Argumente für „contra“.
  // Die Widerlegung entkräftet das jeweilige Argument aus Sicht der Gegenseite.
  const STREIT = [
    {
      q: 'Sollten Handys an Schulen verboten werden?', topic: 'Handys an Schulen',
      pro: 'Handys sollten an Schulen verboten werden.', contra: 'Handys sollten an Schulen erlaubt sein.',
      P: [
        ['Handys lenken im Unterricht ab, weil ständig Nachrichten ankommen.', 'Wenn während einer Mathestunde ein Handy vibriert, verlieren viele sofort den Faden.', 'Zwar können Nachrichten ablenken, aber das Handy lässt sich im Unterricht einfach stumm schalten.'],
        ['Ohne Handys reden die Schülerinnen und Schüler in den Pausen mehr miteinander.', 'An handyfreien Tagen spielen in unserer Klasse viele in der Pause Tischtennis, statt auf das Display zu schauen.', 'Das stimmt nur teilweise, denn viele nutzen das Handy in der Pause gerade, um gemeinsam Fotos anzuschauen oder Musik zu hören.'],
        ['Ein Verbot schützt vor Cybermobbing in der Schule.', 'Peinliche Fotos, die heimlich in der Umkleide gemacht werden, können sich sonst in Minuten in der ganzen Schule verbreiten.', 'Zwar ist Cybermobbing ein ernstes Problem, doch es passiert oft nachmittags zu Hause – dagegen hilft ein Verbot in der Schule kaum.'],
      ],
      C: [
        ['Handys können im Unterricht sinnvoll genutzt werden.', 'Im Erdkundeunterricht kann man mit einer Karten-App schnell nachsehen, wo ein Land liegt.', 'Zwar kann man mit dem Handy recherchieren, aber dafür gibt es an der Schule Computer und Tablets, die besser geeignet sind.'],
        ['Im Notfall müssen Kinder ihre Eltern erreichen können.', 'Fällt der Bus aus, kann man mit dem Handy sofort zu Hause Bescheid sagen.', 'Zwar müssen Kinder im Notfall erreichbar sein, aber dafür kann man jederzeit das Telefon im Sekretariat benutzen.'],
        ['Schülerinnen und Schüler sollen den verantwortungsvollen Umgang mit Medien lernen.', 'Wer schon in der Schule übt, das Handy bewusst wegzulegen, schafft das später auch bei den Hausaufgaben.', 'Dem kann man entgegenhalten, dass man den Umgang mit Medien auch im Unterricht lernen kann, ohne dass jeder ständig sein Handy dabeihat.'],
      ],
    },
    {
      q: 'Sollte es an Schulen eine Schuluniform geben?', topic: 'Schuluniformen',
      pro: 'An Schulen sollte es eine Schuluniform geben.', contra: 'An Schulen sollte es keine Schuluniform geben.',
      P: [
        ['Eine Schuluniform verhindert, dass Kinder wegen ihrer Kleidung ausgegrenzt werden.', 'Wer sich keine teuren Markenschuhe leisten kann, fällt in Uniform nicht auf.', 'Zwar sehen in Uniform alle gleich aus, doch an Handy, Schulranzen oder Frisur kann man trotzdem erkennen, wer viel Geld hat.'],
        ['Eine Uniform stärkt das Gemeinschaftsgefühl.', 'Bei Sportfesten erkennt man die eigene Schule sofort an den gleichen Pullovern.', 'Das überzeugt nur teilweise, denn Gemeinschaft entsteht durch gemeinsame Erlebnisse und nicht durch gleiche Kleidung.'],
        ['Morgens spart man Zeit bei der Kleiderwahl.', 'Statt lange vor dem Kleiderschrank zu stehen, zieht man einfach die Uniform an.', 'Zwar spart man ein paar Minuten, aber dafür lohnt es sich nicht, allen ihre Kleidung vorzuschreiben.'],
      ],
      C: [
        ['Kleidung ist ein Ausdruck der eigenen Persönlichkeit.', 'Wer gerne bunte Sachen trägt, kann in einer grauen Uniform nicht zeigen, wer er ist.', 'Zwar drückt Kleidung Persönlichkeit aus, aber nach der Schule und am Wochenende kann man immer noch tragen, was man möchte.'],
        ['Schuluniformen kosten die Familien zusätzliches Geld.', 'Eltern müssen mehrere Hosen und Pullover kaufen, obwohl die Kinder genug Kleidung haben.', 'Dem kann man entgegenhalten, dass Familien dann weniger teure Markenkleidung für die Schule kaufen müssen.'],
        ['Ausgrenzung verschwindet durch eine Uniform nicht.', 'Auch in Uniform kann man an Handy, Schulranzen oder Frisur sehen, wer viel Geld hat.', 'Zwar verschwindet Ausgrenzung nicht ganz, doch die Kleidung als einer der auffälligsten Unterschiede fällt weg.'],
      ],
    },
    {
      q: 'Sollten Hausaufgaben abgeschafft werden?', topic: 'Hausaufgaben',
      pro: 'Hausaufgaben sollten abgeschafft werden.', contra: 'Hausaufgaben sollten nicht abgeschafft werden.',
      P: [
        ['Nach einem langen Schultag brauchen Kinder Zeit zur Erholung.', 'Wer bis 15 Uhr Unterricht hat, sitzt mit Hausaufgaben oft noch bis zum Abend am Schreibtisch.', 'Zwar ist Erholung wichtig, aber kurze Hausaufgaben von einer halben Stunde lassen trotzdem genug Freizeit.'],
        ['Hausaufgaben sind ungerecht, weil nicht alle zu Hause Hilfe bekommen.', 'Manche Kinder können ihre Eltern fragen, andere sind mit schwierigen Aufgaben ganz allein.', 'Dem kann man entgegenhalten, dass viele Schulen Hausaufgabenbetreuung anbieten, in der alle Hilfe bekommen.'],
        ['Für Hobbys und Freunde bleibt sonst zu wenig Zeit.', 'Das Fußballtraining fällt aus, weil noch ein Aufsatz geschrieben werden muss.', 'Das stimmt nur teilweise, denn wer sich seine Zeit gut einteilt, schafft Hausaufgaben und Hobbys.'],
      ],
      C: [
        ['Durch Hausaufgaben wird der Unterrichtsstoff gefestigt.', 'Vokabeln, die man zu Hause wiederholt, kann man im Test viel sicherer.', 'Zwar festigen Übungen den Stoff, doch dafür könnte man in der Schule feste Übungszeiten einplanen.'],
        ['Hausaufgaben zeigen, was man noch nicht verstanden hat.', 'Wer bei einer Matheaufgabe zu Hause hängen bleibt, weiß genau, was er in der nächsten Stunde fragen muss.', 'Zwar merkt man so Lücken, aber das zeigen kurze Übungen im Unterricht genauso gut.'],
        ['Mit Hausaufgaben lernt man, selbstständig zu arbeiten.', 'Wer sich seine Zeit für die Hausaufgaben selbst einteilt, übt etwas, das später im Beruf wichtig ist.', 'Dem kann man entgegenhalten, dass man Selbstständigkeit auch bei Projekten und Referaten in der Schule lernt.'],
      ],
    },
    {
      q: 'Sollten Jugendliche schon mit 16 Jahren den Bundestag wählen dürfen?', topic: 'das Wahlalter',
      pro: 'Jugendliche sollten schon mit 16 Jahren den Bundestag wählen dürfen.', contra: 'Jugendliche sollten erst mit 18 Jahren den Bundestag wählen dürfen.',
      P: [
        ['Politische Entscheidungen betreffen die Zukunft der Jugendlichen besonders lange.', 'Beim Klimaschutz geht es um Jahrzehnte – die heute 16-Jährigen leben am längsten mit den Folgen.', 'Zwar betrifft Politik die Zukunft der Jüngeren, aber das gilt für Zwölfjährige genauso, und die sollen auch nicht wählen.'],
        ['Mit 16 übernehmen viele Jugendliche schon Verantwortung.', 'Viele beginnen mit 16 eine Ausbildung und verdienen ihr erstes eigenes Geld.', 'Das stimmt nur teilweise, denn viele 16-Jährige gehen noch zur Schule und leben ganz bei ihren Eltern.'],
        ['Bei anderen Wahlen dürfen 16-Jährige schon mitbestimmen.', 'Bei der Europawahl 2024 durften in Deutschland zum ersten Mal schon 16-Jährige wählen.', 'Zwar gibt es diese Ausnahmen, doch die Bundestagswahl ist so wichtig, dass man an der Volljährigkeit festhalten sollte.'],
      ],
      C: [
        ['Viele 16-Jährige interessieren sich noch wenig für Politik.', 'Im Freundeskreis sprechen viele eher über Sport und Musik als über Wahlprogramme.', 'Zwar sind nicht alle 16-Jährigen politisch interessiert, aber das gilt auch für viele Erwachsene, die trotzdem wählen dürfen.'],
        ['Mit 18 ist man volljährig – Rechte und Pflichten sollten zusammenpassen.', 'Wer mit 16 noch keinen Handyvertrag allein abschließen darf, sollte auch noch nicht über die Regierung mitbestimmen.', 'Dem kann man entgegenhalten, dass es auch andere Rechte schon vor 18 gibt, zum Beispiel den Mopedführerschein mit 16.'],
        ['Jüngere lassen sich leichter beeinflussen.', 'Kurze Videos in sozialen Netzwerken können Meinungen stark prägen, ohne dass man es merkt.', 'Zwar können Videos beeinflussen, doch das gilt für Erwachsene genauso – dagegen hilft politische Bildung in der Schule.'],
      ],
    },
    {
      q: 'Sollten Tablets die Schulbücher ersetzen?', topic: 'Tablets im Unterricht',
      pro: 'Tablets sollten die Schulbücher ersetzen.', contra: 'Tablets sollten die Schulbücher nicht ersetzen.',
      P: [
        ['Mit Tablets wird der Schulranzen viel leichter.', 'Statt fünf dicken Büchern trägt man nur noch ein Gerät mit sich.', 'Zwar wird der Ranzen leichter, aber das lässt sich auch mit Spinden in der Schule erreichen.'],
        ['Digitale Bücher lassen sich schnell aktualisieren.', 'Wenn sich eine Landkarte ändert, ist die neue Version sofort auf allen Tablets.', 'Das stimmt, doch so oft ändert sich der Stoff in den meisten Fächern gar nicht.'],
        ['Mit Tablets kann man Videos und interaktive Übungen nutzen.', 'Im Biologieunterricht kann man sich eine Zelle in 3D von allen Seiten ansehen.', 'Zwar sind Videos anschaulich, aber man kann sie auch zusätzlich zum Buch an der Tafel zeigen.'],
      ],
      C: [
        ['Lange Bildschirmarbeit strengt die Augen an.', 'Nach mehreren Stunden am Tablet klagen viele über müde oder trockene Augen.', 'Zwar ist Bildschirmarbeit anstrengend, aber niemand muss den ganzen Tag ununterbrochen auf das Tablet schauen.'],
        ['Technik kann ausfallen.', 'Ist der Akku leer oder das WLAN gestört, kann plötzlich niemand mehr im Buch lesen.', 'Dem kann man entgegenhalten, dass man Bücher auch offline speichern und Geräte über Nacht laden kann.'],
        ['Auf dem Tablet ist die Ablenkung durch Spiele und Nachrichten groß.', 'Ein kurzer Blick in eine Spiele-App, und schon ist die halbe Stunde vorbei.', 'Zwar lenken Spiele ab, doch die Schule kann auf Schul-Tablets Spiele und Nachrichten einfach sperren.'],
      ],
    },
    {
      q: 'Sollte die Schule erst um 9 Uhr beginnen?', topic: 'den Schulbeginn',
      pro: 'Die Schule sollte erst um 9 Uhr beginnen.', contra: 'Die Schule sollte weiterhin um 8 Uhr beginnen.',
      P: [
        ['Viele Jugendliche sind morgens noch sehr müde.', 'In der ersten Stunde um acht Uhr gähnen viele, statt mitzudenken.', 'Zwar sind viele morgens müde, aber wer früher ins Bett geht, ist auch um acht Uhr wach.'],
        ['Ausgeschlafene Schülerinnen und Schüler lernen besser.', 'Wer genug geschlafen hat, kann sich Vokabeln leichter merken und macht weniger Flüchtigkeitsfehler.', 'Das stimmt, doch viele würden bei späterem Schulbeginn einfach später schlafen gehen.'],
        ['Der Schulweg im Winter wäre heller und sicherer.', 'Um halb acht ist es im Dezember noch dunkel, um halb neun wird es langsam hell.', 'Zwar ist es morgens dunkel, aber mit Licht am Fahrrad und heller Kleidung ist der Schulweg trotzdem sicher.'],
      ],
      C: [
        ['Der Unterricht würde später enden.', 'Wer bis 16 Uhr Schule hat, hat danach kaum noch Zeit für den Sportverein.', 'Zwar endet die Schule später, aber viele Vereine trainieren ohnehin erst am frühen Abend.'],
        ['Viele Eltern müssen früh zur Arbeit.', 'Kleine Geschwister müssten sonst allein zu Hause warten, bis die Schule beginnt.', 'Dem kann man entgegenhalten, dass Schulen eine Frühbetreuung anbieten könnten.'],
        ['Busse und Bahnen sind auf die bisherigen Zeiten abgestimmt.', 'Der Schulbus fährt auf dem Land oft nur einmal am Morgen.', 'Zwar müssten Fahrpläne geändert werden, doch das ist eine einmalige Aufgabe und kein Grund gegen gesündere Schulzeiten.'],
      ],
    },
    {
      q: 'Sollten Schulnoten abgeschafft werden?', topic: 'Schulnoten',
      pro: 'Schulnoten sollten abgeschafft werden.', contra: 'Schulnoten sollten beibehalten werden.',
      P: [
        ['Noten setzen viele Schülerinnen und Schüler unter Druck.', 'Vor jeder Klassenarbeit können manche vor Aufregung kaum schlafen.', 'Zwar machen Noten Druck, aber ein wenig Anspannung hilft vielen, sich gut vorzubereiten.'],
        ['Eine Note sagt nicht, was man gut oder schlecht gemacht hat.', 'Eine 3 in Deutsch verrät nicht, ob es an der Rechtschreibung oder am Inhalt lag.', 'Dem kann man entgegenhalten, dass Lehrkräfte zusätzlich zur Note einen kurzen Kommentar schreiben können.'],
        ['Ohne Noten lernt man eher aus Interesse.', 'Wer ein Referat über Vulkane hält, weil ihn das Thema fasziniert, behält mehr als jemand, der nur für die Note lernt.', 'Das stimmt nur teilweise, denn nicht jedes Thema begeistert jeden – dann helfen Noten als Anreiz.'],
      ],
      C: [
        ['Noten zeigen schnell und übersichtlich den Leistungsstand.', 'Eltern sehen auf dem Zeugnis auf einen Blick, in welchem Fach Hilfe nötig ist.', 'Zwar sind Noten übersichtlich, doch sie verraten nicht, woran genau man arbeiten muss.'],
        ['Noten können motivieren.', 'Wer sich von einer 4 auf eine 2 verbessert, ist zu Recht stolz auf seine Leistung.', 'Zwar motivieren gute Noten, aber schlechte Noten entmutigen viele und nehmen ihnen die Lust am Lernen.'],
        ['Für Bewerbungen braucht man vergleichbare Ergebnisse.', 'Ausbildungsbetriebe schauen bei vielen Bewerbungen zuerst auf das Zeugnis.', 'Dem kann man entgegenhalten, dass Betriebe sich auch durch Praktika und Gespräche ein gutes Bild machen können.'],
      ],
    },
    {
      q: 'Sollte es in der Schulmensa einen fleischlosen Tag pro Woche geben?', topic: 'einen fleischlosen Tag in der Mensa',
      pro: 'In der Schulmensa sollte es einen fleischlosen Tag pro Woche geben.', contra: 'In der Schulmensa sollte es keinen fleischlosen Tag geben.',
      P: [
        ['Weniger Fleisch ist gut für das Klima.', 'Für Rindfleisch werden viel mehr Fläche und Energie gebraucht als für Gemüse.', 'Zwar hilft weniger Fleisch dem Klima, aber eine einzelne Schulmensa macht dabei nur einen winzigen Unterschied.'],
        ['Man lernt neue Gerichte kennen.', 'Viele haben eine Linsen-Bolognese noch nie probiert und sind überrascht, wie gut sie schmeckt.', 'Das stimmt, doch neue Gerichte kann man auch anbieten, ohne das Fleisch ganz zu streichen.'],
        ['Ein fleischloser Tag ist gesund.', 'Gemüse, Hülsenfrüchte und Vollkorn liefern viele Vitamine und Ballaststoffe.', 'Zwar ist Gemüse gesund, aber auch ein Gericht mit etwas Fleisch kann ausgewogen sein.'],
      ],
      C: [
        ['Jeder sollte selbst entscheiden, was er isst.', 'Wer gerne Fleisch isst, bekommt an diesem Tag etwas, das er nicht möchte.', 'Zwar ist Wahlfreiheit wichtig, aber an den anderen vier Tagen kann ja jeder weiter Fleisch essen.'],
        ['Ein Tag pro Woche ändert am Klima wenig.', 'Eine einzelne Schulmensa kocht nur einen winzigen Teil aller Mahlzeiten.', 'Dem kann man entgegenhalten, dass viele kleine Schritte zusammen viel bewirken – besonders, wenn viele Schulen mitmachen.'],
        ['Manche essen dann gar nicht in der Mensa.', 'Wer das Gericht nicht mag, kauft sich stattdessen beim Bäcker ein Croissant.', 'Zwar mögen nicht alle das Essen, doch wenn die Gerichte lecker sind, kommen die meisten trotzdem.'],
      ],
    },
    {
      q: 'Sollten soziale Netzwerke erst ab 16 Jahren erlaubt sein?', topic: 'soziale Netzwerke für Kinder',
      pro: 'Soziale Netzwerke sollten erst ab 16 Jahren erlaubt sein.', contra: 'Soziale Netzwerke sollten auch für Jüngere erlaubt sein.',
      P: [
        ['Jüngere Kinder können Gefahren im Netz oft noch nicht einschätzen.', 'Eine nette Nachricht von einem Fremden kann in Wahrheit von jemandem mit bösen Absichten stammen.', 'Zwar gibt es Gefahren, aber gerade deshalb sollten Kinder früh lernen, sie zu erkennen – mit Hilfe der Eltern.'],
        ['Soziale Netzwerke können süchtig machen.', 'Viele merken gar nicht, wie aus fünf Minuten Scrollen eine ganze Stunde wird.', 'Dem kann man entgegenhalten, dass man Bildschirmzeiten in den Einstellungen begrenzen kann.'],
        ['Perfekte Bilder im Netz können das Selbstwertgefühl schwächen.', 'Wer ständig bearbeitete Fotos sieht, findet sich selbst plötzlich nicht mehr schön genug.', 'Zwar sind bearbeitete Fotos ein Problem, doch das hört mit 16 nicht plötzlich auf – man muss lernen, sie zu durchschauen.'],
      ],
      C: [
        ['Soziale Netzwerke helfen, Kontakt zu Freunden zu halten.', 'Nach einem Umzug kann man mit der alten Klasse weiter Fotos und Nachrichten austauschen.', 'Zwar hält man so Kontakt, aber dafür reichen auch Nachrichten-Apps ohne öffentliche Profile.'],
        ['Ein Verbot ist kaum zu kontrollieren.', 'Ein falsches Geburtsdatum ist bei der Anmeldung schnell eingetippt.', 'Das stimmt nur teilweise, denn es gibt inzwischen Verfahren, mit denen das Alter genauer geprüft werden kann.'],
        ['Kinder sollten den Umgang mit Medien lernen, statt ferngehalten zu werden.', 'Wer mit Begleitung der Eltern anfängt, lernt Schritt für Schritt, worauf man achten muss.', 'Zwar ist Medienkompetenz wichtig, doch die kann man auch mit sichereren Angeboten für Kinder üben.'],
      ],
    },
    {
      q: 'Sollte es weiterhin Zoos geben?', topic: 'Zoos',
      pro: 'Es sollte weiterhin Zoos geben.', contra: 'Zoos sollten abgeschafft werden.',
      P: [
        ['Zoos helfen, bedrohte Tierarten zu erhalten.', 'Das Przewalski-Pferd wurde in Zoos gezüchtet und später wieder in der Natur angesiedelt.', 'Zwar retten Zoos einzelne Arten, aber die meisten Zootiere gehören gar nicht zu bedrohten Arten.'],
        ['Im Zoo lernen Kinder Tiere kennen und schätzen.', 'Wer einmal einen Elefanten aus der Nähe gesehen hat, setzt sich eher für seinen Schutz ein.', 'Dem kann man entgegenhalten, dass man Tiere auch in Wildparks und auf Bauernhöfen erleben kann, wo sie mehr Platz haben.'],
        ['Viele Zoos unterstützen den Naturschutz in der Wildnis.', 'Mit einem Teil der Eintrittsgelder werden zum Beispiel Schutzgebiete in Afrika oder Asien unterstützt.', 'Zwar spenden Zoos Geld, doch Naturschutzprojekte könnten auch direkt unterstützt werden.'],
      ],
      C: [
        ['Viele Tiere haben im Zoo zu wenig Platz.', 'Ein Eisbär läuft in freier Wildbahn sehr weite Strecken, im Gehege nur wenige Meter hin und her.', 'Zwar sind manche Gehege zu klein, aber moderne Zoos bauen große, naturnahe Anlagen.'],
        ['Tiere gehören in ihren natürlichen Lebensraum.', 'Ein Delfin, der im Meer kilometerweit schwimmt, lebt im Zoo in einem Becken.', 'Das stimmt nur teilweise, denn für manche Arten ist der natürliche Lebensraum fast zerstört.'],
        ['Wissen über Tiere kann man auch anders bekommen.', 'Gute Tierfilme zeigen Tiere in ihrem echten Lebensraum – ohne dass sie eingesperrt werden.', 'Zwar sind Tierfilme lehrreich, doch ein Tier selbst zu erleben, beeindruckt viele Kinder viel stärker.'],
      ],
    },
    {
      q: 'Sollte die Spielzeit von Jugendlichen an Computer und Konsole begrenzt werden?', topic: 'Computerspiele',
      pro: 'Die Spielzeit von Jugendlichen sollte begrenzt werden.', contra: 'Die Spielzeit von Jugendlichen sollte nicht begrenzt werden.',
      P: [
        ['Zu viel Spielen kostet Zeit für Schlaf, Bewegung und Schule.', 'Wer bis Mitternacht spielt, ist am nächsten Morgen im Unterricht unkonzentriert.', 'Zwar kann zu viel Spielen schaden, aber das hängt davon ab, wann und wie lange man spielt – nicht jeder spielt bis Mitternacht.'],
        ['Feste Zeiten schützen davor, die Kontrolle zu verlieren.', 'Mit einer klaren Regel, etwa einer Stunde am Tag, verliert man nicht so leicht das Gefühl für die Zeit.', 'Dem kann man entgegenhalten, dass Jugendliche selbst lernen müssen, wann genug ist.'],
        ['Bewegung ist wichtig für die Gesundheit.', 'Statt stundenlang zu sitzen, könnte man mit Freunden Rad fahren oder schwimmen gehen.', 'Zwar ist Bewegung wichtig, doch viele Jugendliche treiben neben dem Spielen regelmäßig Sport.'],
      ],
      C: [
        ['Jugendliche sollten lernen, ihre Zeit selbst einzuteilen.', 'Wer selbst entscheidet, wann er aufhört, übt Verantwortung.', 'Zwar ist Selbstständigkeit wichtig, aber gerade am Anfang helfen klare Regeln, das zu lernen.'],
        ['Viele Spiele fördern Teamarbeit und schnelles Denken.', 'In Mannschaftsspielen muss man sich absprechen und gemeinsam Strategien entwickeln.', 'Das stimmt nur teilweise, denn Teamarbeit kann man auch im Sportverein oder in der Schule üben.'],
        ['Spielen ist für viele ein Weg, Freunde zu treffen.', 'Abends verabreden sich Freunde online, die in verschiedenen Städten wohnen.', 'Zwar trifft man online Freunde, doch auch mit einer Zeitbegrenzung bleibt dafür noch genug Zeit.'],
      ],
    },
    {
      q: 'Sollte jede Klasse jedes Jahr eine Klassenfahrt machen?', topic: 'Klassenfahrten',
      pro: 'Jede Klasse sollte jedes Jahr eine Klassenfahrt machen.', contra: 'Klassenfahrten sollte es nicht jedes Jahr geben.',
      P: [
        ['Klassenfahrten stärken die Klassengemeinschaft.', 'Bei einer Nachtwanderung lernt man Mitschüler von einer ganz neuen Seite kennen.', 'Zwar stärken Fahrten die Gemeinschaft, aber das schaffen auch Wandertage und Projekttage, die weniger kosten.'],
        ['Auf Klassenfahrten lernt man außerhalb des Klassenzimmers.', 'Im Museum oder im Wald versteht man vieles besser als nur aus dem Buch.', 'Dem kann man entgegenhalten, dass Museen und Wälder auch bei Tagesausflügen erreichbar sind.'],
        ['Auf Klassenfahrten wird man selbstständiger.', 'Wer eine Woche ohne Eltern unterwegs ist, muss sein Geld und seine Sachen selbst im Blick behalten.', 'Das stimmt, doch dafür muss die Fahrt nicht jedes Jahr stattfinden.'],
      ],
      C: [
        ['Klassenfahrten sind für manche Familien zu teuer.', 'Wenn eine Fahrt mehrere hundert Euro kostet, können nicht alle Eltern das jedes Jahr bezahlen.', 'Zwar sind Fahrten teuer, aber es gibt Fördervereine und Zuschüsse, damit alle mitfahren können.'],
        ['Während der Fahrt fällt an der Schule Unterricht aus.', 'Andere Klassen haben Vertretungsunterricht, weil die Lehrkräfte mitfahren.', 'Dem kann man entgegenhalten, dass Vertretungsstunden gut planbar sind, weil Fahrten lange vorher feststehen.'],
        ['Nicht alle fühlen sich auf Klassenfahrten wohl.', 'Wer Heimweh hat oder nicht gern im Mehrbettzimmer schläft, erlebt eine anstrengende Woche.', 'Zwar fühlen sich nicht alle sofort wohl, aber gerade auf Fahrten lernen viele, mit Heimweh umzugehen.'],
      ],
    },
  ];

  // Feststellung (F) oder These (T). Bei Thesen: Kennzeichen-Typ und Signalwort.
  const SIG = {
    modal: 'Forderung / Modalverb (sollte, müsste, darf …)',
    wertung: 'Wertung (gut, schlecht, sinnvoll, überflüssig …)',
    vergleich: 'Vergleich oder Superlativ (besser als, am schönsten …)',
    meinung: 'Meinungs-Signal (ich finde, meiner Meinung nach …)',
    verallg: 'Verallgemeinerung (alle, jeder, immer …)',
  };
  const SENTENCES = [
    ['Berlin ist die Hauptstadt Deutschlands.', 'F', 'Das kann man nachprüfen – niemand muss es begründen.'],
    ['Ein Jahr hat zwölf Monate.', 'F', 'Eine nachprüfbare Tatsache.'],
    ['Wasser gefriert bei 0 Grad Celsius.', 'F', 'Eine nachprüfbare Tatsache aus den Naturwissenschaften.'],
    ['In Deutschland gibt es eine Schulpflicht.', 'F', 'Das steht im Gesetz – man kann es nachprüfen.'],
    ['Der Rhein fließt durch Köln.', 'F', 'Ein Blick auf die Landkarte genügt.'],
    ['In der Klasse 8a sind 28 Schülerinnen und Schüler.', 'F', 'Man kann einfach nachzählen.'],
    ['Die Mensa öffnet um 12 Uhr.', 'F', 'Eine überprüfbare Angabe ohne Wertung.'],
    ['Eine Fußballmannschaft besteht aus elf Spielern auf dem Feld.', 'F', 'Das steht in den Spielregeln.'],
    ['Im Jahr 2024 fanden in Paris die Olympischen Sommerspiele statt.', 'F', 'Eine nachprüfbare Tatsache.'],
    ['Die Deutscharbeit wird am Freitag geschrieben.', 'F', 'Ein Termin – nachprüfbar und nicht strittig.'],
    ['Bienen bestäuben Blüten.', 'F', 'Eine Tatsache aus der Biologie.'],
    ['Viele Jugendliche besitzen ein Smartphone.', 'F', 'Achtung: Das „viele“ wertet nicht, es beschreibt. Man kann es mit Umfragen überprüfen.'],
    ['Ich habe gestern zwei Stunden Fußball gespielt.', 'F', 'Achtung: Auch eine Aussage über sich selbst kann eine Feststellung sein – sie enthält keine Meinung.'],
    ['Die Schule beginnt um 8 Uhr.', 'F', 'Eine Angabe aus dem Stundenplan.'],
    ['Unsere Schule hat einen eigenen Schulgarten.', 'F', 'Man kann nachsehen, ob es stimmt.'],
    ['Der Monat Februar hat meistens 28 Tage.', 'F', 'Eine nachprüfbare Tatsache.'],
    ['Handys sollten an Schulen verboten werden.', 'T', 'Eine Forderung, über die man streiten kann.', 'modal', 'sollten'],
    ['Die Schule müsste später beginnen.', 'T', 'Eine Forderung – man kann dafür oder dagegen sein.', 'modal', 'müsste'],
    ['Man darf Kindern das Computerspielen nicht verbieten.', 'T', 'Eine Forderung mit Modalverb.', 'modal', 'darf … nicht'],
    ['Schuluniformen sollten Pflicht werden.', 'T', 'Eine strittige Forderung.', 'modal', 'sollten'],
    ['Jugendliche sollten mehr Bücher lesen.', 'T', 'Eine Forderung, die begründet werden muss.', 'modal', 'sollten'],
    ['Hausaufgaben sind überflüssig.', 'T', 'Eine Wertung – viele würden widersprechen.', 'wertung', 'überflüssig'],
    ['Ein Tempolimit auf Autobahnen wäre sinnvoll.', 'T', 'Ob etwas „sinnvoll“ ist, ist eine Wertung.', 'wertung', 'sinnvoll'],
    ['Die Ferien sind viel zu kurz.', 'T', '„Zu kurz“ ist eine Bewertung, keine nachprüfbare Tatsache.', 'wertung', 'zu kurz'],
    ['Zoos sind Tierquälerei.', 'T', 'Eine starke Wertung, über die man streiten kann.', 'wertung', 'Tierquälerei'],
    ['Das Mensaessen schmeckt schrecklich.', 'T', 'Geschmack ist eine persönliche Wertung.', 'wertung', 'schrecklich'],
    ['Fußball ist der schönste Sport der Welt.', 'T', 'Ein Superlativ mit Wertung – andere sehen das anders.', 'vergleich', 'der schönste'],
    ['Bücher sind besser als Filme.', 'T', 'Ein wertender Vergleich.', 'vergleich', 'besser als'],
    ['Lesen ist wichtiger als Fernsehen.', 'T', 'Ein wertender Vergleich.', 'vergleich', 'wichtiger als'],
    ['Klassenfahrten sind das Beste am ganzen Schuljahr.', 'T', 'Ein Superlativ, der eine Meinung ausdrückt.', 'vergleich', 'das Beste'],
    ['Meiner Meinung nach ist Mathe das wichtigste Schulfach.', 'T', 'Schon das Signal „meiner Meinung nach“ zeigt: Hier steht ein Standpunkt.', 'meinung', 'meiner Meinung nach'],
    ['Ich finde, dass die Mensa gesünderes Essen anbieten sollte.', 'T', '„Ich finde“ leitet eine Meinung ein.', 'meinung', 'ich finde'],
    ['Ich bin überzeugt, dass Tablets das Lernen verbessern.', 'T', '„Ich bin überzeugt“ zeigt einen Standpunkt.', 'meinung', 'ich bin überzeugt'],
    ['Jeder Jugendliche braucht ein eigenes Smartphone.', 'T', 'Eine Verallgemeinerung, die man begründen müsste.', 'verallg', 'jeder'],
    ['Alle Kinder lieben Haustiere.', 'T', 'Eine Verallgemeinerung – stimmt sicher nicht für alle.', 'verallg', 'alle'],
    ['Computerspiele machen immer aggressiv.', 'T', '„Immer“ verallgemeinert – darüber kann man streiten.', 'verallg', 'immer'],
  ];

  // Belege und ihre Art
  const BELEG_TYPES = ['Beispiel', 'eigene Erfahrung', 'Aussage einer Fachperson', 'Umfrage / Zahl', 'Tatsache', 'Vergleich'];
  const BELEGE = [
    ['Zum Beispiel vibrierte gestern in der Mathestunde fünfmal ein Handy.', 'Beispiel'],
    ['Im Museum kann man zum Beispiel echte Dinosaurierknochen sehen, die im Buch nur abgebildet sind.', 'Beispiel'],
    ['So kann man etwa im Erdkundeunterricht mit einer Karten-App ein Land sofort finden.', 'Beispiel'],
    ['Ich habe selbst erlebt, dass ich nach langem Spielen am Abend im Unterricht kaum wach war.', 'eigene Erfahrung'],
    ['Meine Schwester hat in der Ganztagsschule viele neue Freunde gefunden.', 'eigene Erfahrung'],
    ['Als ich letztes Jahr mit auf Klassenfahrt war, habe ich meine Mitschüler ganz neu kennengelernt.', 'eigene Erfahrung'],
    ['Die Kinderärztin Dr. Lena Roth erklärt, dass Jugendliche etwa neun Stunden Schlaf brauchen.', 'Aussage einer Fachperson'],
    ['Der Schulleiter berichtet, seit dem Handyverbot gebe es auf dem Schulhof weniger Streit.', 'Aussage einer Fachperson'],
    ['Eine Umfrage in unserer Jahrgangsstufe ergab: 20 von 28 Schülern wünschen sich einen späteren Schulbeginn.', 'Umfrage / Zahl'],
    ['In unserer Klasse haben 25 von 27 Kindern ein eigenes Handy.', 'Umfrage / Zahl'],
    ['Bei der Europawahl 2024 durften in Deutschland zum ersten Mal schon 16-Jährige wählen.', 'Tatsache'],
    ['Im Winter ist es in Deutschland morgens um halb acht oft noch dunkel.', 'Tatsache'],
    ['Wie ein Sportler vor dem Wettkampf trainiert, so übt man mit Hausaufgaben vor der Klassenarbeit.', 'Vergleich'],
    ['Ein Handy im Unterricht ist wie ein Fernseher, der im Klassenzimmer läuft – man schaut immer wieder hin.', 'Vergleich'],
  ];

  // Konnektoren: [Satz mit ___, richtig, [falsch …], Erklärung]
  const CONNECT = [
    ['Handys lenken ab, ___ ständig Nachrichten ankommen.', 'weil', ['deshalb', 'obwohl', 'trotzdem'], '„weil“ leitet eine Begründung ein.'],
    ['Hausaufgaben festigen den Stoff. ___ kann man Vokabeln zu Hause in Ruhe wiederholen.', 'Zum Beispiel', ['Obwohl', 'Trotzdem', 'Weil'], '„Zum Beispiel“ leitet einen Beleg ein.'],
    ['Viele Jugendliche sind morgens müde. ___ sollte die Schule später beginnen.', 'Deshalb', ['Obwohl', 'Weil', 'Zum Beispiel'], '„Deshalb“ zieht eine Schlussfolgerung.'],
    ['Zwar machen Noten Druck, ___ sie können auch motivieren.', 'aber', ['weil', 'deshalb', 'denn'], '„Zwar … aber …“ stellt ein Gegenargument und eine Einschränkung gegenüber.'],
    ['Tablets machen den Ranzen leichter. ___ lassen sie sich schnell aktualisieren.', 'Außerdem', ['Obwohl', 'Trotzdem', 'Denn'], '„Außerdem“ fügt ein weiteres Argument hinzu.'],
    ['Zoos sind wichtig, ___ sie schützen bedrohte Tierarten.', 'denn', ['obwohl', 'trotzdem', 'deshalb'], '„denn“ leitet eine Begründung ein (danach steht das Verb an zweiter Stelle).'],
    ['Einige meinen, Uniformen seien teuer. ___ sparen Familien dann teure Markenkleidung.', 'Doch', ['Deshalb', 'Weil', 'Zum Beispiel'], '„Doch“ leitet einen Einwand ein – typisch für eine Widerlegung.'],
    ['Klassenfahrten sind teuer. ___ sollten sie stattfinden, weil sie die Gemeinschaft stärken.', 'Trotzdem', ['Deshalb', 'Weil', 'Zum Beispiel'], '„Trotzdem“ zeigt: Obwohl es einen Nachteil gibt, bleibt man bei seiner These.'],
    ['Viele Schüler wünschen sich mehr Pausen, ___ sie sich dann besser konzentrieren können.', 'da', ['deshalb', 'trotzdem', 'außerdem'], '„da“ leitet wie „weil“ eine Begründung ein.'],
  ];

  // Texte mit Zeilennummern zum Zitieren
  const TEXTS = [
    {
      id: 'A', title: 'Text A: Handys in der Pause – Fluch oder Segen?',
      lines: [
        'Seit dem letzten Schuljahr gilt an der Lindenschule eine neue Regel:',
        'In den Pausen bleiben die Handys im Schulranzen. Die Schulleiterin',
        'Frau Berger erklärt, die Geräte seien „eine ständige Ablenkung“ gewesen.',
        'Viele Schülerinnen und Schüler hätten in den Pausen nur noch auf ihre',
        'Bildschirme gestarrt, statt miteinander zu reden oder sich zu bewegen.',
        'Inzwischen sei der Schulhof wieder deutlich lauter und lebendiger.',
        'Nicht alle sind mit der Regel zufrieden. Der Schülersprecher Malik',
        'kritisiert, dass die Schüler bei der Entscheidung nicht gefragt wurden.',
        '„Wir hätten gerne mitgeredet“, sagt er. Außerdem könne man das Handy',
        'auch sinnvoll nutzen, etwa um schnell etwas nachzuschlagen.',
        'Eine Elternvertreterin meint dagegen, die Kinder würden nun',
        '„endlich wieder richtig Pause machen“.',
      ],
      // [Zitat, Zeile(n), veränderte Fassung]
      quotes: [
        ['In den Pausen bleiben die Handys im Schulranzen', [2], 'In den Pausen bleiben die Handys in der Tasche'],
        ['nur noch auf ihre Bildschirme gestarrt', [4, 5], 'nur noch auf ihre Displays gestarrt'],
        ['statt miteinander zu reden oder sich zu bewegen', [5], 'statt miteinander zu sprechen oder sich zu bewegen'],
        ['wieder deutlich lauter und lebendiger', [6], 'wieder viel lauter und lebendiger'],
        ['Nicht alle sind mit der Regel zufrieden', [7], 'Nicht alle sind mit dem Verbot zufrieden'],
        ['bei der Entscheidung nicht gefragt', [8], 'bei der Entscheidung nicht beteiligt'],
        ['Außerdem könne man das Handy auch sinnvoll nutzen', [9, 10], 'Außerdem könne man das Smartphone auch sinnvoll nutzen'],
        ['etwa um schnell etwas nachzuschlagen', [10], 'etwa um schnell etwas nachzusehen'],
        ['Seit dem letzten Schuljahr gilt an der Lindenschule eine neue Regel', [1], 'Seit diesem Schuljahr gilt an der Lindenschule eine neue Regel'],
      ],
    },
    {
      id: 'B', title: 'Text B: Brauchen wir noch gedruckte Schulbücher?',
      lines: [
        'Immer mehr Schulen in Deutschland setzen auf Tablets. Befürworter',
        'betonen, dass digitale Bücher den Schulranzen leichter machen und',
        'sich schnell aktualisieren lassen. Doch es gibt auch Kritik:',
        'Eine Lehrerin aus Hamburg berichtet, ihre Klasse lese auf Papier',
        'aufmerksamer als am Bildschirm. Zudem lenkten Benachrichtigungen',
        'und Spiele leicht vom eigentlichen Lernen ab. Ein Schüler aus der',
        'neunten Klasse sieht das anders: Mit dem Tablet könne er Videos',
        'anhalten, Notizen ergänzen und Aufgaben sofort überprüfen. Für ihn',
        'sei das „viel spannender als jedes dicke Buch“. Fest steht: Wie gut',
        'Tablets wirken, hängt stark davon ab, wie sie im Unterricht',
        'eingesetzt werden.',
      ],
      quotes: [
        ['Immer mehr Schulen in Deutschland setzen auf Tablets', [1], 'Immer mehr Schulen in Deutschland setzen auf Laptops'],
        ['den Schulranzen leichter machen', [2], 'den Schulranzen leichter gestalten'],
        ['sich schnell aktualisieren lassen', [3], 'sich rasch aktualisieren lassen'],
        ['Doch es gibt auch Kritik', [3], 'Doch es gibt auch Bedenken'],
        ['auf Papier aufmerksamer als am Bildschirm', [4, 5], 'auf Papier konzentrierter als am Bildschirm'],
        ['leicht vom eigentlichen Lernen ab', [6], 'leicht vom richtigen Lernen ab'],
        ['Notizen ergänzen und Aufgaben sofort überprüfen', [8], 'Notizen ergänzen und Aufgaben gleich überprüfen'],
        ['hängt stark davon ab, wie sie im Unterricht eingesetzt werden', [10, 11], 'hängt sehr davon ab, wie sie im Unterricht eingesetzt werden'],
      ],
    },
  ];

  root.DeData = { STREIT, SIG, SENTENCES, BELEG_TYPES, BELEGE, CONNECT, TEXTS };
})(window);
