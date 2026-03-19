import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { topics } from "../../../shared/questions";
import type { UserProgress } from "../../../shared/schema";
import {
  BookOpen, Zap, Calculator, BookMarked, GraduationCap,
  ChevronRight, Trophy, Network, Cpu, Shield, GitBranch,
  HelpCircle
} from "lucide-react";

// ── Module registry – add a new object here to add a module ──────────────────
const modules = [
  {
    id: "wiki",
    href: "/wiki",
    title: "Wiki",
    subtitle: "Knowledge Base",
    description: "Artikel, Cheat Sheets und How-To Guides zu allen IT-Themen.",
    icon: BookOpen,
    color: "blue",
    badge: "Neu",
    gradient: "from-blue-500/20 to-blue-600/5",
  },
  {
    id: "lernen",
    href: "/lernen",
    title: "Lernen & Quiz",
    subtitle: "AP1 Vorbereitung",
    description: "60+ Fragen, Schreibaufgaben, Schwachstellen-Modus.",
    icon: Zap,
    color: "yellow",
    badge: null,
    gradient: "from-yellow-500/20 to-yellow-600/5",
  },
  {
    id: "exam",
    href: "/exam",
    title: "Prüfungssimulation",
    subtitle: "90 Minuten",
    description: "Echter IHK-Modus mit Timer, 4 Aufgabenblöcken und Auswertung.",
    icon: GraduationCap,
    color: "orange",
    badge: null,
    gradient: "from-orange-500/20 to-orange-600/5",
  },
  {
    id: "formulas",
    href: "/formulas",
    title: "Formelsammlung",
    subtitle: "Quick Reference",
    description: "Subnetting, Netzplan, RAID, Kalkulation und Datenübertragung.",
    icon: Calculator,
    color: "green",
    badge: null,
    gradient: "from-green-500/20 to-green-600/5",
  },
  {
    id: "glossary",
    href: "/glossary",
    title: "Glossar",
    subtitle: "50+ Begriffe",
    description: "Fachbegriffe aus Netzwerk, Sicherheit, BWL und mehr.",
    icon: BookMarked,
    color: "purple",
    badge: null,
    gradient: "from-purple-500/20 to-purple-600/5",
  },
  {
    id: "fragen-editor",
    href: "/fragen-editor",
    title: "Fragen-Editor",
    subtitle: "Eigene Fragen",
    description: "Erstelle eigene Prüfungsfragen: Multiple Choice, Schreibaufgaben, Rechenaufgaben.",
    icon: HelpCircle,
    color: "cyan",
    badge: "Neu",
    gradient: "from-cyan-500/20 to-cyan-600/5",
  },
  // Future modules – uncomment to activate:
  // { id: "subnet", href: "/subnet-calc", title: "Subnet Calculator", subtitle: "Live Tool", description: "IP-Adresse eingeben, Subnetzmaske berechnen.", icon: Network, color: "cyan", badge: "Bald", gradient: "from-cyan-500/20 to-cyan-600/5" },
  // { id: "netzplan", href: "/netzplan-calc", title: "Netzplan-Rechner", subtitle: "FAZ / FEZ / GP", description: "Automatisch kritischen Pfad berechnen.", icon: GitBranch, color: "indigo", badge: "Bald", gradient: "from-indigo-500/20 to-indigo-600/5" },
];

const colorMap: Record<string, string> = {
  blue:   "text-blue-400 bg-blue-500/15 border-blue-500/30",
  yellow: "text-yellow-400 bg-yellow-500/15 border-yellow-500/30",
  orange: "text-orange-400 bg-orange-500/15 border-orange-500/30",
  green:  "text-green-400 bg-green-500/15 border-green-500/30",
  purple: "text-purple-400 bg-purple-500/15 border-purple-500/30",
  cyan:   "text-cyan-400 bg-cyan-500/15 border-cyan-500/30",
  indigo: "text-indigo-400 bg-indigo-500/15 border-indigo-500/30",
};

const iconBg: Record<string, string> = {
  blue:   "bg-blue-500/15",
  yellow: "bg-yellow-500/15",
  orange: "bg-orange-500/15",
  green:  "bg-green-500/15",
  purple: "bg-purple-500/15",
  cyan:   "bg-cyan-500/15",
  indigo: "bg-indigo-500/15",
};

const iconText: Record<string, string> = {
  blue:   "text-blue-400",
  yellow: "text-yellow-400",
  orange: "text-orange-400",
  green:  "text-green-400",
  purple: "text-purple-400",
  cyan:   "text-cyan-400",
  indigo: "text-indigo-400",
};

