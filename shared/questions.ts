export type QuestionType = "multiple-choice" | "true-false" | "open" | "calculation" | "table-fill";

export interface Answer {
  id: string;
  text: string;
  correct: boolean;
  explanation?: string;
}

export interface Question {
  id: string;
  topicId: string;
  type: QuestionType;
  question: string;
  answers?: Answer[];
  modelAnswer?: string;          // Musterlösung für open/table-fill
  keyPoints?: string[];          // Stichpunkte die bewertet werden
  explanation: string;
  tip?: string;
  difficulty: "leicht" | "mittel" | "schwer";
  points: number;
  source?: string;               // z.B. "IHK Frühjahr 2024"
}

export interface Topic {
  id: string;
  title: string;
  icon: string;
  description: string;
  color: string;
  questions: Question[];
}

export const topics: Topic[] = [

  // ══════════════════════════════════════════════════════════════
  // 1. NETZWERKTECHNIK
  // ══════════════════════════════════════════════════════════════
  {
    id: "netzwerk",
    title: "Netzwerktechnik",
    icon: "Network",
    description: "Subnetting, IPv4/IPv6, OSI-Modell, Protokolle, Fehlerdiagnose, VLANs, Routing",
    color: "blue",
    questions: [
      {
        id: "nw-01", topicId: "netzwerk", type: "calculation", difficulty: "mittel", points: 4, source: "IHK AP1 2026",
        question: "Du erhältst die IP-Adresse 192.168.16.52 /25. Berechne: Subnetzmaske, Netzadresse, Broadcast-Adresse und Anzahl nutzbarer Hosts.",
        modelAnswer: "Subnetzmaske: 255.255.255.128\nNetzadresse: 192.168.16.0\nBroadcast: 192.168.16.127\nNutzbare Hosts: 2^7 - 2 = 126",
        keyPoints: ["255.255.255.128", "192.168.16.0", "192.168.16.127", "126 nutzbare Hosts"],
        explanation: "/25 = 25 Einsen im Subnetz = 255.255.255.128. Block: 2^7 = 128 Adressen pro Subnetz. 192.168.16.52 liegt im Block 0–127 → Netz: .0, Broadcast: .127. Nutzbar: 128-2 = 126.",
        tip: "Formel Hosts: 2^(32-Präfix) - 2. /25 → 2^7-2 = 126. Netzadresse = erstes, Broadcast = letztes im Block."
      },
      {
        id: "nw-02", topicId: "netzwerk", type: "multiple-choice", difficulty: "leicht", points: 2,
        question: "Welches Protokoll ermöglicht den gleichzeitigen Betrieb von IPv4 und IPv6 auf einem Gerät?",
        answers: [
          { id: "a", text: "Dual Stack", correct: true, explanation: "Dual Stack = beide Protokollstacks gleichzeitig aktiv auf einer Schnittstelle." },
          { id: "b", text: "NAT64", correct: false, explanation: "NAT64 übersetzt IPv6 → IPv4, kein paralleler Betrieb." },
          { id: "c", text: "Tunneling (6in4)", correct: false, explanation: "Tunneling kapselt IPv6 in IPv4-Paketen, kein echtes Dual-Stack." },
          { id: "d", text: "SLAAC", correct: false, explanation: "SLAAC ist IPv6-Adresszuweisung, kein Dual-Stack-Protokoll." },
        ],
        explanation: "Dual Stack: Gerät hat sowohl eine IPv4- als auch eine IPv6-Adresse. Es kommuniziert je nach Gegenüber über das passende Protokoll. Übergangstechnologien: Dual Stack, Tunneling, NAT64/DNS64.",
        tip: "Gleichzeitig = Dual Stack. Übersetzung = NAT64. Kapselung = Tunneling."
      },
      {
        id: "nw-03", topicId: "netzwerk", type: "open", difficulty: "mittel", points: 4,
        question: "Nenne und erkläre zwei wesentliche Unterschiede zwischen IPv4 und IPv6.",
        modelAnswer: "1. Adresslänge: IPv4 = 32 Bit (~4,3 Mrd. Adressen), IPv6 = 128 Bit (3,4×10^38 Adressen) → IPv6 löst Adressknappheit.\n2. NAT: IPv4 benötigt NAT für private Netze, IPv6 macht NAT überflüssig (genug öffentliche Adressen).\nWeitere gültige Unterschiede: IPv6 hat vereinfachten Header (feste Länge), IPv6 unterstützt Auto-Konfiguration (SLAAC), IPv6 hat keine Broadcast-Adressen (nur Multicast/Anycast).",
        keyPoints: ["32 Bit vs. 128 Bit", "Adressknappheit gelöst", "kein NAT nötig bei IPv6", "vereinfachter Header"],
        explanation: "IPv4: 32 Bit, Dezimal-Notation (192.168.1.1), NAT nötig, Broadcast. IPv6: 128 Bit, Hex-Notation (2001:db8::1), kein NAT, Multicast statt Broadcast, IPSec integriert, SLAAC für Autokonfiguration.",
        tip: "Merke: IPv4 = 32 Bit, NAT nötig. IPv6 = 128 Bit, kein NAT, kein Broadcast."
      },
      {
        id: "nw-04", topicId: "netzwerk", type: "open", difficulty: "mittel", points: 8,
        question: "Beim Versuch eine Website aufzurufen tritt ein Fehler auf. Fülle die Tabelle aus: Für jeden der folgenden Fehler nenne eine Überprüfung und eine Fehlerbehebung:\n• Patchkabel am Laptop defekt\n• Netzwerkdose nicht gepatcht\n• Namensauflösung funktioniert nicht\n• Netzwerkadresse passt nicht zur Range",
        modelAnswer: "Patchkabel defekt:\n→ Überprüfung: Anderes Kabel anschließen / LED-Status am Switch prüfen / Kabeltester\n→ Behebung: Defektes Patchkabel austauschen\n\nNetzwerkdose nicht gepatcht:\n→ Überprüfung: Patchfeld prüfen / Kabelverbindung im Verteiler kontrollieren\n→ Behebung: Dose im Patchfeld korrekt verbinden (patchen)\n\nNamensauflösung defekt:\n→ Überprüfung: nslookup <hostname> / ping auf DNS-Server-IP\n→ Behebung: Korrekten DNS-Server in Netzwerkeinstellungen eintragen\n\nNetzwerkadresse falsch:\n→ Überprüfung: ipconfig /all → IP mit Subnetzmaske und Gateway vergleichen\n→ Behebung: Korrekte IP-Adresse aus dem richtigen Subnetz zuweisen (DHCP oder manuell)",
        keyPoints: ["Kabel austauschen/testen", "Patchfeld kontrollieren", "nslookup / DNS prüfen", "ipconfig /all", "IP-Adresse korrigieren"],
        explanation: "Systematische Fehlersuche: OSI von unten → oben. Layer 1 (Kabel, Dose) → Layer 2 (Switch, VLAN) → Layer 3 (IP, Subnetz, DNS). Diagnosebefehle: ping, ipconfig/ifconfig, nslookup, traceroute.",
        tip: "Prüfung: pro Fehler wird je 1 Punkt für Überprüfung und 1 Punkt für Behebung gegeben."
      },
      {
        id: "nw-05", topicId: "netzwerk", type: "multiple-choice", difficulty: "leicht", points: 2,
        question: "Auf welcher OSI-Schicht arbeitet ein Switch?",
        answers: [
          { id: "a", text: "Schicht 2 (Data Link) – anhand MAC-Adressen", correct: true, explanation: "Switches lernen MAC-Adressen und leiten Frames gezielt weiter (Layer 2)." },
          { id: "b", text: "Schicht 1 (Physical) – wie ein Hub", correct: false, explanation: "Hubs arbeiten auf Layer 1 und fluten alle Ports." },
          { id: "c", text: "Schicht 3 (Network) – anhand IP-Adressen", correct: false, explanation: "Layer-3-Switches können das, Standard-Switches nicht." },
          { id: "d", text: "Schicht 4 (Transport) – anhand Ports", correct: false, explanation: "Layer-4-Switching ist eine spezielle Funktion, keine Grundlage." },
        ],
        explanation: "OSI-Gerätezuordnung: Hub → L1, Switch → L2 (MAC), Router → L3 (IP), Firewall/Proxy → L4-L7. Ein Switch lernt MAC-Adressen aus eingehenden Frames und baut eine MAC-Adresstabelle auf.",
        tip: "Merktabelle: L1=Hub/Kabel, L2=Switch/Bridge (MAC), L3=Router (IP)"
      },
      {
        id: "nw-06", topicId: "netzwerk", type: "open", difficulty: "mittel", points: 4,
        question: "Erkläre den DHCP-DORA-Prozess. Beschreibe kurz was in jedem der vier Schritte passiert.",
        modelAnswer: "D – Discover: Client sendet Broadcast-Paket ins Netzwerk um DHCP-Server zu finden (ohne eigene IP)\nO – Offer: DHCP-Server antwortet mit einem Angebot (IP-Adresse, Subnetzmaske, Gateway, DNS, Lease-Zeit)\nR – Request: Client wählt ein Angebot und sendet Broadcast-Anfrage, welches Angebot er annimmt\nA – Acknowledge: DHCP-Server bestätigt die Zuweisung und der Client konfiguriert seine Netzwerkschnittstelle",
        keyPoints: ["Discover = Broadcast Suche", "Offer = Angebot vom Server", "Request = Anforderung durch Client", "Acknowledge = Bestätigung"],
        explanation: "DORA-Prozess läuft beim Boot oder bei 'ipconfig /renew'. Lease-Zeit bestimmt wie lange die IP gültig ist. Nach 50% der Lease-Zeit versucht der Client zu verlängern. APIPA (169.254.x.x) greift wenn kein DHCP-Server erreichbar ist.",
        tip: "Eselsbrücke: D-O-R-A wie die Erkunderin. Discover → Offer → Request → Acknowledge."
      },
      {
        id: "nw-07", topicId: "netzwerk", type: "multiple-choice", difficulty: "mittel", points: 3,
        question: "Welche Aussage zu VLANs (Virtual Local Area Networks) ist korrekt?",
        answers: [
          { id: "a", text: "VLANs trennen Broadcasts logisch, auch wenn Geräte am selben physischen Switch hängen", correct: true, explanation: "Genau: VLANs sind logische Trennungen auf Layer 2. Verschiedene VLANs können nicht direkt kommunizieren (brauchen Router/L3-Switch)." },
          { id: "b", text: "VLANs erfordern immer separate physische Switches", correct: false, explanation: "Ein Switch kann mehrere VLANs verwalten – das ist gerade der Vorteil." },
          { id: "c", text: "VLANs erhöhen automatisch die Bandbreite", correct: false, explanation: "VLANs trennen Broadcast-Domänen, erhöhen aber nicht direkt die Bandbreite." },
          { id: "d", text: "Alle VLANs können ohne Router miteinander kommunizieren", correct: false, explanation: "Inter-VLAN-Routing benötigt einen Router oder Layer-3-Switch." },
        ],
        explanation: "VLANs: Logische Netzwerksegmentierung. Tagged (802.1Q): mehrere VLANs auf einem Trunk-Port. Untagged: Access-Port gehört zu genau einem VLAN. Vorteile: Sicherheit, Broadcast-Reduzierung, Flexibilität. Inter-VLAN-Routing: über Router-on-a-Stick oder L3-Switch.",
        tip: "VLAN = virtuelle Broadcast-Domäne. Kommunikation zwischen VLANs immer über L3 (Routing)."
      },
      {
        id: "nw-08", topicId: "netzwerk", type: "calculation", difficulty: "schwer", points: 5,
        question: "Ein Live-Stream hat folgende Parameter: Auflösung 1920×1080 Pixel, 30 fps, Farbtiefe 24 Bit, Komprimierung 30%. Berechne die benötigte Übertragungsrate in Mbit/s (gerundet auf ganze Zahlen). Rechenweg angeben.",
        modelAnswer: "Schritt 1: Pixel pro Frame = 1920 × 1080 = 2.073.600 Pixel\nSchritt 2: Bit pro Frame = 2.073.600 × 24 = 49.766.400 Bit\nSchritt 3: Bit pro Sekunde = 49.766.400 × 30 = 1.492.992.000 Bit/s = 1.493 Mbit/s\nSchritt 4: Mit 30% Komprimierung (nur 70% der Daten): 1.493 × 0,70 = 1.045 Mbit/s\nErgebnis: ≈ 1.045 Mbit/s",
        keyPoints: ["1920×1080 = 2.073.600 Pixel", "×24 Bit Farbtiefe", "×30 fps", "÷ 1.000.000 = Mbit/s", "×0,7 (30% Komprimierung)"],
        explanation: "Formel: Auflösung(Pixel) × Farbtiefe(Bit) × FPS = Rohdatenrate(Bit/s). Durch 1.000.000 → Mbit/s. Komprimierung 30% bedeutet: 70% der Originaldaten bleiben → ×0,70.",
        tip: "Komprimierung X% → Faktor (1 - X/100). Rechenweg unbedingt angeben, Teilpunkte!"
      },
      {
        id: "nw-09", topicId: "netzwerk", type: "open", difficulty: "leicht", points: 3,
        question: "Nenne drei Unterschiede zwischen TCP und UDP.",
        modelAnswer: "1. Verbindungsaufbau: TCP = verbindungsorientiert (3-Way-Handshake), UDP = verbindungslos\n2. Zuverlässigkeit: TCP garantiert Ankunft und Reihenfolge, UDP nicht (kein ACK)\n3. Overhead/Geschwindigkeit: TCP hat mehr Overhead und ist langsamer, UDP ist schneller\n4. Einsatz: TCP für Datenübertragung (HTTP, SSH, FTP), UDP für Streaming, VoIP, DNS, Gaming",
        keyPoints: ["verbindungsorientiert vs. verbindungslos", "garantierte Zustellung (ACK) bei TCP", "TCP langsamer/zuverlässiger, UDP schneller/unzuverlässiger"],
        explanation: "TCP (Transmission Control Protocol): 3-Way-Handshake (SYN→SYN-ACK→ACK), ACK für jedes Paket, Flusskontrolle, Fehlerkorrektur. UDP (User Datagram Protocol): Fire-and-forget, kein ACK, gut für zeitkritische Anwendungen.",
        tip: "TCP = Telefon (Verbindung aufgebaut, zuverlässig). UDP = Postkarte (abschicken, ankommen ungewiss)."
      },
      {
        id: "nw-10", topicId: "netzwerk", type: "multiple-choice", difficulty: "leicht", points: 2,
        question: "Was ist die Funktion von DNS?",
        answers: [
          { id: "a", text: "Auflösung von Domainnamen in IP-Adressen", correct: true, explanation: "DNS = Domain Name System. Übersetzt z.B. google.de → 142.250.185.78." },
          { id: "b", text: "Automatische IP-Vergabe an Clients", correct: false, explanation: "Das ist DHCP." },
          { id: "c", text: "Verschlüsselung von Netzwerkverbindungen", correct: false, explanation: "Das machen TLS/SSL." },
          { id: "d", text: "Routing zwischen Netzwerken", correct: false, explanation: "Das übernimmt der Router mit dem Routingprotokoll." },
        ],
        explanation: "DNS-Record-Typen: A = IPv4-Adresse, AAAA = IPv6-Adresse, MX = Mailserver, CNAME = Alias, NS = Nameserver, PTR = Reverse-Lookup, SOA = Zonenverwaltung. Port 53 (UDP/TCP).",
        tip: "DNS-Records: A=IPv4, AAAA=IPv6, MX=Mail, CNAME=Alias, NS=Nameserver."
      },
      {
        id: "nw-11", topicId: "netzwerk", type: "open", difficulty: "schwer", points: 4,
        question: "Erkläre den Unterschied zwischen einer Firewall und einer DMZ. Warum wird eine DMZ eingesetzt?",
        modelAnswer: "Firewall: Netzwerksicherheitskomponente, die eingehenden und ausgehenden Datenverkehr nach definierten Regeln filtert (Packet Filter, Stateful Inspection, Application-Level).\n\nDMZ (Demilitarisierte Zone): Netzwerksegment zwischen externem Netz (Internet) und internem Netz (LAN). Server die aus dem Internet erreichbar sein müssen (Webserver, Mailserver) stehen in der DMZ.\n\nWarum DMZ: Wenn ein Server in der DMZ kompromittiert wird, hat der Angreifer keinen direkten Zugang zum internen LAN. Das interne Netz bleibt durch eine zweite Firewall geschützt.",
        keyPoints: ["Firewall = Regelbasierte Filterung", "DMZ = Pufferzone zwischen Internet und LAN", "öffentliche Server in DMZ", "internes LAN bleibt geschützt"],
        explanation: "Typische DMZ-Topologie: Internet → Außen-Firewall → DMZ (Webserver, Mailserver) → Innen-Firewall → LAN. Doppelt gesichert: Angreifer muss zwei Firewalls überwinden.",
        tip: "DMZ-Analogie: Wie ein Empfangsbereich im Gebäude. Besucher kommen rein, aber nicht ins Büro."
      },
    ],
  },

  // ══════════════════════════════════════════════════════════════
  // 2. HARDWARE & PERIPHERIE
  // ══════════════════════════════════════════════════════════════
  {
    id: "hardware",
    title: "Hardware & Peripherie",
    icon: "Cpu",
    description: "CPU, RAM, Speicher, RAID, USV, PoE, Monitore, Schnittstellen",
    color: "green",
    questions: [
      {
        id: "hw-01", topicId: "hardware", type: "open", difficulty: "mittel", points: 6,
        question: "Erkläre den Unterschied zwischen RAID 0, RAID 1 und RAID 5. Nenne für jedes Level Vor- und Nachteile.",
        modelAnswer: "RAID 0 (Striping):\n→ Daten werden auf mehrere Platten verteilt\n→ Vorteil: hohe Lese-/Schreibgeschwindigkeit, volle Kapazität genutzt\n→ Nachteil: KEIN Datenschutz – fällt eine Platte aus, sind ALLE Daten verloren\n\nRAID 1 (Mirroring/Spiegelung):\n→ Daten werden auf zwei Platten identisch gespiegelt\n→ Vorteil: Datensicherheit (Ausfall einer Platte = kein Datenverlust)\n→ Nachteil: Nur 50% der Kapazität nutzbar, teurer\n\nRAID 5 (Striping mit Parität):\n→ Daten + Paritätsinformationen auf min. 3 Platten verteilt\n→ Vorteil: Ausfall einer Platte ohne Datenverlust, gute Performance, effiziente Kapazität (n-1 Platten)\n→ Nachteil: Langsamer Schreibvorgang (Paritätsberechnung), min. 3 Platten nötig",
        keyPoints: ["RAID 0: Striping, keine Redundanz", "RAID 1: Spiegelung, 50% Kapazität", "RAID 5: Parität, min. 3 Platten, n-1 Kapazität"],
        explanation: "RAID = Redundant Array of Independent Disks. RAID ersetzt kein Backup! RAID 6: wie RAID 5, aber 2 Platten dürfen ausfallen. RAID 10 (1+0): Kombination Mirroring + Striping. Hot Spare: Reserveplatte wird automatisch eingebunden.",
        tip: "RAID 0 = Speed (kein Schutz). RAID 1 = Spiegel (50%). RAID 5 = Parität (n-1, min. 3 Platten)."
      },
      {
        id: "hw-02", topicId: "hardware", type: "multiple-choice", difficulty: "leicht", points: 2,
        question: "Welcher PoE-Standard liefert bis zu 30 Watt und eignet sich für Kameras mit Heizung und IR-LEDs (ca. 24W)?",
        answers: [
          { id: "a", text: "IEEE 802.3at (PoE+) – bis 30W", correct: true, explanation: "802.3at liefert bis 30W (Endgerät bekommt ~25,5W) und deckt 24W ab." },
          { id: "b", text: "IEEE 802.3af (PoE) – bis 15,4W", correct: false, explanation: "802.3af reicht für 24W nicht aus." },
          { id: "c", text: "IEEE 802.3bt (PoE++) – bis 90W", correct: false, explanation: "Technisch möglich, aber überdimensioniert für 24W." },
          { id: "d", text: "USB-C Power Delivery 3.0", correct: false, explanation: "USB PD ist kein Ethernet-PoE-Standard." },
        ],
        explanation: "PoE-Standards: 802.3af = max. 15,4W (typisch: WLAN-APs, IP-Phones). 802.3at (PoE+) = max. 30W (IP-Kameras, Video-Phones). 802.3bt (PoE++) = max. 90W (PTZ-Kameras, Thin Clients). Formel: P = U × I (48V × Strom).",
        tip: "af < at < bt (alphabetisch = mehr Leistung). af ≈ 15W, at ≈ 30W, bt ≈ 60–90W"
      },
      {
        id: "hw-03", topicId: "hardware", type: "open", difficulty: "mittel", points: 4,
        question: "Erkläre den Unterschied zwischen einer USV vom Typ VFI (Online), VI (Line-Interactive) und VFD (Offline). Wann sollte welcher Typ eingesetzt werden?",
        modelAnswer: "VFD (Offline/Standby): Gerät läuft direkt am Netz, USV schaltet bei Ausfall zu (Umschaltzeit ~5ms). Günstiger, aber kurze Unterbrechung möglich. Für unkritische Geräte (PC zuhause).\n\nVI (Line-Interactive): Spannung wird ständig reguliert (Spannungsschwankungen ausgeglichen), bei Ausfall sofortiger Wechsel auf Akku. Mittlere Klasse. Für Server im kleineren Umfeld.\n\nVFI (Online/Doppelumwandlung): Strom wird ständig über Akku bereitgestellt (Wechselrichter), keine Umschaltzeit. Teuerste Lösung, beste Schutzwirkung. Für kritische Server, Rechenzentren.",
        keyPoints: ["VFD = Standby, Umschaltzeit ~5ms", "VI = Line-Interactive, Spannungsregelung", "VFI = Online, keine Unterbrechung"],
        explanation: "IEC 62040-3 klassifiziert USV-Typen. Scheinleistung [VA] = Wirkleistung [W] / Leistungsfaktor. Übliche Leistungsfaktoren: 0,6–0,9. Laufzeitberechnung: Kapazität [Wh] / Last [W].",
        tip: "VFI = immer online = teuerste = sicherste. Rechenzentrum → VFI. Homeoffice → VFD."
      },
      {
        id: "hw-04", topicId: "hardware", type: "open", difficulty: "leicht", points: 4,
        question: "Nenne vier ergonomische Maßnahmen zur Verbesserung eines Bildschirmarbeitsplatzes gemäß der Arbeitsstättenverordnung.",
        modelAnswer: "1. Monitorhöhe: Oberkante des Monitors auf Augenhöhe oder leicht darunter, Abstand ca. Armlänge (50–70 cm)\n2. Stuhl: Höhenverstellbar, Rückenlehne mit Lordosenstütze, Füße flach auf dem Boden\n3. Tisch: Arbeitsfläche in Ellenbogenhöhe (ca. 90°-Winkel beim Tippen)\n4. Beleuchtung: Mindestens 500 Lux, kein Spiegeln auf dem Monitor, Bildschirm senkrecht zur Lichtquelle\n5. Pausen: Bildschirmpausen nach 45–60 Minuten, Augenentspannung (Blick in die Ferne)\n6. Tastatur/Maus: Handgelenk nicht abgewinkelt, ggf. Handballenauflage",
        keyPoints: ["Monitorhöhe Augenhöhe", "höhenverstellbarer Stuhl", "500 Lux Beleuchtung", "Pausen", "Tisch Ellenbogenhöhe"],
        explanation: "Rechtsgrundlagen: Arbeitsstättenverordnung (ArbStättV), Bildschirmarbeitsverordnung, DGUV-Vorschriften. Ergonomie schützt vor: RSI (Repetitive Strain Injury), Rückenschmerzen, Augenproblemen.",
        tip: "Arbeitsstättenverordnung: Merke Monitorabstand (Armlänge), Lux (500), Stuhl (verstellbar), Pausen."
      },
      {
        id: "hw-05", topicId: "hardware", type: "multiple-choice", difficulty: "mittel", points: 3,
        question: "Was ist der Unterschied zwischen einem HDD und einem SSD beim Einsatz als Systemlaufwerk?",
        answers: [
          { id: "a", text: "SSD: schneller, leiser, stoßfester, aber teurer pro GB als HDD", correct: true, explanation: "SSD hat keine mechanischen Teile → schneller, stoßfest, leiser. HDDs günstiger bei großen Kapazitäten." },
          { id: "b", text: "HDD ist für Datenbanken immer besser", correct: false, explanation: "SSDs sind wegen niedrigem I/O-Latenz besser für Datenbanken." },
          { id: "c", text: "SSDs haben keine Schreiblimitierungen", correct: false, explanation: "SSDs haben begrenzte Schreibzyklen (TBW – TeraBytes Written)." },
          { id: "d", text: "HDDs sind schneller beim sequenziellen Lesen", correct: false, explanation: "SSDs (SATA: ~500 MB/s, NVMe: ~3500 MB/s) sind deutlich schneller." },
        ],
        explanation: "SSD-Typen: SATA SSD (~550 MB/s), M.2 NVMe (~3.500 MB/s), M.2 SATA (~550 MB/s). HDD: 50–150 MB/s. Formfaktoren: 2,5 Zoll (Laptop), 3,5 Zoll (Desktop), M.2 (Slot auf Mainboard). HDDs besser für: günstigen Massenspeicher, Archivierung.",
        tip: "NVMe > SATA SSD > HDD in Geschwindigkeit. NVMe nutzt PCIe-Interface statt SATA."
      },
      {
        id: "hw-06", topicId: "hardware", type: "calculation", difficulty: "schwer", points: 5,
        question: "4 Kameras sollen je 482 Mbit/s übertragen. Die Aufnahmen sollen 72 Stunden gespeichert werden. Berechne den benötigten Speicherbedarf in TiB. Rechenweg angeben.",
        modelAnswer: "Schritt 1: Datenrate gesamt = 482 Mbit/s × 4 = 1.928 Mbit/s\nSchritt 2: In MB/s: 1.928 ÷ 8 = 241 MB/s\nSchritt 3: Speicher in Sekunden: 72h × 3.600s/h = 259.200s\nSchritt 4: Speicher in MB: 241 × 259.200 = 62.467.200 MB\nSchritt 5: In GB: 62.467.200 ÷ 1.024 = 61.003 GB\nSchritt 6: In TiB: 61.003 ÷ 1.024 = ~59,6 TiB ≈ 60 TiB",
        keyPoints: ["×4 Kameras", "÷8 für Bit→Byte", "×72×3600 für Sekunden", "÷1024 für GiB", "÷1024 für TiB"],
        explanation: "Wichtig: 1 Byte = 8 Bit. 1 GiB = 1.024 MiB. 1 TiB = 1.024 GiB. Binäre Präfixe (TiB, GiB) vs. dezimale (TB, GB). 1 TB = 1.000 GB, 1 TiB = 1.024 GiB ≈ 1,099 TB.",
        tip: "Mbit → MByte: ÷8. MB → GiB: ÷1024. GiB → TiB: ÷1024. Rechenweg immer angeben!"
      },
    ],
  },

  // ══════════════════════════════════════════════════════════════
  // 3. IT-SICHERHEIT & DATENSCHUTZ
  // ══════════════════════════════════════════════════════════════
  {
    id: "sicherheit",
    title: "IT-Sicherheit & Datenschutz",
    icon: "Shield",
    description: "CIA-Triad, BSI, DSGVO, Angriffsvektoren, Backup, Verschlüsselung, Zero Trust",
    color: "red",
    questions: [
      {
        id: "sec-01", topicId: "sicherheit", type: "open", difficulty: "leicht", points: 4,
        question: "Erkläre die drei Schutzziele der IT-Sicherheit (CIA-Triad). Nenne für jedes Schutzziel ein konkretes technisches Beispiel.",
        modelAnswer: "Confidentiality (Vertraulichkeit): Nur berechtigte Personen haben Zugang zu Daten.\n→ Beispiel: Datei-Verschlüsselung mit AES, HTTPS-Verbindungen, Zugriffsrechte (ACL)\n\nIntegrity (Integrität): Daten sind vollständig und unverändert.\n→ Beispiel: Hashwerte (SHA-256) zur Prüfung, digitale Signaturen, Versions-Checksums\n\nAvailability (Verfügbarkeit): Daten und Systeme sind verfügbar wenn benötigt.\n→ Beispiel: RAID-Systeme, USV, Failover-Cluster, regelmäßige Backups",
        keyPoints: ["Vertraulichkeit = nur Berechtigte", "Integrität = unverändert", "Verfügbarkeit = jederzeit erreichbar"],
        explanation: "Erweiterte Schutzziele: Authentizität (Echtheit), Verbindlichkeit/Nichtabstreitbarkeit, Zurechenbarkeit. BSI IT-Grundschutz basiert auf CIA-Triad. Gegenmaßnahmen immer auf alle drei Ziele abstimmen.",
        tip: "CIA = Confidentiality, Integrity, Availability. Merkhilfe: Geheimhalten, Unverfälscht, Immer da."
      },
      {
        id: "sec-02", topicId: "sicherheit", type: "open", difficulty: "mittel", points: 6,
        question: "Erkläre den Unterschied zwischen einem Virus, einem Wurm und einem Trojaner. Nenne jeweils eine typische Gegenmaßnahme.",
        modelAnswer: "Virus:\n→ Anhängt sich an bestehende Dateien/Programme\n→ Benötigt Nutzeraktion zum Ausführen/Verbreiten\n→ Beispiel: Makrovirus in Office-Dokumenten\n→ Gegenmaßnahme: Antivirensoftware, E-Mail-Filter, keine unbekannten Anhänge öffnen\n\nWurm:\n→ Verbreitet sich selbstständig über Netzwerke ohne Nutzeraktion\n→ Nutzt Sicherheitslücken in Betriebssystemen/Diensten\n→ Beispiel: WannaCry (über SMB-Schwachstelle)\n→ Gegenmaßnahme: Firewall, regelmäßige Updates/Patches, Netzwerksegmentierung\n\nTrojaner:\n→ Tarnt sich als nützliche Anwendung, enthält versteckte Schadfunktion\n→ Kein Selbstverbreiten, muss aktiv installiert werden\n→ Beispiel: Fake-Antivirensoftware\n→ Gegenmaßnahme: Software nur aus vertrauenswürdigen Quellen, Whitelist-Ansatz",
        keyPoints: ["Virus: braucht Wirtsdatei", "Wurm: verbreitet sich selbst", "Trojaner: tarnt sich als nützliche Software"],
        explanation: "Weitere Malware: Ransomware (Verschlüsselung + Lösegeld), Rootkit (versteckt sich im OS), Spyware (Daten abgreifen), Adware (unerwünschte Werbung), Keylogger (Tastatureingaben aufzeichnen), Botnetz (ferngesteuertes Netz aus infizierten PCs).",
        tip: "Unterschied: Virus=Wirt braucht, Wurm=alleine, Trojaner=versteckt. WannaCry=Wurm, nicht Virus!"
      },
      {
        id: "sec-03", topicId: "sicherheit", type: "open", difficulty: "mittel", points: 4,
        question: "Erkläre den Unterschied zwischen symmetrischer und asymmetrischer Verschlüsselung. Nenne je ein Beispiel.",
        modelAnswer: "Symmetrische Verschlüsselung:\n→ Gleicher Schlüssel zum Ver- und Entschlüsseln\n→ Schnell, geringer Rechenaufwand\n→ Problem: sicherer Schlüsselaustausch\n→ Beispiel: AES (Advanced Encryption Standard), DES (veraltet)\n\nAsymmetrische Verschlüsselung:\n→ Schlüsselpaar: Public Key (öffentlich) + Private Key (geheim)\n→ Verschlüsselung mit Public Key, Entschlüsselung nur mit Private Key\n→ Langsamer, aber kein Problem beim Schlüsselaustausch\n→ Beispiel: RSA, ECC, verwendetet in HTTPS/TLS, SSH, S/MIME\n\nIn der Praxis: Hybrid (asymmetrisch für Schlüsselaustausch, symmetrisch für Datentransfer) → z.B. TLS/HTTPS",
        keyPoints: ["symmetrisch: ein Schlüssel", "asymmetrisch: Public/Private Key Pair", "Hybrid in HTTPS/TLS"],
        explanation: "Hash-Funktionen: Einwegfunktion, kein Zurückrechnen. Einsatz: Passwörter, Checksums. Beispiele: MD5 (veraltet), SHA-256, SHA-512. Digitale Signatur: Hashwert wird mit Private Key signiert.",
        tip: "HTTPS = TLS = Hybrid. Erst asymmetrisch für Schlüsselaustausch, dann symmetrisch (AES) für Daten."
      },
      {
        id: "sec-04", topicId: "sicherheit", type: "open", difficulty: "mittel", points: 6,
        question: "Erkläre die DSGVO-Grundsätze nach Art. 5. Nenne mindestens 5 der 7 Grundsätze und erkläre diese kurz.",
        modelAnswer: "1. Rechtmäßigkeit, Verarbeitung nach Treu und Glauben, Transparenz: Daten dürfen nur mit Rechtsgrundlage verarbeitet werden (Einwilligung, Vertrag, gesetzliche Pflicht etc.)\n2. Zweckbindung: Daten nur für festgelegte Zwecke verarbeiten, nicht zweckfremd nutzen\n3. Datenminimierung: Nur so viele Daten wie nötig erheben\n4. Richtigkeit: Daten müssen korrekt sein, falsche Daten korrigieren/löschen\n5. Speicherbegrenzung: Daten nicht länger als nötig speichern\n6. Integrität und Vertraulichkeit: Angemessene Sicherheitsmaßnahmen (TOMs)\n7. Rechenschaftspflicht: Verantwortlicher muss Einhaltung nachweisen können",
        keyPoints: ["Rechtmäßigkeit", "Zweckbindung", "Datenminimierung", "Richtigkeit", "Speicherbegrenzung", "Sicherheit (TOMs)", "Rechenschaftspflicht"],
        explanation: "Betroffenenrechte (Art. 12-22): Auskunft, Berichtigung, Löschung (Recht auf Vergessenwerden), Einschränkung, Datenübertragbarkeit, Widerspruch. Datenschutzbeauftragter: ab 20 Personen die regelmäßig personenbezogene Daten verarbeiten.",
        tip: "7 Grundsätze DSGVO Art. 5: Rechtmäßigkeit, Zweck, Minimierung, Richtigkeit, Speicher, Sicherheit, Rechenschaft."
      },
      {
        id: "sec-05", topicId: "sicherheit", type: "open", difficulty: "mittel", points: 4,
        question: "Beschreibe drei unterschiedliche Backup-Strategien (Vollbackup, inkrementell, differenziell) und vergleiche diese hinsichtlich Dauer und Speicherbedarf.",
        modelAnswer: "Vollbackup: Alle Daten werden komplett gesichert.\n→ Vorteil: Einfache Wiederherstellung (nur 1 Band)\n→ Nachteil: Viel Zeit und Speicher\n\nInkrementelles Backup: Nur Änderungen seit dem letzten Backup (egal welcher Art) werden gesichert.\n→ Vorteil: Wenig Zeit und Speicher\n→ Nachteil: Wiederherstellung komplex (Vollbackup + alle inkrementellen Bänder)\n\nDifferenzielles Backup: Alle Änderungen seit dem letzten Vollbackup werden gesichert.\n→ Vorteil: Wiederherstellung einfacher (Vollbackup + 1 differenzielles Band)\n→ Nachteil: Wächst mit der Zeit, mehr Speicher als inkrementell",
        keyPoints: ["Vollbackup: alles", "inkrementell: nur neue Änderungen", "differenziell: alle Änderungen seit Vollbackup"],
        explanation: "Generationenprinzip (Großvater-Vater-Sohn): Täglich (Sohn), wöchentlich (Vater), monatlich (Großvater). Backup-Regel 3-2-1: 3 Kopien, auf 2 verschiedenen Medien, 1 davon extern. RAID ≠ Backup!",
        tip: "3-2-1-Regel: 3 Kopien, 2 Medientypen, 1 außer Haus. RAID schützt vor Hardwareausfall, NICHT vor Ransomware/Löschen!"
      },
      {
        id: "sec-06", topicId: "sicherheit", type: "multiple-choice", difficulty: "leicht", points: 2,
        question: "Was versteht man unter einem SQL-Injection-Angriff?",
        answers: [
          { id: "a", text: "Einschleusen von SQL-Code über Eingabefelder zur unautorisierten Datenbankmanipulation", correct: true, explanation: "Angreifer schleust SQL-Befehle ein: z.B. ' OR '1'='1 um Login zu umgehen." },
          { id: "b", text: "Einschleusen von Viren über SQL-Schnittstellen", correct: false, explanation: "SQL-Injection betrifft die Datenbanklogik, nicht Virenübertragung." },
          { id: "c", text: "Abhören von SQL-Datenbank-Traffic", correct: false, explanation: "Das wäre Sniffing, nicht SQL-Injection." },
          { id: "d", text: "Denial-of-Service-Angriff auf SQL-Server", correct: false, explanation: "DoS-Angriff ist eine separate Angriffskategorie." },
        ],
        explanation: "SQL-Injection Gegenmaßnahmen: Prepared Statements/Parameterized Queries, Input Validation, ORMs, WAF (Web Application Firewall), minimale Datenbankrechte. Beispiel: Eingabe ' OR '1'='1'-- umgeht WHERE-Bedingung.",
        tip: "Schutz gegen SQL-Injection = Prepared Statements. Immer Benutzereingaben validieren!"
      },
      {
        id: "sec-07", topicId: "sicherheit", type: "open", difficulty: "leicht", points: 3,
        question: "Was ist der Unterschied zwischen Authentifizierung und Autorisierung? Nenne jeweils ein Beispiel aus dem IT-Alltag.",
        modelAnswer: "Authentifizierung (Authentication): Überprüfung der Identität – 'Wer bist du?'\n→ Beispiel: Login mit Benutzername + Passwort, Fingerabdruckscan, 2FA-Code\n\nAutorisierung (Authorization): Vergabe von Zugriffsrechten – 'Was darfst du?'\n→ Beispiel: Ein Benutzer darf Dateien lesen, aber nicht löschen. Admin hat mehr Rechte als Standard-User.\n\nReihenfolge: Erst Authentifizierung, dann Autorisierung.",
        keyPoints: ["Authentifizierung = Identität prüfen", "Autorisierung = Berechtigungen vergeben"],
        explanation: "AAA-Prinzip: Authentication, Authorization, Accounting (Protokollierung was getan wurde). RBAC (Role-Based Access Control): Rechte an Rollen, nicht an Personen. Least Privilege: minimale Rechte.",
        tip: "Auth-N = Nachweis (Name+Passwort). Auth-Z = Zugang (Berechtigungen). Erst N, dann Z."
      },
    ],
  },

  // ══════════════════════════════════════════════════════════════
  // 4. PROJEKTMANAGEMENT
  // ══════════════════════════════════════════════════════════════
  {
    id: "projektmanagement",
    title: "Projektmanagement",
    icon: "GitBranch",
    description: "Netzplantechnik, Gantt, Scrum, Kanban, Wasserfall, Lasten- und Pflichtenheft",
    color: "purple",
    questions: [
      {
        id: "pm-01", topicId: "projektmanagement", type: "open", difficulty: "mittel", points: 4,
        question: "Was ist der Unterschied zwischen einem Lastenheft und einem Pflichtenheft? Wer erstellt jeweils welches Dokument?",
        modelAnswer: "Lastenheft:\n→ Beschreibt WAS und WOFÜR etwas gemacht werden soll (Anforderungen)\n→ Erstellt vom Auftraggeber (Kunde)\n→ Enthält: Ziele, Anforderungen, Rahmenbedingungen\n→ Beispiel: 'Das System soll 100 gleichzeitige Nutzer unterstützen'\n\nPflichtenheft:\n→ Beschreibt WIE und WOMIT die Anforderungen umgesetzt werden\n→ Erstellt vom Auftragnehmer (z.B. IT-Dienstleister)\n→ Basiert auf dem Lastenheft, konkretisiert technische Umsetzung\n→ Beispiel: 'Die Anwendung wird als Web-App auf Node.js mit PostgreSQL umgesetzt'",
        keyPoints: ["Lastenheft: Was/Wofür (Auftraggeber)", "Pflichtenheft: Wie/Womit (Auftragnehmer)"],
        explanation: "DIN 69901: Projektmanagement-Norm. Lastenheft → Anforderungsanalyse → Pflichtenheft → Implementierung. Oft auch: Anforderungsspezifikation (Requirements Specification). Agil: User Stories statt Lastenheft.",
        tip: "Merkhilfe: Last = Auftraggeber drückt Last auf Auftragnehmer. Pflicht = Auftragnehmer erfüllt Pflicht."
      },
      {
        id: "pm-02", topicId: "projektmanagement", type: "open", difficulty: "schwer", points: 6,
        question: "Erläutere die Netzplantechnik. Erkläre die Begriffe FAZ, FEZ, SAZ, SEZ, Gesamtpuffer und freier Puffer und deren Beziehungen zueinander.",
        modelAnswer: "Netzplantechnik: Methode zur Projektplanung und -kontrolle. Vorgänge werden als Knoten, Abhängigkeiten als Pfeile dargestellt.\n\nFAZ (Frühester Anfangszeitpunkt): Frühestmöglich kann Vorgang beginnen\nFEZ (Frühester Endzeitpunkt): FEZ = FAZ + Dauer\nSAZ (Spätester Anfangszeitpunkt): Spätestmöglich darf Vorgang beginnen (ohne Verzug)\nSEZ (Spätester Endzeitpunkt): SEZ = SAZ + Dauer\n\nGesamtpuffer (GP): GP = SAZ - FAZ = SEZ - FEZ\n→ Zeit um die ein Vorgang verschoben werden kann OHNE das Projektende zu verzögern\n\nFreier Puffer (FP): Zeitreserve bis zum frühestmöglichen Start des direkten Nachfolgers\n→ FP = FAZ(Nachfolger) - FEZ(Vorgang)\n\nKritischer Pfad: Alle Vorgänge mit GP = 0. Verzögerung hier = Projektverzögerung!",
        keyPoints: ["FEZ = FAZ + Dauer", "SAZ = SEZ - Dauer", "GP = SAZ - FAZ", "Kritischer Pfad: GP = 0"],
        explanation: "Vorwärtsrechnung: FAZ/FEZ berechnen (von links). Rückwärtsrechnung: SAZ/SEZ berechnen (von rechts). Letzter Vorgang: SEZ = FEZ (kein Puffer). Kritischer Pfad gibt Mindestprojektdauer an.",
        tip: "Vorwärts: FAZ→FEZ (+Dauer). Rückwärts: SEZ→SAZ (-Dauer). GP=0 → kritisch!"
      },
      {
        id: "pm-03", topicId: "projektmanagement", type: "open", difficulty: "mittel", points: 4,
        question: "Vergleiche das Wasserfallmodell mit Scrum. Nenne je zwei Vor- und Nachteile beider Modelle.",
        modelAnswer: "Wasserfallmodell:\n→ Vorteile: klare Struktur, gut dokumentiert, planbar für feste Anforderungen\n→ Nachteile: wenig Flexibilität, spätes Feedback, Fehler früher Phasen teuer zu korrigieren\n→ Phasen: Anforderung → Design → Implementierung → Test → Betrieb\n\nScrum (agil):\n→ Vorteile: hohe Flexibilität, frühe Ergebnisse (Sprints), kontinuierliches Feedback\n→ Nachteile: schwer planbar (kein fixer Endtermin), erfordert erfahrenes Team, Aufwand durch Meetings\n→ Artefakte: Product Backlog, Sprint Backlog, Increment\n→ Rollen: Product Owner, Scrum Master, Dev-Team\n→ Events: Sprint Planning, Daily Standup, Sprint Review, Retrospektive",
        keyPoints: ["Wasserfall: linear, dokumentiert", "Scrum: iterativ, flexibel", "Wasserfall: wenig Flexibilität", "Scrum: schwer planbar"],
        explanation: "Agile Manifesto: Individuen > Prozesse, Funktionierende Software > Dokumentation, Zusammenarbeit > Vertragsverhandlung, Reagieren auf Veränderung > Plan-Befolgen. Kanban: WIP-Limit, Spalten = Prozessschritte, Pull-Prinzip.",
        tip: "Wasserfall = Plan → einmal durch. Scrum = Sprint für Sprint, regelmäßig prüfen."
      },
      {
        id: "pm-04", topicId: "projektmanagement", type: "multiple-choice", difficulty: "leicht", points: 2,
        question: "Was bedeutet das 'Magische Dreieck' im Projektmanagement?",
        answers: [
          { id: "a", text: "Die drei konkurrierenden Ziele: Qualität, Kosten und Zeit (Scope)", correct: true, explanation: "Kein Projekt kann gleichzeitig günstig, schnell und hochqualitativ sein – immer Kompromiss." },
          { id: "b", text: "Ein Werkzeug zur Risikoanalyse", correct: false, explanation: "Das ist kein Risikoanalysewerkzeug." },
          { id: "c", text: "Die drei Projektphasen: Planung, Durchführung, Abschluss", correct: false, explanation: "Das sind Phasen, nicht das Magische Dreieck." },
          { id: "d", text: "Die drei Stakeholder: Auftraggeber, Team, Management", correct: false, explanation: "Das sind Stakeholder, kein Dreieck." },
        ],
        explanation: "Magisches Dreieck: Qualität ↔ Kosten ↔ Zeit. Änderung einer Dimension beeinflusst die anderen. Beispiel: Mehr Qualität in gleicher Zeit → mehr Kosten. SMART-Ziele: Spezifisch, Messbar, Attraktiv, Realistisch, Terminiert.",
        tip: "Pick two: schnell + günstig = schlechte Qualität. Schnell + gut = teuer. Gut + günstig = langsam."
      },
      {
        id: "pm-05", topicId: "projektmanagement", type: "open", difficulty: "leicht", points: 3,
        question: "Was ist ein Gantt-Diagramm und worin unterscheidet es sich vom Netzplan? Wann wird welches eingesetzt?",
        modelAnswer: "Gantt-Diagramm:\n→ Balkendiagramm mit Zeitachse (Kalenderwochen/Tage)\n→ Zeigt Aufgaben, Dauer, Parallelität und ggf. Abhängigkeiten\n→ Vorteil: Intuitiv lesbar, gut für Präsentation, Terminplanung\n→ Nachteil: Kritischer Pfad nicht direkt sichtbar\n\nNetzplan:\n→ Mathematisch-grafische Methode (Knoten = Vorgänge, Pfeile = Abhängigkeiten)\n→ Zeigt kritischen Pfad, Pufferzeiten, früheste/späteste Termine\n→ Vorteil: Kritischer Pfad sichtbar, genaue Pufferanalyse\n→ Nachteil: Komplex, weniger intuitiv\n\nEinsatz: Gantt für Kommunikation/Überblick. Netzplan für genaue Terminplanung.",
        keyPoints: ["Gantt = Balkendiagramm mit Zeit", "Netzplan = kritischer Pfad sichtbar", "Gantt für Kommunikation, Netzplan für Analyse"],
        explanation: "Projektstrukturplan (PSP): Hierarchische Gliederung aller Arbeitspakete. Basis für Netzplan und Gantt. Meilensteine: Ereignisse (Dauer 0) die wichtige Zwischenziele markieren.",
        tip: "Gantt = Überblick/Zeitplan. Netzplan = kritischer Pfad/Puffer. Beide ergänzen sich."
      },
      {
        id: "pm-06", topicId: "projektmanagement", type: "open", difficulty: "mittel", points: 4,
        question: "Erkläre das Tuckman-Modell der Teamentwicklung. In welcher Phase entstehen typischerweise Konflikte und wie geht man damit um?",
        modelAnswer: "Tuckman-Modell (5 Phasen):\n1. Forming: Kennenlernen, Vorsicht, höflich\n2. Storming: Konflikte entstehen (unterschiedliche Meinungen, Rollenklärung) → häufigste Konfliktphase\n3. Norming: Team findet gemeinsame Regeln und Arbeitsweise\n4. Performing: Höchste Leistung, effiziente Zusammenarbeit\n5. Adjourning: Projektabschluss, Team löst sich auf\n\nUmgang mit Konflikten in der Storming-Phase:\n→ Konstruktives Feedback (Ich-Botschaften)\n→ Moderierte Diskussionen\n→ Klare Rollenverteilung\n→ Gemeinsame Ziele fokussieren\n→ Retrospektiven (besonders in Scrum)",
        keyPoints: ["Forming, Storming, Norming, Performing, Adjourning", "Konflikte in Storming-Phase", "Konstruktives Feedback, Rollenklärung"],
        explanation: "Harvard-Konzept: Menschen und Probleme trennen, Interessen statt Positionen, Optionen entwickeln, Kriterien nutzen, BATNA (Best Alternative to Negotiated Agreement). Ich-Botschaften: 'Ich erlebe...' statt 'Du machst...'",
        tip: "Forming→Storming→Norming→Performing (→Adjourning). Konflikte in Storming = normal und wichtig!"
      },
    ],
  },

  // ══════════════════════════════════════════════════════════════
  // 5. PROGRAMMIERUNG & SOFTWAREENTWICKLUNG
  // ══════════════════════════════════════════════════════════════
  {
    id: "programmierung",
    title: "Programmierung & Softwareentwicklung",
    icon: "Code",
    description: "OOP, UML, Pseudocode, Algorithmen, Datentypen, Testmethoden, Debugging",
    color: "yellow",
    questions: [
      {
        id: "prog-01", topicId: "programmierung", type: "open", difficulty: "leicht", points: 4,
        question: "Erkläre die vier Grundprinzipien der objektorientierten Programmierung (OOP). Gib für jedes Prinzip ein kurzes Beispiel.",
        modelAnswer: "1. Kapselung (Encapsulation):\n→ Daten und Methoden einer Klasse werden zusammengefasst\n→ Zugriff über definierte Schnittstellen (getter/setter), private Attribute\n→ Beispiel: Bankkonto-Klasse – Kontostand ist private, nur über Methoden zugänglich\n\n2. Vererbung (Inheritance):\n→ Klasse erbt Eigenschaften/Methoden einer Elternklasse\n→ Code-Wiederverwendung, Hierarchien\n→ Beispiel: Klasse Hund erbt von Klasse Tier (hat schon Methode atmen())\n\n3. Polymorphismus:\n→ Gleicher Methodenaufruf, unterschiedliches Verhalten je nach Klasse\n→ Beispiel: shape.draw() – bei Circle zeichnet Kreis, bei Rectangle zeichnet Rechteck\n\n4. Abstraktion:\n→ Wesentliches hervorheben, Komplexität verstecken\n→ Beispiel: Interface 'Fahrzeug' mit Methode fahren() – Implementierung verborgen",
        keyPoints: ["Kapselung: private Daten", "Vererbung: Code-Wiederverwendung", "Polymorphismus: verschiedenes Verhalten", "Abstraktion: Komplexität verstecken"],
        explanation: "UML-Sichtbarkeiten: - private, + public, # protected, ~ package. OOP-Sprachen: Java, C++, Python, C#, Kotlin. Prozedurale Sprachen: C, Pascal. Skriptsprachen: Python, JavaScript, Bash.",
        tip: "OOP-Säulen: KAPA – Kapselung, Abstraktion, Polymorphismus, Abstraktion. Oder: KAVA."
      },
      {
        id: "prog-02", topicId: "programmierung", type: "open", difficulty: "mittel", points: 5,
        question: "Führe einen Schreibtischtest für den folgenden Pseudocode durch. Welche Ausgaben werden produziert?\n\nFUNCTION berechne(x, y)\n  result = 0\n  IF x > y THEN\n    result = x - y\n  ELSE IF x == y THEN\n    result = 0\n  ELSE\n    result = y - x\n  END IF\n  RETURN result\nEND FUNCTION\n\nAufruf 1: berechne(10, 3)\nAufruf 2: berechne(5, 5)\nAufruf 3: berechne(2, 8)",
        modelAnswer: "Aufruf 1: berechne(10, 3)\n→ x=10, y=3\n→ 10 > 3 ist TRUE → result = 10 - 3 = 7\n→ Rückgabe: 7\n\nAufruf 2: berechne(5, 5)\n→ x=5, y=5\n→ 5 > 5 ist FALSE\n→ 5 == 5 ist TRUE → result = 0\n→ Rückgabe: 0\n\nAufruf 3: berechne(2, 8)\n→ x=2, y=8\n→ 2 > 8 ist FALSE\n→ 2 == 8 ist FALSE\n→ result = 8 - 2 = 6\n→ Rückgabe: 6",
        keyPoints: ["Aufruf 1 = 7", "Aufruf 2 = 0", "Aufruf 3 = 6"],
        explanation: "Schreibtischtest: Variablenwerte Schritt für Schritt in einer Tabelle tracken. Wichtig bei Schleifen: Zähler/Schleifenvariable nach jeder Iteration notieren. Hilft beim Finden von Logic Errors.",
        tip: "Schreibtischtest-Tabelle: Spalten = Variablen (x, y, result). Zeilen = Ausführungsschritt."
      },
      {
        id: "prog-03", topicId: "programmierung", type: "open", difficulty: "mittel", points: 4,
        question: "Erkläre den Unterschied zwischen Black-Box-Test und White-Box-Test. Wann wird welcher eingesetzt?",
        modelAnswer: "Black-Box-Test:\n→ Tester kennt die interne Implementierung NICHT\n→ Nur Ein- und Ausgaben werden geprüft (Anforderungen/Spezifikation)\n→ Tester 'sieht' nur die Außenseite (schwarze Box)\n→ Einsatz: Akzeptanztest, Systemtest, Benutzertest\n→ Vorteil: Unvoreingenommen, testet aus Nutzerperspektive\n\nWhite-Box-Test (Glass-Box):\n→ Tester kennt Quellcode und interne Struktur\n→ Zweige, Pfade, Schleifen werden gezielt getestet (Codeabdeckung)\n→ Einsatz: Unit-Test, Komponententest, Entwicklertest\n→ Vorteil: Hohe Codeabdeckung, Fehler im Code direkt sichtbar",
        keyPoints: ["Black-Box: ohne Codekenntnisse, aus Nutzersicht", "White-Box: mit Codekenntnissen, Codeabdeckung"],
        explanation: "Teststufen: Unit-Test → Integration-Test → Systemtest → Akzeptanztest. Grey-Box-Test: Kombination aus White und Black. Testgetriebene Entwicklung (TDD): Tests werden vor dem Code geschrieben.",
        tip: "Black-Box = Nutzer/Tester sieht nur was rein- und rausgeht. White-Box = Entwickler kennt Code."
      },
      {
        id: "prog-04", topicId: "programmierung", type: "multiple-choice", difficulty: "leicht", points: 2,
        question: "Was ist der Unterschied zwischen einem Compiler und einem Interpreter?",
        answers: [
          { id: "a", text: "Compiler übersetzt gesamten Code vor Ausführung. Interpreter führt Code Zeile für Zeile aus.", correct: true, explanation: "Compiler: Quellcode → Maschinecode (einmalig). Interpreter: Zeile für Zeile zur Laufzeit übersetzen." },
          { id: "b", text: "Kein Unterschied, beide machen dasselbe", correct: false, explanation: "Grundlegend verschiedene Konzepte." },
          { id: "c", text: "Compiler ist langsamer als Interpreter", correct: false, explanation: "Compiler erzeugt schnelleren Maschinecode. Interpreter hat Overhead pro Zeile." },
          { id: "d", text: "Interpreter wird nur für Webentwicklung genutzt", correct: false, explanation: "Interpreter werden für Python, Ruby, JavaScript, PHP etc. verwendet." },
        ],
        explanation: "Compiler: C, C++, Java (→ Bytecode), Rust. Interpreter: Python, Ruby, PHP, JavaScript. JIT-Compiler (Just-In-Time): Bytecode wird zur Laufzeit kompiliert (Java HotSpot, V8 JavaScript). Linker: Verbindet kompilierte Objektdateien zu ausführbarem Programm.",
        tip: "Compiler = Buch übersetzen (einmal, dann lesen). Interpreter = Dolmetscher (echtzeit, Satz für Satz)."
      },
      {
        id: "prog-05", topicId: "programmierung", type: "open", difficulty: "mittel", points: 5,
        question: "Zeichne bzw. beschreibe ein UML-Klassendiagramm für eine Klasse 'Mitarbeiter' mit folgenden Anforderungen:\n• private Attribute: vorname (String), nachname (String), gehalt (double), mitarbeiterNr (int)\n• public Methoden: berechneJahresgehalt(): double, getVorname(): String, setGehalt(betrag: double): void",
        modelAnswer: "┌──────────────────────────────────────┐\n│           Mitarbeiter                │\n├──────────────────────────────────────┤\n│ - vorname: String                    │\n│ - nachname: String                   │\n│ - gehalt: double                     │\n│ - mitarbeiterNr: int                 │\n├──────────────────────────────────────┤\n│ + berechneJahresgehalt(): double     │\n│ + getVorname(): String               │\n│ + setGehalt(betrag: double): void    │\n└──────────────────────────────────────┘",
        keyPoints: ["Klassenname oben", "- für private Attribute", "+ für public Methoden", "Datentypen angeben", "Parametertypen angeben"],
        explanation: "UML-Klasse: 3 Bereiche: Name, Attribute (-/+/#), Methoden (-/+/#). Format Attribut: [Sichtbarkeit] [name]: [Typ]. Format Methode: [Sichtbarkeit] [name]([param: Typ]): [Rückgabetyp]. void = kein Rückgabewert.",
        tip: "UML: '-' = private, '+' = public, '#' = protected. IMMER Typen angeben!"
      },
      {
        id: "prog-06", topicId: "programmierung", type: "open", difficulty: "leicht", points: 3,
        question: "Erkläre den Unterschied zwischen funktionalen und nicht-funktionalen Anforderungen. Gib je zwei Beispiele aus einem IT-Projekt.",
        modelAnswer: "Funktionale Anforderungen: Beschreiben was das System TUN soll (Funktionen/Verhalten)\n→ Beispiel 1: 'Benutzer können sich mit E-Mail und Passwort anmelden'\n→ Beispiel 2: 'Das System exportiert Berichte als PDF'\n\nNicht-funktionale Anforderungen: Beschreiben WIE GUT das System es tun soll (Qualitätseigenschaften)\n→ Beispiel 1: 'Die Webseite muss in unter 2 Sekunden laden (Performance)'\n→ Beispiel 2: 'Das System muss 99,9% Verfügbarkeit haben (Reliability)'\n\nWeitere nicht-funktionale: Skalierbarkeit, Sicherheit, Barrierefreiheit, Wartbarkeit, Portabilität",
        keyPoints: ["Funktional: Was? (Funktionen)", "Nicht-funktional: Wie gut? (Qualität)"],
        explanation: "ISO 25010 (SQuaRE): Qualitätsmerkmale für Software: Funktionalität, Zuverlässigkeit, Leistungseffizienz, Benutzbarkeit, Sicherheit, Kompatibilität, Wartbarkeit, Portabilität.",
        tip: "Funktional = Feature (Login, Export). Nicht-funktional = Qualität (Geschwindigkeit, Sicherheit)."
      },
    ],
  },

  // ══════════════════════════════════════════════════════════════
  // 6. DATENBANKEN
  // ══════════════════════════════════════════════════════════════
  {
    id: "datenbanken",
    title: "Datenbanken",
    icon: "Database",
    description: "ER-Modell, Normalisierung, SQL-Grundlagen, Relationen, DBMS, DSGVO",
    color: "orange",
    questions: [
      {
        id: "db-01", topicId: "datenbanken", type: "open", difficulty: "mittel", points: 8,
        question: "Modelliere ein ER-Diagramm (textuell beschreiben): Ein Kunde kann mehrere Bestellungen aufgeben. Jede Bestellung enthält mehrere Produkte, ein Produkt kann in mehreren Bestellungen enthalten sein. Nenne alle Entitäten, Beziehungen, Kardinalitäten und wichtige Attribute inkl. Primärschlüssel.",
        modelAnswer: "Entitäten:\n• Kunde (KundeID PK, Vorname, Nachname, E-Mail, Adresse)\n• Bestellung (BestellungID PK, Datum, Status, KundeID FK)\n• Produkt (ProduktID PK, Bezeichnung, Preis, Lagerbestand)\n\nBeziehungen:\n• Kunde 1:n Bestellung → Ein Kunde kann viele Bestellungen haben\n  → KundeID als Fremdschlüssel in Bestellung\n\n• Bestellung m:n Produkt → Eine Bestellung hat viele Produkte, ein Produkt in vielen Bestellungen\n  → Auflösung durch Zwischentabelle: BestellungsPosition (BestellungID FK, ProduktID FK, Menge, Einzelpreis)\n  → Primärschlüssel: BestellungID + ProduktID",
        keyPoints: ["3 Entitäten", "1:n Kunde-Bestellung", "m:n Bestellung-Produkt", "Zwischentabelle für m:n", "Primärschlüssel angeben"],
        explanation: "ER → Relational: Jede Entität wird zur Tabelle. 1:n → FK in der n-Seite. m:n → Zwischentabelle. Primärschlüssel: eindeutig, NOT NULL. Fremdschlüssel: referenziert existierenden PK.",
        tip: "m:n immer mit Zwischentabelle. Attribute der Beziehung (Menge, Preis) gehören in die Zwischentabelle!"
      },
      {
        id: "db-02", topicId: "datenbanken", type: "open", difficulty: "mittel", points: 6,
        question: "Erkläre die erste, zweite und dritte Normalform. Gib für jede Normalform ein Beispiel für eine Verletzung und wie man sie behebt.",
        modelAnswer: "1. Normalform (1NF): Alle Attributwerte sind atomar (keine Wiederholungsgruppen)\n→ Verletzung: Tabelle Bestellung(BestellID, Produkte='Laptop, Maus, Tastatur')\n→ Behebung: Separate Zeilen für jedes Produkt\n\n2. Normalform (2NF): 1NF + jedes Nichtschlüsselattribut voll funktional abhängig vom gesamten Schlüssel\n(Nur relevant bei zusammengesetzten Primärschlüsseln)\n→ Verletzung: BestellPos(BestellID, ProduktID, Produktname, Menge) – Produktname hängt nur von ProduktID ab\n→ Behebung: Produktname in eigene Tabelle Produkt(ProduktID, Produktname)\n\n3. Normalform (3NF): 2NF + keine transitiven Abhängigkeiten (Nichtschlüsselattribute unabhängig voneinander)\n→ Verletzung: Mitarbeiter(MitarbID, Abteilung, AbteilungsLeiter) – AbteilungsLeiter hängt von Abteilung ab, nicht von MitarbID\n→ Behebung: Abteilung(AbteilungID, AbteilungsLeiter) auslagern",
        keyPoints: ["1NF: atomare Werte", "2NF: volle Abhängigkeit vom Schlüssel", "3NF: keine transitiven Abhängigkeiten"],
        explanation: "Normalisierung: Redundanz reduzieren, Anomalien vermeiden (Einfüge-, Lösch-, Änderungsanomalien). BCNF (Boyce-Codd-NF): Verschärfung von 3NF. In der Praxis meist 3NF angestrebt.",
        tip: "1NF: keine Listen. 2NF: kein 'halb-abhängig'. 3NF: keine Kette A→B→C (A=Schlüssel)."
      },
      {
        id: "db-03", topicId: "datenbanken", type: "open", difficulty: "mittel", points: 4,
        question: "Erkläre die Aufgaben eines DBMS (Datenbankmanagement-Systems). Nenne mindestens 4 Aufgaben.",
        modelAnswer: "1. Datenverwaltung: Speichern, Abrufen, Ändern und Löschen von Daten (CRUD)\n2. Datensicherheit: Zugriffskontrolle, Rechteverwaltung (wer darf was lesen/schreiben)\n3. Datenintegrität: Sicherstellung der Konsistenz (Constraints, Fremdschlüssel, Transaktionen)\n4. Mehrbenutzerbetrieb: Gleichzeitiger Zugriff mehrerer Nutzer ohne Konflikte (Locking, Transaktionen, ACID)\n5. Datensicherung/Recovery: Backup und Wiederherstellung nach Fehlern\n6. Abfrageoptimierung: Effiziente Ausführung von SQL-Abfragen (Query Optimizer, Indizes)",
        keyPoints: ["Datenverwaltung (CRUD)", "Zugriffskontrolle", "Integrität/Constraints", "Mehrbenutzerbetrieb (ACID)", "Backup/Recovery"],
        explanation: "ACID-Eigenschaften: Atomicity (alles oder nichts), Consistency (Integritätsbedingungen), Isolation (parallele Transaktionen unabhängig), Durability (Persistenz nach Commit). SQL-DBMS: MySQL, PostgreSQL, Oracle, SQL Server, MariaDB.",
        tip: "DBMS-Aufgaben = ACID + Sicherheit + Recovery. ACID = Atomarität, Konsistenz, Isolation, Dauerhaftigkeit."
      },
      {
        id: "db-04", topicId: "datenbanken", type: "open", difficulty: "leicht", points: 4,
        question: "Schreibe für folgende Anforderungen die SQL-Grundstruktur (kein Code, sondern erkläre welche SQL-Klauseln verwendet werden):\na) Alle Kunden aus München anzeigen\nb) Anzahl der Bestellungen pro Kunde berechnen\nc) Nur Kunden anzeigen die mehr als 5 Bestellungen haben",
        modelAnswer: "a) SELECT * FROM Kunden WHERE Stadt = 'München'\n→ SELECT: Spaltenauswahl (* = alle)\n→ FROM: Tabelle\n→ WHERE: Filterbedingung\n\nb) SELECT KundeID, COUNT(*) AS AnzahlBestellungen\n   FROM Bestellungen\n   GROUP BY KundeID\n→ COUNT(*): Aggregatfunktion zählt Zeilen\n→ GROUP BY: Gruppierung nach KundeID\n\nc) SELECT KundeID, COUNT(*) AS AnzahlBestellungen\n   FROM Bestellungen\n   GROUP BY KundeID\n   HAVING COUNT(*) > 5\n→ HAVING: Filtert nach GROUP BY (WHERE filtert vor Gruppierung, HAVING danach)",
        keyPoints: ["SELECT...FROM...WHERE für Filterung", "COUNT/GROUP BY für Aggregation", "HAVING für Filter nach Aggregation"],
        explanation: "SQL-Reihenfolge: FROM → WHERE → GROUP BY → HAVING → SELECT → ORDER BY. Aggregatfunktionen: COUNT, SUM, AVG, MIN, MAX. JOIN-Typen: INNER JOIN, LEFT/RIGHT OUTER JOIN, FULL JOIN.",
        tip: "WHERE = vor GROUP BY. HAVING = nach GROUP BY. Merke: WHERE HAT keine Aggregatfunktionen."
      },
      {
        id: "db-05", topicId: "datenbanken", type: "multiple-choice", difficulty: "leicht", points: 2,
        question: "Was bedeutet die referenzielle Integrität in einer relationalen Datenbank?",
        answers: [
          { id: "a", text: "Jeder Fremdschlüsselwert muss einem existierenden Primärschlüssel entsprechen", correct: true, explanation: "FK-Constraint verhindert 'verwaiste' Datensätze (Bestellung ohne existierenden Kunden)." },
          { id: "b", text: "Alle Daten müssen verschlüsselt sein", correct: false, explanation: "Das ist Datensicherheit, nicht referenzielle Integrität." },
          { id: "c", text: "Keine NULL-Werte sind erlaubt", correct: false, explanation: "NULL-Werte haben nichts mit referenzieller Integrität zu tun." },
          { id: "d", text: "Tabellen müssen in 3. Normalform sein", correct: false, explanation: "Normalformen und referenzielle Integrität sind separate Konzepte." },
        ],
        explanation: "Referenzielle Integrität: FK-Wert muss in der referenzierten Tabelle als PK existieren (oder NULL). Cascade-Optionen: ON DELETE CASCADE (Löschen propagiert), ON DELETE RESTRICT (Löschen verhindert wenn FK existiert).",
        tip: "FK → PK muss existieren. Kein 'verwaister' Fremdschlüssel. Erzwungen durch FOREIGN KEY CONSTRAINT."
      },
    ],
  },

  // ══════════════════════════════════════════════════════════════
  // 7. WIRTSCHAFT & RECHT
  // ══════════════════════════════════════════════════════════════
  {
    id: "wirtschaft",
    title: "Wirtschaft & Recht",
    icon: "Briefcase",
    description: "Vertragsrecht, Kaufrecht, Kalkulation, DSGVO, Lizenzmodelle, Unternehmensrecht",
    color: "teal",
    questions: [
      {
        id: "wirt-01", topicId: "wirtschaft", type: "open", difficulty: "mittel", points: 6,
        question: "Erkläre den Unterschied zwischen Kaufvertrag, Werkvertrag und Dienstvertrag im IT-Kontext. Gib für jeden Vertragstyp ein konkretes IT-Beispiel.",
        modelAnswer: "Kaufvertrag (§433 BGB):\n→ Übertragung von Eigentum an einer vorhandenen Sache\n→ Pflichten: Verkäufer übergibt Ware, Käufer zahlt\n→ IT-Beispiel: Kauf eines Laptops, Kauf von Standardsoftware-Lizenzen\n\nWerkvertrag (§631 BGB):\n→ Herstellung eines individuellen Werks (Erfolg geschuldet)\n→ Abnahme durch Auftraggeber, Nachbesserungsrecht\n→ IT-Beispiel: Entwicklung einer individuellen Kundendatenbank, Installation einer Netzwerkinfrastruktur\n\nDienstvertrag (§611 BGB):\n→ Tätigkeiten werden erbracht (kein Erfolg geschuldet)\n→ Stundenlohnabrechnung, auch ohne messbares Ergebnis\n→ IT-Beispiel: IT-Support-Stunden, Beratungsleistungen, Managed Services",
        keyPoints: ["Kauf: Eigentum übertragen", "Werkvertrag: Erfolg geschuldet, Abnahme", "Dienstvertrag: Tätigkeit, kein Ergebnis"],
        explanation: "Gewährleistung (§434 BGB): 2 Jahre bei Neukauf. Garantie: freiwillige Herstellerleistung. Mängelrechte: Nacherfüllung, Minderung, Rücktritt, Schadensersatz. SLA (Service Level Agreement): Vereinbarung über Servicequalität (Reaktionszeit, Verfügbarkeit).",
        tip: "Kauf=kaufen. Werk=Ergebnis. Dienst=Stunden. Im IT: Laptop=Kauf, Individualsoftware=Werk, Support=Dienst."
      },
      {
        id: "wirt-02", topicId: "wirtschaft", type: "calculation", difficulty: "mittel", points: 6,
        question: "Berechne den Listenverkaufspreis für eine IT-Lösung:\n• Materialkosten: 3.200 €\n• Materialgemeinkosten: 10%\n• Lohnkosten: 1.800 €\n• Lohngemeinkosten: 120%\n• Verwaltung/Vertrieb: 15% der Herstellkosten\n• Gewinnaufschlag: 8%\n• Skonto: 2%\n• Rabatt: 5%",
        modelAnswer: "Materialkosten:         3.200,00 €\n+ Materialgemeinkosten: 3.200 × 0,10 = 320,00 €\n= Materialkosten ges.:  3.520,00 €\n\nLohnkosten:             1.800,00 €\n+ Lohngemeinkosten:     1.800 × 1,20 = 2.160,00 €\n= Lohnkosten ges.:      3.960,00 €\n\nHerstellkosten:         3.520 + 3.960 = 7.480,00 €\n\n+ Verw./Vertrieb:       7.480 × 0,15 = 1.122,00 €\n= Selbstkosten:         8.602,00 €\n\n+ Gewinn (8%):          8.602 × 0,08 = 688,16 €\n= Barverkaufspreis:     9.290,16 €\n\n÷ (1 - Skonto 2%):      9.290,16 ÷ 0,98 = 9.479,76 €\n= Zielverkaufspreis\n\n÷ (1 - Rabatt 5%):      9.479,76 ÷ 0,95 = 9.978,69 €\n≈ Listenverkaufspreis:  9.979,00 €",
        keyPoints: ["Materialgemeinkosten addieren", "Lohngemeinkosten addieren", "Herstellkosten = Material + Lohn gesamt", "Selbstkosten + Verwaltung", "÷(1-Skonto) für Zielpreis", "÷(1-Rabatt) für Listpreis"],
        explanation: "Zuschlagskalkulation (häufige Prüfungsaufgabe): Materialkosten → +MGK → +Lohn → +LGK → Herstellkosten → +VVK → Selbstkosten → +Gewinn → Barverkaufspreis → ÷(1-Skonto) → Zielverkaufspreis → ÷(1-Rabatt) → Listenverkaufspreis.",
        tip: "Skonto und Rabatt werden GETEILT (nicht addiert): LVP = BVP ÷ (1-Skonto) ÷ (1-Rabatt)"
      },
      {
        id: "wirt-03", topicId: "wirtschaft", type: "open", difficulty: "mittel", points: 4,
        question: "Erkläre den Unterschied zwischen Gewährleistung und Garantie. Welche Rechte hat ein Käufer bei mangelhafter Ware?",
        modelAnswer: "Gewährleistung (gesetzlich, §434 BGB):\n→ Gesetzlich vorgeschrieben, kann nicht ausgeschlossen werden\n→ 2 Jahre bei Neukauf (B2C), 1 Jahr möglich bei B2B\n→ Verkäufer haftet für Sachmängel die bei Übergabe vorhanden waren\n→ Reihenfolge der Mängelrechte: 1. Nacherfüllung (Reparatur oder Neulieferung), 2. Minderung oder Rücktritt, 3. Schadensersatz\n\nGarantie (freiwillig, Hersteller/Händler):\n→ Freiwillige Zusatzleistung über gesetzliche Gewährleistung hinaus\n→ Bedingungen vom Anbieter frei gestaltet\n→ Beispiel: 3 Jahre Herstellergarantie auf Laptop",
        keyPoints: ["Gewährleistung = gesetzlich, 2 Jahre", "Garantie = freiwillig", "Mängelrechte: Nacherfüllung → Minderung/Rücktritt → Schadensersatz"],
        explanation: "B2C (Business-to-Consumer): 2 Jahre Gewährleistung, Beweislast in ersten 6 Monaten beim Händler. B2B (Business-to-Business): 1 Jahr möglich. Verjährung beginnt mit Übergabe.",
        tip: "Gewährleistung = Pflicht (Gesetz). Garantie = Freiwillig (Hersteller). Erst Nacherfüllung, dann Rücktritt!"
      },
      {
        id: "wirt-04", topicId: "wirtschaft", type: "open", difficulty: "mittel", points: 4,
        question: "Erkläre den Unterschied zwischen Open Source und proprietärer Software. Nenne je zwei Lizenzmodelle und gib ein Beispiel.",
        modelAnswer: "Open Source:\n→ Quellcode ist öffentlich einsehbar, oft kostenlos nutzbar\n→ Freiheiten: Nutzen, Verstehen, Weitergeben, Verbessern\n→ Lizenzmodelle:\n  • GPL (GNU General Public License): Änderungen müssen auch Open Source sein (Copyleft)\n  • MIT-Lizenz: sehr permissiv, kaum Einschränkungen, auch in proprietären Produkten nutzbar\n→ Beispiele: Linux, Apache, MySQL, LibreOffice\n\nProprietäre Software:\n→ Quellcode geschlossen, Nutzung an Lizenz gebunden\n→ Lizenzmodelle:\n  • Named User License: Lizenz für bestimmten Benutzer\n  • Concurrent User License: Anzahl gleichzeitiger Nutzer begrenzt\n→ Beispiele: Windows, Microsoft 365, Adobe Photoshop",
        keyPoints: ["Open Source: offener Quellcode", "GPL: Copyleft", "MIT: permissiv", "Proprietär: geschlossener Code, Lizenzkauf"],
        explanation: "Weitere Lizenzmodelle: LGPL (Library GPL), Apache, BSD, Creative Commons (für Inhalte). Pay-per-Use, Freemium, SaaS-Abonnement, OEM (nur mit Hardware). EULA: End User License Agreement.",
        tip: "GPL = Copyleft (viral). MIT = frei verwendbar. Proprietär = kaufen/mieten."
      },
      {
        id: "wirt-05", topicId: "wirtschaft", type: "open", difficulty: "mittel", points: 4,
        question: "Was versteht man unter Leasing im IT-Bereich? Nenne drei Vor- und zwei Nachteile des Leasings gegenüber dem Kauf.",
        modelAnswer: "Leasing: Nutzungsüberlassung eines Wirtschaftsguts gegen regelmäßige Zahlungen.\nLeasingnehmer nutzt das Gerät, Leasinggeber bleibt Eigentümer.\n\nVorteile Leasing:\n1. Geringe Anfangsinvestition (kein Kapitalbindung)\n2. Planbare monatliche Raten (Liquidität)\n3. Immer aktuelle Hardware (Austausch nach Leasingende)\n4. Steuerlich als Betriebsausgabe absetzbar\n\nNachteile Leasing:\n1. Insgesamt höhere Gesamtkosten als Kauf\n2. Kein Eigentum am Ende der Laufzeit\n3. Vorzeitige Kündigung meist teuer",
        keyPoints: ["Leasing = Nutzung ohne Eigentum", "Vorteil: geringe Anfangsinvestition", "Vorteil: immer aktuelle Hardware", "Nachteil: teurer als Kauf"],
        explanation: "Kauf vs. Leasing vs. Miete: Kauf = Eigentum, Miete = kurzfristig, Leasing = mittelfristig. TCO (Total Cost of Ownership): Gesamtbetriebskosten inkl. Anschaffung, Betrieb, Wartung, Entsorgung.",
        tip: "Leasing-Merkhilfe: Nutzen ohne Besitzen. Vorteil: Cash flow. Nachteil: Gesamtkosten höher."
      },
      {
        id: "wirt-06", topicId: "wirtschaft", type: "calculation", difficulty: "mittel", points: 4,
        question: "Berechne den Deckungsbeitrag und den Gewinn:\n• Verkaufspreis pro Einheit: 450 €\n• Variable Kosten pro Einheit: 280 €\n• Fixkosten gesamt: 42.000 €\n• Verkaufte Menge: 350 Einheiten\nBerechne: a) Deckungsbeitrag pro Stück, b) Gesamtdeckungsbeitrag, c) Gewinn/Verlust, d) Break-Even-Menge",
        modelAnswer: "a) Deckungsbeitrag pro Stück = Verkaufspreis - variable Kosten\n   = 450 - 280 = 170 €\n\nb) Gesamtdeckungsbeitrag = 170 × 350 = 59.500 €\n\nc) Gewinn = Gesamtdeckungsbeitrag - Fixkosten\n   = 59.500 - 42.000 = 17.500 € (Gewinn)\n\nd) Break-Even-Menge = Fixkosten ÷ Deckungsbeitrag pro Stück\n   = 42.000 ÷ 170 = 247,06 ≈ 248 Einheiten",
        keyPoints: ["DB = Preis - variable Kosten", "Gesamt-DB = DB × Menge", "Gewinn = Gesamt-DB - Fixkosten", "Break-Even = Fixkosten ÷ DB"],
        explanation: "Deckungsbeitrag = Beitrag zur Deckung der Fixkosten. Über Break-Even = Gewinnzone. Unter Break-Even = Verlustzone. Wichtig: Variable Kosten steigen mit Menge, Fixkosten bleiben konstant.",
        tip: "DB = Preis - var. Kosten. Break-Even: DB × Menge = Fixkosten → Menge = FK ÷ DB."
      },
    ],
  },

  // ══════════════════════════════════════════════════════════════
  // 8. BETRIEBSSYSTEME & SYSTEMADMIN
  // ══════════════════════════════════════════════════════════════
  {
    id: "systemadmin",
    title: "Betriebssysteme & Systemadministration",
    icon: "Server",
    description: "Windows/Linux, Active Directory, GPO, Virtualisierung, Cloud, CLI-Befehle",
    color: "indigo",
    questions: [
      {
        id: "sys-01", topicId: "systemadmin", type: "open", difficulty: "mittel", points: 4,
        question: "Erkläre den Unterschied zwischen Virtualisierung und Cloud Computing. Nenne je zwei Einsatzszenarien.",
        modelAnswer: "Virtualisierung:\n→ Software-Technik: Auf einem physischen Server laufen mehrere virtuelle Maschinen\n→ Hypervisor verwaltet VMs: Typ 1 (Bare-Metal: Hyper-V, ESXi) oder Typ 2 (Hosted: VirtualBox, VMware Workstation)\n→ Einsatz 1: Server-Konsolidierung (viele physische Server → wenige Hosts)\n→ Einsatz 2: Testumgebungen, Isolierung von Anwendungen\n\nCloud Computing:\n→ IT-Ressourcen über Internet als Service bereitgestellt\n→ Modelle: IaaS (VM mieten), PaaS (Plattform), SaaS (Software)\n→ Typen: Public Cloud (Azure, AWS, GCP), Private Cloud, Hybrid\n→ Einsatz 1: Skalierbare Web-Anwendungen ohne eigene Infrastruktur\n→ Einsatz 2: Disaster Recovery / Backup in die Cloud",
        keyPoints: ["Virtualisierung = eigene Hardware, mehrere VMs", "Cloud = externe Ressourcen, Abrechnung nach Nutzung", "IaaS/PaaS/SaaS"],
        explanation: "Container (Docker) vs. VMs: Container teilen OS-Kernel → leichter/schneller, aber weniger Isolation. Kubernetes: Container-Orchestrierung. DevOps nutzt Container für CI/CD-Pipelines.",
        tip: "IaaS = VM mieten. PaaS = Plattform (Datenbank as a Service). SaaS = Software (Office 365). Cloud = pay-as-you-go."
      },
      {
        id: "sys-02", topicId: "systemadmin", type: "open", difficulty: "mittel", points: 4,
        question: "Erkläre die Funktion von Active Directory (AD). Welche Objekte werden in einem AD verwaltet und was ist eine Organisationseinheit (OU)?",
        modelAnswer: "Active Directory (AD):\n→ Verzeichnisdienst von Microsoft für Windows-Domänen\n→ Zentrale Authentifizierung und Autorisierung\n→ Protokoll: LDAP (Lightweight Directory Access Protocol), Kerberos\n\nVerwaltete Objekte:\n• Benutzer (User): Anmeldekonten mit Passwort, Profil\n• Computer: Domain-Computer, Gruppenrichtlinien anwenden\n• Gruppen: Sicherheitsgruppen (Rechte), Verteilergruppen (E-Mail)\n• Drucker, Freigaben\n\nOrganisationseinheit (OU):\n→ Container zur hierarchischen Strukturierung von AD-Objekten\n→ GPOs (Gruppenrichtlinien) werden auf OUs angewendet\n→ Beispiel: OU=Abteilung_IT > OU=Admins (spezielle Richtlinien für Admins)\n→ OUs spiegeln oft Unternehmensstruktur wider",
        keyPoints: ["AD = Verzeichnisdienst, zentrales Login", "Objekte: Benutzer, Computer, Gruppen", "OU = Container für GPO-Anwendung"],
        explanation: "Domain Controller (DC): Server der AD-Dienst betreibt. PDC Emulator: wichtigste FSMO-Rolle. AD-Replikation: Änderungen zwischen DCs synchronisiert. LDAP-Pfad: CN=User,OU=IT,DC=firma,DC=de",
        tip: "AD-Strukturhinweis: Forest > Domain > OU > Objekte. GPO wird an OU gehängt und auf alle darin enthaltenen Objekte angewendet."
      },
      {
        id: "sys-03", topicId: "systemadmin", type: "open", difficulty: "leicht", points: 4,
        question: "Erkläre die wichtigsten Linux-CLI-Befehle. Was machen: ls, cd, chmod, chown, ps aux, grep, ping, ifconfig/ip addr?",
        modelAnswer: "ls: Verzeichnisinhalt anzeigen (-l = Liste, -a = versteckte Dateien)\ncd: Verzeichnis wechseln (cd /etc, cd .., cd ~)\nchmod: Dateiberechtigungen ändern (chmod 755 datei.sh = rwxr-xr-x)\nchown: Eigentümer ändern (chown user:gruppe datei)\nps aux: Alle laufenden Prozesse anzeigen\ngrep: Text in Dateien suchen (grep 'fehler' logdatei.txt, ps aux | grep nginx)\nping: Netzwerkverbindung testen (ping 8.8.8.8)\nifconfig / ip addr: Netzwerkinterfaces und IP-Adressen anzeigen\n\nBonus:\ntail -f /var/log/syslog: Log-Datei live verfolgen\nsudo: Befehl als root ausführen\napt install / yum install: Pakete installieren",
        keyPoints: ["ls = Liste Verzeichnis", "chmod = Berechtigungen", "grep = suchen", "ps aux = Prozesse", "ping = Netzwerktest"],
        explanation: "Linux-Berechtigungen: rwx für User (u), Group (g), Other (o). Oktale Notation: r=4, w=2, x=1. chmod 755 = 7(rwx) 5(r-x) 5(r-x). Distributionen: Debian/Ubuntu (apt), RHEL/CentOS (yum/dnf), openSUSE (zypper).",
        tip: "chmod-Zahlen: 7=rwx, 6=rw-, 5=r-x, 4=r--, 0=---. 755 = Skript: Owner alles, Rest lesen+ausführen."
      },
      {
        id: "sys-04", topicId: "systemadmin", type: "multiple-choice", difficulty: "leicht", points: 2,
        question: "Was ist der Unterschied zwischen kooperativem und präemptivem Multitasking?",
        answers: [
          { id: "a", text: "Kooperativ: Programme geben CPU freiwillig ab. Präemptiv: OS entzieht CPU zwangsweise.", correct: true, explanation: "Moderne OS (Windows, Linux) nutzen präemptives Multitasking für Stabilität." },
          { id: "b", text: "Kooperativ ist schneller als präemptiv", correct: false, explanation: "Präemptives ist stabiler; ein hängendes Programm blockiert nicht das System." },
          { id: "c", text: "Kein Unterschied bei modernen Betriebssystemen", correct: false, explanation: "Moderne OS nutzen präemptives Multitasking (kein kooperatives mehr)." },
          { id: "d", text: "Kooperativ ist die modernere Methode", correct: false, explanation: "Kooperativ (z.B. Windows 3.x, frühe Mac OS) ist veraltet." },
        ],
        explanation: "Kooperativ (Windows 3.x, früher Mac OS): Anwendung ruft Betriebssystem auf, um CPU abzugeben. Problem: hängende Anwendung blockiert alles. Präemptiv (Windows NT+, Linux): Scheduler entzieht nach Zeitscheibe zwangsweise CPU. Prozess → Thread → Task.",
        tip: "Kooperativ = freiwillig. Präemptiv = erzwungen (Scheduler). Modern = präemptiv."
      },
      {
        id: "sys-05", topicId: "systemadmin", type: "open", difficulty: "mittel", points: 4,
        question: "Erkläre den Unterschied zwischen FAT32, NTFS und ext4. Für welche Einsatzzwecke eignet sich welches Dateisystem?",
        modelAnswer: "FAT32:\n→ Ältestes, kompatibelstes Dateisystem\n→ Keine Zugriffsrechte, keine Verschlüsselung\n→ Max. Dateigröße: 4 GB, max. Partitionsgröße: 8 TB\n→ Einsatz: USB-Sticks, SD-Karten (maximale Kompatibilität)\n\nNTFS (New Technology File System):\n→ Windows-Standard seit NT\n→ Zugriffsrechte (ACL), Verschlüsselung (EFS), Journaling, Komprimierung\n→ Max. Dateigröße: 16 TB (theor. 16 ExaByte)\n→ Einsatz: Windows-Systemlaufwerk, Netzwerkfreigaben\n\next4 (Fourth Extended Filesystem):\n→ Linux-Standard-Dateisystem\n→ Journaling, ACL, sehr stabil, große Dateien\n→ Max. Dateigröße: 16 TB\n→ Einsatz: Linux-Systempartitionen, Server",
        keyPoints: ["FAT32: kompatibel, keine Rechte, max 4GB Datei", "NTFS: Windows, ACL, Journaling", "ext4: Linux-Standard, stabil"],
        explanation: "Weitere Dateisysteme: exFAT (für große Dateien auf USB/Flash, cross-platform), APFS (Apple), Btrfs/ZFS (Linux-Server), ReFS (Windows-Server). Journaling: Änderungen werden protokolliert → Konsistenz nach Absturz.",
        tip: "USB-Stick für alle: exFAT. Windows-PC: NTFS. Linux-Server: ext4. FAT32 = Altlast (max 4GB)."
      },
    ],
  },

  // ══════════════════════════════════════════════════════════════
  // 9. QUALITÄTSSICHERUNG & SERVICEANFRAGEN
  // ══════════════════════════════════════════════════════════════
  {
    id: "qualitaet",
    title: "Qualität & Service",
    icon: "CheckSquare",
    description: "QS-Methoden, ITIL, PDCA, Ticketsysteme, Dokumentation, SLA",
    color: "cyan",
    questions: [
      {
        id: "qs-01", topicId: "qualitaet", type: "open", difficulty: "leicht", points: 4,
        question: "Erkläre den PDCA-Zyklus (Deming-Kreis). Wie wird er im IT-Umfeld angewendet? Gib ein Beispiel.",
        modelAnswer: "PDCA = Plan → Do → Check → Act\n\nPlan (Planen): Problem analysieren, Ziel definieren, Maßnahmen planen\nDo (Ausführen): Maßnahmen im kleinen Rahmen testen/umsetzen\nCheck (Überprüfen): Ergebnisse messen und mit Zielen vergleichen\nAct (Handeln): Bei Erfolg → standardisieren. Bei Misserfolg → nochmals planen\n\nBeispiel IT: Hohe Fehlerrate bei Software-Deployments\n→ Plan: Deployment-Checkliste und Testprozess erstellen\n→ Do: In einem Team-Projekt testen\n→ Check: Fehlerrate vorher/nachher vergleichen\n→ Act: Bei Verbesserung → Prozess für alle Teams einführen",
        keyPoints: ["Plan: analysieren, planen", "Do: umsetzen (klein)", "Check: messen", "Act: standardisieren oder korrigieren"],
        explanation: "PDCA stammt aus dem Qualitätsmanagement (Deming). Kaizen: japanisches Konzept für kontinuierliche Verbesserung. ISO 9001: Qualitätsmanagementsystem-Norm. ITIL: IT Service Management Best Practices.",
        tip: "PDCA = ewiger Verbesserungskreis. Nicht einmalig, sondern kontinuierlich!"
      },
      {
        id: "qs-02", topicId: "qualitaet", type: "open", difficulty: "mittel", points: 4,
        question: "Was versteht man unter einem SLA (Service Level Agreement)? Nenne vier typische Inhalte eines SLAs.",
        modelAnswer: "SLA (Service Level Agreement): Vertraglich vereinbartes Dokument zwischen Dienstleister und Kunden, das die Qualität einer IT-Dienstleistung definiert.\n\nTypische Inhalte:\n1. Verfügbarkeit: z.B. 99,9% Uptime (entspricht max. ~8,7h Ausfall/Jahr)\n2. Reaktionszeit: Zeit bis erste Reaktion auf Incident (z.B. Kritisch: 1h, Normal: 4h)\n3. Lösungszeit: Zeit bis zur vollständigen Behebung\n4. Support-Zeiten: z.B. 24/7 für kritische Systeme, 8×5 für Normal\n5. Eskalationsstufen: 1st/2nd/3rd Level Support\n6. Strafen (Konventionalstrafen): Vertragsstrafe bei SLA-Verletzung",
        keyPoints: ["Verfügbarkeit (Uptime)", "Reaktionszeit", "Lösungszeit", "Support-Zeiten"],
        explanation: "KPIs für SLAs: MTBF (Mean Time Between Failures), MTTR (Mean Time To Repair/Recover). ITIL: Incident (Störung), Problem (Ursache), Change (Änderung), Release. 5 Neunen = 99,999% = ~5min Ausfall/Jahr.",
        tip: "SLA = Vertrag über Service-Qualität. 99,9% Verfügbarkeit = ~8,7h Ausfall/Jahr erlaubt."
      },
      {
        id: "qs-03", topicId: "qualitaet", type: "multiple-choice", difficulty: "leicht", points: 2,
        question: "Was ist der Unterschied zwischen 1st, 2nd und 3rd Level Support?",
        answers: [
          { id: "a", text: "1st = Erstaufnahme/einfache Probleme, 2nd = Spezialisten, 3rd = Hersteller/Entwickler", correct: true, explanation: "Eskalation von einfach → komplex → Hersteller." },
          { id: "b", text: "1st = teuerster Support, 3rd = günstigster", correct: false, explanation: "Umgekehrt: 3rd-Level ist teurer (Spezialisten, Hersteller)." },
          { id: "c", text: "Alle Level machen dasselbe", correct: false, explanation: "Verschiedene Spezialisierungsgrade und Eskalationsstufen." },
          { id: "d", text: "2nd Level = extern ausgelagerter Support", correct: false, explanation: "Level-Zuordnung ist unabhängig von intern/extern." },
        ],
        explanation: "1st Level: Helpdesk, Erstaufnahme, FAQ, Passwort-Reset, Standardprobleme. 2nd Level: Techniker, Server-/Netzwerkprobleme, tiefere Fehlersuche. 3rd Level: Entwickler, Hersteller, komplexe Bugs. ITIL: Service Desk = Entry Point.",
        tip: "Level 1: Helpdesk. Level 2: Techniker. Level 3: Hersteller. Immer von unten nach oben eskalieren."
      },
      {
        id: "qs-04", topicId: "qualitaet", type: "open", difficulty: "mittel", points: 3,
        question: "Erkläre das Wasserfallmodell-Phasenprinzip. Warum sind frühe Fehler besonders teuer in diesem Modell?",
        modelAnswer: "Wasserfallmodell-Phasen:\n1. Anforderungsanalyse (Was wird benötigt?)\n2. Systemdesign (Wie wird es aufgebaut?)\n3. Implementierung (Coding)\n4. Testen/Integration\n5. Einführung/Betrieb\n6. Wartung\n\nFrühe Fehler sind teuer, weil:\n→ Jede Phase baut auf der vorherigen auf\n→ Ein Fehler in der Anforderungsanalyse zieht sich durch ALLE folgenden Phasen\n→ Je später ein Fehler entdeckt wird, desto mehr Arbeit muss rückgängig gemacht werden\n→ Beispiel: Falsche Anforderung → falsches Design → falscher Code → alles muss neu gemacht werden\n→ Korrekturfaktor: Fehler in Anforderung × 100 teurer als in der Test-Phase",
        keyPoints: ["6 Phasen sequenziell", "frühe Fehler durchziehen alle Phasen", "Korrekturen exponentiell teurer je später"],
        explanation: "Das ist ein Hauptkritikpunkt am Wasserfall: Fehlende Flexibilität. Lösung: Agile Methoden (Scrum, Kanban) mit kurzen Iterationen und frühzeitigem Feedback. V-Modell: Erweiterung mit zugehörigen Tests je Phase.",
        tip: "Wasserfall: 1 Chance zu korrigieren. Agil: jeder Sprint = Chance zum Korrigieren."
      },
    ],
  },

  // ══════════════════════════════════════════════════════════════
  // 10. WIRTSCHAFTSKUNDE & KAUFMÄNNISCHES
  // ══════════════════════════════════════════════════════════════
  {
    id: "bwl",
    title: "Wirtschaftskunde & Betrieb",
    icon: "TrendingUp",
    description: "Unternehmensformen, Arbeitsrecht, Kalkulation, Marktformen, Kennzahlen",
    color: "pink",
    questions: [
      {
        id: "bwl-01", topicId: "bwl", type: "open", difficulty: "mittel", points: 4,
        question: "Nenne und erkläre drei Unternehmensformen. Beschreibe Haftung und Stammkapital.",
        modelAnswer: "GmbH (Gesellschaft mit beschränkter Haftung):\n→ Kapitalgesellschaft, juristische Person\n→ Mindest-Stammkapital: 25.000 €\n→ Haftung: nur das Gesellschaftsvermögen (nicht privat)\n→ Organe: Geschäftsführer, Gesellschafterversammlung\n\nAG (Aktiengesellschaft):\n→ Kapitalgesellschaft, Aktien an Börse handelbar\n→ Mindest-Grundkapital: 50.000 €\n→ Haftung: nur das Gesellschaftsvermögen\n→ Organe: Vorstand, Aufsichtsrat, Hauptversammlung\n\nGbR (Gesellschaft bürgerlichen Rechts):\n→ Personengesellschaft, keine Mindestkapital-Anforderung\n→ Haftung: unbeschränkt persönlich (mit Privatvermögen!)\n→ Einfachste Form für Zusammenschlüsse",
        keyPoints: ["GmbH: 25.000€, beschränkte Haftung", "AG: 50.000€, Aktien", "GbR: kein Mindestkapital, unbeschränkte Haftung"],
        explanation: "Weitere: UG (haftungsbeschränkt) = Mini-GmbH (1€), OHG (alle Gesellschafter haften), KG (Komplementär voll, Kommanditist begrenzt), e.G. (Genossenschaft). Einzelunternehmen: Inhaber haftet privat.",
        tip: "Kapitalgesellschaften (GmbH, AG) haften nur mit Gesellschaftsvermögen. Personengesellschaften (GbR, OHG) auch privat!"
      },
      {
        id: "bwl-02", topicId: "bwl", type: "open", difficulty: "mittel", points: 4,
        question: "Erkläre den Unterschied zwischen Prokura und Handlungsvollmacht. Was darf ein Prokurist, was nicht?",
        modelAnswer: "Prokura (§48 HGB):\n→ Weitgehendste kaufmännische Vollmacht\n→ Eingetragen ins Handelsregister (Zusatz: 'ppa.' oder 'per procura')\n→ Darf: fast alle Rechtsgeschäfte des Handelsgetriebs abschließen\n→ Darf NICHT ohne besondere Ermächtigung: Grundstücke verkaufen, das Unternehmen verkaufen, Prokura erteilen\n\nHandlungsvollmacht (§54 HGB):\n→ Begrenzte Vollmacht für bestimmte Tätigkeiten\n→ Nicht ins Handelsregister eingetragen\n→ Typen: Generalhandlungsvollmacht (alle typischen Geschäfte), Arthandlungsvollmacht (bestimmte Art), Spezialvollmacht (Einzelgeschäft)\n→ Kürzel: i.A. (im Auftrag) oder i.V. (in Vertretung)",
        keyPoints: ["Prokura = weitgehendste Vollmacht, HReg", "Darf nicht: Grundstücke verkaufen", "Handlungsvollmacht = begrenzt, kein HReg"],
        explanation: "Vollmachten im Betrieb: Wer unterschreibt was? Prokura: 'ppa. Mustermann'. Handlungsvollmacht: 'i.V. Mustermann'. i.A. = im Auftrag (schwächste Form). Wichtig für Verträge: wer ist zur Vertretung berechtigt?",
        tip: "Prokura = fast alles (außer Grundstücke, Firmenverkauf). i.V. = Handlungsvollmacht. i.A. = im Auftrag (weniger)."
      },
      {
        id: "bwl-03", topicId: "bwl", type: "open", difficulty: "leicht", points: 3,
        question: "Erkläre den Unterschied zwischen Effektivität und Effizienz. Gib je ein Beispiel aus dem IT-Bereich.",
        modelAnswer: "Effektivität: Die richtigen Dinge tun – Zielerreichung\n→ Frage: Wird das richtige Ziel erreicht?\n→ Beispiel: Ein Backup-System das tatsächlich alle kritischen Daten sichert = effektiv\n\nEffizienz: Die Dinge richtig tun – Ressourceneinsatz\n→ Frage: Wird das Ziel mit minimalem Aufwand erreicht?\n→ Beispiel: Backup läuft in 30 Minuten statt 3 Stunden = effizienter Prozess\n\nBeide zusammen: Richtiges Ziel (effektiv) + minimale Ressourcen (effizient) = optimal",
        keyPoints: ["Effektivität = richtiges Ziel", "Effizienz = minimaler Aufwand", "Beide notwendig"],
        explanation: "Peter Drucker: 'Effektivität ist das Richtige tun, Effizienz ist das Tun richtig.' Im Projektmanagement: Effektivität = Projektziel erreicht. Effizienz = Budget und Zeit eingehalten.",
        tip: "Effektiv = richtiges Ergebnis. Effizient = wenig Aufwand. Beide ohne den anderen: Probleme!"
      },
      {
        id: "bwl-04", topicId: "bwl", type: "open", difficulty: "mittel", points: 4,
        question: "Was versteht man unter Change Management im Unternehmenskontext? Erkläre das 3-Phasen-Modell nach Lewin.",
        modelAnswer: "Change Management: Strukturierter Prozess zur Steuerung und Begleitung von Veränderungen in Organisationen.\nZiel: Mitarbeiter für Veränderungen gewinnen, Widerstände reduzieren.\n\nLewin-Modell (3 Phasen):\n\n1. Unfreeze (Auftauen):\n→ Bestehende Strukturen und Gewohnheiten aufbrechen\n→ Veränderungsnotwendigkeit kommunizieren\n→ Mitarbeiter auf Veränderung vorbereiten\n\n2. Change (Verändern):\n→ Neue Strukturen, Prozesse, Verhaltensweisen einführen\n→ Schulungen, Kommunikation, Support\n→ Widerstände aktiv managen\n\n3. Refreeze (Einfrieren):\n→ Neue Zustände stabilisieren und verankern\n→ Neue Gewohnheiten festigen\n→ Erfolge kommunizieren",
        keyPoints: ["Unfreeze: vorbereiten", "Change: umsetzen", "Refreeze: stabilisieren", "Mitarbeiter einbeziehen"],
        explanation: "Typische Reaktionen auf Veränderungen: Promotoren (aktiv unterstützend), Skeptiker (abwartend), Bremser (passiver Widerstand), Widerständler (aktiver Widerstand). Maßnahmen: frühzeitig informieren, Schulungen, Erfolge sichtbar machen.",
        tip: "Lewin: Einfrieren → Auftauen → Verändern → Einfrieren. Nicht überspringen! Zuerst 'auftauen'."
      },
    ],
  },

];

export function getAllQuestions(): Question[] {
  return topics.flatMap(t => t.questions);
}

export function getTopicById(id: string): Topic | undefined {
  return topics.find(t => t.id === id);
}

export function getQuestionsByTopic(topicId: string): Question[] {
  return topics.find(t => t.id === topicId)?.questions ?? [];
}
