import { Link } from "wouter";
import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import {
  ArrowLeft, Plus, Trash2, Save, X, Pencil, CheckCircle,
  BookOpen, Code, Calculator, ChevronDown, ChevronUp,
  HelpCircle, List, Tag, Star
} from "lucide-react";

// ── Types ────────────────────────────────────────────────────────────────────
interface Answer {
  text: string;
  correct: boolean;
}

interface CustomQuestion {
  id: string;
  type: "multiple-choice" | "open" | "calculation";
  topic: string;
  difficulty: "leicht" | "mittel" | "schwer";
  points: number;
  question: string;
  answers?: Answer[];
  modelAnswer?: string;
  keyPoints?: string[];
  createdAt: string;
}

// ── Constants ─────────────────────────────────────────────────────────────────
const TOPICS = [
  "Netzwerk", "Hardware", "Sicherheit", "Projektmanagement",
  "Programmierung", "Datenbanken", "Wirtschaft", "Systemadministration",
  "Qualitätssicherung", "BWL"
];

const typeConfig = {
  "multiple-choice": {
    label: "Multiple Choice",
    icon: List,
    color: "blue",
    desc: "Antwortoptionen mit einer oder mehreren richtigen Antworten"
  },
  "open": {
    label: "Schreibaufgabe",
    icon: BookOpen,
    color: "purple",
    desc: "Freitext-Antwort mit Musterlösung und Schlüsselpunkten"
  },
  "calculation": {
    label: "Rechenaufgabe",
    icon: Calculator,
    color: "green",
    desc: "Berechnungsaufgabe mit Lösungsweg und Ergebnis"
  },
};

const diffConfig = {
  leicht:  { label: "Leicht",  color: "text-green-400 bg-green-500/10 border-green-500/30" },
  mittel:  { label: "Mittel",  color: "text-yellow-400 bg-yellow-500/10 border-yellow-500/30" },
  schwer:  { label: "Schwer",  color: "text-red-400 bg-red-500/10 border-red-500/30" },
};

const colorText: Record<string, string> = {
  blue: "text-blue-400", purple: "text-purple-400", green: "text-green-400",
};
const colorBg: Record<string, string> = {
  blue: "bg-blue-500/10", purple: "bg-purple-500/10", green: "bg-green-500/10",
};
const colorBorder: Record<string, string> = {
  blue: "border-blue-500/30", purple: "border-purple-500/30", green: "border-green-500/30",
};

// ── Question Form ─────────────────────────────────────────────────────────────
interface QuestionFormProps {
  question?: CustomQuestion | null;
  onClose: () => void;
  onSaved: () => void;
}

