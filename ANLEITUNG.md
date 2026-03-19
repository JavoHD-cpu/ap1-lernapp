# AP1 Lernapp – Entwickleranleitung

## Voraussetzungen

- **Node.js** v18+ → [nodejs.org](https://nodejs.org)
- **Git** → [git-scm.com](https://git-scm.com)
- **VS Code** (empfohlen)

---

## Installation & Start

```bash
# 1. Repo klonen
git clone https://github.com/JavoHD-cpu/ap1-lernapp.git
cd ap1-lernapp

# 2. Abhängigkeiten installieren
npm install

# 3. Entwicklungsserver starten (Port 5000, Hot Reload)
npm run dev
```

→ App unter **http://localhost:5000** aufrufen

---

## Verfügbare Befehle

| Befehl | Beschreibung |
|--------|-------------|
| `npm run dev` | Entwicklungsserver mit Hot Reload |
| `npm run build` | Produktions-Build erstellen |
| `npm start` | Produktionsserver starten |
| `npm run check` | TypeScript-Fehler prüfen |

---

## Projektstruktur

```
ap1-lernapp/
├── client/src/
│   ├── App.tsx          ← Routing
│   ├── index.css        ← Dark Theme
│   └── pages/
│       ├── home.tsx     ← Startseite
│       ├── quiz.tsx     ← Quiz-Modus
│       ├── topic.tsx    ← Themenübersicht
│       ├── stats.tsx    ← Statistik
│       ├── exam.tsx     ← Prüfungssimulation
│       ├── formulas.tsx ← Formelsammlung
│       └── glossary.tsx ← Glossar
├── server/
│   ├── routes.ts        ← API-Endpunkte
│   └── storage.ts       ← In-Memory Speicher
└── shared/
    └── questions.ts     ← ALLE Fragen & Themen
```

---

## Fragen bearbeiten

Alle Fragen sind in **`shared/questions.ts`**. Es gibt 4 Typen:

### Multiple-Choice-Frage

```typescript
{
  id: "nw-99",              // Eindeutige ID – nie doppelt!
  topicId: "netzwerk",      // Siehe Themen-IDs unten
  type: "multiple-choice",
  difficulty: "mittel",     // "leicht" | "mittel" | "schwer"
  points: 2,
  question: "Auf welcher OSI-Schicht arbeitet ein Switch?",
  answers: [
    { id: "a", text: "Schicht 1 – Physisch",  correct: false, explanation: "..." },
    { id: "b", text: "Schicht 2 – Sicherung", correct: true,  explanation: "..." },
    { id: "c", text: "Schicht 3 – Netzwerk",  correct: false, explanation: "..." },
    { id: "d", text: "Schicht 4 – Transport", correct: false, explanation: "..." },
  ],
  explanation: "Switches arbeiten mit MAC-Adressen = OSI-Schicht 2.",
  tip: "Merkhilfe: Hub=1, Switch=2, Router=3",
},
```

### Schreibaufgabe / Rechenaufgabe

```typescript
{
  id: "nw-100",
  topicId: "netzwerk",
  type: "open",             // oder "calculation" oder "table-fill"
  difficulty: "schwer",
  points: 5,
  question: "Erkläre den Unterschied zwischen TCP und UDP...",
  modelAnswer: "TCP ist verbindungsorientiert...\n\nUDP ist verbindungslos...",
  keyPoints: [
    "TCP verbindungsorientiert, UDP verbindungslos",
    "3-Way-Handshake bei TCP erwähnt",
    "Anwendungsbeispiel TCP korrekt",
    "Anwendungsbeispiel UDP korrekt",
  ],
  explanation: "TCP: SYN → SYN-ACK → ACK. UDP: Paket senden, fertig.",
  tip: "Im Zweifel: Streaming/Gaming = UDP, alles andere = TCP",
},
```

### Themenbereich-IDs

| topicId | Thema |
|---------|-------|
| `netzwerk` | Netzwerktechnik |
| `hardware` | Hardware & Peripherie |
| `sicherheit` | IT-Sicherheit & Datenschutz |
| `projektmanagement` | Projektmanagement |
| `programmierung` | Programmierung & Softwareentwicklung |
| `datenbanken` | Datenbanken |
| `wirtschaft` | Wirtschaft & Verträge |
| `systemadmin` | Systemadministration |
| `qualitaet` | Qualität & Service |
| `bwl` | BWL & Betriebswirtschaft |

---

## Neue Seite hinzufügen

**1. Datei erstellen** – `client/src/pages/meine-seite.tsx`

```tsx
import { Link } from "wouter";
import { ArrowLeft } from "lucide-react";

export default function MeineSeite() {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border sticky top-0 z-10 bg-background/95">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center gap-3">
          <Link href="/"><button className="p-1.5 rounded-lg hover:bg-secondary"><ArrowLeft className="w-4 h-4" /></button></Link>
          <h1 className="text-sm font-bold">Meine Seite</h1>
        </div>
      </header>
      <main className="max-w-4xl mx-auto px-4 py-8">
        {/* Inhalte hier */}
      </main>
    </div>
  );
}
```

**2. Route in `client/src/App.tsx` registrieren**

```tsx
import MeineSeite from "@/pages/meine-seite";
// ...
<Route path="/meine-seite" component={MeineSeite} />
```

---

## Auf GitHub pushen

```bash
git add .
git commit -m "feat: Neue Fragen hinzugefügt"
git push origin main
```

---

## Häufige Probleme

| Problem | Lösung |
|---------|--------|
| Port 5000 belegt | `lsof -i :5000` → `kill -9 [PID]` |
| `node: command not found` | Node.js installieren: nodejs.org |
| Änderungen nicht sichtbar | Browser-Cache leeren: `Strg+Shift+R` |
| TypeScript-Fehler | `npm run check` ausführen |
| Build schlägt fehl | Neue Importe in App.tsx eingetragen? |
