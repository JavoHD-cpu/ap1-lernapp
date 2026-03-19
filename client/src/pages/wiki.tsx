import { Link } from "wouter";
import { useState, useMemo } from "react";
import {
  ArrowLeft, BookOpen, Search, ChevronRight, Network, Cpu,
  Shield, GitBranch, Code, Database, Briefcase, Server,
  CheckSquare, TrendingUp, FileText, ListChecks, BookMarked, ExternalLink
} from "lucide-react";

// ── Types ──────────────────────────────────────────────────────────────────
type ContentBlock =
  | { type: "p"; text: string }
  | { type: "h3"; text: string }
  | { type: "ul"; items: string[] }
  | { type: "ol"; items: string[] }
  | { type: "table"; headers: string[]; rows: string[][] }
  | { type: "code"; text: string }
  | { type: "info"; text: string }
  | { type: "tip"; text: string };

interface WikiArticle {
  id: string;
  title: string;
  category: string;
  type: "article" | "cheatsheet" | "howto";
  tags: string[];
  content: ContentBlock[];
}

// ── Content ────────────────────────────────────────────────────────────────
const articles: WikiArticle[] = [

  // ═══════════════════════════════════════════════════════
  // ARTIKEL
  // ═══════════════════════════════════════════════════════

  {
    id: "osi-modell",
    title: "OSI-Referenzmodell",
    category: "Netzwerk",
    type: "article",
    tags: ["OSI", "Schichten", "Protokolle", "Netzwerk"],
    content: [
      { type: "p", text: "Das OSI-Modell (Open Systems Interconnection) ist ein 7-Schichten-Referenzmodell, das beschreibt, wie Netzwerkkommunikation zwischen zwei Systemen funktioniert. Es wurde 1984 von der ISO standardisiert." },
      { type: "h3", text: "Die 7 Schichten im Überblick" },
      { type: "table", headers: ["#", "Name (DE)", "Name (EN)", "Protokolle / Geräte"], rows: [
        ["7", "Anwendung", "Application", "HTTP, HTTPS, FTP, SMTP, DNS, DHCP"],
        ["6", "Darstellung", "Presentation", "SSL/TLS, JPEG, MPEG, ASCII"],
        ["5", "Sitzung", "Session", "NetBIOS, RPC, SMB"],
        ["4", "Transport", "Transport", "TCP, UDP – Ports, Segmentierung"],
        ["3", "Netzwerk", "Network", "IP, ICMP, ARP – Router"],
        ["2", "Sicherung", "Data Link", "Ethernet, MAC, Switch, WLAN (802.11)"],
        ["1", "Physisch", "Physical", "Kabel, Hub, NIC, Repeater"],
      ]},
      { type: "h3", text: "Merkhilfen" },
      { type: "ul", items: [
        "Von unten nach oben (1→7): \"Physiker sehen nackte Transformatoren auf Autobahnen\"",
        "Von oben nach unten (7→1): \"Alle deutschen Netzwerker trinken schwarzen Pils\"",
        "Geräte: Hub=1, Switch=2, Router=3 – \"Einer Schachtel Rotkäppchen\"",
      ]},
      { type: "h3", text: "TCP/IP vs. OSI" },
      { type: "p", text: "In der Praxis wird das TCP/IP-Modell verwendet (4 Schichten). Die Zuordnung: Anwendung (OSI 5-7), Transport (OSI 4), Internet (OSI 3), Netzzugang (OSI 1-2)." },
      { type: "tip", text: "In IHK-Prüfungen wird oft gefragt, auf welcher Schicht ein bestimmtes Protokoll oder Gerät arbeitet. Switch = Schicht 2, Router = Schicht 3, Firewall oft = Schicht 3-4." },
    ],
  },

  {
    id: "subnetting-grundlagen",
    title: "Subnetting – Grundlagen",
    category: "Netzwerk",
    type: "article",
    tags: ["Subnetting", "IP", "CIDR", "Netzwerk"],
    content: [
      { type: "p", text: "Subnetting bezeichnet die Aufteilung eines IP-Netzwerks in kleinere Teilnetze (Subnetze). Es ermöglicht effiziente IP-Adressvergabe und logische Netzwerktrennung." },
      { type: "h3", text: "Wichtige Grundbegriffe" },
      { type: "table", headers: ["Begriff", "Erklärung", "Beispiel"], rows: [
        ["CIDR-Notation", "Präfixlänge nach dem Schrägstrich", "192.168.1.0/24"],
        ["Subnetzmaske", "Bestimmt Netz- und Hostanteil", "/24 = 255.255.255.0"],
        ["Netzadresse", "Erste Adresse – nicht nutzbar", "192.168.1.0"],
        ["Broadcast", "Letzte Adresse – nicht nutzbar", "192.168.1.255"],
        ["Nutzbare Hosts", "Alle Adressen dazwischen", "192.168.1.1 – .254 = 254 Hosts"],
      ]},
      { type: "h3", text: "Formel: Hosts pro Subnetz" },
      { type: "code", text: "Nutzbare Hosts = 2^(32 − Präfix) − 2\n\nBeispiele:\n/24 → 2^8  − 2 = 254 Hosts\n/25 → 2^7  − 2 = 126 Hosts\n/26 → 2^6  − 2 =  62 Hosts\n/27 → 2^5  − 2 =  30 Hosts\n/28 → 2^4  − 2 =  14 Hosts\n/30 → 2^2  − 2 =   2 Hosts (Punkt-zu-Punkt)" },
      { type: "h3", text: "Subnetzmaske schnell bestimmen" },
      { type: "code", text: "Präfix → letzte Oktet-Maske:\n/25 → 128  /26 → 192  /27 → 224\n/28 → 240  /29 → 248  /30 → 252" },
      { type: "tip", text: "Schnelle Methode: Blockgröße = 256 − Subnetzmaske-Wert. Bei /26 (Maske 192): Blockgröße = 256−192 = 64. Subnetze: .0, .64, .128, .192" },
    ],
  },

  {
    id: "it-sicherheit-cia",
    title: "IT-Sicherheit: CIA-Triad & Schutzmaßnahmen",
    category: "Sicherheit",
    type: "article",
    tags: ["CIA", "Sicherheit", "DSGVO", "BSI", "Datenschutz"],
    content: [
      { type: "p", text: "Die IT-Sicherheit basiert auf drei Grundschutzzielen, bekannt als CIA-Triad. Alle Sicherheitsmaßnahmen lassen sich einem oder mehreren dieser Ziele zuordnen." },
      { type: "h3", text: "Die drei Schutzziele" },
      { type: "table", headers: ["Ziel", "Englisch", "Bedeutung", "Beispielmaßnahme"], rows: [
        ["Vertraulichkeit", "Confidentiality", "Daten nur für Befugte lesbar", "Verschlüsselung, Zugriffskontrolle"],
        ["Integrität", "Integrity", "Daten unverfälscht und vollständig", "Hashwerte, digitale Signaturen"],
        ["Verfügbarkeit", "Availability", "Systeme und Daten erreichbar", "RAID, Backup, USV, Redundanz"],
      ]},
      { type: "h3", text: "Wichtige Angriffsvektoren" },
      { type: "ul", items: [
        "Phishing – gefälschte E-Mails/Webseiten zur Dateneingabe",
        "Social Engineering – Manipulation von Personen",
        "Ransomware – Verschlüsselung von Dateien, Lösegeld",
        "Man-in-the-Middle (MitM) – Kommunikation abfangen",
        "SQL-Injection – schadhafter Code in Datenbankabfragen",
        "DDoS – Überlastung eines Systems durch Massenanfragen",
      ]},
      { type: "h3", text: "DSGVO – Wichtige Regeln" },
      { type: "ul", items: [
        "Gilt seit Mai 2018 in der gesamten EU",
        "Meldepflicht bei Datenpannen: innerhalb 72 Stunden an Aufsichtsbehörde",
        "Betroffenenrechte: Auskunft, Löschung (Recht auf Vergessenwerden), Berichtigung",
        "Datensparsamkeit: nur notwendige Daten erheben",
        "Verantwortlicher: Unternehmen das Daten verarbeitet",
      ]},
      { type: "tip", text: "CIA steht für Confidentiality, Integrity, Availability – nicht für die US-Behörde. In der Prüfung werden Maßnahmen oft einer dieser drei Kategorien zugeordnet." },
    ],
  },

  {
    id: "projektmanagement-methoden",
    title: "Projektmanagement: Klassisch vs. Agil",
    category: "Projektmanagement",
    type: "article",
    tags: ["Scrum", "Wasserfall", "Kanban", "Agil", "PM"],
    content: [
      { type: "p", text: "Projektmanagement beschreibt die Planung, Steuerung und den Abschluss von Projekten. Grundsätzlich unterscheidet man klassische (sequentielle) und agile (iterative) Vorgehensmodelle." },
      { type: "h3", text: "Vergleich: Wasserfall vs. Scrum" },
      { type: "table", headers: ["Kriterium", "Wasserfall", "Scrum"], rows: [
        ["Vorgehensweise", "Sequentiell, Phasen nacheinander", "Iterativ, kurze Sprints"],
        ["Anforderungen", "Am Anfang vollständig definiert", "Evolving Backlog"],
        ["Flexibilität", "Gering – Änderungen schwierig", "Hoch – Anpassung jederzeit"],
        ["Dokumentation", "Umfangreich (Lasten-/Pflichtenheft)", "Minimal (User Stories)"],
        ["Eignung", "Klare, stabile Anforderungen", "Unklare, sich ändernde Anforderungen"],
      ]},
      { type: "h3", text: "Scrum – Rollen & Events" },
      { type: "ul", items: [
        "Rollen: Product Owner (Backlog-Verantwortung), Scrum Master (Moderator), Entwicklungsteam",
        "Events: Sprint (1–4 Wochen), Sprint Planning, Daily Scrum, Sprint Review, Retrospektive",
        "Artefakte: Product Backlog, Sprint Backlog, Increment",
      ]},
      { type: "h3", text: "Netzplantechnik" },
      { type: "p", text: "Zur Projektplanung wird häufig die Netzplantechnik verwendet. Jeder Vorgang hat: FAZ (frühester Anfang), FEZ (frühestes Ende), SAZ (spätester Anfang), SEZ (spätestes Ende) und GP (Gesamtpuffer)." },
      { type: "code", text: "Vorwärtsrechnung:  FAZ + Dauer = FEZ\nRückwärtsrechnung: SEZ − Dauer = SAZ\nGesamtpuffer:      GP = SAZ − FAZ\nKritischer Pfad:   alle Vorgänge mit GP = 0" },
      { type: "tip", text: "Lastenheft = WAS will der Auftraggeber (Anforderungen). Pflichtenheft = WIE setzt der Auftragnehmer es um (Lösung). Merkhilfe: L = Leistungsanforderungen des Auftraggebers, P = Planung des Auftragnehmers." },
    ],
  },

  {
    id: "datenbanken-grundlagen",
    title: "Datenbanken: ER-Modell & SQL",
    category: "Datenbanken",
    type: "article",
    tags: ["SQL", "ER-Modell", "Normalisierung", "Datenbank"],
    content: [
      { type: "p", text: "Relationale Datenbanken speichern Daten in Tabellen mit Zeilen (Datensätze) und Spalten (Attribute). Das ER-Modell dient dem Datenbankentwurf, SQL ist die Abfragesprache." },
      { type: "h3", text: "ER-Modell – Kardinalitäten" },
      { type: "table", headers: ["Beziehung", "Bedeutung", "Beispiel"], rows: [
        ["1:1", "Ein Datensatz ↔ ein Datensatz", "Person hat einen Reisepass"],
        ["1:N", "Ein Datensatz ↔ viele Datensätze", "Kunde hat viele Bestellungen"],
        ["N:M", "Viele ↔ viele (Zwischentabelle!)", "Schüler belegen viele Kurse"],
      ]},
      { type: "h3", text: "SQL – Wichtige Befehle" },
      { type: "code", text: "-- Daten abfragen\nSELECT name, email FROM kunden WHERE land = 'DE' ORDER BY name;\n\n-- Tabellen verknüpfen\nSELECT k.name, b.betrag\nFROM kunden k JOIN bestellungen b ON k.id = b.kunden_id;\n\n-- Daten einfügen / ändern / löschen\nINSERT INTO kunden (name, email) VALUES ('Max', 'max@test.de');\nUPDATE kunden SET email = 'neu@test.de' WHERE id = 1;\nDELETE FROM kunden WHERE id = 1;\n\n-- Aggregation\nSELECT COUNT(*), AVG(betrag), MAX(betrag) FROM bestellungen;" },
      { type: "h3", text: "Normalisierung" },
      { type: "ul", items: [
        "1NF: Atomare Werte – keine Wiederholungsgruppen",
        "2NF: Keine partiellen Abhängigkeiten vom Primärschlüssel",
        "3NF: Keine transitiven Abhängigkeiten (A→B→C auflösen)",
        "Faustregel: Wenn Änderung eines Werts Folgeänderungen erzwingt → normalisieren",
      ]},
      { type: "tip", text: "N:M-Beziehungen müssen immer durch eine Zwischentabelle (Assoziationstabelle) aufgelöst werden. Diese Tabelle enthält die Fremdschlüssel beider Entitäten." },
    ],
  },

  // ═══════════════════════════════════════════════════════
  // CHEAT SHEETS
  // ═══════════════════════════════════════════════════════

  {
    id: "cheat-osi",
    title: "Cheat Sheet: OSI-Modell",
    category: "Netzwerk",
    type: "cheatsheet",
    tags: ["OSI", "Protokolle", "Cheat Sheet"],
    content: [
      { type: "table", headers: ["Layer", "Name", "Protokolle", "Geräte", "PDU"], rows: [
        ["7", "Anwendung", "HTTP, HTTPS, FTP, SMTP, DNS, DHCP, SNMP", "–", "Daten"],
        ["6", "Darstellung", "SSL/TLS, MIME, JPEG, MPEG", "–", "Daten"],
        ["5", "Sitzung", "NetBIOS, RPC, SMB, NFS", "–", "Daten"],
        ["4", "Transport", "TCP (verbindungsorientiert), UDP (verbindungslos)", "–", "Segment/Datagramm"],
        ["3", "Netzwerk", "IPv4, IPv6, ICMP, ARP, OSPF, BGP", "Router, L3-Switch", "Paket"],
        ["2", "Sicherung", "Ethernet, MAC, PPP, WLAN (802.11)", "Switch, Bridge", "Frame"],
        ["1", "Physisch", "Koaxialkabel, Glasfaser, WLAN (physisch)", "Hub, Repeater, NIC", "Bit"],
      ]},
      { type: "h3", text: "TCP vs. UDP" },
      { type: "table", headers: ["Eigenschaft", "TCP", "UDP"], rows: [
        ["Verbindung", "Verbindungsorientiert (3-Way-Handshake)", "Verbindungslos"],
        ["Zuverlässigkeit", "Garantierte Zustellung, Reihenfolge", "Keine Garantie"],
        ["Geschwindigkeit", "Langsamer (Overhead)", "Schneller"],
        ["Anwendungen", "HTTP, FTP, SSH, SMTP", "DNS, DHCP, VoIP, Streaming"],
      ]},
      { type: "h3", text: "Wichtige Portnummern" },
      { type: "table", headers: ["Port", "Protokoll", "Beschreibung"], rows: [
        ["20/21", "FTP", "File Transfer (Daten/Steuerung)"],
        ["22", "SSH", "Secure Shell"],
        ["23", "Telnet", "Unsichere Remote-Verwaltung (veraltet)"],
        ["25", "SMTP", "E-Mail senden"],
        ["53", "DNS", "Namensauflösung"],
        ["67/68", "DHCP", "IP-Adressvergabe"],
        ["80", "HTTP", "Web unverschlüsselt"],
        ["110", "POP3", "E-Mail abrufen"],
        ["143", "IMAP", "E-Mail abrufen (mit Synchronisation)"],
        ["443", "HTTPS", "Web verschlüsselt (TLS)"],
        ["3389", "RDP", "Remote Desktop Protocol"],
      ]},
    ],
  },

  {
    id: "cheat-raid",
    title: "Cheat Sheet: RAID-Systeme",
    category: "Hardware",
    type: "cheatsheet",
    tags: ["RAID", "Speicher", "Festplatte", "Cheat Sheet"],
    content: [
      { type: "table", headers: ["RAID", "Name", "Min. Platten", "Kapazität", "Ausfalltoleranz", "Vorteil"], rows: [
        ["0", "Striping", "2", "n × Größe", "0 (keine!)", "Max. Performance"],
        ["1", "Mirroring", "2", "1× Größe", "1 Platte", "Einfache Redundanz"],
        ["5", "Striping + Parität", "3", "(n−1) × Größe", "1 Platte", "Gut balanciert"],
        ["6", "Doppelte Parität", "4", "(n−2) × Größe", "2 Platten", "Hohe Sicherheit"],
        ["10", "RAID 1+0", "4", "(n/2) × Größe", "1 je Spiegel-Paar", "Performance + Sicherheit"],
      ]},
      { type: "h3", text: "Kapazitäts-Beispiele" },
      { type: "code", text: "4 × 2 TB:\n  RAID 0: 4 × 2 = 8 TB   (kein Schutz)\n  RAID 1: 1 × 2 = 2 TB   (nur 2 Platten)\n  RAID 5: 3 × 2 = 6 TB\n  RAID 6: 2 × 2 = 4 TB\n  RAID10: 2 × 2 = 4 TB   (4 Platten = 2 Paare)" },
      { type: "info", text: "RAID ist kein Backup! RAID schützt vor Hardwareausfall, nicht vor versehentlichem Löschen, Ransomware oder Feuer/Diebstahl. Immer zusätzlich Backups anlegen (3-2-1-Regel)." },
      { type: "h3", text: "3-2-1-Backup-Regel" },
      { type: "ul", items: [
        "3 Kopien der Daten insgesamt",
        "2 verschiedene Speichermedien (z.B. Festplatte + NAS)",
        "1 Kopie extern/offsite (z.B. Cloud oder anderer Standort)",
      ]},
    ],
  },

  {
    id: "cheat-sql",
    title: "Cheat Sheet: SQL-Befehle",
    category: "Datenbanken",
    type: "cheatsheet",
    tags: ["SQL", "Datenbank", "Cheat Sheet"],
    content: [
      { type: "h3", text: "DDL – Datenstruktur definieren" },
      { type: "code", text: "CREATE TABLE kunden (\n  id      INT PRIMARY KEY AUTO_INCREMENT,\n  name    VARCHAR(100) NOT NULL,\n  email   VARCHAR(150) UNIQUE,\n  land    CHAR(2) DEFAULT 'DE'\n);\n\nALTER TABLE kunden ADD COLUMN telefon VARCHAR(20);\nDROP TABLE kunden;" },
      { type: "h3", text: "DML – Daten manipulieren" },
      { type: "code", text: "INSERT INTO kunden (name, email) VALUES ('Max Müller', 'max@test.de');\nUPDATE kunden SET land = 'AT' WHERE id = 5;\nDELETE FROM kunden WHERE land = 'XX';" },
      { type: "h3", text: "DQL – Daten abfragen" },
      { type: "code", text: "-- Grundabfrage\nSELECT name, email FROM kunden WHERE land = 'DE' ORDER BY name ASC LIMIT 10;\n\n-- JOIN (Verknüpfung)\nSELECT k.name, b.betrag, b.datum\nFROM kunden k\nINNER JOIN bestellungen b ON k.id = b.kunden_id\nWHERE b.betrag > 100;\n\n-- Aggregation mit GROUP BY\nSELECT land, COUNT(*) AS anzahl, AVG(betrag) AS schnitt\nFROM kunden k JOIN bestellungen b ON k.id = b.kunden_id\nGROUP BY land\nHAVING COUNT(*) > 5;" },
      { type: "h3", text: "JOIN-Typen" },
      { type: "table", headers: ["JOIN-Typ", "Ergebnis"], rows: [
        ["INNER JOIN", "Nur Datensätze die in BEIDEN Tabellen vorkommen"],
        ["LEFT JOIN", "ALLE aus linker Tabelle + passende aus rechter (NULL wenn kein Match)"],
        ["RIGHT JOIN", "ALLE aus rechter Tabelle + passende aus linker"],
        ["FULL OUTER JOIN", "Alle aus beiden Tabellen"],
      ]},
    ],
  },

  {
    id: "cheat-scrum",
    title: "Cheat Sheet: Scrum",
    category: "Projektmanagement",
    type: "cheatsheet",
    tags: ["Scrum", "Agil", "Cheat Sheet", "Sprint"],
    content: [
      { type: "h3", text: "Scrum auf einen Blick" },
      { type: "table", headers: ["Element", "Beschreibung", "Dauer / Häufigkeit"], rows: [
        ["Sprint", "Iteration mit konkretem Ziel", "1–4 Wochen"],
        ["Sprint Planning", "Team plant den Sprint", "Zu Beginn jedes Sprints"],
        ["Daily Scrum", "15-min Statusmeeting", "Täglich"],
        ["Sprint Review", "Ergebnis dem Product Owner zeigen", "Am Sprintende"],
        ["Retrospektive", "Prozessverbesserung im Team", "Nach Review"],
      ]},
      { type: "h3", text: "Rollen" },
      { type: "table", headers: ["Rolle", "Aufgaben"], rows: [
        ["Product Owner", "Priorisiert Product Backlog, vertritt Kundenwunsch, definiert Akzeptanzkriterien"],
        ["Scrum Master", "Moderiert Events, entfernt Hindernisse, coacht das Team im Scrum-Prozess"],
        ["Entwicklungsteam", "Selbstorganisiert, cross-funktional, liefert potenziell auslieferbares Inkrement"],
      ]},
      { type: "h3", text: "Artefakte" },
      { type: "ul", items: [
        "Product Backlog – priorisierte Liste aller Anforderungen (User Stories)",
        "Sprint Backlog – Aufgaben des aktuellen Sprints",
        "Increment – das fertige, funktionierende Ergebnis nach dem Sprint",
        "Definition of Done (DoD) – wann gilt eine Aufgabe als abgeschlossen?",
      ]},
      { type: "h3", text: "User Story Format" },
      { type: "code", text: "Als [Rolle] möchte ich [Funktionalität],\ndamit ich [Nutzen/Ziel] erreiche.\n\nBeispiel:\nAls Kunde möchte ich meine Bestellung online verfolgen,\ndamit ich weiß, wann sie ankommt." },
    ],
  },

  // ═══════════════════════════════════════════════════════
  // HOW-TO GUIDES
  // ═══════════════════════════════════════════════════════

  {
    id: "howto-subnetting",
    title: "How-To: Subnetz berechnen",
    category: "Netzwerk",
    type: "howto",
    tags: ["Subnetting", "CIDR", "How-To", "Berechnung"],
    content: [
      { type: "p", text: "Schritt-für-Schritt-Anleitung zur Subnetzberechnung – wie sie in IHK-Prüfungen verlangt wird." },
      { type: "h3", text: "Aufgabe (Beispiel)" },
      { type: "info", text: "Gegeben: IP-Adresse 192.168.10.75 /26\nGesucht: Subnetzmaske, Netzadresse, Broadcast, nutzbare Hosts" },
      { type: "h3", text: "Schritt 1: Subnetzmaske aus Präfix" },
      { type: "code", text: "/26 = 26 Einsen = 11111111.11111111.11111111.11000000\n                 = 255    .255    .255    .192\n\nFaustregel: 256 − 192 = 64 → Blockgröße ist 64" },
      { type: "h3", text: "Schritt 2: Subnetz-Block bestimmen" },
      { type: "code", text: "Blöcke bei /26: .0, .64, .128, .192\n\n75 liegt zwischen 64 und 128\n→ Netzadresse: 192.168.10.64\n→ Broadcast:   192.168.10.127  (nächster Block −1)" },
      { type: "h3", text: "Schritt 3: Hosts berechnen" },
      { type: "code", text: "Nutzbare Hosts = 2^(32−26) − 2 = 2^6 − 2 = 64 − 2 = 62\nErste Hostadresse: 192.168.10.65\nLetzte Hostadresse: 192.168.10.126" },
      { type: "h3", text: "Zusammenfassung" },
      { type: "table", headers: ["Ergebnis", "Wert"], rows: [
        ["Subnetzmaske", "255.255.255.192"],
        ["Netzadresse", "192.168.10.64"],
        ["Broadcast", "192.168.10.127"],
        ["Nutzbare Hosts", "62 (von .65 bis .126)"],
      ]},
      { type: "tip", text: "Merke: Blockgröße = 256 − letzter Subnetzmasken-Wert. Netzadresse = Vielfaches der Blockgröße, das ≤ Host-Teil ist. Broadcast = Netzadresse + Blockgröße − 1." },
    ],
  },

  {
    id: "howto-netzplan",
    title: "How-To: Netzplan erstellen und berechnen",
    category: "Projektmanagement",
    type: "howto",
    tags: ["Netzplan", "FAZ", "FEZ", "GP", "Kritischer Pfad", "How-To"],
    content: [
      { type: "p", text: "Ein Netzplan visualisiert Vorgänge, ihre Abhängigkeiten und Zeitpuffer. Ziel ist es, den kritischen Pfad zu finden – also die Vorgänge ohne Puffer, die das Projektende direkt beeinflussen." },
      { type: "h3", text: "Vorgangsknoten (Standardformat)" },
      { type: "code", text: "┌──────┬───────┬──────┐\n│ FAZ  │  D    │ FEZ  │\n├──────┼───────┼──────┤\n│  VP  │       │  GP  │\n├──────┼───────┼──────┤\n│ SAZ  │       │ SEZ  │\n└──────┴───────┴──────┘\n\nD   = Dauer\nVP  = Vorgangsname\nGP  = Gesamtpuffer\nFAZ = Frühester Anfangszeitpunkt\nFEZ = Frühester Endzeitpunkt\nSAZ = Spätester Anfangszeitpunkt\nSEZ = Spätester Endzeitpunkt" },
      { type: "h3", text: "Schritt 1 – Vorwärtsrechnung (FAZ/FEZ)" },
      { type: "code", text: "FAZ des ersten Vorgangs = 0\nFEZ = FAZ + Dauer\nFAZ des Nachfolgers = FEZ des Vorgängers\nBei mehreren Vorgängern: MAX aller FEZ-Werte nehmen" },
      { type: "h3", text: "Schritt 2 – Rückwärtsrechnung (SAZ/SEZ)" },
      { type: "code", text: "SEZ des letzten Vorgangs = FEZ des letzten Vorgangs\nSAZ = SEZ − Dauer\nSEZ des Vorgängers = SAZ des Nachfolgers\nBei mehreren Nachfolgern: MIN aller SAZ-Werte nehmen" },
      { type: "h3", text: "Schritt 3 – Gesamtpuffer (GP)" },
      { type: "code", text: "GP = SAZ − FAZ  (oder: SEZ − FEZ)\n\nGP = 0 → Vorgang liegt auf dem kritischen Pfad\nGP > 0 → Vorgang kann verschoben werden" },
      { type: "h3", text: "Beispielrechnung" },
      { type: "table", headers: ["Vorgang", "Dauer", "Vorgänger", "FAZ", "FEZ", "SAZ", "SEZ", "GP"], rows: [
        ["A", "3", "–", "0", "3", "0", "3", "0 ★"],
        ["B", "5", "A", "3", "8", "3", "8", "0 ★"],
        ["C", "2", "A", "3", "5", "6", "8", "3"],
        ["D", "4", "B,C", "8", "12", "8", "12", "0 ★"],
      ]},
      { type: "info", text: "Kritischer Pfad: A → B → D (alle GP = 0). C hat 3 Tage Puffer." },
      { type: "tip", text: "In der Prüfung immer zuerst vollständig Vorwärtsrechnen, dann Rückwärtsrechnen, dann GP berechnen. Den kritischen Pfad am Ende durch Markierung aller Vorgänge mit GP=0 einzeichnen." },
    ],
  },

  {
    id: "howto-er-diagramm",
    title: "How-To: ER-Diagramm lesen und erstellen",
    category: "Datenbanken",
    type: "howto",
    tags: ["ER-Modell", "Datenbank", "Kardinalität", "How-To"],
    content: [
      { type: "p", text: "Das Entity-Relationship-Modell (ERM) dient dem konzeptionellen Datenbankentwurf. Es beschreibt Entitäten, ihre Attribute und die Beziehungen untereinander." },
      { type: "h3", text: "Symbole im ER-Diagramm (Chen-Notation)" },
      { type: "table", headers: ["Symbol", "Bedeutung"], rows: [
        ["Rechteck", "Entität (z.B. Kunde, Produkt, Bestellung)"],
        ["Ellipse", "Attribut (z.B. Name, Adresse, Preis)"],
        ["Linie", "Beziehung zwischen Entitäten"],
        ["Doppelrechteck", "Schwache Entität (existiert nur mit Besitzer-Entität)"],
        ["Unterstrich", "Primärschlüssel-Attribut"],
      ]},
      { type: "h3", text: "Kardinalitäten lesen" },
      { type: "code", text: "1:1   Jeder Mitarbeiter hat genau ein Büro\n      Mitarbeiter ──1────1── Büro\n\n1:N   Ein Kunde hat viele Bestellungen\n      Kunde ──1────N── Bestellung\n\nN:M   Studenten belegen viele Kurse, Kurse haben viele Studenten\n      Student ──N────M── Kurs\n      → Auflösung durch Zwischentabelle!" },
      { type: "h3", text: "Schritt-für-Schritt: ERM aus Text ableiten" },
      { type: "ol", items: [
        "Substantive identifizieren → potenzielle Entitäten (Kunde, Bestellung, Produkt)",
        "Verben identifizieren → potenzielle Beziehungen (kauft, enthält, liefert)",
        "Kardinalitäten bestimmen: Wie viele A können mit wie vielen B in Beziehung stehen?",
        "Attribute zuordnen: Was beschreibt jede Entität? (Name, Datum, Preis...)",
        "Primärschlüssel wählen: eindeutig identifizierendes Attribut (ID, Kundennummer)",
        "N:M-Beziehungen durch Zwischentabellen mit eigenem Primärschlüssel auflösen",
      ]},
      { type: "h3", text: "Vom ERM zur Tabelle (Relationales Modell)" },
      { type: "code", text: "Entitäten → Tabellen\nAttribute → Spalten\nPrimärschlüssel → PRIMARY KEY\n1:N-Beziehung → Fremdschlüssel in der N-Seite\nN:M-Beziehung → eigene Zwischentabelle\n\nBeispiel:\nKunde(KundenID, Name, Email)\nBestellung(BestellID, Datum, KundenID*)   ← FK\nProdukt(ProduktID, Name, Preis)\nBestellposition(BestellID*, ProduktID*, Menge)  ← Zwischentabelle" },
      { type: "tip", text: "N:M-Beziehungen IMMER durch eine Zwischentabelle auflösen. Diese enthält die Primärschlüssel beider Entitäten als Fremdschlüssel und kann eigene Attribute haben (z.B. Menge)." },
    ],
  },

];

