e.GO-digital-Hackathon

#Stressfrei - Team eHochKappa

## Web Application
Diese Application hängt von folgenden Projekten ab:
- [Onsen UI](https://onsen.io/)
- [Socket.io](https://socket.io/)
- [Leaflet](https://leafletjs.com/)
- [Fontawesome](https://fontawesome.com/) 
- [Apexcharts](https://apexcharts.com/)
- [Node.js](https://nodejs.org/en/) (Version 10.x)

### Messdaten
Die Messdaten werden mit Python analysiert und in JSON-Files gespeichert. Diese JSON-Files werden in den nodejs/public Ordner kopiert. Von dort aus können die Clients darauf zugreifen.

### Forntend
Die Files für diesen Teil befinden sich in nodejs und nodejs/public.
Die Struktur des Forntends orientiert sich an der Struktur von Onsen UI. index.html definiert die beiden Onsen-Seiten der Web-App. Für die dynamische Erzeugung von Elementen wurden Funktionen in kappa_lib.js definiert.

- page1: Auf der ersten werden als Elemente der Onsen-Navigator <ons-navigator> und die MiniTripCard der Funktion setMiniTripCard verwendet.
- page2: Auf der zweiten Seite werden die selbstgeschriebenen Elemente MapCard, Chart und SpeedStressCard verwendet.

Bei einer Verbindung mit dem Server wird zuerst page1 aufgerufen. Über den Socket werden die Informationen über die erhältlichen Fahrten übermittelt. Mit dem Click auf eine Card wird die Detailansicht in page2 aufgerufen. Dazu wird zuerst über die Funkion loadPage() der JSON-File mit allen Messdaten in den Browser geladen. Danach werden die DOM-Elemente einzeln erzeugt und mit den geladenen Daten versorgt.

### Backend
Zu Beginn der Ausführung des Node.js-Servers werden Allgemeindaten der Fahrten aus den JSON-Files in den Arbeitsspeicher geladen und von dort aus, über den Socket, an die Clients weiterverteilt. Die großen Datenmengen holen sich die Clients über jQuery gleich aus den JSON-Dateien.
Node.js wird hier über index.js ausgeführt.

Anmerkung: Die Socket Infrastruktur ist besonders angenehm für eine Realtime-Erweiterung der Web-App.

