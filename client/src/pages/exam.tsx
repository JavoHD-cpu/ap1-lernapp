import { useState, useEffect, useRef } from "react";
import { Link } from "wouter";
import { useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { getAllQuestions, topics } from "../../../shared/questions";
import type { Question, Answer } from "../../../shared/questions";
import {
  ArrowLeft, Clock, CheckCircle2, XCircle, Trophy, AlertTriangle,
  ChevronRight, ChevronLeft, PenLine, Calculator, BookOpen
} from "lucide-react";

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// Build 4 exam blocks from all questions, distributed by topic
function buildExamBlocks(allQ: Question[]): { title: string; questions: Question[] }[] {
  const blockTitles = [
    "Aufgabe 1 – Netzwerk & Hardware",
    "Aufgabe 2 – Sicherheit & Projektmanagement",
    "Aufgabe 3 – Software & Datenbanken",
    "Aufgabe 4 – Wirtschaft & Administration",
  ];
  const blockTopics = [
    ["netzwerk", "hardware"],
    ["sicherheit", "projektmanagement"],
    ["programmierung", "datenbanken"],
    ["wirtschaft", "systemadmin", "qualitaet", "bwl"],
  ];

  return blockTitles.map((title, i) => {
    const relevant = allQ.filter(q => blockTopics[i].includes(q.topicId));
    const picked = shuffle(relevant).slice(0, Math.min(7, relevant.length));
    return { title, questions: picked };
  });
}

const EXAM_MINUTES = 90;

type Phase = "intro" | "running" | "review" | "done";

interface AnswerMap {
  [questionId: string]: {
    type: "mc" | "open";
    selected?: string;   // for MC
    text?: string;       // for open
    selfCorrect?: boolean; // for open
  };
}

function Lightbulb({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="9" y1="18" x2="15" y2="18"/><line x1="10" y1="22" x2="14" y2="22"/>
      <path d="M15.09 14c.18-.98.65-1.74 1.41-2.5A4.65 4.65 0 0 0 18 8 6 6 0 0 0 6 8c0 1 .23 2.23 1.5 3.5A4.61 4.61 0 0 1 8.91 14"/>
    </svg>
  );
}

export default function ExamPage() {
  const [phase, setPhase] = useState<Phase>("intro");
  const [blocks, setBlocks] = useState<{ title: string; questions: Question[] }[]>([]);
  const [currentBlock, setCurrentBlock] = useState(0);
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState<AnswerMap>({});
  const [secondsLeft, setSecondsLeft] = useState(EXAM_MINUTES * 60);
  const [revealedQ, setRevealedQ] = useState<Set<string>>(new Set());
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const saveMutation = useMutation({
    mutationFn: (data: { topicId: string; questionId: string; correct: boolean; attempts: number }) =>
      apiRequest("POST", "/api/progress", data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["/api/progress"] }),
  });

  // Timer
  useEffect(() => {
    if (phase !== "running") return;
    timerRef.current = setInterval(() => {
      setSecondsLeft(s => {
        if (s <= 1) {
          clearInterval(timerRef.current!);
          setPhase("review");
          return 0;
        }
        return s - 1;
      });
    }, 1000);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [phase]);

  function startExam() {
    const allQ = getAllQuestions();
    const b = buildExamBlocks(allQ);
    setBlocks(b);
    setCurrentBlock(0);
    setCurrentQ(0);
    setAnswers({});
    setSecondsLeft(EXAM_MINUTES * 60);
    setRevealedQ(new Set());
    setPhase("running");
  }

  function submitExam() {
    if (timerRef.current) clearInterval(timerRef.current);
    // Save all answers to progress
    blocks.forEach(block => {
      block.questions.forEach(q => {
        const a = answers[q.id];
        if (!a) return;
        let correct = false;
        if (a.type === "mc" && a.selected) {
          correct = q.answers?.find(ans => ans.id === a.selected)?.correct ?? false;
        } else if (a.type === "open") {
          correct = a.selfCorrect ?? false;
        }
        saveMutation.mutate({ topicId: q.topicId, questionId: q.id, correct, attempts: 1 });
      });
    });
    setPhase("done");
  }

  function formatTime(s: number) {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m}:${sec.toString().padStart(2, "0")}`;
  }

  const allQuestions = blocks.flatMap(b => b.questions);
  const totalQ = allQuestions.length;
  const answeredCount = Object.keys(answers).length;
  const timePct = (secondsLeft / (EXAM_MINUTES * 60)) * 100;
  const isLowTime = secondsLeft < 600; // < 10 min

  // Current question
  const block = blocks[currentBlock];
  const q = block?.questions[currentQ];

  const flatIndex = blocks.slice(0, currentBlock).reduce((s, b) => s + b.questions.length, 0) + currentQ;

  function goNext() {
    if (currentQ + 1 < block.questions.length) {
      setCurrentQ(c => c + 1);
    } else if (currentBlock + 1 < blocks.length) {
      setCurrentBlock(b => b + 1);
      setCurrentQ(0);
    }
  }

  function goPrev() {
    if (currentQ > 0) {
      setCurrentQ(c => c - 1);
    } else if (currentBlock > 0) {
      setCurrentBlock(b => b - 1);
      setCurrentQ(blocks[currentBlock - 1].questions.length - 1);
    }
  }

  // ── INTRO ─────────────────────────────────────────────────────────────────
  if (phase === "intro") {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="max-w-lg w-full animate-fadeInUp">
          <Link href="/">
            <button className="flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground mb-6 transition-colors">
              <ArrowLeft className="w-3.5 h-3.5" /> Zurück
            </button>
          </Link>

          <div className="text-center mb-8">
            <div className="text-5xl mb-3">📝</div>
            <h1 className="text-2xl font-bold text-foreground mb-2">Prüfungssimulation</h1>
            <p className="text-muted-foreground text-sm">Simuliere eine echte IHK AP1 Zwischenprüfung</p>
          </div>

          <div className="bg-card border border-border rounded-2xl p-6 mb-6 space-y-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-primary flex-shrink-0" />
                <span><span className="font-semibold">90 Minuten</span> Bearbeitungszeit</span>
              </div>
              <div className="flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-primary flex-shrink-0" />
                <span><span className="font-semibold">4 Aufgabenblöcke</span></span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-primary flex-shrink-0" />
                <span><span className="font-semibold">~28 Fragen</span> gemischt</span>
              </div>
              <div className="flex items-center gap-2">
                <Trophy className="w-4 h-4 text-primary flex-shrink-0" />
                <span><span className="font-semibold">Bestehensgrenze: 50%</span></span>
              </div>
            </div>

            <div className="border-t border-border pt-4">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Aufgabenblöcke</p>
              <div className="space-y-1.5">
                {["Netzwerk & Hardware", "Sicherheit & Projektmanagement", "Software & Datenbanken", "Wirtschaft & Administration"].map((b, i) => (
                  <div key={i} className="flex items-center gap-2 text-xs text-foreground/80">
                    <span className="w-5 h-5 rounded-full bg-primary/20 text-primary text-xs flex items-center justify-center font-bold flex-shrink-0">
                      {i + 1}
                    </span>
                    {b}
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-3">
              <div className="flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 text-yellow-400 flex-shrink-0 mt-0.5" />
                <p className="text-xs text-yellow-300">
                  Der Timer läuft nach dem Start ununterbrechbar. Alle Antworten werden am Ende ausgewertet.
                </p>
              </div>
            </div>
          </div>

          <button
            onClick={startExam}
            className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl bg-primary text-primary-foreground font-semibold text-sm hover:bg-primary/90 transition-all hover:scale-[1.01] active:scale-95"
          >
            <Clock className="w-4 h-4" />
            Prüfung starten
          </button>
        </div>
      </div>
    );
  }

  // ── DONE ──────────────────────────────────────────────────────────────────
  if (phase === "done") {
    let totalCorrect = 0;
    let totalAnswered = 0;

    const blockResults = blocks.map(block => {
      let blockCorrect = 0;
      let blockAnswered = 0;
      block.questions.forEach(q => {
        const a = answers[q.id];
        if (!a) return;
        blockAnswered++;
        let correct = false;
        if (a.type === "mc" && a.selected) {
          correct = q.answers?.find(ans => ans.id === a.selected)?.correct ?? false;
        } else if (a.type === "open") {
          correct = a.selfCorrect ?? false;
        }
        if (correct) blockCorrect++;
      });
      totalCorrect += blockCorrect;
      totalAnswered += blockAnswered;
      return { title: block.title, correct: blockCorrect, total: block.questions.length };
    });

    const pct = totalAnswered > 0 ? Math.round((totalCorrect / totalAnswered) * 100) : 0;
    const passed = pct >= 50;

    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="max-w-lg w-full animate-fadeInUp">
          <div className="text-center mb-6">
            <div className="text-6xl mb-3">{passed ? "🎉" : "📚"}</div>
            <h1 className="text-2xl font-bold mb-1">{passed ? "Bestanden!" : "Nicht bestanden"}</h1>
            <p className="text-muted-foreground text-sm">
              {passed ? "Gute Leistung — weiter so!" : "Nicht aufgeben, weiter üben!"}
            </p>
          </div>

          <div className="bg-card border border-border rounded-2xl p-6 mb-4">
            <div className="text-4xl font-bold text-primary text-center mb-1">{pct}%</div>
            <div className="text-sm text-muted-foreground text-center mb-4">
              {totalCorrect} von {totalAnswered} Fragen richtig
            </div>
            <div className="progress-bar mb-6">
              <div
                className="progress-fill"
                style={{
                  width: `${pct}%`,
                  background: passed ? "hsl(142 71% 45%)" : "hsl(0 84% 60%)"
                }}
              />
            </div>

            {/* Block breakdown */}
            <div className="space-y-2">
              {blockResults.map((br, i) => {
                const bPct = br.total > 0 ? Math.round((br.correct / br.total) * 100) : 0;
                return (
                  <div key={i} className="flex items-center gap-3 text-sm">
                    <span className="w-5 h-5 rounded-full bg-secondary flex items-center justify-center text-xs font-bold flex-shrink-0">
                      {i + 1}
                    </span>
                    <span className="flex-1 text-xs text-muted-foreground truncate">
                      {br.title.replace("Aufgabe " + (i+1) + " – ", "")}
                    </span>
                    <span className={`text-xs font-semibold ${bPct >= 50 ? "text-green-400" : "text-red-400"}`}>
                      {br.correct}/{br.total}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => setPhase("intro")}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-primary text-primary-foreground font-medium text-sm hover:bg-primary/90 transition-colors"
            >
              Nochmal versuchen
            </button>
            <Link href="/" className="flex-1">
              <button className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-secondary text-secondary-foreground font-medium text-sm hover:bg-secondary/80 transition-colors">
                Zurück zur Übersicht
              </button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // ── RUNNING ───────────────────────────────────────────────────────────────
  if (!q) return null;

  const currentAnswer = answers[q.id];
  const isRevealed = revealedQ.has(q.id);
  const isOpenType = q.type === "open" || q.type === "calculation" || q.type === "table-fill";

  return (
    <div className="min-h-screen bg-background">
      {/* Exam Header */}
      <header className="border-b border-border sticky top-0 z-10 bg-background/95 backdrop-blur">
        <div className="max-w-2xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between mb-2">
            <div className="text-xs text-muted-foreground">
              <span className="font-semibold text-foreground">{block.title}</span>
            </div>
            {/* Timer */}
            <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-bold border ${
              isLowTime
                ? "bg-red-500/20 border-red-500/40 text-red-400 animate-pulse"
                : "bg-card border-border text-foreground"
            }`}>
              <Clock className="w-3 h-3" />
              {formatTime(secondsLeft)}
            </div>
          </div>

          {/* Progress */}
          <div className="flex items-center gap-2">
            <div className="flex-1 progress-bar">
              <div className="progress-fill" style={{width: `${((flatIndex + 1) / totalQ) * 100}%`}} />
            </div>
            <span className="text-xs text-muted-foreground flex-shrink-0">
              {flatIndex + 1}/{totalQ}
            </span>
            <span className="text-xs text-muted-foreground flex-shrink-0">
              ({answeredCount} beantwortet)
            </span>
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
            <span className="text-xs text-muted-foreground">
              {topics.find(t => t.id === q.topicId)?.title ?? q.topicId}
            </span>
            {isOpenType && (
              <span className="ml-auto flex items-center gap-1 text-xs px-2 py-0.5 rounded-full bg-blue-500/15 text-blue-400 border border-blue-500/20">
                <PenLine className="w-3 h-3" />
                {q.type === "calculation" ? "Rechenaufgabe" : "Schreibaufgabe"}
              </span>
            )}
          </div>

          {/* Question */}
          <div className="bg-card border border-border rounded-2xl p-5 mb-4">
            <p className="text-foreground font-medium leading-relaxed whitespace-pre-line">{q.question}</p>
          </div>

          {/* MC Answers */}
          {q.type === "multiple-choice" && q.answers && (
            <div className="space-y-2.5 mb-4">
              {q.answers.map(ans => {
                const sel = currentAnswer?.selected;
                let state = "idle";
                if (sel) {
                  if (ans.id === sel) state = "selected";
                }
                return (
                  <button
                    key={ans.id}
                    onClick={() => setAnswers(prev => ({ ...prev, [q.id]: { type: "mc", selected: ans.id } }))}
                    className={`w-full flex items-start gap-3 p-4 rounded-xl border text-left transition-all ${
                      state === "selected"
                        ? "bg-primary/15 border-primary/60 scale-[1.01]"
                        : "bg-card border-border hover:border-primary/50 cursor-pointer hover:scale-[1.01]"
                    }`}
                  >
                    <span className={`w-6 h-6 rounded-full border flex-shrink-0 flex items-center justify-center text-xs font-bold mt-0.5 ${
                      state === "selected" ? "border-primary text-primary bg-primary/20" : "border-border text-muted-foreground"
                    }`}>
                      {ans.id.toUpperCase()}
                    </span>
                    <span className="text-sm leading-snug">{ans.text}</span>
                    {state === "selected" && <CheckCircle2 className="w-4 h-4 text-primary flex-shrink-0 mt-0.5 ml-auto" />}
                  </button>
                );
              })}
            </div>
          )}

          {/* Open / Calculation */}
          {isOpenType && (
            <div className="space-y-3 mb-4">
              {!isRevealed ? (
                <>
                  <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block mb-1.5">
                    Deine Antwort
                  </label>
                  <textarea
                    value={currentAnswer?.text ?? ""}
                    onChange={e => setAnswers(prev => ({ ...prev, [q.id]: { type: "open", text: e.target.value } }))}
                    placeholder="Schreibe deine Lösung hier..."
                    rows={4}
                    className="w-full bg-card border border-border rounded-xl p-4 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/60 resize-y transition-colors"
                  />
                  <button
                    onClick={() => setRevealedQ(prev => new Set([...prev, q.id]))}
                    className="text-xs text-primary hover:text-primary/80 underline transition-colors"
                  >
                    Musterlösung anzeigen (zum Selbstvergleich)
                  </button>
                </>
              ) : (
                <div className="space-y-3 animate-fadeInUp">
                  {currentAnswer?.text && (
                    <div className="bg-card border border-border rounded-xl p-4">
                      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Deine Antwort</p>
                      <p className="text-sm text-foreground/80 whitespace-pre-line">{currentAnswer.text}</p>
                    </div>
                  )}
                  <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <CheckCircle2 className="w-4 h-4 text-green-400" />
                      <p className="text-xs font-semibold text-green-400 uppercase tracking-wider">Musterlösung</p>
                    </div>
                    <p className="text-sm text-foreground/90 whitespace-pre-line">{(q as any).modelAnswer}</p>
                  </div>
                  {(q as any).keyPoints?.length > 0 && (
                    <div className="bg-card border border-border rounded-xl p-4">
                      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Bewertungspunkte</p>
                      <ul className="space-y-1">
                        {((q as any).keyPoints as string[]).map((p: string, i: number) => (
                          <li key={i} className="flex items-start gap-2 text-sm">
                            <span className="text-green-400 flex-shrink-0">✓</span>
                            <span>{p}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {/* Self-assessment for open questions */}
                  {currentAnswer?.selfCorrect === undefined && (
                    <div className="bg-card border border-border rounded-xl p-4">
                      <p className="text-sm font-medium mb-3">Hatte ich das richtig?</p>
                      <div className="flex gap-3">
                        <button
                          onClick={() => setAnswers(prev => ({ ...prev, [q.id]: { ...prev[q.id], type: "open", selfCorrect: true } }))}
                          className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl bg-green-500/20 border border-green-500/40 text-green-400 text-xs font-medium hover:bg-green-500/30 transition-colors"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" /> Ja
                        </button>
                        <button
                          onClick={() => setAnswers(prev => ({ ...prev, [q.id]: { ...prev[q.id], type: "open", selfCorrect: false } }))}
                          className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl bg-red-500/20 border border-red-500/40 text-red-400 text-xs font-medium hover:bg-red-500/30 transition-colors"
                        >
                          <XCircle className="w-3.5 h-3.5" /> Nein
                        </button>
                      </div>
                    </div>
                  )}
                  {currentAnswer?.selfCorrect !== undefined && (
                    <div className={`flex items-center gap-2 p-3 rounded-xl text-xs font-medium ${currentAnswer.selfCorrect ? "bg-green-500/15 text-green-400 border border-green-500/30" : "bg-red-500/15 text-red-400 border border-red-500/30"}`}>
                      {currentAnswer.selfCorrect ? <><CheckCircle2 className="w-3.5 h-3.5" /> Markiert als richtig</> : <><XCircle className="w-3.5 h-3.5" /> Markiert als falsch</>}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Navigation */}
          <div className="flex gap-3 mt-6">
            <button
              onClick={goPrev}
              disabled={flatIndex === 0}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-secondary text-secondary-foreground text-sm font-medium hover:bg-secondary/80 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="w-4 h-4" /> Zurück
            </button>

            {flatIndex < totalQ - 1 ? (
              <button
                onClick={goNext}
                className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors"
              >
                Weiter <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={submitExam}
                className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-green-600 text-white text-sm font-semibold hover:bg-green-500 transition-colors"
              >
                <Trophy className="w-4 h-4" /> Prüfung abgeben
              </button>
            )}
          </div>

          {/* Submit from anywhere */}
          {flatIndex < totalQ - 1 && (
            <button
              onClick={submitExam}
              className="mt-3 w-full text-xs text-muted-foreground hover:text-destructive transition-colors text-center"
            >
              Prüfung jetzt abgeben ({answeredCount}/{totalQ} beantwortet)
            </button>
          )}
        </div>
      </main>
    </div>
  );
}