export default function HubPage() {
  const { data: progress = [] } = useQuery<UserProgress[]>({
    queryKey: ["/api/progress"],
  });

  const totalQ = topics.reduce((s, t) => s + t.questions.length, 0);
  const answered = new Set(progress.map(p => p.questionId)).size;
  const correct = progress.filter(p => p.correct).length;
  const score = answered > 0 ? Math.round((correct / answered) * 100) : 0;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border sticky top-0 z-10 bg-background/95 backdrop-blur">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* IO Hub Logo */}
            <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center">
              <span className="text-primary font-bold text-sm leading-none">IO</span>
            </div>
            <div>
              <h1 className="text-sm font-bold text-foreground leading-none">IO Hub</h1>
              <p className="text-xs text-muted-foreground">Fachinformatiker Systemintegration</p>
            </div>
          </div>
          <Link href="/stats">
            <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-secondary hover:bg-secondary/80 transition-colors">
              <Trophy className="w-3.5 h-3.5 text-yellow-400" />
              Statistik
            </button>
          </Link>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-8">

        {/* Hero */}
        <div className="mb-8 animate-fadeInUp">
          <h2 className="text-3xl font-bold text-foreground mb-2">
            Willkommen im IO Hub
          </h2>
          <p className="text-muted-foreground text-sm max-w-xl">
            Dein persönliches Wissenszentrum für Fachinformatiker Systemintegration — Wiki, Lerntools und Referenzen an einem Ort.
          </p>
        </div>

        {/* Quick Stats (only shown if any progress) */}
        {answered > 0 && (
          <div className="grid grid-cols-3 gap-3 mb-8 animate-fadeInUp" style={{ animationDelay: "0.05s" }}>
            <div className="bg-card border border-border rounded-xl p-4 text-center">
              <p className="text-2xl font-bold text-primary">{answered}</p>
              <p className="text-xs text-muted-foreground mt-0.5">Fragen beantwortet</p>
            </div>
            <div className="bg-card border border-border rounded-xl p-4 text-center">
              <p className="text-2xl font-bold text-green-400">{score}%</p>
              <p className="text-xs text-muted-foreground mt-0.5">Trefferquote</p>
            </div>
            <div className="bg-card border border-border rounded-xl p-4 text-center">
              <p className="text-2xl font-bold text-yellow-400">{Math.round((answered / totalQ) * 100)}%</p>
              <p className="text-xs text-muted-foreground mt-0.5">Fortschritt</p>
            </div>
          </div>
        )}

        {/* Module Grid */}
        <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4 animate-fadeInUp" style={{ animationDelay: "0.08s" }}>
          Module
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {modules.map((mod, i) => {
            const Icon = mod.icon;
            return (
              <Link href={mod.href} key={mod.id}>
                <div
                  className={`group relative bg-card border border-border rounded-2xl p-5 cursor-pointer transition-all hover:scale-[1.02] hover:border-${mod.color}-400/40 animate-fadeInUp overflow-hidden`}
                  style={{ animationDelay: `${0.1 + i * 0.05}s` }}
                  data-testid={`module-${mod.id}`}
                >
                  {/* Subtle gradient bg */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${mod.gradient} opacity-60 rounded-2xl pointer-events-none`} />

                  <div className="relative">
                    <div className="flex items-start justify-between mb-4">
                      <div className={`p-2.5 rounded-xl ${iconBg[mod.color]}`}>
                        <Icon className={`w-5 h-5 ${iconText[mod.color]}`} />
                      </div>
                      <div className="flex items-center gap-2">
                        {mod.badge && (
                          <span className={`text-xs px-2 py-0.5 rounded-full border font-medium ${colorMap[mod.color]}`}>
                            {mod.badge}
                          </span>
                        )}
                        <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors" />
                      </div>
                    </div>
                    <h4 className="font-bold text-foreground text-base mb-0.5">{mod.title}</h4>
                    <p className={`text-xs font-medium mb-2 ${iconText[mod.color]}`}>{mod.subtitle}</p>
                    <p className="text-xs text-muted-foreground leading-relaxed">{mod.description}</p>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        {/* Footer hint */}
        <p className="text-xs text-muted-foreground text-center mt-12 animate-fadeInUp" style={{ animationDelay: "0.5s" }}>
          Weitere Module (Subnet Calculator, Netzplan-Rechner) folgen bald
        </p>
      </main>

      <footer className="border-t border-border mt-8 py-6">
        <div className="max-w-5xl mx-auto px-4 text-center">
          <a href="https://www.perplexity.ai/computer" target="_blank" rel="noopener noreferrer" className="text-xs text-muted-foreground hover:text-foreground transition-colors">
            Created with Perplexity Computer
          </a>
        </div>
      </footer>
    </div>
  );
}
