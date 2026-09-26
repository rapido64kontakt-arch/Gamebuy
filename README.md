# GamePath MVP

Ein klickbarer MVP für die Idee: "Sag uns, welches Game du willst. Wir finden den günstigsten Kaufweg."

## Start
Öffne `index.html` direkt im Browser.

Für lokales Hosting:
```bash
python3 -m http.server 8080
```
Dann `http://localhost:8080` öffnen.

## Was funktioniert
- Natural-Language-artige Suche für drei Demo-Games
- Berechnung des effektiven Preises aus mehreren Guthabenkarten
- Ersparnis und Prozentvorteil
- Responsive UI
- Fake-Door-Kaufbutton zur Validierung der Kaufabsicht

## Wichtig
Die enthaltenen Preise sind Demo-/Beispieldaten. Vor einem öffentlichen Livegang müssen Preis-APIs, Affiliate-Links, Analytics, rechtliche Texte und ein echtes Backend angeschlossen werden.

## Sinnvolle nächste technische Schritte
1. Preis-API/Partnerfeeds anbinden
2. Giftcard-Kombinationsoptimierer serverseitig bauen
3. Suchparser/LLM für Spiel + Plattform + Region
4. Analytics für Search -> Result -> Buy Intent
5. Affiliate Redirect Service
6. Erst nach Validierung: Reseller-API + Payment + Code-Auslieferung
