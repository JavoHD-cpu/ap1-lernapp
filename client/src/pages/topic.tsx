import { Link, useRoute } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { topics, getTopicById } from "../../../shared/questions";
import type { UserProgress } from "../../../shared/schema";
import {
  Network, Cpu, Shield, GitBranch, Code, Database, Briefcase, Server,
  CheckSquare, TrendingUp,
  ArrowLeft, Zap, BookOpen, CheckCircle2, XCircle, Circle
} from "lucide-react";

const iconMap: Record<string, React.FC<{className?: string}>> = {
  Network, Cpu, Shield, GitBranch, Code, Database, Briefcase, Server,
  CheckSquare, TrendingUp
};

export default function TopicPage() {
  const [, params] = useRoute("/topic/:id");
  const topicId = params?.id ?? "";
  const topic = getTopicById(topicId);

  const { data: progress = [] } = useQuery<UserProgress[]>({
    queryKey: ["/api/progress"],
  });

  if (!topic) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground mb-4">Thema nicht gefunden</p>
          <Link href="/"><button className="text-primary">Zurück</button></Link>
        </div>
      </div>
    );
  }

  const Icon = iconMap[topic.icon] ?? BookOpen;
  const topicProgress = progress.filter(p => p.topicId === topicId);
  const answered = new Set(topicProgress.map(p => p.questionId)).size;
  const correct = topicProgress.filter(p => p.correct).length;
  const pct = topic.questions.length > 0 ? Math.round((answered / topic.questions.length) * 100) : 0;

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border sticky top-0 z-10 bg-background/95 backdrop-blur">
        <div className="max-w-3xl mx-auto px-4 py-3 flex items-center gap-3">
          <Link href="/">
            <button className="p-1.5 rounded-lg hover:bg-secondary transition-colors" data-testid="btn-back">
              <ArrowLeft className="w-4 h-4" />
            </button>
          </Link>
          <div className={`p-1.5 rounded-lg bg-topic-${topic.color}`}>
            <Icon className={`w-4 h-4 topic-${topic.color}`} />
          </div>
          <div className="flex-1">
            <h1 className="text-sm font-bold leading-none">{topic.title}</h1>
            <p className="text-xs text-muted-foreground">{topic.questions.length} Fragen</p>
          </div>
          <Link href={`/quiz/${topicId}`}>
            <button className="flex items-center gap-1.5 px-3 py-1.5 bg-primary text-primary-foreground rounded-lg text-xs font-medium hover:bg-primary/90 transition-colors" data-testid="btn-start-topic-quiz">
              <Zap className="w-3.5 h-3.5" />
              Quiz starten
            </button>
          </Link>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-8">
        {/* Topic header */}
        <div className={`border rounded-xl p-5 mb-6 bg-topic-${topic.color} animate-fadeInUp`}>
          <p className="text-sm text-muted-foreground mb-3">{topic.description}</p>
          <div className="grid grid-cols-3 gap-3">
            <div>
              <p className="text-lg font-bold text-foreground">{answered}/{topic.questions.length}</p>
              <p className="text-xs text-muted-foreground">Beantwortet</p>
            </div>
            <div>
              <p className="text-lg font-bold text-green-400">{correct}</p>
              <p className="text-xs text-muted-foreground">Richtig</p>
            </div>
            <div>
              <p className="text-lg font-bold text-primary">{pct}%</p>
              <p className="text-xs text-muted-foreground">Fortschritt</p>
            </div>
          </div>
          {answered > 0 && (
            <div className="progress-bar mt-3">
              <div className="progress-fill" style={{width: `${pct}%`, background: `hsl(var(--${topic.color}))`}} />
            </div>
          )}
        </div>

        {/* Questions list */}
        <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Fragen</h2>
        <div className="space-y-2">
          {topic.questions.map((q, i) => {
            const qProgress = topicProgress.find(p => p.questionId === q.id);
            const StatusIcon = qProgress
              ? (qProgress.correct ? CheckCircle2 : XCircle)
              : Circle;
            const statusColor = qProgress
              ? (qProgress.correct ? "text-green-400" : "text-red-400")
              : "text-muted-foreground";

            return (
              <Link href={`/quiz/${topicId}?q=${i}`} key={q.id}>
                <div
                  className="flex items-start gap-3 bg-card border border-border rounded-xl p-4 hover:border-primary/40 cursor-pointer transition-all hover:scale-[1.005] animate-fadeInUp"
                  style={{animationDelay: `${i * 0.03}s`}}
                  data-testid={`question-item-${q.id}`}
                >
                  <StatusIcon className={`w-4 h-4 mt-0.5 flex-shrink-0 ${statusColor}`} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-foreground leading-snug line-clamp-2">{q.question}</p>
                    <div className="flex items-center gap-2 mt-1.5">
                      <span className={`text-xs px-1.5 py-0.5 rounded-full diff-${q.difficulty}`}>
                        {q.difficulty}
                      </span>
                      <span className="text-xs text-muted-foreground">{q.points} Punkte</span>
                      <span className="text-xs text-muted-foreground capitalize">{q.type.replace('-', ' ')}</span>
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </main>
    </div>
  );
}