function QuestionForm({ question, onClose, onSaved }: QuestionFormProps) {
  const isNew = !question;
  const [type, setType] = useState<CustomQuestion["type"]>(question?.type ?? "multiple-choice");
  const [topic, setTopic] = useState(question?.topic ?? "Netzwerk");
  const [difficulty, setDifficulty] = useState<CustomQuestion["difficulty"]>(question?.difficulty ?? "mittel");
  const [points, setPoints] = useState(question?.points ?? 10);
  const [questionText, setQuestionText] = useState(question?.question ?? "");
  const [answers, setAnswers] = useState<Answer[]>(
    question?.answers ?? [
      { text: "", correct: true },
      { text: "", correct: false },
      { text: "", correct: false },
      { text: "", correct: false },
    ]
  );
  const [modelAnswer, setModelAnswer] = useState(question?.modelAnswer ?? "");
  const [keyPointsInput, setKeyPointsInput] = useState((question?.keyPoints ?? []).join("\n"));

  const saveMutation = useMutation({
    mutationFn: async (data: Partial<CustomQuestion>) => {
      if (isNew) return apiRequest("POST", "/api/questions", data);
      return apiRequest("PUT", `/api/questions/${question!.id}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/questions"] });
      onSaved();
    },
  });

  function handleSave() {
    if (!questionText.trim()) return;
    const keyPoints = keyPointsInput.split("\n").map(s => s.trim()).filter(Boolean);
    const data: Partial<CustomQuestion> = {
      type, topic, difficulty, points, question: questionText.trim(),
      modelAnswer: modelAnswer.trim() || undefined,
      keyPoints: keyPoints.length > 0 ? keyPoints : undefined,
      answers: type === "multiple-choice" ? answers.filter(a => a.text.trim()) : undefined,
    };
    saveMutation.mutate(data);
  }

  function addAnswer() {
    setAnswers(a => [...a, { text: "", correct: false }]);
  }

  function removeAnswer(i: number) {
    setAnswers(a => a.filter((_, idx) => idx !== i));
  }

  function updateAnswer(i: number, field: keyof Answer, value: string | boolean) {
    setAnswers(a => a.map((ans, idx) =>
      idx === i ? { ...ans, [field]: value } : ans
    ));
  }

  return (
    <div className="fixed inset-0 z-50 bg-background/90 backdrop-blur flex items-start justify-center overflow-y-auto py-6 px-4">
      <div className="w-full max-w-2xl bg-card border border-border rounded-2xl shadow-2xl flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-border">
          <h2 className="text-sm font-bold">
            {isNew ? "Neue Frage erstellen" : "Frage bearbeiten"}
          </h2>
          <div className="flex items-center gap-2">
            <button
              onClick={handleSave}
              disabled={saveMutation.isPending || !questionText.trim()}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs bg-primary text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-50"
            >
              <Save className="w-3.5 h-3.5" />
              {saveMutation.isPending ? "Speichern..." : "Speichern"}
            </button>
            <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-secondary transition-colors">
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="p-5 flex flex-col gap-4">
          {/* Type selector */}
          <div>
            <label className="text-xs text-muted-foreground mb-2 block">Fragetyp</label>
            <div className="grid grid-cols-3 gap-2">
              {(Object.entries(typeConfig) as [CustomQuestion["type"], typeof typeConfig[keyof typeof typeConfig]][]).map(([key, cfg]) => {
                const Icon = cfg.icon;
                return (
                  <button
                    key={key}
                    onClick={() => setType(key)}
                    className={`flex flex-col items-center gap-1.5 p-3 rounded-xl border text-xs transition-all ${
                      type === key
                        ? `${colorBg[cfg.color]} ${colorBorder[cfg.color]} ${colorText[cfg.color]}`
                        : "bg-secondary border-border text-muted-foreground hover:text-foreground hover:border-primary/30"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="font-medium">{cfg.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Meta row */}
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Thema</label>
              <select
                value={topic}
                onChange={e => setTopic(e.target.value)}
                className="w-full bg-secondary border border-border rounded-lg px-2.5 py-2 text-xs text-foreground focus:outline-none focus:border-primary/60"
              >
                {TOPICS.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Schwierigkeit</label>
              <select
                value={difficulty}
                onChange={e => setDifficulty(e.target.value as CustomQuestion["difficulty"])}
                className="w-full bg-secondary border border-border rounded-lg px-2.5 py-2 text-xs text-foreground focus:outline-none focus:border-primary/60"
              >
                <option value="leicht">Leicht</option>
                <option value="mittel">Mittel</option>
                <option value="schwer">Schwer</option>
              </select>
            </div>
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Punkte</label>
              <input
                type="number"
                min={1}
                max={100}
                value={points}
                onChange={e => setPoints(Number(e.target.value))}
                className="w-full bg-secondary border border-border rounded-lg px-2.5 py-2 text-xs text-foreground focus:outline-none focus:border-primary/60"
              />
            </div>
          </div>

          {/* Question text */}
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">Fragetext</label>
            <textarea
              value={questionText}
              onChange={e => setQuestionText(e.target.value)}
              placeholder="Wie viele nutzbare Hosts hat ein /26-Subnetz?"
              rows={3}
              className="w-full bg-secondary border border-border rounded-xl px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/60 resize-y"
            />
          </div>

          {/* Multiple Choice answers */}
          {type === "multiple-choice" && (
            <div>
              <label className="text-xs text-muted-foreground mb-2 block">Antwortoptionen</label>
              <div className="space-y-2">
                {answers.map((ans, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <button
                      onClick={() => updateAnswer(i, "correct", !ans.correct)}
                      className={`flex-shrink-0 p-1 rounded-full transition-colors ${
                        ans.correct ? "text-green-400 bg-green-500/15" : "text-muted-foreground bg-secondary hover:bg-secondary/80"
                      }`}
                      title={ans.correct ? "Richtige Antwort" : "Als richtig markieren"}
                    >
                      <CheckCircle className="w-4 h-4" />
                    </button>
                    <input
                      type="text"
                      value={ans.text}
                      onChange={e => updateAnswer(i, "text", e.target.value)}
                      placeholder={`Antwort ${i + 1}...`}
                      className="flex-1 bg-secondary border border-border rounded-lg px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/60"
                    />
                    <button
                      onClick={() => removeAnswer(i)}
                      disabled={answers.length <= 2}
                      className="p-1.5 rounded-lg text-muted-foreground hover:text-red-400 hover:bg-red-500/10 transition-colors disabled:opacity-30"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
              <button
                onClick={addAnswer}
                className="mt-2 flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs text-muted-foreground hover:text-foreground bg-secondary hover:bg-secondary/80 transition-colors"
              >
                <Plus className="w-3 h-3" /> Antwort hinzufügen
              </button>
              <p className="text-xs text-muted-foreground mt-1.5">
                <CheckCircle className="w-3 h-3 inline mr-1 text-green-400" />
                Grün markierte Antworten sind richtig
              </p>
            </div>
          )}

          {/* Open / Calculation: Musterlösung */}
          {(type === "open" || type === "calculation") && (
            <>
              <div>
                <label className="text-xs text-muted-foreground mb-1 block">Musterlösung</label>
                <textarea
                  value={modelAnswer}
                  onChange={e => setModelAnswer(e.target.value)}
                  placeholder={type === "calculation"
                    ? "Lösungsweg und Ergebnis hier beschreiben...\n\nBeispiel: Nutzbare Hosts = 2^(32-26) - 2 = 62"
                    : "Ideale Antwort hier beschreiben..."
                  }
                  rows={4}
                  className="w-full bg-secondary border border-border rounded-xl px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/60 resize-y font-mono"
                />
              </div>
              <div>
                <label className="text-xs text-muted-foreground mb-1 block">
                  Schlüsselpunkte (einer pro Zeile)
                </label>
                <textarea
                  value={keyPointsInput}
                  onChange={e => setKeyPointsInput(e.target.value)}
                  placeholder={"Schlüsselpunkt 1\nSchlüsselpunkt 2\nSchlüsselpunkt 3"}
                  rows={3}
                  className="w-full bg-secondary border border-border rounded-xl px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/60 resize-y"
                />
                <p className="text-xs text-muted-foreground mt-1">Diese Punkte werden beim Selbstcheck angezeigt</p>
              </div>
            </>
          )}

          {saveMutation.isError && (
            <p className="text-xs text-red-400">Fehler beim Speichern. Bitte erneut versuchen.</p>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Question Card ─────────────────────────────────────────────────────────────
function QuestionCard({
  question, onEdit, onDelete
}: {
  question: CustomQuestion;
  onEdit: () => void;
  onDelete: () => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const cfg = typeConfig[question.type];
  const Icon = cfg.icon;
  const diff = diffConfig[question.difficulty];

  return (
    <div className="bg-card border border-border rounded-2xl overflow-hidden transition-all hover:border-primary/30">
      <div className="p-4">
        {/* Header row */}
        <div className="flex items-start gap-3 mb-2">
          <div className={`p-2 rounded-lg ${colorBg[cfg.color]} flex-shrink-0 mt-0.5`}>
            <Icon className={`w-3.5 h-3.5 ${colorText[cfg.color]}`} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <span className={`text-xs px-2 py-0.5 rounded-full border font-medium ${colorBg[cfg.color]} ${colorBorder[cfg.color]} ${colorText[cfg.color]}`}>
                {cfg.label}
              </span>
              <span className={`text-xs px-2 py-0.5 rounded-full border ${diff.color}`}>
                {diff.label}
              </span>
              <span className="text-xs text-muted-foreground bg-secondary px-2 py-0.5 rounded-full">
                {question.topic}
              </span>
              <span className="text-xs text-muted-foreground ml-auto flex items-center gap-1">
                <Star className="w-3 h-3" />{question.points} Pkt.
              </span>
            </div>
            <p className="text-sm text-foreground leading-relaxed">{question.question}</p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between mt-3">
          <button
            onClick={() => setExpanded(e => !e)}
            className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            {expanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
            {expanded ? "Weniger" : "Details anzeigen"}
          </button>
          <div className="flex items-center gap-1.5">
            <button
              onClick={onEdit}
              className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs bg-secondary hover:bg-secondary/80 text-muted-foreground hover:text-foreground transition-colors"
            >
              <Pencil className="w-3 h-3" /> Bearbeiten
            </button>
            {confirmDelete ? (
              <div className="flex items-center gap-1">
                <button
                  onClick={onDelete}
                  className="px-2.5 py-1 rounded-lg text-xs bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-colors"
                >
                  Löschen
                </button>
                <button
                  onClick={() => setConfirmDelete(false)}
                  className="px-2 py-1 rounded-lg text-xs bg-secondary text-muted-foreground transition-colors"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => setConfirmDelete(true)}
                className="p-1.5 rounded-lg text-muted-foreground hover:text-red-400 hover:bg-red-500/10 transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Expanded details */}
        {expanded && (
          <div className="mt-3 pt-3 border-t border-border space-y-2 animate-fadeInUp">
            {question.type === "multiple-choice" && question.answers && (
              <div className="space-y-1">
                <p className="text-xs font-medium text-muted-foreground">Antworten:</p>
                {question.answers.map((a, i) => (
                  <div key={i} className={`flex items-center gap-2 text-xs px-3 py-1.5 rounded-lg ${
                    a.correct ? "bg-green-500/10 text-green-300" : "bg-secondary/50 text-muted-foreground"
                  }`}>
                    <CheckCircle className={`w-3 h-3 flex-shrink-0 ${a.correct ? "text-green-400" : "opacity-30"}`} />
                    {a.text}
                  </div>
                ))}
              </div>
            )}
            {question.modelAnswer && (
              <div>
                <p className="text-xs font-medium text-muted-foreground mb-1">Musterlösung:</p>
                <div className="bg-secondary/50 rounded-lg px-3 py-2 text-xs text-foreground/85 whitespace-pre-wrap font-mono">
                  {question.modelAnswer}
                </div>
              </div>
            )}
            {question.keyPoints && question.keyPoints.length > 0 && (
              <div>
                <p className="text-xs font-medium text-muted-foreground mb-1">Schlüsselpunkte:</p>
                <ul className="space-y-0.5">
                  {question.keyPoints.map((kp, i) => (
                    <li key={i} className="flex items-start gap-1.5 text-xs text-foreground/80">
                      <span className="text-primary mt-0.5">•</span>
                      {kp}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function FragenEditorPage() {
  const [showForm, setShowForm] = useState(false);
  const [editingQ, setEditingQ] = useState<CustomQuestion | null>(null);
  const [filterType, setFilterType] = useState<string>("alle");
  const [filterTopic, setFilterTopic] = useState<string>("alle");

  const { data: questions = [], isLoading } = useQuery<CustomQuestion[]>({
    queryKey: ["/api/questions"],
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => apiRequest("DELETE", `/api/questions/${id}`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["/api/questions"] }),
  });

  const filtered = questions.filter(q => {
    const matchType = filterType === "alle" || q.type === filterType;
    const matchTopic = filterTopic === "alle" || q.topic === filterTopic;
    return matchType && matchTopic;
  });

  const usedTopics = ["alle", ...Array.from(new Set(questions.map(q => q.topic))).sort()];

  return (
    <div className="min-h-screen bg-background">
      {/* Form Modal */}
      {(showForm || editingQ !== null) && (
        <QuestionForm
          question={editingQ}
          onClose={() => { setShowForm(false); setEditingQ(null); }}
          onSaved={() => { setShowForm(false); setEditingQ(null); }}
        />
      )}

      <header className="border-b border-border sticky top-0 z-10 bg-background/95 backdrop-blur">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center gap-3">
          <Link href="/">
            <button className="p-1.5 rounded-lg hover:bg-secondary transition-colors">
              <ArrowLeft className="w-4 h-4" />
            </button>
          </Link>
          <div className="flex items-center gap-2 flex-1">
            <div className="w-6 h-6 rounded bg-primary/20 flex items-center justify-center flex-shrink-0">
              <HelpCircle className="w-3.5 h-3.5 text-primary" />
            </div>
            <div>
              <h1 className="text-sm font-bold leading-none">Fragen-Editor</h1>
              <p className="text-xs text-muted-foreground">{questions.length} eigene Fragen</p>
            </div>
          </div>
          <button
            onClick={() => { setEditingQ(null); setShowForm(true); }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-primary/20 border border-primary/40 text-primary hover:bg-primary/30 transition-colors"
            data-testid="btn-new-question"
          >
            <Plus className="w-3.5 h-3.5" /> Neue Frage
          </button>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-6">

        {/* Info box */}
        <div className="bg-primary/8 border border-primary/20 rounded-xl p-4 mb-6 animate-fadeInUp">
          <p className="text-sm text-foreground/80">
            Hier kannst du eigene Prüfungsfragen erstellen. Alle Fragen werden dauerhaft gespeichert und können später im Quiz verwendet werden.
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-2 mb-4 animate-fadeInUp">
          <div className="flex items-center gap-1.5 flex-wrap">
            {["alle", "multiple-choice", "open", "calculation"].map(t => (
              <button
                key={t}
                onClick={() => setFilterType(t)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
                  filterType === t
                    ? "bg-primary/20 border-primary/50 text-primary"
                    : "bg-card border-border text-muted-foreground hover:text-foreground hover:border-primary/30"
                }`}
              >
                {t === "alle" ? "Alle Typen" :
                 t === "multiple-choice" ? "Multiple Choice" :
                 t === "open" ? "Schreibaufgaben" : "Rechenaufgaben"}
              </button>
            ))}
          </div>
        </div>

        {usedTopics.length > 1 && (
          <div className="flex flex-wrap gap-1.5 mb-4 animate-fadeInUp" style={{ animationDelay: "0.05s" }}>
            {usedTopics.map(t => (
              <button
                key={t}
                onClick={() => setFilterTopic(t)}
                className={`px-2.5 py-1 rounded-full text-xs border transition-all ${
                  filterTopic === t
                    ? "bg-secondary border-primary/50 text-foreground"
                    : "bg-card border-border text-muted-foreground hover:text-foreground hover:border-primary/30"
                }`}
              >
                {t === "alle" ? "Alle Themen" : t}
              </button>
            ))}
          </div>
        )}

        {/* Stats */}
        {questions.length > 0 && (
          <div className="grid grid-cols-3 gap-3 mb-6 animate-fadeInUp" style={{ animationDelay: "0.08s" }}>
            {(["multiple-choice", "open", "calculation"] as const).map(t => {
              const cfg = typeConfig[t];
              const Icon = cfg.icon;
              const count = questions.filter(q => q.type === t).length;
              return (
                <div key={t} className={`bg-card border border-border rounded-xl p-3 flex items-center gap-3`}>
                  <div className={`p-2 rounded-lg ${colorBg[cfg.color]}`}>
                    <Icon className={`w-4 h-4 ${colorText[cfg.color]}`} />
                  </div>
                  <div>
                    <p className="text-lg font-bold text-foreground">{count}</p>
                    <p className="text-xs text-muted-foreground">{cfg.label}</p>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Loading */}
        {isLoading && (
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-card border border-border rounded-2xl p-4 animate-pulse h-24" />
            ))}
          </div>
        )}

        {/* Empty state */}
        {!isLoading && questions.length === 0 && (
          <div className="text-center py-16 text-muted-foreground text-sm animate-fadeInUp">
            <HelpCircle className="w-10 h-10 mx-auto mb-3 opacity-30" />
            <p className="font-medium mb-1">Noch keine eigenen Fragen</p>
            <p className="text-xs mb-4">Erstelle deine erste Frage für die Prüfungsvorbereitung</p>
            <button
              onClick={() => { setEditingQ(null); setShowForm(true); }}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm bg-primary/20 text-primary hover:bg-primary/30 transition-colors"
            >
              <Plus className="w-4 h-4" /> Erste Frage erstellen
            </button>
          </div>
        )}

        {/* Questions list */}
        {!isLoading && filtered.length > 0 && (
          <div className="space-y-3">
            <p className="text-xs text-muted-foreground mb-2">{filtered.length} Fragen gefunden</p>
            {filtered.map(q => (
              <QuestionCard
                key={q.id}
                question={q}
                onEdit={() => { setEditingQ(q); setShowForm(false); }}
                onDelete={() => deleteMutation.mutate(q.id)}
              />
            ))}
          </div>
        )}

        {!isLoading && questions.length > 0 && filtered.length === 0 && (
          <div className="text-center py-12 text-muted-foreground text-sm">
            Keine Fragen für diesen Filter gefunden
          </div>
        )}
      </main>
    </div>
  );
}
