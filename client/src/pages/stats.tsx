import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { topics } from "../../../shared/questions";
import type { UserProgress } from "../../../shared/schema";
import {
  Network, Cpu, Shield, GitBranch, Code, Database, Briefcase, Server,
  ArrowLeft, Trophy, Target, TrendingUp, Zap
} from "lucide-react";

const iconMap: Record<string, React.FC<{className?: string}>> = {
  Network, Cpu, Shield, GitBranch, Code, Database, Briefcase, Server
};

export default function StatsPage() {
  const { data: progress = [] } = useQuery<UserProgress[]>({
    queryKey: ["/api/progress"],
  });

  const totalQ = topics.reduce((s, t) => s + t.questions.length, 0);
  const answered = new Set(progress.map(p => p.questionId)).size;
  const correct = progress.filter(p => p.correct).length;
  const score = answered > 0 ? Math.round((correct / answered) * 100) : 0;
  const completion = totalQ > 0 ? Math.round((answered / totalQ) * 100) : 0;

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border sticky top-0 z-10 bg-background/95 backdrop-blur">
        <div className="max-w-3xl mx-auto px-4 py-3 flex items-center gap-3">
          <Link href="/">
            <button className="p-1.5 rounded-lg hover:bg-secondary transition-colors" data-testid="btn-back">
              <ArrowLeft className="w-4 h-4" />
            </button>
          </Link>
          <div>
            <h1 className="text-sm font-bold leading-none">Statistik</h1>
            <p className="text-xs text-muted-foreground">Dein Lernfortschritt</p>
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-8">
        {/* Overview */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8 animate-fadeInUp">
          <div className="bg-card border border-border rounded-xl p-4 text-center">
            <Trophy className="w-5 h-5 text-yellow-400 mx-auto mb-1.5" />
            <p className="text-2xl font-bold text-primary">{score}%</p>
            <p className="text-xs text-muted-foreground">Trefferquote</p>
          </div>
          <div className="bg-card border border-border rounded-xl p-4 text-center">
            <Target className="w-5 h-5 text-blue-400 mx-auto mb-1.5" />
            <p className="text-2xl font-bold text-foreground">{completion}%</p>
            <p className="text-xs text-muted-foreground">Abgedeckt</p>
          </div>
          <div className="bg-card border border-border rounded-xl p-4 text-center">
            <TrendingUp className="w-5 h-5 text-green-400 mx-auto mb-1.5" />
            <p className="text-2xl font-bold text-green-400">{correct}</p>
            <p className="text-xs text-muted-foreground">Richtig</p>
          </div>
          <div className="bg-card border border-border rounded-xl p-4 text-center">
            <Zap className="w-5 h-5 text-orange-400 mx-auto mb-1.5" />
            <p className="text-2xl font-bold text-foreground">{answered}</p>
            <p className="text-xs text-muted-foreground">von {totalQ} gesehen</p>
          </div>
        </div>

        {/* Per-topic breakdown */}
        <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4">
          Nach Themenbereich
        </h2>
        <div className="space-y-3">
          {topics.map((topic, i) => {
            const Icon = iconMap[topic.icon] ?? Database;
            const tp = progress.filter(p => p.topicId === topic.id);
            const tAnswered = new Set(tp.map(p => p.questionId)).size;
            const tCorrect = tp.filter(p => p.correct).length;
            const tScore = tAnswered > 0 ? Math.round((tCorrect / tAnswered) * 100) : null;
            const tPct = topic.questions.length > 0 ? Math.round((tAnswered / topic.questions.length) * 100) : 0;

            return (
              <div
                key={topic.id}
                className={`bg-card border rounded-xl p-4 animate-fadeInUp bg-topic-${topic.color}`}
                style={{animationDelay: `${i * 0.04}s`}}
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className={`p-1.5 rounded-lg bg-topic-${topic.color}`}>
                    <Icon className={`w-4 h-4 topic-${topic.color}`} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-semibold text-foreground">{topic.title}</h3>
                      <div className="flex items-center gap-2">
                        {tScore !== null && (
                          <span className={`text-xs font-bold ${tScore >= 80 ? 'text-green-400' : tScore >= 60 ? 'text-yellow-400' : 'text-red-400'}`}>
                            {tScore}%
                          </span>
                        )}
                        <span className="text-xs text-muted-foreground">{tAnswered}/{topic.questions.length}</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="progress-bar">
                  <div
                    className="progress-fill"
                    style={{
                      width: `${tPct}%`,
                      background: tScore === null ? `hsl(var(--${topic.color}))` :
                        tScore >= 80 ? 'hsl(142 71% 45%)' :
                        tScore >= 60 ? 'hsl(48 96% 53%)' :
                        'hsl(0 72% 55%)'
                    }}
                  />
                </div>
                {tAnswered === 0 && (
                  <p className="text-xs text-muted-foreground mt-2">Noch nicht geübt</p>
                )}
                {tAnswered > 0 && (
                  <div className="flex gap-3 mt-2 text-xs text-muted-foreground">
                    <span className="text-green-400">{tCorrect} richtig</span>
                    <span className="text-red-400">{tAnswered - tCorrect} falsch</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Prüfungstipps */}
        <div className="mt-8 bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-5 animate-fadeInUp">
          <h3 className="text-sm font-bold text-yellow-400 mb-3">Prüfungstipps für die AP1</h3>
          <ul className="space-y-2 text-sm text-foreground/80">
            <li className="flex items-start gap-2">
              <span className="text-yellow-400 flex-shrink-0">→</span>
              <span><strong>90 Minuten, 100 Punkte, 4 Aufgaben</strong> – ca. 22 Min. pro Aufgabe</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-yellow-400 flex-shrink-0">→</span>
              <span>Rechenaufgaben zuerst lesen: <strong>Rechenweg muss angegeben werden</strong></span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-yellow-400 flex-shrink-0">→</span>
              <span>Stichwortartige Antworten sind zulässig (kein langer Text nötig)</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-yellow-400 flex-shrink-0">→</span>
              <span>Gerundete Zwischenergebnisse: <strong>Immer mit gerundeten Werten weiterrechnen</strong></span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-yellow-400 flex-shrink-0">→</span>
              <span>Anzahl geforderte Punkte = Anzahl erwarteter Antworten (4 Punkte = 4 Nennungen)</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-yellow-400 flex-shrink-0">→</span>
              <span>Immer <strong>alle Teilaufgaben</strong> bearbeiten – Teilpunkte zählen!</span>
            </li>
          </ul>
        </div>
      </main>

      <footer className="border-t border-border mt-12 py-6">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <a href="https://www.perplexity.ai/computer" target="_blank" rel="noopener noreferrer" className="text-xs text-muted-foreground hover:text-foreground transition-colors">
            Created with Perplexity Computer
          </a>
        </div>
      </footer>
    </div>
  );
}