// ── Category config ──────────────────────────────────────────────────────────
const categoryConfig: Record<string, { icon: React.FC<{className?: string}>; color: string }> = {
  Netzwerk:           { icon: Network,     color: "blue"   },
  Sicherheit:         { icon: Shield,      color: "red"    },
  Projektmanagement:  { icon: GitBranch,   color: "purple" },
  Datenbanken:        { icon: Database,    color: "orange" },
  Hardware:           { icon: Cpu,         color: "green"  },
  Programmierung:     { icon: Code,        color: "yellow" },
  Wirtschaft:         { icon: Briefcase,   color: "teal"   },
  System:             { icon: Server,      color: "indigo" },
};

const typeConfig = {
  article:    { label: "Artikel",      icon: FileText,    color: "blue"   },
  cheatsheet: { label: "Cheat Sheet",  icon: ListChecks,  color: "green"  },
  howto:      { label: "How-To",       icon: BookMarked,  color: "purple" },
};

const colorText: Record<string, string> = {
  blue:   "text-blue-400",   red:    "text-red-400",
  purple: "text-purple-400", orange: "text-orange-400",
  green:  "text-green-400",  yellow: "text-yellow-400",
  teal:   "text-teal-400",   indigo: "text-indigo-400",
};
const colorBg: Record<string, string> = {
  blue:   "bg-blue-500/15",   red:    "bg-red-500/15",
  purple: "bg-purple-500/15", orange: "bg-orange-500/15",
  green:  "bg-green-500/15",  yellow: "bg-yellow-500/15",
  teal:   "bg-teal-500/15",   indigo: "bg-indigo-500/15",
};
const colorBorder: Record<string, string> = {
  blue:   "border-blue-500/30",   red:    "border-red-500/30",
  purple: "border-purple-500/30", orange: "border-orange-500/30",
  green:  "border-green-500/30",  yellow: "border-yellow-500/30",
  teal:   "border-teal-500/30",   indigo: "border-indigo-500/30",
};

