import { Link } from "wouter";
import { ArrowLeft, Calculator, Network, Clock, HardDrive, TrendingUp, Cpu } from "lucide-react";
import { useState } from "react";

interface Formula {
  name: string;
  formula: string;
  explanation: string;
  example?: string;
  unit?: string;
}

interface FormulaSection {
  id: string;
  title: string;
  icon: React.FC<{ className?: string }>;
  color: string;
  formulas: Formula[];
}

const sections: FormulaSection[] = [
  {
    id: "subnetting",
    title: "Subnetting & IP",
    icon: Network,
    color: "blue",
    formulas: [
      {
        name: "Anzahl nutzbarer Hosts",
        formula: "Hosts = 2^(32 − Präfix) − 2",
        explanation: "−2 weil Netzadresse und Broadcast nicht nutzbar sind.",
        example: "/25 → 2^7 − 2 = 126 Hosts",
      },
      {
        name: "Anzahl Subnetze",
        formula: "Subnetze = 2^(neue Bits)",
        explanation: "Neue Bits = Bits die vom Host-Teil für Subnetz geliehen werden.",
        example: "/24 → /26: 2 neue Bits → 4 Subnetze",
      },
      {
        name: "Netzadresse berechnen",
        formula: "IP AND Subnetzmaske (bitweise)",
        explanation: "Alle Host-Bits auf 0 setzen ergibt die Netzadresse.",
        example: "192.168.1.130 /25 → Netz: 192.168.1.128",
      },
      {
        name: "Broadcast-Adresse",
        formula: "Netzadresse OR (NOT Subnetzmaske)",
        explanation: "Alle Host-Bits auf 1 setzen ergibt den Broadcast.",
        example: "192.168.1.128 /25 → Broadcast: 192.168.1.255",
      },
      {
        name: "Subnetzmaske aus Präfix",
        formula: "Präfix × 1-Bits von links, Rest 0-Bits",
        explanation: "/25 = 11111111.11111111.11111111.10000000 = 255.255.255.128",
        example: "/26 → 255.255.255.192",
      },
      {
        name: "CIDR-Blockgröße",
        formula: "Blockgröße = 2^(32 − Präfix)",
        explanation: "Gibt an, wie viele Adressen ein Subnetz enthält (inkl. Netz + Broadcast).",
        example: "/24 → 256 Adressen; /26 → 64 Adressen",
      },
    ],
  },
  {
    id: "netzplan",
    title: "Netzplantechnik",
    icon: Clock,
    color: "purple",
    formulas: [
      {
        name: "Frühester Anfangszeitpunkt (FAZ)",
        formula: "FAZ(i) = MAX(FAZ(Vorgänger) + Dauer(Vorgänger))",
        explanation: "Vorwärtsrechnung: Wann kann ein Vorgang frühestens starten?",
        example: "Wenn Vorgänger FAZ=0, Dauer=3 → FAZ=3",
      },
      {
        name: "Frühester Endzeitpunkt (FEZ)",
        formula: "FEZ(i) = FAZ(i) + Dauer(i)",
        explanation: "FAZ plus eigene Dauer ergibt den frühesten Endtermin.",
        example: "FAZ=3, Dauer=5 → FEZ=8",
      },
      {
        name: "Spätester Endzeitpunkt (SEZ)",
        formula: "SEZ(i) = MIN(SAZ(Nachfolger))",
        explanation: "Rückwärtsrechnung: Wann muss ein Vorgang spätestens enden?",
        example: "Nachfolger SAZ=10 → SEZ=10",
      },
      {
        name: "Spätester Anfangszeitpunkt (SAZ)",
        formula: "SAZ(i) = SEZ(i) − Dauer(i)",
        explanation: "SEZ minus eigene Dauer ergibt den spätesten Starttermin.",
        example: "SEZ=10, Dauer=5 → SAZ=5",
      },
      {
        name: "Gesamtpuffer (GP)",
        formula: "GP = SAZ − FAZ  (oder SEZ − FEZ)",
        explanation: "Wie lange kann ein Vorgang verschoben werden ohne das Projektende zu verschieben?",
        example: "SAZ=5, FAZ=3 → GP=2 Tage Puffer",
      },
      {
        name: "Kritischer Pfad",
        formula: "GP = 0 auf allen Vorgängen des Pfades",
        explanation: "Der längste Weg durchs Netzdiagramm. Verzögerung hier = Projektverzögerung.",
      },
    ],
  },
  {
    id: "raid",
    title: "RAID & Speicher",
    icon: HardDrive,
    color: "orange",
    formulas: [
      {
        name: "RAID 0 – Nutzkapazität",
        formula: "Kapazität = n × Plattengröße",
        explanation: "Striping: alle Platten werden für Daten genutzt, kein Redundanz.",
        example: "4 × 2 TB = 8 TB nutzbar",
      },
      {
        name: "RAID 1 – Nutzkapazität",
        formula: "Kapazität = Plattengröße (eine Hälfte ist Spiegel)",
        explanation: "Mirroring: 50% der Kapazität geht für Redundanz verloren.",
        example: "2 × 4 TB = 4 TB nutzbar",
      },
      {
        name: "RAID 5 – Nutzkapazität",
        formula: "Kapazität = (n − 1) × Plattengröße",
        explanation: "Eine Platte wird für Paritätsdaten verwendet, verteilt über alle.",
        example: "4 × 2 TB → (4−1) × 2 = 6 TB nutzbar",
      },
      {
        name: "RAID 6 – Nutzkapazität",
        formula: "Kapazität = (n − 2) × Plattengröße",
        explanation: "Zwei Paritätsplatten: kann 2 gleichzeitige Ausfälle verkraften.",
        example: "5 × 2 TB → (5−2) × 2 = 6 TB nutzbar",
      },
      {
        name: "RAID 10 – Nutzkapazität",
        formula: "Kapazität = (n / 2) × Plattengröße",
        explanation: "RAID 1+0: erst spiegeln, dann stripen. Braucht min. 4 Platten.",
        example: "4 × 2 TB → 2 × 2 = 4 TB nutzbar",
      },
    ],
  },
  {
    id: "kalkulation",
    title: "Kalkulation & BWL",
    icon: TrendingUp,
    color: "green",
    formulas: [
      {
        name: "Gewinn",
        formula: "Gewinn = Erlös − Gesamtkosten",
        explanation: "Einfachste Gewinnformel. Gesamtkosten = Fixkosten + variable Kosten.",
        example: "Erlös 50.000 € − Kosten 42.000 € = 8.000 € Gewinn",
      },
      {
        name: "Stundensatz (intern)",
        formula: "Stundensatz = Jahreskosten / produktive Stunden",
        explanation: "Wie viel kostet eine Mitarbeiterstunde dem Unternehmen?",
        example: "60.000 € / 1.600 h = 37,50 €/h",
      },
      {
        name: "Projektkosten",
        formula: "Kosten = Stunden × Stundensatz + Materialkosten",
        explanation: "Gesamtkalkulation für ein IT-Projekt.",
        example: "40h × 80 €/h + 500 € Material = 3.700 €",
      },
      {
        name: "Netto → Brutto",
        formula: "Brutto = Netto × 1,19",
        explanation: "19% MwSt aufschlagen (aktueller deutscher Regelsatz).",
        example: "1.000 € netto → 1.190 € brutto",
      },
      {
        name: "Brutto → Netto",
        formula: "Netto = Brutto / 1,19",
        explanation: "MwSt herausrechnen.",
        example: "1.190 € brutto → 1.000 € netto",
      },
      {
        name: "Rabatt",
        formula: "Rabattbetrag = Listenpreis × (Rabatt% / 100)",
        explanation: "Nettopreis = Listenpreis − Rabattbetrag.",
        example: "500 € mit 10% Rabatt → 450 € Nettopreis",
      },
      {
        name: "Return on Investment (ROI)",
        formula: "ROI = (Gewinn / Investition) × 100 %",
        explanation: "Rentabilität einer Investition in Prozent.",
        example: "Gewinn 8.000 € / Invest 40.000 € = 20% ROI",
      },
      {
        name: "Amortisationszeit",
        formula: "Amortisation = Investition / jährliche Einsparung",
        explanation: "Nach wie vielen Jahren hat sich eine Investition bezahlt gemacht?",
        example: "20.000 € / 5.000 €/Jahr = 4 Jahre",
      },
    ],
  },
  {
    id: "uebertragung",
    title: "Übertragung & Daten",
    icon: Cpu,
    color: "cyan",
    formulas: [
      {
        name: "Übertragungszeit",
        formula: "Zeit = Datenmenge / Übertragungsrate",
        explanation: "Einheiten beachten: Bit vs. Byte (1 Byte = 8 Bit).",
        example: "100 MB / 10 MB/s = 10 Sekunden",
      },
      {
        name: "Übertragungsrate (Bandbreite)",
        formula: "Rate = Datenmenge / Zeit",
        explanation: "Gibt an, wie viele Daten pro Sekunde übertragen werden.",
        example: "500 MB in 25 s → 20 MB/s",
      },
      {
        name: "Datenmenge (Bild)",
        formula: "Größe = Breite × Höhe × Farbtiefe (Bit)",
        explanation: "Farbtiefe: 24 Bit = True Color (je 8 Bit R/G/B).",
        example: "1920 × 1080 × 24 Bit = 49.766.400 Bit ≈ 5,93 MB",
      },
      {
        name: "Einheiten umrechnen",
        formula: "1 Byte = 8 Bit | 1 KB = 1.024 B | 1 MB = 1.024 KB | 1 GB = 1.024 MB",
        explanation: "IHK verwendet oft 1 MB = 1.000.000 Byte (SI) — im Zweifel im Kontext prüfen.",
      },
      {
        name: "IPv4-Adressraum",
        formula: "2^32 = 4.294.967.296 Adressen",
        explanation: "32 Bit → ca. 4,3 Milliarden mögliche IPv4-Adressen.",
      },
      {
        name: "IPv6-Adressraum",
        formula: "2^128 ≈ 3,4 × 10^38 Adressen",
        explanation: "128 Bit → praktisch unbegrenzt — Grund für die Einführung von IPv6.",
      },
    ],
  },
];

