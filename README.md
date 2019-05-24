e.GO-digital-Hackathon

# Stressfrei - Team eHochKappa

### Motivation
Jeder kennt es: Auf der Autobahn wird von hinten gedrängelt; in der Stadt meint jeder Vorfahrt zu haben. Das nervt!

Wie wäre es, wenn es eine App gäbe, die den aktuelle Fahrstiel des Fahrers ermittelt und die auf einer Heatmap gespeichert wird. So können andere Nutzer Ihre Route um diese Hotspots herum planen und so eine entspannte Reise genießen.

### Sensorik
Aus dem e.GO Fahrzeug werden folgende Messgrößen verwendet:

| Messgröße 					| 	Verwendung 	|
| -------- | ------- |
| 	puls 						| 	Der Puls des Fahrers ist ein direkter Indikator für den Stress des Fahrers. 	|
| 	speed 						|	Die Geschwindigekit und die Beschleunigung wird ebenfalls genutzt, um den Stress des Fahrers zu bestimmen. Diese Größe kann auch benutzt werden, wenn kein Puls gemessen werden kann. |
| 	location 					| 	Die Position des Fahrzeuges wird benötigt, um die Karte zu generrieren. 	|
| 	power_consumption 			| 	Diese Größe kann mit berücksichtigt werden, wenn man die durch das Gaspedal geforderte Beschleunigung bestimmen möchte. 
| 	drive_mode 					| 	Ob der Fahrer sich im Sport oder im ECO Modus befindet kann ebenfalls zur bestimmung des Stresses des Fahrers genutzt werden. 
| 	flash 						| 	Ob der Fahrer die Lichthupe oft betätigt
| 	distance_to_object_ 		|	Sollte der Fahrer auf andere Fahrzeuge Auffahren (konkret drengeln) oder andere Fahrzeuge knapp überholen (Schneiden), kann man dieses Verhalten aus den Abständen nach hinten und nach vorne ableiten. (In kombination mit harten Lenkbewegungen)
| 	tire_pressure_back_ 		| 	Wenn der Fahrer eine Kurve zu schnell nehemn sollte, kann man durch die Differenz des Reifendrucks zwischen der Rechten und Linken seinte eine Größe finden, welche die Schäglage des Fahrzeuges beschreibt.

### Stress
Die Größe, nach der wir suchen, ist der Stress, welcher ein Fahrer Verursacht bzw selber verspürt. Wenn Dicht aufgefahren wird, der Puls hoch ist oder intensiev gebremsst wird, sollte der Stress-Wert hoch sein.

### Simulation
Da wir nicht alle Daten Simlieren konnten haben wir uns dazu entschlussen mit einem Vergleichbaren Fahrzeugt und einem Smartphone die GPS Datenpunkte selber zu generrieren. Dazu haben wir die Software phyphox der RWTH sowie einen VW Up genutzt.

### Signalweg
Für ein Fertiges Produkt ist es Sinnvoll diese Daten auf dem Boardcomputer im e.GO zu verarbeiten und nach der Fahrt (oder in Packeten) die Ergebnisse auf einen Server zu schicken,

### Web Application
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

