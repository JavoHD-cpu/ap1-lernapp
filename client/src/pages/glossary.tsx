import { Link } from "wouter";
import { ArrowLeft, BookMarked, Search } from "lucide-react";
import { useState, useMemo } from "react";

interface GlossaryEntry {
  term: string;
  category: string;
  definition: string;
  example?: string;
}

const entries: GlossaryEntry[] = [
  // Netzwerk
  { term: "OSI-Modell", category: "Netzwerk", definition: "7-Schichten-Referenzmodell für Netzwerkkommunikation. Schichten: Physisch, Sicherung, Netzwerk, Transport, Sitzung, Darstellung, Anwendung.", example: "IP arbeitet auf Schicht 3 (Netzwerk), TCP auf Schicht 4 (Transport)." },
  { term: "TCP/IP", category: "Netzwerk", definition: "Protokollfamilie für das Internet. TCP (verbindungsorientiert, zuverlässig), IP (Adressierung und Routing).", example: "HTTP nutzt TCP, DNS nutzt UDP." },
  { term: "DHCP", category: "Netzwerk", definition: "Dynamic Host Configuration Protocol – weist Geräten automatisch IP-Adressen, Subnetzmaske, Gateway und DNS zu.", example: "Ein Router vergibt per DHCP IPs an alle Heimgeräte." },
  { term: "DNS", category: "Netzwerk", definition: "Domain Name System – übersetzt Domainnamen in IP-Adressen (Telefonbuch des Internets).", example: "www.google.de → 142.250.185.35" },
  { term: "NAT", category: "Netzwerk", definition: "Network Address Translation – übersetzt private IP-Adressen in eine öffentliche IP-Adresse (und zurück).", example: "Heimnetz 192.168.1.x → öffentliche IP des Routers." },
  { term: "VLAN", category: "Netzwerk", definition: "Virtual Local Area Network – logische Trennung eines physischen Netzwerks in mehrere isolierte Segmente.", example: "VLAN 10 für Buchhaltung, VLAN 20 für IT." },
  { term: "Subnetting", category: "Netzwerk", definition: "Aufteilung eines IP-Netzwerks in kleinere Teilnetze durch Anpassung der Subnetzmaske.", example: "192.168.1.0/24 → vier /26-Subnetze mit je 62 Hosts." },
  { term: "Gateway", category: "Netzwerk", definition: "Netzwerkkomponente (meist Router), die Pakete zwischen verschiedenen Netzwerken weiterleitet.", example: "Standard-Gateway: 192.168.1.1" },
  { term: "Switch", category: "Netzwerk", definition: "OSI-Schicht-2-Gerät, das Datenpakete gezielt an MAC-Adresse weiterleitet (kein Broadcasting wie Hub).", example: "Managed Switch unterstützt VLANs und Spanning Tree." },
  { term: "Router", category: "Netzwerk", definition: "OSI-Schicht-3-Gerät, das Pakete anhand von IP-Adressen zwischen Netzwerken weiterleitet.", example: "Entscheidet ob Paket ins LAN oder ins Internet geht." },
  { term: "Firewall", category: "Netzwerk", definition: "Sicherheitssystem, das Netzwerkverkehr anhand von Regeln filtert und unerwünschte Verbindungen blockiert.", example: "Paketfilter, Stateful Inspection, Application-Layer-Firewall." },
  { term: "VPN", category: "Netzwerk", definition: "Virtual Private Network – verschlüsselter Tunnel über ein öffentliches Netz für sichere Verbindungen.", example: "Mitarbeiter im Homeoffice verbindet sich per VPN mit dem Firmennetz." },
  { term: "PoE", category: "Netzwerk", definition: "Power over Ethernet – Stromversorgung von Geräten (z.B. IP-Kameras, APs) über das Netzwerkkabel.", example: "PoE-Switch versorgt WLAN-Accesspoints ohne extra Netzteil." },
  { term: "IPv4 vs IPv6", category: "Netzwerk", definition: "IPv4: 32-Bit-Adressen (ca. 4,3 Mrd.). IPv6: 128-Bit-Adressen (praktisch unbegrenzt). IPv6 löst Adressknappheit.", example: "IPv4: 192.168.1.1 | IPv6: 2001:0db8::1" },
  // Sicherheit
  { term: "CIA-Triad", category: "Sicherheit", definition: "Schutzziele der IT-Sicherheit: Confidentiality (Vertraulichkeit), Integrity (Integrität), Availability (Verfügbarkeit).", example: "Backup sichert Verfügbarkeit; Verschlüsselung sichert Vertraulichkeit." },
  { term: "DSGVO", category: "Sicherheit", definition: "Datenschutz-Grundverordnung – EU-Verordnung zum Schutz personenbezogener Daten seit 2018.", example: "Meldepflicht bei Datenpanne innerhalb 72 Stunden an Aufsichtsbehörde." },
  { term: "BSI", category: "Sicherheit", definition: "Bundesamt für Sicherheit in der Informationstechnik – gibt IT-Grundschutz-Empfehlungen für deutsche Behörden und Unternehmen heraus.", },
  { term: "Phishing", category: "Sicherheit", definition: "Angriff durch täuschend echte E-Mails oder Webseiten zur Entwendung von Zugangsdaten.", example: "Gefälschte PayPal-Mail fordert zur Dateneingabe auf." },
  { term: "Social Engineering", category: "Sicherheit", definition: "Manipulation von Personen zur Preisgabe vertraulicher Informationen, ohne technische Hilfsmittel.", example: "Angreifer gibt sich als IT-Support aus und erfrägt das Passwort." },
  { term: "Zero-Day", category: "Sicherheit", definition: "Sicherheitslücke, für die noch kein Patch existiert und die aktiv ausgenutzt wird.", example: "Hersteller hatte 0 Tage Zeit zum Reagieren." },
  { term: "Patch-Management", category: "Sicherheit", definition: "Systematisches Einspielen von Sicherheitsupdates und Bugfixes auf Systemen.", example: "Windows Update, apt upgrade auf Linux-Servern." },
  { term: "2FA / MFA", category: "Sicherheit", definition: "Zwei-/Multi-Faktor-Authentifizierung – Login erfordert zwei verschiedene Faktoren (Wissen + Besitz + Sein).", example: "Passwort + SMS-Code = 2FA." },
  { term: "Ransomware", category: "Sicherheit", definition: "Schadsoftware, die Dateien verschlüsselt und Lösegeld fordert.", example: "WannaCry 2017 legte weltweit Krankenhäuser lahm." },
  // Projektmanagement
  { term: "Lastenheft", category: "Projektmanagement", definition: "Dokument des Auftraggebers: Was soll das System können? Enthält Anforderungen ohne technische Details.", example: "\"Das System muss 1000 gleichzeitige Nutzer unterstützen.\"" },
  { term: "Pflichtenheft", category: "Projektmanagement", definition: "Dokument des Auftragnehmers: Wie wird das Lastenheft technisch umgesetzt?", example: "\"Wir setzen einen Load Balancer mit 3 Appservern ein.\"" },
  { term: "Scrum", category: "Projektmanagement", definition: "Agiles Rahmenwerk mit Sprints (1–4 Wochen), Rollen (Product Owner, Scrum Master, Team) und Events (Daily, Review, Retrospektive).", example: "Sprint Planning → Sprint → Review → Retrospektive → nächster Sprint." },
  { term: "Kanban", category: "Projektmanagement", definition: "Agile Methode zur Visualisierung von Aufgaben auf einem Board (To Do / In Progress / Done).", example: "Jira-Board mit WIP-Limits pro Spalte." },
  { term: "Wasserfall", category: "Projektmanagement", definition: "Klassisches, sequentielles Vorgehensmodell: Jede Phase muss abgeschlossen sein bevor die nächste beginnt.", example: "Anforderung → Design → Implementierung → Test → Betrieb." },
  { term: "Gantt-Diagramm", category: "Projektmanagement", definition: "Balkendiagramm zur Darstellung von Projektzeitplan, Aufgabendauer und Abhängigkeiten.", example: "Zeigt welche Tasks parallel laufen können." },
  { term: "Kritischer Pfad", category: "Projektmanagement", definition: "Längster Weg durch das Netzdiagramm. Vorgänge auf dem krit. Pfad haben keinen Puffer (GP=0).", example: "Verzögerung eines krit. Vorgangs = Projektverzögerung." },
  // Software & Datenbanken
  { term: "OOP", category: "Software", definition: "Objektorientierte Programmierung – Code ist in Klassen und Objekte organisiert mit Vererbung, Kapselung und Polymorphismus.", example: "Klasse Fahrzeug erbt an Klasse Auto." },
  { term: "UML", category: "Software", definition: "Unified Modeling Language – Standardsprache zur grafischen Darstellung von Software-Architekturen und Abläufen.", example: "Klassendiagramm, Sequenzdiagramm, Use-Case-Diagramm." },
  { term: "ER-Modell", category: "Software", definition: "Entity-Relationship-Modell – Datenbankschema-Entwurf mit Entitäten, Attributen und Beziehungen.", example: "Entität Kunde hat Beziehung 1:N zu Entität Bestellung." },
  { term: "Normalisierung", category: "Software", definition: "Prozess zur Optimierung von Datenbankstrukturen zur Vermeidung von Redundanzen. 1NF, 2NF, 3NF.", example: "3NF: keine transitiven Abhängigkeiten." },
  { term: "SQL", category: "Software", definition: "Structured Query Language – Abfragesprache für relationale Datenbanken.", example: "SELECT * FROM kunden WHERE land = 'DE';" },
  { term: "CRUD", category: "Software", definition: "Create, Read, Update, Delete – die vier Grundoperationen auf Daten.", example: "INSERT, SELECT, UPDATE, DELETE in SQL." },
  { term: "API", category: "Software", definition: "Application Programming Interface – Schnittstelle, über die Anwendungen miteinander kommunizieren.", example: "REST-API gibt JSON zurück: GET /api/users/1" },
  { term: "Pseudocode", category: "Software", definition: "Beschreibung eines Algorithmus in strukturierter Umgangssprache, unabhängig von einer Programmiersprache.", example: "WENN Alter >= 18 DANN gib 'volljährig' aus" },
  // Betrieb & Wirtschaft
  { term: "SLA", category: "Wirtschaft", definition: "Service Level Agreement – vertragliche Vereinbarung über Qualitäts- und Verfügbarkeitsziele eines Services.", example: "99,9% Uptime = max. 8,76 Stunden Ausfall/Jahr." },
  { term: "ITIL", category: "Wirtschaft", definition: "IT Infrastructure Library – Best-Practice-Rahmenwerk für IT-Service-Management-Prozesse.", example: "Incident Management, Change Management, Problem Management." },
  { term: "Ticketsystem", category: "Wirtschaft", definition: "Software zur strukturierten Verwaltung von Anfragen, Störungen und Aufgaben im IT-Support.", example: "JIRA, ServiceNow, Zendesk." },
  { term: "ROI", category: "Wirtschaft", definition: "Return on Investment – Kennzahl für die Rentabilität einer Investition in Prozent.", example: "ROI = (Gewinn / Investition) × 100" },
  { term: "TCO", category: "Wirtschaft", definition: "Total Cost of Ownership – Gesamtkosten einer Investition inkl. Anschaffung, Betrieb, Wartung, Schulung.", example: "Server TCO = Kaufpreis + Strom + Admin + Support über 5 Jahre." },
  { term: "Make or Buy", category: "Wirtschaft", definition: "Entscheidung ob eine Leistung selbst erbracht oder extern eingekauft wird.", example: "Eigene Softwareentwicklung vs. SaaS-Lösung kaufen." },
  { term: "Amortisation", category: "Wirtschaft", definition: "Zeitraum, bis sich eine Investition durch Einsparungen oder Erträge bezahlt gemacht hat.", example: "Investition 20.000 € / Einsparung 5.000 €/Jahr = 4 Jahre." },
  // Hardware
  { term: "RAID", category: "Hardware", definition: "Redundant Array of Independent Disks – Zusammenschluss mehrerer Festplatten für Redundanz und/oder Performance.", example: "RAID 5: ab 3 Platten, 1 Ausfall tolerierbar." },
  { term: "USV", category: "Hardware", definition: "Unterbrechungsfreie Stromversorgung – überbrückt Stromausfälle und schützt vor Spannungsschwankungen.", example: "Server-Raum mit USV: 15 min Überbrückungszeit für geordnetes Herunterfahren." },
  { term: "Virtualisierung", category: "Hardware", definition: "Abstraktion von Hardware-Ressourcen – mehrere virtuelle Maschinen laufen auf einem physischen Server.", example: "VMware ESXi hostet 10 VMs auf einem Server." },
  { term: "NAS", category: "Hardware", definition: "Network Attached Storage – Netzwerkspeicher für zentralen Dateizugriff im LAN.", example: "Synology NAS mit RAID 5 als Fileserver im Büro." },
  { term: "SAN", category: "Hardware", definition: "Storage Area Network – hochperformantes, dediziertes Netzwerk ausschließlich für Speicherzugriffe.", example: "Wird für Datenbanken und kritische Anwendungen eingesetzt." },
];