export default function FormulasPage() {
  const [activeSection, setActiveSection] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border sticky top-0 z-10 bg-background/95 backdrop-blur">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center gap-3">
          <Link href="/">
            <button className="p-1.5 rounded-lg hover:bg-secondary transition-colors" data-testid="btn-back">
              <ArrowLeft className="w-4 h-4" />
            </button>
          </Link>
          <div className="flex items-center gap-2">
            <Calculator className="w-4 h-4 text-primary" />
            <div>
              <h1 className="text-sm font-bold leading-none">Formelsammlung</h1>
              <p className="text-xs text-muted-foreground">Alle wichtigen AP1-Formeln</p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        {/* Quick Nav */}
        <div className="flex flex-wrap gap-2 mb-8 animate-fadeInUp">
          {sections.map(s => {
            const Icon = s.icon;
            return (
              <button
                key={s.id}
                onClick={() => {
                  setActiveSection(activeSection === s.id ? null : s.id);
                  setTimeout(() => {
                    document.getElementById(`section-${s.id}`)?.scrollIntoView({ behavior: "smooth", block: "start" });
                  }, 50);
                }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
                  activeSection === s.id
                    ? `bg-${s.color}-500/20 border-${s.color}-500/50 text-${s.color}-400`
                    : "bg-card border-border text-muted-foreground hover:border-primary/40 hover:text-foreground"
                }`}
              >
                <Icon className="w-3 h-3" />
                {s.title}
              </button>
            );
          })}
        </div>

        {/* Sections */}
        <div className="space-y-8">
          {sections.map((section, si) => {
            const Icon = section.icon;
            return (
              <div
                key={section.id}
                id={`section-${section.id}`}
                className="animate-fadeInUp"
                style={{ animationDelay: `${si * 0.06}s` }}
              >
                {/* Section Header */}
                <div className="flex items-center gap-2 mb-4">
                  <div className={`p-1.5 rounded-lg bg-${section.color}-500/15`}>
                    <Icon className={`w-4 h-4 text-${section.color}-400`} />
                  </div>
                  <h2 className="text-base font-bold text-foreground">{section.title}</h2>
                  <span className="text-xs text-muted-foreground ml-auto">{section.formulas.length} Formeln</span>
                </div>

                {/* Formula Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {section.formulas.map((f, fi) => (
                    <div
                      key={fi}
                      className="bg-card border border-border rounded-xl p-4 hover:border-primary/30 transition-all"
                    >
                      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                        {f.name}
                      </p>
                      {/* Formula box */}
                      <div className={`bg-${section.color}-500/10 border border-${section.color}-500/20 rounded-lg px-3 py-2 mb-2.5`}>
                        <code className={`text-sm font-mono font-bold text-${section.color}-300`}>
                          {f.formula}
                        </code>
                      </div>
                      <p className="text-xs text-muted-foreground leading-relaxed mb-1.5">{f.explanation}</p>
                      {f.example && (
                        <p className="text-xs text-foreground/70 bg-secondary/50 rounded px-2 py-1">
                          <span className="font-semibold text-muted-foreground">Bsp: </span>{f.example}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
}
