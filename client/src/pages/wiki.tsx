import { Link } from "wouter";
import { useState, useMemo, useEffect, useRef } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { marked } from "marked";
import {
  ArrowLeft, BookOpen, Search, ChevronRight, Network, Cpu,
  Shield, GitBranch, Code, Database, Briefcase, Server,
  CheckSquare, TrendingUp, FileText, ListChecks, BookMarked,
  Plus, Pencil, Trash2, Save, X, Eye, EyeOff, Tag
} from "lucide-react";

// ── Configure marked ─────────────────────────────────────────────────────────
marked.setOptions({ breaks: true, gfm: true });

// ── Types ────────────────────────────────────────────────────────────────────
interface WikiArticle {
  id: string;
  title: string;
  category: string;
  type: "article" | "cheatsheet" | "howto";
  tags: string[];
  content: string; // Markdown
}

// ── Category & type config ────────────────────────────────────────────────────
const categoryConfig: Record<string, { icon: React.FC<{ className?: string }>; color: string }> = {
  Netzwerk:          { icon: Network,     color: "blue"   },
  Sicherheit:        { icon: Shield,      color: "red"    },
  Projektmanagement: { icon: GitBranch,   color: "purple" },
  Datenbanken:       { icon: Database,    color: "orange" },
  Hardware:          { icon: Cpu,         color: "green"  },
  Programmierung:    { icon: Code,        color: "yellow" },
  Wirtschaft:        { icon: Briefcase,   color: "teal"   },
  System:            { icon: Server,      color: "indigo" },
};

const ALL_CATEGORIES = ["Netzwerk", "Sicherheit", "Projektmanagement", "Datenbanken", "Hardware", "Programmierung", "Wirtschaft", "System"];

const typeConfig = {
  article:    { label: "Artikel",     icon: FileText,   color: "blue"   },
  cheatsheet: { label: "Cheat Sheet", icon: ListChecks, color: "green"  },
  howto:      { label: "How-To",      icon: BookMarked, color: "purple" },
};

const colorText: Record<string, string> = {
  blue:   "text-blue-400",   red:    "text-red-400",
  purple: "text-purple-400", orange: "text-orange-400",
  green:  "text-green-400",  yellow: "text-yellow-400",
  teal:   "text-teal-400",   indigo: "text-indigo-400",
};
const colorBg: Record<string, string> = {
  blue:   "bg-blue-500/15",   red:    "bg-red-500/15",
  purple: "bg-purple-500/15", orange: "bg-orange-500/15",
  green:  "bg-green-500/15",  yellow: "bg-yellow-500/15",
  teal:   "bg-teal-500/15",   indigo: "bg-indigo-500/15",
};
const colorBorder: Record<string, string> = {
  blue:   "border-blue-500/30",   red:    "border-red-500/30",
  purple: "border-purple-500/30", orange: "border-orange-500/30",
  green:  "border-green-500/30",  yellow: "border-yellow-500/30",
  teal:   "border-teal-500/30",   indigo: "border-indigo-500/30",
};