const categories = ["Alle", ...Array.from(new Set(entries.map(e => e.category))).sort()];

const categoryColors: Record<string, string> = {
  Netzwerk: "blue",
  Sicherheit: "red",
  Projektmanagement: "purple",
  Software: "yellow",
  Wirtschaft: "green",
  Hardware: "orange",
};

export default function GlossaryPage() {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("Alle");

  const filtered = useMemo(() => {
    return entries.filter(e => {
      const matchCat = activeCategory === "Alle" || e.category === activeCategory;
      const q = search.toLowerCase();
      const matchSearch = !q || e.term.toLowerCase().includes(q) || e.definition.toLowerCase().includes(q);
      return matchCat && matchSearch;
    }).sort((a, b) => a.term.localeCompare(b.term));
  }, [search, activeCategory]);

  // Group by first letter
  const grouped = useMemo(() => {
    const map: Record<string, GlossaryEntry[]> = {};
    filtered.forEach(e => {
      const letter = e.term[0].toUpperCase();
      if (!map[letter]) map[letter] = [];
      map[letter].push(e);
    });
    return Object.entries(map).sort(([a], [b]) => a.localeCompare(b));
  }, [filtered]);

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border sticky top-0 z-10 bg-background/95 backdrop-blur">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center gap-3">
          <Link href="/">
            <button className="p-1.5 rounded-lg hover:bg-secondary transition-colors">
              <ArrowLeft className="w-4 h-4" />
            </button>
          </Link>
          <div className="flex items-center gap-2 flex-1">
            <BookMarked className="w-4 h-4 text-primary" />
            <div>
              <h1 className="text-sm font-bold leading-none">Glossar</h1>
              <p className="text-xs text-muted-foreground">{entries.length} Fachbegriffe</p>
            </div>
          </div>
        </div>

        {/* Search bar */}
        <div className="max-w-4xl mx-auto px-4 pb-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Begriff suchen..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full bg-card border border-border rounded-xl pl-9 pr-4 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/60 transition-colors"
            />
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-6">
        {/* Category filter */}
        <div className="flex flex-wrap gap-2 mb-6 animate-fadeInUp">
          {categories.map(cat => {
            const color = categoryColors[cat] ?? "gray";
            const isActive = activeCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-3 py-1 rounded-full text-xs font-medium border transition-all ${
                  isActive
                    ? `bg-primary/20 border-primary/50 text-primary`
                    : "bg-card border-border text-muted-foreground hover:border-primary/30 hover:text-foreground"
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>

        {/* Results count */}
        <p className="text-xs text-muted-foreground mb-4">
          {filtered.length} {filtered.length === 1 ? "Begriff" : "Begriffe"} gefunden
        </p>

        {/* Grouped entries */}
        {grouped.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground text-sm">
            Kein Begriff gefunden für „{search}"
          </div>
        ) : (
          <div className="space-y-6">
            {grouped.map(([letter, items]) => (
              <div key={letter} className="animate-fadeInUp">
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-lg font-bold text-primary w-6">{letter}</span>
                  <div className="flex-1 h-px bg-border" />
                </div>
                <div className="space-y-2">
                  {items.map(entry => {
                    const color = categoryColors[entry.category] ?? "gray";
                    return (
                      <div
                        key={entry.term}
                        className="bg-card border border-border rounded-xl p-4 hover:border-primary/30 transition-all"
                      >
                        <div className="flex items-start justify-between gap-2 mb-1.5">
                          <h3 className="font-semibold text-foreground text-sm">{entry.term}</h3>
                          <span className={`flex-shrink-0 text-xs px-2 py-0.5 rounded-full bg-${color}-500/15 text-${color}-400 border border-${color}-500/20`}>
                            {entry.category}
                          </span>
                        </div>
                        <p className="text-sm text-foreground/80 leading-relaxed">{entry.definition}</p>
                        {entry.example && (
                          <p className="text-xs text-muted-foreground mt-1.5 bg-secondary/50 rounded px-2 py-1">
                            <span className="font-semibold">Bsp: </span>{entry.example}
                          </p>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