// ── Article detail renderer ──────────────────────────────────────────────────
function ArticleView({ article, onClose }: { article: WikiArticle; onClose: () => void }) {
  const cat = categoryConfig[article.category];
  const typ = typeConfig[article.type];
  const CatIcon = cat?.icon ?? BookOpen;
  const TypIcon = typ.icon;

  return (
    <div className="animate-fadeInUp">
      {/* Back */}
      <button
        onClick={onClose}
        className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors mb-6"
      >
        <ArrowLeft className="w-3.5 h-3.5" /> Zurück zur Übersicht
      </button>

      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-3 flex-wrap">
          <span className={`flex items-center gap-1 text-xs px-2 py-0.5 rounded-full border ${colorBg[cat?.color ?? "blue"]} ${colorBorder[cat?.color ?? "blue"]} ${colorText[cat?.color ?? "blue"]}`}>
            <CatIcon className="w-3 h-3" />
            {article.category}
          </span>
          <span className={`flex items-center gap-1 text-xs px-2 py-0.5 rounded-full border ${colorBg[typ.color]} ${colorBorder[typ.color]} ${colorText[typ.color]}`}>
            <TypIcon className="w-3 h-3" />
            {typ.label}
          </span>
        </div>
        <h2 className="text-2xl font-bold text-foreground mb-2">{article.title}</h2>
        <div className="flex flex-wrap gap-1.5">
          {article.tags.map(tag => (
            <span key={tag} className="text-xs bg-secondary text-muted-foreground px-2 py-0.5 rounded-full">#{tag}</span>
          ))}
        </div>
      </div>

      {/* Content blocks */}
      <div className="space-y-4">
        {article.content.map((block, i) => {
          if (block.type === "p") {
            return <p key={i} className="text-sm text-foreground/85 leading-relaxed">{block.text}</p>;
          }
          if (block.type === "h3") {
            return <h3 key={i} className="text-base font-bold text-foreground mt-6 mb-2">{block.text}</h3>;
          }
          if (block.type === "ul") {
            return (
              <ul key={i} className="space-y-1.5 ml-2">
                {block.items.map((item, j) => (
                  <li key={j} className="flex items-start gap-2 text-sm text-foreground/85">
                    <span className="text-primary flex-shrink-0 mt-0.5">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            );
          }
          if (block.type === "ol") {
            return (
              <ol key={i} className="space-y-1.5 ml-2">
                {block.items.map((item, j) => (
                  <li key={j} className="flex items-start gap-2.5 text-sm text-foreground/85">
                    <span className="text-primary font-bold flex-shrink-0 w-5 text-right">{j + 1}.</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ol>
            );
          }
          if (block.type === "table") {
            return (
              <div key={i} className="overflow-x-auto rounded-xl border border-border">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="bg-secondary/70">
                      {block.headers.map((h, j) => (
                        <th key={j} className="px-3 py-2.5 text-left font-semibold text-foreground/90 whitespace-nowrap">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {block.rows.map((row, j) => (
                      <tr key={j} className={j % 2 === 0 ? "bg-card" : "bg-secondary/20"}>
                        {row.map((cell, k) => (
                          <td key={k} className="px-3 py-2.5 text-foreground/80 border-t border-border/50">{cell}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            );
          }
          if (block.type === "code") {
            return (
              <div key={i} className="bg-[#1e2535] rounded-xl p-4 overflow-x-auto">
                <pre className="text-xs text-blue-300 font-mono leading-relaxed whitespace-pre-wrap">{block.text}</pre>
              </div>
            );
          }
          if (block.type === "info") {
            return (
              <div key={i} className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4">
                <p className="text-sm text-blue-300 leading-relaxed whitespace-pre-line">{block.text}</p>
              </div>
            );
          }
          if (block.type === "tip") {
            return (
              <div key={i} className="bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-4">
                <p className="text-xs font-semibold text-yellow-400 uppercase tracking-wider mb-1.5">💡 Prüfungstipp</p>
                <p className="text-sm text-foreground/85 leading-relaxed">{block.text}</p>
              </div>
            );
          }
          return null;
        })}
      </div>
    </div>
  );
}

// ── Main Wiki page ───────────────────────────────────────────────────────────
export default function WikiPage() {
  const [search, setSearch] = useState("");
  const [activeType, setActiveType] = useState<string>("alle");
  const [activeCategory, setActiveCategory] = useState<string>("alle");
  const [selectedArticle, setSelectedArticle] = useState<WikiArticle | null>(null);

  const categories = ["alle", ...Array.from(new Set(articles.map(a => a.category))).sort()];

  const filtered = useMemo(() => {
    return articles.filter(a => {
      const matchType = activeType === "alle" || a.type === activeType;
      const matchCat = activeCategory === "alle" || a.category === activeCategory;
      const q = search.toLowerCase();
      const matchSearch = !q || a.title.toLowerCase().includes(q) || a.tags.some(t => t.toLowerCase().includes(q));
      return matchType && matchCat && matchSearch;
    });
  }, [search, activeType, activeCategory]);

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border sticky top-0 z-10 bg-background/95 backdrop-blur">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center gap-3">
          <Link href="/">
            <button className="p-1.5 rounded-lg hover:bg-secondary transition-colors">
              <ArrowLeft className="w-4 h-4" />
            </button>
          </Link>
          <div className="flex items-center gap-2 flex-1">
            <div className="w-6 h-6 rounded bg-primary/20 flex items-center justify-center flex-shrink-0">
              <span className="text-primary font-bold text-xs">IO</span>
            </div>
            <div>
              <h1 className="text-sm font-bold leading-none">Wiki</h1>
              <p className="text-xs text-muted-foreground">{articles.length} Artikel · Knowledge Base</p>
            </div>
          </div>
        </div>
        {/* Search */}
        <div className="max-w-5xl mx-auto px-4 pb-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Artikel suchen..."
              value={search}
              onChange={e => { setSearch(e.target.value); setSelectedArticle(null); }}
              className="w-full bg-card border border-border rounded-xl pl-9 pr-4 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/60 transition-colors"
            />
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-6">
        {selectedArticle ? (
          <ArticleView article={selectedArticle} onClose={() => setSelectedArticle(null)} />
        ) : (
          <>
            {/* Type filter */}
            <div className="flex flex-wrap gap-2 mb-4 animate-fadeInUp">
              {[
                { id: "alle", label: "Alle", icon: BookOpen },
                { id: "article", label: "Artikel", icon: FileText },
                { id: "cheatsheet", label: "Cheat Sheets", icon: ListChecks },
                { id: "howto", label: "How-Tos", icon: BookMarked },
              ].map(t => {
                const Icon = t.icon;
                return (
                  <button
                    key={t.id}
                    onClick={() => setActiveType(t.id)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
                      activeType === t.id
                        ? "bg-primary/20 border-primary/50 text-primary"
                        : "bg-card border-border text-muted-foreground hover:text-foreground hover:border-primary/30"
                    }`}
                  >
                    <Icon className="w-3 h-3" />
                    {t.label}
                  </button>
                );
              })}
            </div>

            {/* Category filter */}
            <div className="flex flex-wrap gap-1.5 mb-6 animate-fadeInUp" style={{ animationDelay: "0.05s" }}>
              {categories.map(cat => {
                const cfg = categoryConfig[cat];
                const CatIcon = cfg?.icon;
                return (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs border transition-all ${
                      activeCategory === cat
                        ? `${colorBg[cfg?.color ?? "blue"]} ${colorBorder[cfg?.color ?? "blue"]} ${colorText[cfg?.color ?? "blue"]}`
                        : "bg-card border-border text-muted-foreground hover:text-foreground hover:border-primary/30"
                    }`}
                  >
                    {CatIcon && <CatIcon className="w-3 h-3" />}
                    {cat === "alle" ? "Alle Kategorien" : cat}
                  </button>
                );
              })}
            </div>

            {/* Stats row */}
            <p className="text-xs text-muted-foreground mb-4">{filtered.length} Einträge gefunden</p>

            {/* Article grid */}
            {filtered.length === 0 ? (
              <div className="text-center py-16 text-muted-foreground text-sm">
                Kein Artikel für „{search}" gefunden
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {filtered.map((article, i) => {
                  const cat = categoryConfig[article.category];
                  const typ = typeConfig[article.type];
                  const CatIcon = cat?.icon ?? BookOpen;
                  const TypIcon = typ.icon;
                  return (
                    <button
                      key={article.id}
                      onClick={() => setSelectedArticle(article)}
                      className="group text-left bg-card border border-border rounded-2xl p-4 hover:border-primary/40 transition-all hover:scale-[1.02] animate-fadeInUp"
                      style={{ animationDelay: `${i * 0.04}s` }}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className={`p-2 rounded-lg ${colorBg[cat?.color ?? "blue"]}`}>
                          <CatIcon className={`w-4 h-4 ${colorText[cat?.color ?? "blue"]}`} />
                        </div>
                        <span className={`flex items-center gap-1 text-xs px-2 py-0.5 rounded-full ${colorBg[typ.color]} ${colorText[typ.color]}`}>
                          <TypIcon className="w-3 h-3" />
                          {typ.label}
                        </span>
                      </div>
                      <h3 className="font-semibold text-foreground text-sm mb-1 line-clamp-2">{article.title}</h3>
                      <p className="text-xs text-muted-foreground mb-3">{article.category}</p>
                      <div className="flex items-center justify-between">
                        <div className="flex flex-wrap gap-1">
                          {article.tags.slice(0, 2).map(tag => (
                            <span key={tag} className="text-xs bg-secondary/60 text-muted-foreground px-1.5 py-0.5 rounded">#{tag}</span>
                          ))}
                        </div>
                        <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors flex-shrink-0" />
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}
