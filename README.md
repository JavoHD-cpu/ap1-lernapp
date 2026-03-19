# AP1 Lernapp – Fachinformatiker Systemintegration

Eine interaktive Lernapp zur Vorbereitung auf die IHK Zwischenprüfung (AP1) für Fachinformatiker Systemintegration.

## Features

- 📚 **60+ Fragen** aus 10 Themenbereichen
- ✍️ **Schreibaufgaben** mit Musterlösung & Selbstbewertung
- 🧮 **Rechenaufgaben** (Subnetting, Netzplantechnik, Kalkulation)
- 📊 **Statistik-Seite** mit Lernfortschritt pro Thema
- 🎯 **Schwachstellen-Modus** – übt gezielt falsch beantwortete Fragen
- 🏆 **Prüfungssimulation** – 90 Minuten Countdown, 4 Aufgabenblöcke
- 📐 **Formelsammlung** – alle wichtigen AP1-Formeln auf einen Blick
- 📖 **Glossar** – Fachbegriffe kurz erklärt

## Themen

1. Netzwerktechnik (Subnetting, OSI, Protokolle)
2. Hardware & Peripherie
3. IT-Sicherheit & Datenschutz
4. Projektmanagement (Netzplantechnik, Scrum)
5. Programmierung & Softwareentwicklung
6. Datenbanken (ER-Modell, SQL)
7. Wirtschaft & Verträge
8. Systemadministration
9. Qualität & Service
10. BWL & Betriebswirtschaft

## Tech Stack

- **Frontend**: React + TypeScript + Vite + Tailwind CSS + shadcn/ui
- **Backend**: Express.js (In-Memory Progress-Tracking)
- **Routing**: Wouter (Hash-Routing für SPA-Deployment)

## Lokale Entwicklung

```bash
npm install
npm run dev
```

## Build & Deploy

```bash
npm run build
NODE_ENV=production node dist/index.cjs
```

## Basierend auf

- IHK AP1 Prüfung Frühjahr 2026 (Fachinformatiker Systemintegration)
- Offizieller IHK-Prüfungskatalog (Oktober 2024)
- Verschiedene IHK-Übungsprüfungen

---

Erstellt mit [Perplexity Computer](https://www.perplexity.ai/computer)
