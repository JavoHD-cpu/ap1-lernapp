import { Link } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { topics } from "../../../shared/questions";
import type { UserProgress } from "../../../shared/schema";
import {
  Network, Cpu, Shield, GitBranch, Code, Database, Briefcase, Server,
  CheckSquare, TrendingUp,
  Trophy, RotateCcw, Zap, BookOpen, Target, ChevronRight,
  Calculator, BookMarked, GraduationCap
} from "lucide-react";

const iconMap: Record<string, React.FC<{className?: string}>> = {
  Network, Cpu, Shield, GitBranch, Code, Database, Briefcase, Server,
  CheckSquare, TrendingUp
};

export default function Home() {
  const { data: progress = [] } = useQuery<UserProgress[]>({
    queryKey: ["/api/progress"],
  });

  const resetMutation = useMutation({
    mutationFn: () => apiRequest("DELETE", "/api/progress"),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["/api/progress"] }),
  });

  const totalQuestions = topics.reduce((s, t) => s + t.questions.length, 0);
  const answered = new Set(progress.map(p => p.questionId)).size;
  const correct = progress.filter(p => p.correct).length;
  const pct = totalQuestions > 0 ? Math.round((answered / totalQuestions) * 100) : 0;
  const score = answered > 0 ? Math.round((correct / answered) * 100) : 0;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border sticky top-0 z-10 bg-background/95 backdrop-blur">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <svg aria-label="AP1 Lernapp Logo" viewBox="0 0 32 32" fill="none" width="32" height="32">
              <rect width="32" height="32" rx="8" fill="hsl(217 91% 60% / 0.2)"/>
              <path d="M8 22L14 10L20 22" stroke="hsl(217, 91%, 60%)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M10.5 18h7" stroke="hsl(217, 91%, 60%)" strokeWidth="2" strokeLinecap="round"/>
              <circle cx="24" cy="12" r="3" fill="hsl(217, 91%, 60%)"/>
            </svg>
            <div>
              <h1 className="text-sm font-bold text-foreground leading-none">AP1 Lernapp</h1>
              <p className="text-xs text-muted-foreground">Fachinformatiker Systemintegration</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Link href="/stats">
              <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-secondary hover:bg-secondary/80 transition-colors" data-testid="nav-stats">
                <Trophy className="w-3.5 h-3.5 text-yellow-400" />
                Statistik
              </button>
            </Link>
            <Link href="/quiz">
              <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-primary text-primary-foreground hover:bg-primary/90 transition-colors" data-testid="nav-quiz-all">
                <Zap className="w-3.5 h-3.5" />
                Alle üben
              </button>
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-8">
        {/* Hero */}
        <div className="mb-8 animate-fadeInUp">
          <h2 className="text-2xl font-bold text-foreground mb-1">Deine Zwischenprüfung</h2>
          <p className="text-muted-foreground text-sm">
            {totalQuestions} Fragen aus {topics.length} Themenbereichen — basierend auf echten IHK-Prüfungen
          </p>
        </div>

        {/* Stats Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8 animate-fadeInUp" style={{animationDelay:'0.05s'}}>
          <div className="bg-card border border-border rounded-xl p-4">
            <p className="text-2xl font-bold text-primary">{answered}</p>
            <p className="text-xs text-muted-foreground mt-0.5">Beantwortet</p>
            <p className="text-xs text-muted-foreground">von {totalQuestions}</p>
          </div>
          <div className="bg-card border border-border rounded-xl p-4">
            <p className="text-2xl font-bold text-green-400">{score}%</p>
            <p className="text-xs text-muted-foreground mt-0.5">Trefferquote</p>
            <p className="text-xs text-muted-foreground">{correct} richtig</p>
          </div>
          <div className="bg-card border border-border rounded-xl p-4">
            <p className="text-2xl font-bold text-yellow-400">{pct}%</p>
            <p className="text-xs text-muted-foreground mt-0.5">Fortschritt</p>
            <p className="text-xs text-muted-foreground">Fragen gesehen</p>
          </div>
          <div className="bg-card border border-border rounded-xl p-4">
            <p className="text-2xl font-bold text-purple-400">{topics.length}</p>
            <p className="text-xs text-muted-foreground mt-0.5">Themengebiete</p>
            <p className="text-xs text-muted-foreground">AP1 relevant</p>
          </div>
        </div>

        {/* Progress bar */}
        {answered > 0 && (
          <div className="mb-8 animate-fadeInUp" style={{animationDelay:'0.1s'}}>
            <div className="flex justify-between text-xs text-muted-foreground mb-1.5">
              <span>Gesamtfortschritt</span>
              <span>{answered} / {totalQuestions} Fragen</span>
            </div>
            <div className="progress-bar">
              <div className="progress-fill" style={{width: `${pct}%`}} />
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex flex-wrap gap-3 mb-6 animate-fadeInUp" style={{animationDelay:'0.12s'}}>
          <Link href="/quiz">
            <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary text-primary-foreground font-medium text-sm hover:bg-primary/90 transition-all hover:scale-105 active:scale-95" data-testid="btn-quiz-all">
              <Zap className="w-4 h-4" />
              Zufallsquiz starten
            </button>
          </Link>
          <Link href="/quiz?weak=1">
            <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-secondary text-secondary-foreground font-medium text-sm hover:bg-secondary/80 transition-all hover:scale-105 active:scale-95" data-testid="btn-quiz-weak">
              <Target className="w-4 h-4" />
              Schwachstellen üben
            </button>
          </Link>
          <Link href="/exam">
            <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-yellow-500/20 border border-yellow-500/30 text-yellow-300 font-medium text-sm hover:bg-yellow-500/30 transition-all hover:scale-105 active:scale-95" data-testid="btn-exam">
              <GraduationCap className="w-4 h-4" />
              Prüfungssimulation
            </button>
          </Link>
          {answered > 0 && (
            <button
              onClick={() => resetMutation.mutate()}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-border text-muted-foreground font-medium text-sm hover:border-destructive hover:text-destructive transition-colors"
              data-testid="btn-reset"
            >
              <RotateCcw className="w-4 h-4" />
              Fortschritt zurücksetzen
            </button>
          )}
        </div>

        {/* Lernhilfen */}
        <div className="grid grid-cols-2 gap-3 mb-8 animate-fadeInUp" style={{animationDelay:'0.14s'}}>
          <Link href="/formulas">
            <div className="group bg-card border border-border rounded-xl p-4 hover:border-blue-400/40 cursor-pointer transition-all hover:scale-[1.01]">
              <div className="flex items-center gap-2.5 mb-1.5">
                <div className="p-1.5 rounded-lg bg-blue-500/15">
                  <Calculator className="w-4 h-4 text-blue-400" />
                </div>
                <span className="font-semibold text-sm text-foreground">Formelsammlung</span>
                <ChevronRight className="w-4 h-4 text-muted-foreground ml-auto group-hover:text-foreground transition-colors" />
              </div>
              <p className="text-xs text-muted-foreground">Subnetting, Netzplan, RAID, Kalkulation & mehr</p>
            </div>
          </Link>
          <Link href="/glossary">
            <div className="group bg-card border border-border rounded-xl p-4 hover:border-purple-400/40 cursor-pointer transition-all hover:scale-[1.01]">
              <div className="flex items-center gap-2.5 mb-1.5">
                <div className="p-1.5 rounded-lg bg-purple-500/15">
                  <BookMarked className="w-4 h-4 text-purple-400" />
                </div>
                <span className="font-semibold text-sm text-foreground">Glossar</span>
                <ChevronRight className="w-4 h-4 text-muted-foreground ml-auto group-hover:text-foreground transition-colors" />
              </div>
              <p className="text-xs text-muted-foreground">50+ Fachbegriffe kurz erklärt</p>
            </div>
          </Link>
        </div>

        {/* Topic Grid */}
        <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4">
          Themenbereiche
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {topics.map((topic, i) => {
            const Icon = iconMap[topic.icon] ?? BookOpen;
            const topicProgress = progress.filter(p => p.topicId === topic.id);
            const answeredCount = new Set(topicProgress.map(p => p.questionId)).size;
            const correctCount = topicProgress.filter(p => p.correct).length;
            const topicPct = topic.questions.length > 0
              ? Math.round((answeredCount / topic.questions.length) * 100)
              : 0;
            const topicScore = answeredCount > 0
              ? Math.round((correctCount / answeredCount) * 100)
              : null;

            return (
              <Link href={`/topic/${topic.id}`} key={topic.id}>
                <div
                  className={`group bg-card border rounded-xl p-4 hover:border-${topic.color}-400/60 cursor-pointer transition-all hover:scale-[1.01] animate-fadeInUp bg-topic-${topic.color}`}
                  style={{animationDelay: `${0.15 + i * 0.04}s`}}
                  data-testid={`topic-card-${topic.id}`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className={`p-2 rounded-lg bg-topic-${topic.color}`}>
                      <Icon className={`w-5 h-5 topic-${topic.color}`} />
                    </div>
                    <div className="flex items-center gap-1.5">
                      {topicScore !== null && (
                        <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${topicScore >= 80 ? 'bg-green-500/20 text-green-400' : topicScore >= 50 ? 'bg-yellow-500/20 text-yellow-400' : 'bg-red-500/20 text-red-400'}`}>
                          {topicScore}%
                        </span>
                      )}
                      <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors" />
                    </div>
                  </div>
                  <h4 className="font-semibold text-foreground text-sm mb-0.5">{topic.title}</h4>
                  <p className="text-xs text-muted-foreground line-clamp-2 mb-3">{topic.description}</p>
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>{topic.questions.length} Fragen</span>
                    <span>{answeredCount}/{topic.questions.length} gesehen</span>
                  </div>
                  {answeredCount > 0 && (
                    <div className="progress-bar mt-2">
                      <div className="progress-fill" style={{width: `${topicPct}%`, background: `hsl(var(--${topic.color}))`}} />
                    </div>
                  )}
                </div>
              </Link>
            );
          })}
        </div>
      </main>

      <footer className="border-t border-border mt-12 py-6">
        <div className="max-w-5xl mx-auto px-4 text-center">
          <a href="https://www.perplexity.ai/computer" target="_blank" rel="noopener noreferrer" className="text-xs text-muted-foreground hover:text-foreground transition-colors">
            Created with Perplexity Computer
          </a>
        </div>
      </footer>
    </div>
  );
}
