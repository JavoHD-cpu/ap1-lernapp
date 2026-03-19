import { useState, useEffect } from "react";
import { Link, useRoute } from "wouter";
import { useMutation, useQuery } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { topics, getAllQuestions, getTopicById } from "../../../shared/questions";
import type { Question, Answer } from "../../../shared/questions";
import type { UserProgress } from "../../../shared/schema";
import {
  ArrowLeft, CheckCircle2, XCircle, Lightbulb, ChevronRight,
  RotateCcw, Trophy, Zap, PenLine, Calculator, Table2
} from "lucide-react";

function BookOpen({className}: {className?: string}) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/>
      <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
    </svg>
  );
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

const typeLabels: Record<string, { label: string; Icon: React.FC<{className?: string}> }> = {
  "multiple-choice": { label: "Multiple Choice", Icon: CheckCircle2 },
  "open":            { label: "Schreibaufgabe", Icon: PenLine },
  "calculation":     { label: "Rechenaufgabe", Icon: Calculator },
  "table-fill":      { label: "Tabellenaufgabe", Icon: Table2 },
};

export default function QuizPage() {
  const [, topicParams] = useRoute("/quiz/:id");
  const topicId = topicParams?.id;
  const topic = topicId ? getTopicById(topicId) : null;

  const [questions, setQuestions] = useState<Question[]>([]);
  const [current, setCurrent] = useState(0);

  // Multiple-choice state
  const [selected, setSelected] = useState<string | null>(null);

  // Open / calculation / table-fill state
  const [userText, setUserText] = useState("");
  const [revealed, setRevealed] = useState(false);
  const [selfAssessed, setSelfAssessed] = useState<boolean | null>(null);

  const [showExplanation, setShowExplanation] = useState(false);
  const [sessionResults, setSessionResults] = useState<{id: string; correct: boolean}[]>([]);
  const [done, setDone] = useState(false);

  const { data: progress = [] } = useQuery<UserProgress[]>({
    queryKey: ["/api/progress"],
  });

  const saveMutation = useMutation({
    mutationFn: (data: { topicId: string; questionId: string; correct: boolean; attempts: number }) =>
      apiRequest("POST", "/api/progress", data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["/api/progress"] }),
  });

  useEffect(() => {
    const allQ = topicId
      ? (topic?.questions ?? [])
      : getAllQuestions();
    const url = window.location.href;
    const isWeak = url.includes("weak=1");
    if (isWeak && progress.length > 0) {
      const wrongIds = new Set(progress.filter(p => !p.correct).map(p => p.questionId));
      const seenIds = new Set(progress.map(p => p.questionId));
      const wrongQ = allQ.filter(q => wrongIds.has(q.id));
      const unseenQ = allQ.filter(q => !seenIds.has(q.id));
      const rest = allQ.filter(q => seenIds.has(q.id) && !wrongIds.has(q.id));
      setQuestions(shuffle([...wrongQ, ...unseenQ, ...rest]));
    } else {
      setQuestions(shuffle(allQ));
    }
    resetQuestionState();
    setSessionResults([]);
    setDone(false);
    setCurrent(0);
  }, [topicId]);

  function resetQuestionState() {
    setSelected(null);
    setUserText("");
    setRevealed(false);
    setSelfAssessed(null);
    setShowExplanation(false);
  }

  const q = questions[current];
  if (!q && questions.length > 0 && !done) return null;

  if (questions.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground mb-4">Keine Fragen gefunden</p>
          <Link href="/"><button className="text-primary">Zurück</button></Link>
        </div>
      </div>
    );
  }

  // ── Multiple Choice handlers ──────────────────────────────────────────────
  const handleSelect = (answer: Answer) => {
    if (selected) return;
    setSelected(answer.id);
    setShowExplanation(true);
    const isCorrect = answer.correct;
    setSessionResults(prev => [...prev, { id: q.id, correct: isCorrect }]);
    saveMutation.mutate({ topicId: q.topicId, questionId: q.id, correct: isCorrect, attempts: 1 });
  };

  // ── Open / Calculation / Table handlers ──────────────────────────────────
  const handleReveal = () => {
    setRevealed(true);
  };

  const handleSelfAssess = (correct: boolean) => {
    setSelfAssessed(correct);
    setShowExplanation(true);
    setSessionResults(prev => [...prev, { id: q.id, correct }]);
    saveMutation.mutate({ topicId: q.topicId, questionId: q.id, correct, attempts: 1 });
  };

  // ── Navigation ────────────────────────────────────────────────────────────
  const handleNext = () => {
    if (current + 1 >= questions.length) {
      setDone(true);
      return;
    }
    setCurrent(c => c + 1);
    resetQuestionState();
  };

  const correctSelected = q?.answers?.find(a => a.id === selected)?.correct;
  const progress_pct = ((current + 1) / questions.length) * 100;
  const sessionCorrect = sessionResults.filter(r => r.correct).length;

  const isOpenType = q && (q.type === "open" || q.type === "calculation" || q.type === "table-fill");
  const isAnswered = selected !== null || selfAssessed !== null;

  // ── Done screen ───────────────────────────────────────────────────────────
  if (done) {
    const pct = Math.round((sessionCorrect / sessionResults.length) * 100);
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="max-w-md w-full text-center animate-fadeInUp">
          <div className="text-6xl mb-4">
            {pct >= 80 ? "🏆" : pct >= 60 ? "👍" : "📚"}
          </div>
          <h1 className="text-2xl font-bold mb-2">Runde beendet!</h1>
          <p className="text-muted-foreground mb-6">
            Du hast {sessionCorrect} von {sessionResults.length} Fragen richtig beantwortet
          </p>
          <div className="bg-card border border-border rounded-2xl p-6 mb-6">
            <div className="text-4xl font-bold text-primary mb-1">{pct}%</div>
            <div className="text-sm text-muted-foreground mb-4">Trefferquote in dieser Runde</div>
            <div className="progress-bar">
              <div className="progress-fill" style={{width: `${pct}%`}} />
            </div>
            <div className="grid grid-cols-2 gap-4 mt-4 text-sm">
              <div className="text-center">
                <div className="text-green-400 font-bold text-xl">{sessionCorrect}</div>
                <div className="text-muted-foreground">Richtig</div>
              </div>
              <div className="text-center">
                <div className="text-red-400 font-bold text-xl">{sessionResults.length - sessionCorrect}</div>
                <div className="text-muted-foreground">Falsch</div>
              </div>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => {
                const allQ = topicId ? (topic?.questions ?? []) : getAllQuestions();
                setQuestions(shuffle(allQ));
                setCurrent(0);
                resetQuestionState();
                setSessionResults([]);
                setDone(false);
              }}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-primary text-primary-foreground font-medium text-sm hover:bg-primary/90 transition-colors"
              data-testid="btn-restart-quiz"
            >
              <RotateCcw className="w-4 h-4" />
              Nochmal spielen
            </button>
            <Link href="/" className="flex-1">
              <button className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-secondary text-secondary-foreground font-medium text-sm hover:bg-secondary/80 transition-colors" data-testid="btn-home">
                Zurück zur Übersicht
              </button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // ── Main quiz screen ──────────────────────────────────────────────────────
  const typeInfo = typeLabels[q.type] ?? typeLabels["multiple-choice"];
  const TypeIcon = typeInfo.Icon;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border sticky top-0 z-10 bg-background/95 backdrop-blur">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center gap-3">
          <Link href={topicId ? `/topic/${topicId}` : "/"}>
            <button className="p-1.5 rounded-lg hover:bg-secondary transition-colors" data-testid="btn-back">
              <ArrowLeft className="w-4 h-4" />
            </button>
          </Link>
          <div className="flex-1">
            <div className="flex justify-between text-xs text-muted-foreground mb-1">
              <span>{topic?.title ?? "Alle Themen"}</span>
              <span>{current + 1} / {questions.length}</span>
            </div>
            <div className="progress-bar">
              <div className="progress-fill" style={{width: `${progress_pct}%`}} />
            </div>
          </div>
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <span className="text-green-400 font-medium">{sessionCorrect}</span>
            <span>/</span>
            <span>{sessionResults.length}</span>
          </div>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-8">
        <div className="animate-fadeInUp" key={q.id}>

          {/* Meta */}
          <div className="flex items-center gap-2 mb-4 flex-wrap">
            <span className={`text-xs px-2 py-0.5 rounded-full diff-${q.difficulty}`}>{q.difficulty}</span>
            <span className="text-xs text-muted-foreground">{q.points} Punkte</span>
            <span className="text-xs text-muted-foreground">•</span>
            <span className="text-xs text-muted-foreground capitalize">
              {topics.find(t => t.id === q.topicId)?.title ?? q.topicId}
            </span>
            <span className="ml-auto flex items-center gap-1 text-xs px-2 py-0.5 rounded-full bg-secondary text-secondary-foreground">
              <TypeIcon className="w-3 h-3" />
              {typeInfo.label}
            </span>
          </div>

          {/* Question */}
          <div className="bg-card border border-border rounded-2xl p-5 mb-4">
            <p className="text-foreground font-medium leading-relaxed whitespace-pre-line">{q.question}</p>
          </div>

          {/* ── Multiple Choice ── */}
          {q.type === "multiple-choice" && q.answers && (
            <div className="space-y-2.5 mb-4">
              {q.answers.map((ans) => {
                let state = "idle";
                if (selected) {
                  if (ans.id === selected) state = ans.correct ? "correct" : "wrong";
                  else if (ans.correct) state = "reveal";
                }

                const stateClasses = {
                  idle: "bg-card border-border hover:border-primary/50 cursor-pointer hover:scale-[1.01]",
                  correct: "bg-green-500/15 border-green-500/60 correct-glow scale-[1.01]",
                  wrong: "bg-red-500/15 border-red-500/60 wrong-glow",
                  reveal: "bg-green-500/10 border-green-500/30",
                }[state];

                return (
                  <button
                    key={ans.id}
                    onClick={() => handleSelect(ans)}
                    className={`w-full flex items-start gap-3 p-4 rounded-xl border text-left transition-all ${stateClasses}`}
                    disabled={!!selected}
                    data-testid={`answer-${ans.id}`}
                  >
                    <span className={`w-6 h-6 rounded-full border flex-shrink-0 flex items-center justify-center text-xs font-bold mt-0.5 ${
                      state === 'idle' ? 'border-border text-muted-foreground' :
                      state === 'correct' ? 'border-green-500 text-green-400 bg-green-500/20' :
                      state === 'wrong' ? 'border-red-500 text-red-400 bg-red-500/20' :
                      'border-green-500/50 text-green-400/70'
                    }`}>
                      {ans.id.toUpperCase()}
                    </span>
                    <span className="text-sm leading-snug">{ans.text}</span>
                    {(state === 'correct' || state === 'reveal') && (
                      <CheckCircle2 className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5 ml-auto" />
                    )}
                    {state === 'wrong' && (
                      <XCircle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5 ml-auto" />
                    )}
                  </button>
                );
              })}
            </div>
          )}

          {/* MC Feedback */}
          {q.type === "multiple-choice" && selected && (
            <div className="animate-fadeInUp space-y-3">
              <div className={`flex items-center gap-2 p-3 rounded-xl text-sm font-medium ${correctSelected ? 'bg-green-500/15 text-green-400 border border-green-500/30' : 'bg-red-500/15 text-red-400 border border-red-500/30'}`}>
                {correctSelected
                  ? <><CheckCircle2 className="w-4 h-4 flex-shrink-0" /> Richtig! Gut gemacht.</>
                  : <><XCircle className="w-4 h-4 flex-shrink-0" /> Leider falsch. Aber gut für dich zu wissen!</>
                }
              </div>

              {q.answers?.find(a => a.id === selected)?.explanation && (
                <div className="bg-card border border-border rounded-xl p-4">
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">Zur gewählten Antwort</p>
                  <p className="text-sm text-foreground/90 leading-relaxed">
                    {q.answers?.find(a => a.id === selected)?.explanation}
                  </p>
                </div>
              )}

              <div className="bg-card border border-border rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <BookOpen className="w-4 h-4 text-primary" />
                  <p className="text-xs font-semibold text-primary uppercase tracking-wider">Erklärung</p>
                </div>
                <p className="text-sm text-foreground/90 leading-relaxed">{q.explanation}</p>
              </div>

              {q.tip && (
                <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-1.5">
                    <Lightbulb className="w-4 h-4 text-yellow-400" />
                    <p className="text-xs font-semibold text-yellow-400 uppercase tracking-wider">Prüfungstipp</p>
                  </div>
                  <p className="text-sm text-foreground/90 leading-relaxed">{q.tip}</p>
                </div>
              )}

              <button
                onClick={handleNext}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-all hover:scale-[1.01] active:scale-95"
                data-testid="btn-next"
              >
                {current + 1 >= questions.length
                  ? <><Trophy className="w-4 h-4" /> Auswertung anzeigen</>
                  : <><ChevronRight className="w-4 h-4" /> Nächste Frage</>
                }
              </button>
            </div>
          )}

          {/* ── Open / Calculation / Table-fill ── */}
          {isOpenType && (
            <div className="space-y-3 mb-4">

              {/* Hinweis-Banner */}
              <div className="flex items-start gap-2 p-3 rounded-xl bg-blue-500/10 border border-blue-500/20 text-xs text-blue-300">
                <PenLine className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" />
                <span>Bearbeite die Aufgabe gedanklich oder schriftlich, dann vergleiche mit der Musterlösung.</span>
              </div>

              {/* Textarea */}
              {!revealed && (
                <div>
                  <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block mb-1.5">
                    Deine Antwort (optional — zur eigenen Kontrolle)
                  </label>
                  <textarea
                    value={userText}
                    onChange={e => setUserText(e.target.value)}
                    placeholder="Schreibe deine Lösung hier..."
                    rows={5}
                    className="w-full bg-card border border-border rounded-xl p-4 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/60 resize-y transition-colors"
                  />
                </div>
              )}

              {/* Reveal Button */}
              {!revealed && (
                <button
                  onClick={handleReveal}
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-all hover:scale-[1.01] active:scale-95"
                  data-testid="btn-reveal"
                >
                  <BookOpen className="w-4 h-4" />
                  Musterlösung anzeigen
                </button>
              )}

              {/* Revealed: Model Answer + Key Points */}
              {revealed && (
                <div className="animate-fadeInUp space-y-3">

                  {/* User's answer summary if they wrote something */}
                  {userText.trim() && (
                    <div className="bg-card border border-border rounded-xl p-4">
                      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Deine Antwort</p>
                      <p className="text-sm text-foreground/80 leading-relaxed whitespace-pre-line">{userText}</p>
                    </div>
                  )}

                  {/* Model Answer */}
                  <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <CheckCircle2 className="w-4 h-4 text-green-400" />
                      <p className="text-xs font-semibold text-green-400 uppercase tracking-wider">Musterlösung</p>
                    </div>
                    <p className="text-sm text-foreground/90 leading-relaxed whitespace-pre-line">
                      {(q as any).modelAnswer ?? "—"}
                    </p>
                  </div>

                  {/* Key Points checklist */}
                  {(q as any).keyPoints && (q as any).keyPoints.length > 0 && (
                    <div className="bg-card border border-border rounded-xl p-4">
                      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Bewertungspunkte</p>
                      <ul className="space-y-1.5">
                        {((q as any).keyPoints as string[]).map((point, idx) => (
                          <li key={idx} className="flex items-start gap-2 text-sm text-foreground/85">
                            <span className="text-green-400 flex-shrink-0 mt-0.5">✓</span>
                            <span>{point}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Self-assessment — only if not yet assessed */}
                  {selfAssessed === null && (
                    <div className="bg-card border border-border rounded-xl p-4">
                      <p className="text-sm font-medium text-foreground mb-3">Hatte ich das richtig?</p>
                      <div className="flex gap-3">
                        <button
                          onClick={() => handleSelfAssess(true)}
                          className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-green-500/20 border border-green-500/40 text-green-400 font-medium text-sm hover:bg-green-500/30 transition-colors"
                          data-testid="btn-self-correct"
                        >
                          <CheckCircle2 className="w-4 h-4" />
                          Ja, hatte ich
                        </button>
                        <button
                          onClick={() => handleSelfAssess(false)}
                          className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-red-500/20 border border-red-500/40 text-red-400 font-medium text-sm hover:bg-red-500/30 transition-colors"
                          data-testid="btn-self-wrong"
                        >
                          <XCircle className="w-4 h-4" />
                          Nein, war falsch
                        </button>
                      </div>
                    </div>
                  )}

                  {/* After self-assessment feedback */}
                  {selfAssessed !== null && (
                    <div className={`flex items-center gap-2 p-3 rounded-xl text-sm font-medium ${selfAssessed ? 'bg-green-500/15 text-green-400 border border-green-500/30' : 'bg-red-500/15 text-red-400 border border-red-500/30'}`}>
                      {selfAssessed
                        ? <><CheckCircle2 className="w-4 h-4 flex-shrink-0" /> Super! Weiter so.</>
                        : <><XCircle className="w-4 h-4 flex-shrink-0" /> Kein Problem — beim nächsten Mal klappt es!</>
                      }
                    </div>
                  )}

                  {/* Explanation */}
                  {showExplanation && q.explanation && (
                    <div className="bg-card border border-border rounded-xl p-4 animate-fadeInUp">
                      <div className="flex items-center gap-2 mb-2">
                        <BookOpen className="w-4 h-4 text-primary" />
                        <p className="text-xs font-semibold text-primary uppercase tracking-wider">Erklärung</p>
                      </div>
                      <p className="text-sm text-foreground/90 leading-relaxed">{q.explanation}</p>
                    </div>
                  )}

                  {/* Tip */}
                  {showExplanation && q.tip && (
                    <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-4 animate-fadeInUp">
                      <div className="flex items-center gap-2 mb-1.5">
                        <Lightbulb className="w-4 h-4 text-yellow-400" />
                        <p className="text-xs font-semibold text-yellow-400 uppercase tracking-wider">Prüfungstipp</p>
                      </div>
                      <p className="text-sm text-foreground/90 leading-relaxed">{q.tip}</p>
                    </div>
                  )}

                  {/* Next Button */}
                  {selfAssessed !== null && (
                    <button
                      onClick={handleNext}
                      className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-all hover:scale-[1.01] active:scale-95"
                      data-testid="btn-next"
                    >
                      {current + 1 >= questions.length
                        ? <><Trophy className="w-4 h-4" /> Auswertung anzeigen</>
                        : <><ChevronRight className="w-4 h-4" /> Nächste Frage</>
                      }
                    </button>
                  )}
                </div>
              )}
            </div>
          )}

        </div>
      </main>
    </div>
  );
}