// ── Markdown Renderer ─────────────────────────────────────────────────────────
function MarkdownContent({ content }: { content: string }) {
  const html = useMemo(() => marked(content) as string, [content]);

  return (
    <div
      className="wiki-markdown prose-custom"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}

// ── Editor Modal ──────────────────────────────────────────────────────────────
interface EditorProps {
  article?: WikiArticle | null;
  onClose: () => void;
  onSaved: () => void;
}

function ArticleEditor({ article, onClose, onSaved }: EditorProps) {
  const isNew = !article;
  const [title, setTitle] = useState(article?.title ?? "");
  const [category, setCategory] = useState(article?.category ?? "Netzwerk");
  const [type, setType] = useState<WikiArticle["type"]>(article?.type ?? "article");
  const [tagsInput, setTagsInput] = useState((article?.tags ?? []).join(", "));
  const [content, setContent] = useState(article?.content ?? "");
  const [preview, setPreview] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const saveMutation = useMutation({
    mutationFn: async (data: Partial<WikiArticle>) => {
      if (isNew) {
        return apiRequest("POST", "/api/wiki", data);
      } else {
        return apiRequest("PUT", `/api/wiki/${article!.id}`, data);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/wiki"] });
      onSaved();
    },
  });

  function handleSave() {
    if (!title.trim() || !category || !type) return;
    const tags = tagsInput.split(",").map(t => t.trim()).filter(Boolean);
    saveMutation.mutate({ title: title.trim(), category, type, tags, content });
  }

  // Toolbar helpers
  function insertText(before: string, after = "") {
    const el = textareaRef.current;
    if (!el) return;
    const start = el.selectionStart;
    const end = el.selectionEnd;
    const selected = content.slice(start, end);
    const newContent = content.slice(0, start) + before + selected + after + content.slice(end);
    setContent(newContent);
    setTimeout(() => {
      el.focus();
      el.setSelectionRange(start + before.length, start + before.length + selected.length);
    }, 0);
  }

  const toolbar = [
    { label: "H2", action: () => insertText("\n## ") },
    { label: "H3", action: () => insertText("\n### ") },
    { label: "B", action: () => insertText("**", "**") },
    { label: "•", action: () => insertText("\n- ") },
    { label: "1.", action: () => insertText("\n1. ") },
    { label: "`code`", action: () => insertText("`", "`") },
    { label: "```", action: () => insertText("\n```\n", "\n```") },
    { label: "🔗", action: () => insertText("[Text](", ")") },
    { label: "💡 Tipp", action: () => insertText("\n> 💡 **Prüfungstipp:** ") },
    { label: "⚠️", action: () => insertText("\n> ⚠️ **Wichtig:** ") },
  ];

  return (
    <div className="fixed inset-0 z-50 bg-background/90 backdrop-blur flex items-start justify-center overflow-y-auto py-6 px-4">
      <div className="w-full max-w-4xl bg-card border border-border rounded-2xl shadow-2xl flex flex-col" style={{ minHeight: "80vh" }}>
        {/* Editor Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-border">
          <h2 className="text-sm font-bold text-foreground">
            {isNew ? "Neuer Artikel" : `Bearbeiten: ${article!.title}`}
          </h2>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPreview(p => !p)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs transition-colors ${
                preview ? "bg-primary/20 text-primary" : "bg-secondary text-muted-foreground hover:text-foreground"
              }`}
            >
              {preview ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
              {preview ? "Editor" : "Vorschau"}
            </button>
            <button
              onClick={handleSave}
              disabled={saveMutation.isPending || !title.trim()}
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

        <div className="flex flex-col gap-4 p-5 flex-1">
          {/* Meta fields */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-1">
              <label className="text-xs text-muted-foreground mb-1 block">Typ</label>
              <select
                value={type}
                onChange={e => setType(e.target.value as WikiArticle["type"])}
                className="w-full bg-secondary border border-border rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:border-primary/60"
              >
                <option value="article">Artikel</option>
                <option value="cheatsheet">Cheat Sheet</option>
                <option value="howto">How-To</option>
              </select>
            </div>
            <div className="sm:col-span-1">
              <label className="text-xs text-muted-foreground mb-1 block">Kategorie</label>
              <select
                value={category}
                onChange={e => setCategory(e.target.value)}
                className="w-full bg-secondary border border-border rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:border-primary/60"
              >
                {ALL_CATEGORIES.map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
            <div className="sm:col-span-1">
              <label className="text-xs text-muted-foreground mb-1 block flex items-center gap-1">
                <Tag className="w-3 h-3" /> Tags (kommagetrennt)
              </label>
              <input
                type="text"
                value={tagsInput}
                onChange={e => setTagsInput(e.target.value)}
                placeholder="z.B. OSI, Netzwerk, Schichten"
                className="w-full bg-secondary border border-border rounded-lg px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/60"
              />
            </div>
          </div>

          <div>
            <label className="text-xs text-muted-foreground mb-1 block">Titel</label>
            <input
              type="text"
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="Artikeltitel..."
              className="w-full bg-secondary border border-border rounded-lg px-3 py-2.5 text-sm font-medium text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/60"
            />
          </div>

          {/* Toolbar */}
          {!preview && (
            <div className="flex flex-wrap gap-1.5">
              {toolbar.map(btn => (
                <button
                  key={btn.label}
                  onClick={btn.action}
                  className="px-2 py-1 text-xs bg-secondary hover:bg-secondary/80 border border-border rounded-lg text-muted-foreground hover:text-foreground transition-colors font-mono"
                >
                  {btn.label}
                </button>
              ))}
            </div>
          )}

          {/* Content area */}
          <div className="flex-1 min-h-[300px]">
            {preview ? (
              <div className="h-full bg-secondary/30 border border-border rounded-xl p-4 overflow-y-auto">
                {content ? (
                  <MarkdownContent content={content} />
                ) : (
                  <p className="text-sm text-muted-foreground italic">Noch kein Inhalt...</p>
                )}
              </div>
            ) : (
              <textarea
                ref={textareaRef}
                value={content}
                onChange={e => setContent(e.target.value)}
                placeholder={"# Titel\n\nInhalt in Markdown...\n\n## Abschnitt\n\nText hier.\n\n```\nCode hier\n```"}
                className="w-full h-full min-h-[300px] bg-secondary/50 border border-border rounded-xl p-4 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/60 font-mono leading-relaxed resize-y"
              />
            )}
          </div>

          {saveMutation.isError && (
            <p className="text-xs text-red-400">Fehler beim Speichern. Bitte erneut versuchen.</p>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Article detail view ───────────────────────────────────────────────────────
interface ArticleViewProps {
  article: WikiArticle;
  onClose: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

function ArticleView({ article, onClose, onEdit, onDelete }: ArticleViewProps) {
  const cat = categoryConfig[article.category];
  const typ = typeConfig[article.type];
  const CatIcon = cat?.icon ?? BookOpen;
  const TypIcon = typ.icon;
  const [confirmDelete, setConfirmDelete] = useState(false);

  return (
    <div className="animate-fadeInUp">
      {/* Back + actions */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={onClose}
          className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Zurück zur Übersicht
        </button>
        <div className="flex items-center gap-2">
          <button
            onClick={onEdit}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs bg-secondary hover:bg-secondary/80 text-foreground transition-colors"
          >
            <Pencil className="w-3.5 h-3.5" /> Bearbeiten
          </button>
          {confirmDelete ? (
            <div className="flex items-center gap-1">
              <button
                onClick={onDelete}
                className="px-3 py-1.5 rounded-lg text-xs bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-colors"
              >
                Wirklich löschen
              </button>
              <button
                onClick={() => setConfirmDelete(false)}
                className="px-2 py-1.5 rounded-lg text-xs bg-secondary text-muted-foreground hover:text-foreground transition-colors"
              >
                Abbrechen
              </button>
            </div>
          ) : (
            <button
              onClick={() => setConfirmDelete(true)}
              className="p-1.5 rounded-lg text-xs bg-secondary hover:bg-red-500/20 text-muted-foreground hover:text-red-400 transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-3 flex-wrap">
          <span className={`flex items-center gap-1 text-xs px-2 py-0.5 rounded-full border ${colorBg[cat?.color ?? "blue"]} ${colorBorder[cat?.color ?? "blue"]} ${colorText[cat?.color ?? "blue"]}`}>
            <CatIcon className="w-3 h-3" />
            {article.category}
          </span>
          <span className={`flex items-center gap-1 text-xs px-2 py-0.5 rounded-full border ${colorBg[typ.color]} ${colorBorder[typ.color]} ${colorText[typ.color]}`}>
            <TypIcon className="w-3 h-3" />
            {typ.label}
          </span>
        </div>
        <h2 className="text-2xl font-bold text-foreground mb-2">{article.title}</h2>
        <div className="flex flex-wrap gap-1.5">
          {article.tags.map(tag => (
            <span key={tag} className="text-xs bg-secondary text-muted-foreground px-2 py-0.5 rounded-full">#{tag}</span>
          ))}
        </div>
      </div>

      {/* Markdown content */}
      <MarkdownContent content={article.content} />
    </div>
  );
}

// ── Main Wiki page ────────────────────────────────────────────────────────────
export default function WikiPage() {
  const [search, setSearch] = useState("");
  const [activeType, setActiveType] = useState<string>("alle");
  const [activeCategory, setActiveCategory] = useState<string>("alle");
  const [selectedArticle, setSelectedArticle] = useState<WikiArticle | null>(null);
  const [editingArticle, setEditingArticle] = useState<WikiArticle | null | undefined>(undefined); // undefined = closed, null = new

  const { data: articles = [], isLoading } = useQuery<WikiArticle[]>({
    queryKey: ["/api/wiki"],
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => apiRequest("DELETE", `/api/wiki/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/wiki"] });
      setSelectedArticle(null);
    },
  });

  const categories = useMemo(() => {
    return ["alle", ...Array.from(new Set(articles.map(a => a.category))).sort()];
  }, [articles]);

  const filtered = useMemo(() => {
    return articles.filter(a => {
      const matchType = activeType === "alle" || a.type === activeType;
      const matchCat = activeCategory === "alle" || a.category === activeCategory;
      const q = search.toLowerCase();
      const matchSearch = !q || a.title.toLowerCase().includes(q) || a.tags.some(t => t.toLowerCase().includes(q));
      return matchType && matchCat && matchSearch;
    });
  }, [search, activeType, activeCategory, articles]);

  const isEditorOpen = editingArticle !== undefined;

  return (
    <div className="min-h-screen bg-background">
      {/* Editor Modal */}
      {isEditorOpen && (
        <ArticleEditor
          article={editingArticle}
          onClose={() => setEditingArticle(undefined)}
          onSaved={() => {
            setEditingArticle(undefined);
            setSelectedArticle(null);
          }}
        />
      )}

      <header className="border-b border-border sticky top-0 z-10 bg-background/95 backdrop-blur">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center gap-3">
          <Link href="/">
            <button className="p-1.5 rounded-lg hover:bg-secondary transition-colors">
              <ArrowLeft className="w-4 h-4" />
            </button>
          </Link>
          <div className="flex items-center gap-2 flex-1">
            <div className="w-6 h-6 rounded bg-primary/20 flex items-center justify-center flex-shrink-0">
              <span className="text-primary font-bold text-xs">IO</span>
            </div>
            <div>
              <h1 className="text-sm font-bold leading-none">Wiki</h1>
              <p className="text-xs text-muted-foreground">{articles.length} Artikel · Knowledge Base</p>
            </div>
          </div>
          {/* Neuer Artikel Button */}
          <button
            onClick={() => setEditingArticle(null)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-primary/20 border border-primary/40 text-primary hover:bg-primary/30 transition-colors"
            data-testid="btn-new-article"
          >
            <Plus className="w-3.5 h-3.5" />
            Neuer Artikel
          </button>
        </div>
        {/* Search */}
        <div className="max-w-5xl mx-auto px-4 pb-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Artikel suchen..."
              value={search}
              onChange={e => { setSearch(e.target.value); setSelectedArticle(null); }}
              className="w-full bg-card border border-border rounded-xl pl-9 pr-4 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/60 transition-colors"
            />
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-6">
        {selectedArticle ? (
          <ArticleView
            article={selectedArticle}
            onClose={() => setSelectedArticle(null)}
            onEdit={() => setEditingArticle(selectedArticle)}
            onDelete={() => deleteMutation.mutate(selectedArticle.id)}
          />
        ) : (
          <>
            {/* Type filter */}
            <div className="flex flex-wrap gap-2 mb-4 animate-fadeInUp">
              {[
                { id: "alle", label: "Alle", icon: BookOpen },
                { id: "article", label: "Artikel", icon: FileText },
                { id: "cheatsheet", label: "Cheat Sheets", icon: ListChecks },
                { id: "howto", label: "How-Tos", icon: BookMarked },
              ].map(t => {
                const Icon = t.icon;
                return (
                  <button
                    key={t.id}
                    onClick={() => setActiveType(t.id)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
                      activeType === t.id
                        ? "bg-primary/20 border-primary/50 text-primary"
                        : "bg-card border-border text-muted-foreground hover:text-foreground hover:border-primary/30"
                    }`}
                  >
                    <Icon className="w-3 h-3" />
                    {t.label}
                  </button>
                );
              })}
            </div>

            {/* Category filter */}
            <div className="flex flex-wrap gap-1.5 mb-6 animate-fadeInUp" style={{ animationDelay: "0.05s" }}>
              {categories.map(cat => {
                const cfg = categoryConfig[cat];
                const CatIcon = cfg?.icon;
                return (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs border transition-all ${
                      activeCategory === cat
                        ? `${colorBg[cfg?.color ?? "blue"]} ${colorBorder[cfg?.color ?? "blue"]} ${colorText[cfg?.color ?? "blue"]}`
                        : "bg-card border-border text-muted-foreground hover:text-foreground hover:border-primary/30"
                    }`}
                  >
                    {CatIcon && <CatIcon className="w-3 h-3" />}
                    {cat === "alle" ? "Alle Kategorien" : cat}
                  </button>
                );
              })}
            </div>

            {/* Stats row */}
            <p className="text-xs text-muted-foreground mb-4">{filtered.length} Einträge gefunden</p>

            {/* Loading */}
            {isLoading && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="bg-card border border-border rounded-2xl p-4 animate-pulse h-36" />
                ))}
              </div>
            )}

            {/* Article grid */}
            {!isLoading && filtered.length === 0 && (
              <div className="text-center py-16 text-muted-foreground text-sm">
                {search ? `Kein Artikel für „${search}" gefunden` : "Noch keine Artikel vorhanden"}
                <br />
                <button
                  onClick={() => setEditingArticle(null)}
                  className="mt-3 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs bg-primary/20 text-primary hover:bg-primary/30 transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" /> Ersten Artikel erstellen
                </button>
              </div>
            )}

            {!isLoading && filtered.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {filtered.map((article, i) => {
                  const cat = categoryConfig[article.category];
                  const typ = typeConfig[article.type];
                  const CatIcon = cat?.icon ?? BookOpen;
                  const TypIcon = typ.icon;
                  return (
                    <button
                      key={article.id}
                      onClick={() => setSelectedArticle(article)}
                      className="group text-left bg-card border border-border rounded-2xl p-4 hover:border-primary/40 transition-all hover:scale-[1.02] animate-fadeInUp"
                      style={{ animationDelay: `${i * 0.04}s` }}
                      data-testid={`article-card-${article.id}`}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className={`p-2 rounded-lg ${colorBg[cat?.color ?? "blue"]}`}>
                          <CatIcon className={`w-4 h-4 ${colorText[cat?.color ?? "blue"]}`} />
                        </div>
                        <div className="flex items-center gap-1.5">
                          <span className={`flex items-center gap-1 text-xs px-2 py-0.5 rounded-full ${colorBg[typ.color]} ${colorText[typ.color]}`}>
                            <TypIcon className="w-3 h-3" />
                            {typ.label}
                          </span>
                          <button
                            onClick={e => { e.stopPropagation(); setEditingArticle(article); }}
                            className="p-1 rounded-lg opacity-0 group-hover:opacity-100 hover:bg-secondary transition-all text-muted-foreground hover:text-foreground"
                            title="Bearbeiten"
                          >
                            <Pencil className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                      <h3 className="font-semibold text-foreground text-sm mb-1 line-clamp-2">{article.title}</h3>
                      <p className="text-xs text-muted-foreground mb-3">{article.category}</p>
                      <div className="flex items-center justify-between">
                        <div className="flex flex-wrap gap-1">
                          {article.tags.slice(0, 2).map(tag => (
                            <span key={tag} className="text-xs bg-secondary/60 text-muted-foreground px-1.5 py-0.5 rounded">#{tag}</span>
                          ))}
                        </div>
                        <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors flex-shrink-0" />
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}
